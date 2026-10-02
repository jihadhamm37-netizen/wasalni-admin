// Lamma — zero-dependency social app server (Node built-ins only).
// Serves the JSON API, real-time stream (SSE), and the static frontend.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, now } from './db.js';
import { hashPassword, verifyPassword, signToken, verifyToken } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;
const MAX_BODY = 8 * 1024 * 1024; // 8MB (room for base64 images)

/* ----------------------------- tiny framework ----------------------------- */
const routes = []; // { method, regex, keys, handler }
function route(method, pattern, handler) {
  const keys = [];
  const regex = new RegExp(
    '^' +
      pattern.replace(/:[^/]+/g, (m) => {
        keys.push(m.slice(1));
        return '([^/]+)';
      }) +
      '/?$'
  );
  routes.push({ method, regex, keys, handler });
}
const get = (p, h) => route('GET', p, h);
const post = (p, h) => route('POST', p, h);
const put = (p, h) => route('PUT', p, h);
const del = (p, h) => route('DELETE', p, h);

function send(res, status, data, headers = {}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    ...headers,
  });
  res.end(body);
}
const ok = (res, data) => send(res, 200, data ?? { ok: true });
const bad = (res, msg, code = 400) => send(res, code, { error: msg });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('payload too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('invalid json')); }
    });
    req.on('error', reject);
  });
}

function auth(req) {
  const h = req.headers['authorization'] || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return db.prepare('SELECT id, username, name, bio, avatar, cover, created_at FROM users WHERE id = ?').get(payload.uid) || null;
}

/* ------------------------------- SSE hub ---------------------------------- */
const clients = new Map(); // userId -> Set<res>
function sseAdd(userId, res) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);
}
function sseRemove(userId, res) {
  const set = clients.get(userId);
  if (set) { set.delete(res); if (!set.size) clients.delete(userId); }
}
function pushTo(userId, event, data) {
  const set = clients.get(userId);
  if (!set) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) { try { res.write(payload); } catch {} }
}

/* ------------------------------ serializers ------------------------------- */
const pubUser = (u) => u && ({ id: u.id, username: u.username, name: u.name, bio: u.bio, avatar: u.avatar, cover: u.cover, created_at: u.created_at });

function postView(postId, meId) {
  const p = db.prepare(`
    SELECT p.*, u.username, u.name, u.avatar
    FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?`).get(postId);
  if (!p) return null;
  const likes = db.prepare('SELECT COUNT(*) c FROM likes WHERE post_id = ?').get(p.id).c;
  const comments = db.prepare('SELECT COUNT(*) c FROM comments WHERE post_id = ?').get(p.id).c;
  const liked = meId ? !!db.prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?').get(p.id, meId) : false;
  return {
    id: p.id, content: p.content, image: p.image, created_at: p.created_at,
    author: { id: p.user_id, username: p.username, name: p.name, avatar: p.avatar },
    likes, comments, liked,
  };
}

function friendStatus(meId, otherId) {
  if (meId === otherId) return 'self';
  const f = db.prepare(`SELECT * FROM friendships
    WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)`)
    .get(meId, otherId, otherId, meId);
  if (!f) return 'none';
  if (f.status === 'accepted') return 'friends';
  return f.requester_id === meId ? 'request_sent' : 'request_received';
}

function notify(userId, type, actorId, postId = null) {
  if (userId === actorId) return;
  const info = db.prepare('INSERT INTO notifications (user_id, type, actor_id, post_id, created_at) VALUES (?,?,?,?,?)')
    .run(userId, type, actorId, postId, now());
  const actor = db.prepare('SELECT id, name, username, avatar FROM users WHERE id = ?').get(actorId);
  pushTo(userId, 'notification', { id: Number(info.lastInsertRowid), type, actor, post_id: postId, created_at: now() });
}

