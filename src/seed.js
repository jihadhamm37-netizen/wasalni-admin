// Seed demo data. Run: npm run seed
import { db, now } from './db.js';
import { hashPassword } from './auth.js';

const reset = process.argv.includes('--reset');
if (reset) {
  for (const t of ['notifications', 'messages', 'friendships', 'comments', 'likes', 'posts', 'users'])
    db.exec(`DELETE FROM ${t};`);
  console.log('cleared existing data');
}

function mkUser(username, name, bio) {
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return existing.id;
  const { hash, salt } = hashPassword('123456');
  const info = db.prepare('INSERT INTO users (username, name, pass_hash, pass_salt, bio, created_at) VALUES (?,?,?,?,?,?)')
    .run(username, name, hash, salt, bio, now());
  return Number(info.lastInsertRowid);
}

const sara = mkUser('sara', 'سارة أحمد', 'أحب القهوة والتصوير 📷');
const omar = mkUser('omar', 'عمر خالد', 'مهندس برمجيات 💻 | عمّان');
const lina = mkUser('lina', 'لينا يوسف', 'طالبة طب 🩺');
const demo = mkUser('demo', 'مستخدم تجريبي', 'هذا حساب للتجربة — سجّل دخولك باسم demo / 123456');

function mkPost(uid, content, t) {
  const info = db.prepare('INSERT INTO posts (user_id, content, created_at) VALUES (?,?,?)').run(uid, content, t);
  return Number(info.lastInsertRowid);
}
function friends(a, b) {
  const ex = db.prepare('SELECT 1 FROM friendships WHERE requester_id=? AND addressee_id=?').get(a, b);
  if (!ex) db.prepare('INSERT INTO friendships (requester_id, addressee_id, status, created_at) VALUES (?,?,?,?)').run(a, b, 'accepted', now());
}

friends(demo, sara); friends(demo, omar); friends(sara, lina);

const t = now();
const p1 = mkPost(sara, 'صباح الخير ☀️ يوم جديد وفنجان قهوة. شو خططكم اليوم؟', t - 3600_000 * 2);
mkPost(omar, 'خلّصت أخيراً مشروع التطبيق اللي كنت شغّال عليه 🎉 كان تحدّي حلو!', t - 3600_000 * 5);
mkPost(lina, 'نصيحة اليوم: اشربوا ماء كفاية 💧', t - 3600_000 * 26);
mkPost(demo, 'أهلاً فيكم بتطبيق لمّة 👋 هاد أول منشور إلي هون.', t - 3600_000);

db.prepare('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?,?,?,?)').run(p1, omar, 'صباح النور ☕', t - 3600_000);
db.prepare('INSERT INTO likes (post_id, user_id, created_at) VALUES (?,?,?)').run(p1, omar, t - 3600_000);
db.prepare('INSERT INTO likes (post_id, user_id, created_at) VALUES (?,?,?)').run(p1, demo, t - 3500_000);

db.prepare('INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?,?,?,?)').run(sara, demo, 'هلا! شفت التطبيق الجديد؟', t - 1800_000);
db.prepare('INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?,?,?,?)').run(demo, sara, 'آه حلو كتير 😍', t - 1700_000);

console.log('seeded. demo login -> username: demo  password: 123456');