/* -------------------------------- routes ---------------------------------- */
// Auth
post('/api/auth/register', async (req, res) => {
  const { username, name, password } = await readBody(req);
  if (!username || !name || !password) return bad(res, 'username, name and password are required');
  const uname = String(username).trim().toLowerCase();
  if (!/^[a-z0-9_.]{3,20}$/.test(uname)) return bad(res, 'username must be 3-20 chars: letters, numbers, _ or .');
  if (String(password).length < 6) return bad(res, 'password must be at least 6 characters');
  if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(uname)) return bad(res, 'username already taken', 409);
  const { hash, salt } = hashPassword(String(password));
  const info = db.prepare('INSERT INTO users (username, name, pass_hash, pass_salt, created_at) VALUES (?,?,?,?,?)')
    .run(uname, String(name).trim(), hash, salt, now());
  const user = db.prepare('SELECT id, username, name, bio, avatar, cover, created_at FROM users WHERE id = ?').get(Number(info.lastInsertRowid));
  ok(res, { token: signToken({ uid: user.id }), user: pubUser(user) });
});

post('/api/auth/login', async (req, res) => {
  const { username, password } = await readBody(req);
  if (!username || !password) return bad(res, 'username and password are required');
  const u = db.prepare('SELECT * FROM users WHERE username = ?').get(String(username).trim().toLowerCase());
  if (!u || !verifyPassword(String(password), u.pass_hash, u.pass_salt)) return bad(res, 'invalid username or password', 401);
  ok(res, { token: signToken({ uid: u.id }), user: pubUser(u) });
});

// Me
get('/api/me', (req, res) => { const me = auth(req); if (!me) return bad(res, 'unauthorized', 401); ok(res, pubUser(me)); });

put('/api/me', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { name, bio, avatar, cover } = await readBody(req);
  db.prepare('UPDATE users SET name = COALESCE(?,name), bio = COALESCE(?,bio), avatar = COALESCE(?,avatar), cover = COALESCE(?,cover) WHERE id = ?')
    .run(name ?? null, bio ?? null, avatar ?? null, cover ?? null, me.id);
  ok(res, pubUser(db.prepare('SELECT * FROM users WHERE id = ?').get(me.id)));
});

// Users
get('/api/users', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const u = new URL(req.url, 'http://x');
  const q = (u.searchParams.get('q') || '').trim().toLowerCase();
  if (!q) return ok(res, []);
  const rows = db.prepare(`SELECT id, username, name, avatar, bio FROM users
     WHERE id != ? AND (lower(name) LIKE ? OR username LIKE ?) LIMIT 30`)
    .all(me.id, `%${q}%`, `%${q}%`);
  ok(res, rows.map((r) => ({ ...r, friend_status: friendStatus(me.id, r.id) })));
});

get('/api/users/:id', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(params.id));
  if (!u) return bad(res, 'user not found', 404);
  const postCount = db.prepare('SELECT COUNT(*) c FROM posts WHERE user_id = ?').get(u.id).c;
  const friendCount = db.prepare(`SELECT COUNT(*) c FROM friendships WHERE status='accepted' AND (requester_id=? OR addressee_id=?)`).get(u.id, u.id).c;
  ok(res, { ...pubUser(u), post_count: postCount, friend_count: friendCount, friend_status: friendStatus(me.id, u.id) });
});

get('/api/users/:id/posts', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const rows = db.prepare('SELECT id FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 100').all(Number(params.id));
  ok(res, rows.map((r) => postView(r.id, me.id)));
});

// Posts / feed
post('/api/posts', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { content, image } = await readBody(req);
  if (!(content && content.trim()) && !image) return bad(res, 'post cannot be empty');
  const info = db.prepare('INSERT INTO posts (user_id, content, image, created_at) VALUES (?,?,?,?)')
    .run(me.id, (content || '').trim(), image || null, now());
  ok(res, postView(Number(info.lastInsertRowid), me.id));
});

get('/api/posts', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  // feed = my posts + accepted friends' posts
  const rows = db.prepare(`
    SELECT p.id FROM posts p WHERE p.user_id = ? OR p.user_id IN (
      SELECT CASE WHEN requester_id = ? THEN addressee_id ELSE requester_id END
      FROM friendships WHERE status='accepted' AND (requester_id = ? OR addressee_id = ?)
    ) ORDER BY p.created_at DESC LIMIT 100`).all(me.id, me.id, me.id, me.id);
  ok(res, rows.map((r) => postView(r.id, me.id)));
});

get('/api/posts/:id', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const v = postView(Number(params.id), me.id);
  if (!v) return bad(res, 'post not found', 404);
  ok(res, v);
});

del('/api/posts/:id', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(params.id));
  if (!p) return bad(res, 'post not found', 404);
  if (p.user_id !== me.id) return bad(res, 'forbidden', 403);
  db.prepare('DELETE FROM posts WHERE id = ?').run(p.id);
  ok(res, { ok: true });
});

// Likes
post('/api/posts/:id/like', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(params.id));
  if (!p) return bad(res, 'post not found', 404);
  const existing = db.prepare('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?').get(p.id, me.id);
  if (existing) db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(p.id, me.id);
  else { db.prepare('INSERT INTO likes (post_id, user_id, created_at) VALUES (?,?,?)').run(p.id, me.id, now()); notify(p.user_id, 'like', me.id, p.id); }
  ok(res, postView(p.id, me.id));
});

// Comments
get('/api/posts/:id/comments', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const rows = db.prepare(`SELECT c.id, c.content, c.created_at, u.id uid, u.name, u.username, u.avatar
     FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC`).all(Number(params.id));
  ok(res, rows.map((r) => ({ id: r.id, content: r.content, created_at: r.created_at, author: { id: r.uid, name: r.name, username: r.username, avatar: r.avatar } })));
});

post('/api/posts/:id/comments', async (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { content } = await readBody(req);
  if (!content || !content.trim()) return bad(res, 'comment cannot be empty');
  const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(params.id));
  if (!p) return bad(res, 'post not found', 404);
  const info = db.prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?,?,?,?)')
    .run(p.id, me.id, content.trim(), now());
  notify(p.user_id, 'comment', me.id, p.id);
  ok(res, { id: Number(info.lastInsertRowid), content: content.trim(), created_at: now(), author: pubUser(me) });
});

// Friends
post('/api/friends/request', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { user_id } = await readBody(req);
  const target = Number(user_id);
  if (!target || target === me.id) return bad(res, 'invalid user');
  if (!db.prepare('SELECT 1 FROM users WHERE id = ?').get(target)) return bad(res, 'user not found', 404);
  const st = friendStatus(me.id, target);
  if (st === 'friends') return bad(res, 'already friends');
  if (st === 'request_sent') return bad(res, 'request already sent');
  if (st === 'request_received') {
    // auto-accept the reverse pending request
    db.prepare(`UPDATE friendships SET status='accepted' WHERE requester_id = ? AND addressee_id = ?`).run(target, me.id);
    notify(target, 'friend_accept', me.id);
    return ok(res, { status: 'friends' });
  }
  db.prepare('INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES (?,?,?,?)')
    .run(me.id, target, 'pending', now());
  notify(target, 'friend_request', me.id);
  ok(res, { status: 'request_sent' });
});

post('/api/friends/respond', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { request_id, accept } = await readBody(req);
  const f = db.prepare('SELECT * FROM friendships WHERE id = ?').get(Number(request_id));
  if (!f || f.addressee_id !== me.id || f.status !== 'pending') return bad(res, 'request not found', 404);
  if (accept) { db.prepare(`UPDATE friendships SET status='accepted' WHERE id = ?`).run(f.id); notify(f.requester_id, 'friend_accept', me.id); }
  else db.prepare('DELETE FROM friendships WHERE id = ?').run(f.id);
  ok(res, { ok: true });
});

post('/api/friends/remove', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { user_id } = await readBody(req);
  const other = Number(user_id);
  db.prepare(`DELETE FROM friendships WHERE (requester_id=? AND addressee_id=?) OR (requester_id=? AND addressee_id=?)`)
    .run(me.id, other, other, me.id);
  ok(res, { ok: true });
});

get('/api/friends', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const rows = db.prepare(`
    SELECT u.id, u.username, u.name, u.avatar, u.bio FROM friendships f
    JOIN users u ON u.id = CASE WHEN f.requester_id = ? THEN f.addressee_id ELSE f.requester_id END
    WHERE f.status='accepted' AND (f.requester_id = ? OR f.addressee_id = ?) ORDER BY u.name`).all(me.id, me.id, me.id);
  ok(res, rows);
});

get('/api/friends/requests', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const rows = db.prepare(`
    SELECT f.id request_id, u.id, u.username, u.name, u.avatar, f.created_at FROM friendships f
    JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = ? AND f.status='pending' ORDER BY f.created_at DESC`).all(me.id);
  ok(res, rows);
});

// Messages
get('/api/conversations', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const partners = db.prepare(`
    SELECT CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS uid, MAX(created_at) last
    FROM messages WHERE sender_id = ? OR receiver_id = ? GROUP BY uid ORDER BY last DESC`).all(me.id, me.id, me.id);
  const out = partners.map((p) => {
    const u = db.prepare('SELECT id, username, name, avatar FROM users WHERE id = ?').get(p.uid);
    const last = db.prepare(`SELECT content, created_at, sender_id FROM messages
      WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at DESC LIMIT 1`)
      .get(me.id, p.uid, p.uid, me.id);
    const unread = db.prepare('SELECT COUNT(*) c FROM messages WHERE sender_id=? AND receiver_id=? AND read_at IS NULL').get(p.uid, me.id).c;
    return { user: u, last, unread };
  });
  ok(res, out);
});

get('/api/messages/:userId', (req, res, params) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const other = Number(params.userId);
  db.prepare('UPDATE messages SET read_at = ? WHERE sender_id=? AND receiver_id=? AND read_at IS NULL').run(now(), other, me.id);
  const rows = db.prepare(`SELECT * FROM messages
    WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at ASC LIMIT 500`)
    .all(me.id, other, other, me.id);
  ok(res, rows);
});

post('/api/messages', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const { to, content } = await readBody(req);
  const other = Number(to);
  if (!other || !content || !content.trim()) return bad(res, 'recipient and content required');
  if (!db.prepare('SELECT 1 FROM users WHERE id = ?').get(other)) return bad(res, 'user not found', 404);
  const info = db.prepare('INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?,?,?,?)')
    .run(me.id, other, content.trim(), now());
  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(Number(info.lastInsertRowid));
  pushTo(other, 'message', msg);
  pushTo(me.id, 'message', msg);
  ok(res, msg);
});

// WebRTC call signaling (relayed over SSE). data: {kind, to, ...payload}
post('/api/signal', async (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const body = await readBody(req);
  const to = Number(body.to);
  if (!to) return bad(res, 'recipient required');
  pushTo(to, 'signal', { from: me.id, fromName: me.name, fromAvatar: me.avatar || null, kind: body.kind, media: body.media, sdp: body.sdp, candidate: body.candidate });
  ok(res, { ok: true });
});

// Notifications
get('/api/notifications', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const rows = db.prepare(`SELECT n.*, u.name, u.username, u.avatar FROM notifications n
    LEFT JOIN users u ON u.id = n.actor_id WHERE n.user_id = ? ORDER BY n.created_at DESC LIMIT 50`).all(me.id);
  db.prepare('UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL').run(now(), me.id);
  ok(res, rows.map((r) => ({ id: r.id, type: r.type, post_id: r.post_id, created_at: r.created_at, was_read: r.read_at != null,
    actor: r.actor_id ? { id: r.actor_id, name: r.name, username: r.username, avatar: r.avatar } : null })));
});

get('/api/notifications/count', (req, res) => {
  const me = auth(req); if (!me) return bad(res, 'unauthorized', 401);
  const notif = db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(me.id).c;
  const msgs = db.prepare('SELECT COUNT(*) c FROM messages WHERE receiver_id=? AND read_at IS NULL').get(me.id).c;
  const reqs = db.prepare(`SELECT COUNT(*) c FROM friendships WHERE addressee_id=? AND status='pending'`).get(me.id).c;
  ok(res, { notifications: notif, messages: msgs, requests: reqs });
});

// Real-time stream (SSE). Token passed as query param since EventSource can't set headers.
get('/api/stream', (req, res) => {
  const u = new URL(req.url, 'http://x');
  const payload = verifyToken(u.searchParams.get('token'));
  if (!payload) return bad(res, 'unauthorized', 401);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write('retry: 3000\n\n');
  sseAdd(payload.uid, res);
  const ping = setInterval(() => { try { res.write(': ping\n\n'); } catch {} }, 25000);
  req.on('close', () => { clearInterval(ping); sseRemove(payload.uid, res); });
});

/* ----------------------------- ADMIN (separate panel) ----------------------- */
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';
function adminOk(req) { return (req.headers['x-admin-key'] || '') === ADMIN_KEY; }
function adminGuard(req, res) { if (!adminOk(req)) { bad(res, 'unauthorized', 401); return false; } return true; }

post('/api/admin/login', async (req, res) => {
  const { key } = await readBody(req);
  if (key === ADMIN_KEY) return ok(res, { ok: true });
  bad(res, 'مفتاح غير صحيح', 401);
});

get('/api/admin/stats', (req, res) => {
  if (!adminGuard(req, res)) return;
  ok(res, {
    users: db.prepare('SELECT COUNT(*) c FROM users').get().c,
    posts: db.prepare('SELECT COUNT(*) c FROM posts').get().c,
    comments: db.prepare('SELECT COUNT(*) c FROM comments').get().c,
    likes: db.prepare('SELECT COUNT(*) c FROM likes').get().c,
    friends: db.prepare(`SELECT COUNT(*) c FROM friendships WHERE status='accepted'`).get().c,
    pending: db.prepare(`SELECT COUNT(*) c FROM friendships WHERE status='pending'`).get().c,
    messages: db.prepare('SELECT COUNT(*) c FROM messages').get().c,
  });
});

get('/api/admin/users', (req, res) => {
  if (!adminGuard(req, res)) return;
  const rows = db.prepare(`
    SELECT u.id, u.username, u.name, u.avatar, u.created_at,
      (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id) post_count,
      (SELECT COUNT(*) FROM messages m WHERE m.sender_id = u.id) msg_count
    FROM users u ORDER BY u.created_at DESC`).all();
  ok(res, rows);
});

get('/api/admin/posts', (req, res) => {
  if (!adminGuard(req, res)) return;
  const rows = db.prepare(`
    SELECT p.id, p.content, p.image, p.created_at, u.name author_name, u.id author_id,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) likes,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) comments
    FROM posts p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 300`).all();
  ok(res, rows.map((r) => ({ ...r, image: r.image ? true : false })));
});

del('/api/admin/posts/:id', (req, res, params) => {
  if (!adminGuard(req, res)) return;
  db.prepare('DELETE FROM posts WHERE id = ?').run(Number(params.id));
  ok(res, { ok: true });
});

del('/api/admin/users/:id', (req, res, params) => {
  if (!adminGuard(req, res)) return;
  db.prepare('DELETE FROM users WHERE id = ?').run(Number(params.id)); // cascades posts/comments/likes/messages/friendships
  ok(res, { ok: true });
});

get('/api/health', (req, res) => ok(res, { ok: true, service: 'lamma', time: now() }));

/* --------------------------- static file serving -------------------------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json' };

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, 'forbidden');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
        if (e2) return send(res, 404, 'not found');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

/* -------------------------------- server ---------------------------------- */
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const pathname = new URL(req.url, 'http://x').pathname;
  if (pathname.startsWith('/api/')) {
    const match = routes.find((r) => r.method === req.method && r.regex.test(pathname));
    if (!match) return bad(res, 'not found', 404);
    const m = pathname.match(match.regex);
    const params = {};
    match.keys.forEach((k, i) => (params[k] = m[i + 1]));
    try { await match.handler(req, res, params); }
    catch (err) { if (!res.headersSent) bad(res, err.message || 'server error', 500); }
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => console.log(`Lamma server running on http://localhost:${PORT}`));
