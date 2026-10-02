/* ===================== Lamma — frontend SPA (zero deps) ===================== */
// API base: same origin by default. For the Android (Capacitor) build, set
// window.LAMMA_API to your deployed server URL in a small config before app.js.
const API = (window.LAMMA_API || '').replace(/\/$/, '');

/* ----------------------------- state ----------------------------- */
const store = {
  token: localStorage.getItem('lamma_token') || null,
  me: null,
  route: { name: 'feed', params: {} },
  counts: { notifications: 0, messages: 0, requests: 0 },
  es: null,
};
const $app = document.getElementById('app');

/* ----------------------------- api ------------------------------ */
async function api(pathname, { method = 'GET', body } = {}) {
  const res = await fetch(API + pathname, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(store.token ? { Authorization: 'Bearer ' + store.token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'حدث خطأ، حاول مرة أخرى');
  return data;
}

/* ----------------------------- helpers -------------------------- */
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = (name = '') => name.trim().charAt(0) || '؟';

function avatar(user, size = 'sm') {
  if (user && user.avatar) return `<img class="avatar ${size}" src="${esc(user.avatar)}" alt="">`;
  const hue = user ? (user.id * 47) % 360 : 200;
  return `<div class="avatar ${size}" style="background:hsl(${hue} 55% 45%)">${esc(initials(user && user.name))}</div>`;
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'الآن';
  const m = Math.floor(s / 60); if (m < 60) return `${m} د`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} س`;
  const d = Math.floor(h / 24); if (d < 7) return `${d} ي`;
  const date = new Date(ts);
  return date.toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}
const clockTime = (ts) => new Date(ts).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function readFileAsDataURL(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const r = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * r); height = Math.round(height * r);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* icons */
const I = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" stroke-linejoin="round"/></svg>',
  homeFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  friends: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9" stroke-linecap="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a7.5 8.5 0 0 1-10.9 7.2L4 20l1.4-3.6A8 8 0 1 1 21 11.5z" stroke-linejoin="round"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-2 8-2 8h16s-2-1-2-8" stroke-linejoin="round"/><path d="M10.5 21a2 2 0 0 0 3 0" stroke-linecap="round"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.4-9.3 9-9.3 9z" stroke-linejoin="round"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.4-9.3 9-9.3 9z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a7.5 8.5 0 0 1-10.9 7.2L4 20l1.4-3.6A8 8 0 1 1 21 11.5z" stroke-linejoin="round"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 3v13M8 7l4-4 4 4"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M3 12h18"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2.5-7.5L3 11z"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M4 17l4.5-4.5 4 4L16 12l4 4" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 12H3m0 0 4-4m-4 4 4 4"/></svg>',
};

/* ----------------------------- navigation ----------------------- */
function navigate(name, params = {}) {
  store.route = { name, params };
  render();
  window.scrollTo(0, 0);
}

/* ----------------------------- boot ----------------------------- */
async function boot() {
  if (!store.token) return renderAuth();
  try {
    store.me = await api('/api/me');
    connectStream();
    refreshCounts();
    render();
  } catch {
    logout();
  }
}

function logout() {
  localStorage.removeItem('lamma_token');
  store.token = null; store.me = null;
  if (store.es) { store.es.close(); store.es = null; }
  renderAuth();
}

/* ----------------------------- realtime (SSE) ------------------- */
function connectStream() {
  if (store.es) store.es.close();
  const es = new EventSource(`${API}/api/stream?token=${encodeURIComponent(store.token)}`);
  store.es = es;
  es.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    const r = store.route;
    if (r.name === 'chat' && Number(r.params.userId) === (msg.sender_id === store.me.id ? msg.receiver_id : msg.sender_id)) {
      appendChatMessage(msg);
      if (msg.receiver_id === store.me.id) api(`/api/messages/${msg.sender_id}`).catch(() => {});
    } else if (msg.receiver_id === store.me.id) {
      store.counts.messages++; paintBadges();
      if (r.name === 'chats') loadChats();
    }
  });
  es.addEventListener('notification', () => { store.counts.notifications++; paintBadges(); });
  es.onerror = () => {};
}

async function refreshCounts() {
  try { store.counts = await api('/api/notifications/count'); paintBadges(); } catch {}
}

/* ============================ AUTH SCREENS ============================ */
function renderAuth(mode = 'login') {
  $app.innerHTML = `
    <div class="screen"><div class="auth view">
      <div class="brand">
        <img class="mark" src="/icon.svg" alt="لمّة" />
        <h1>لمّة</h1>
        <p>${mode === 'login' ? 'سجّل دخولك وابقَ على تواصل' : 'أنشئ حسابك وانضمّ للمّة'}</p>
      </div>
      <div id="authErr"></div>
      <form id="authForm">
        ${mode === 'register' ? `
          <div class="field"><label>الاسم الكامل</label>
            <input class="input" name="name" placeholder="مثال: عمر خالد" required></div>` : ''}
        <div class="field"><label>اسم المستخدم</label>
          <input class="input" name="username" placeholder="username" autocapitalize="off" autocorrect="off" dir="ltr" required></div>
        <div class="field"><label>كلمة المرور</label>
          <input class="input" name="password" type="password" placeholder="••••••" required></div>
        <button class="btn block" type="submit">${mode === 'login' ? 'دخول' : 'إنشاء حساب'}</button>
      </form>
      <div class="switch">
        ${mode === 'login'
          ? 'ما عندك حساب؟ <button id="toReg">أنشئ حساب</button>'
          : 'عندك حساب؟ <button id="toLogin">سجّل دخول</button>'}
      </div>
      ${mode === 'login' ? `<div class="switch" style="margin-top:8px;color:var(--text-3)">تجربة سريعة: <b dir="ltr">demo / 123456</b></div>` : ''}
    </div></div>`;

  document.getElementById('toReg')?.addEventListener('click', () => renderAuth('register'));
  document.getElementById('toLogin')?.addEventListener('click', () => renderAuth('login'));
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    const f = Object.fromEntries(new FormData(e.target));
    try {
      const data = await api(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: f });
      store.token = data.token; localStorage.setItem('lamma_token', data.token);
      store.me = data.user;
      connectStream(); refreshCounts(); navigate('feed');
    } catch (err) {
      document.getElementById('authErr').innerHTML = `<div class="err">${esc(err.message)}</div>`;
      btn.disabled = false;
    }
  });
}

/* ============================ APP SHELL ============================ */
function shell(inner, { topbar = true, nav = true } = {}) {
  $app.innerHTML = `
    <div class="screen">
      ${topbar ? topBar() : ''}
      <main class="app-main">${inner}</main>
      ${nav ? bottomNav() : ''}
    </div>`;
  wireShell();
  paintBadges();
}

function topBar() {
  return `<header class="topbar">
    <span class="logo">لمّة</span>
    <span class="spacer"></span>
    <button class="icon-btn" data-go="search" aria-label="بحث">${I.search}</button>
    <button class="icon-btn" data-go="notifications" aria-label="إشعارات">${I.bell}<span class="badge" data-badge="notifications" hidden></span></button>
  </header>`;
}

function bottomNav() {
  const n = store.route.name;
  const item = (name, icon, iconFill, label, badge) => `
    <button data-go="${name}" class="${n === name ? 'active' : ''}">
      ${n === name ? iconFill : icon}
      ${badge ? `<span class="badge" data-badge="${badge}" hidden></span>` : ''}
      <span class="lbl">${label}</span>
    </button>`;
  return `<nav class="bottomnav">
    ${item('feed', I.home, I.homeFill, 'الرئيسية')}
    ${item('friends', I.friends, I.friends, 'الأصدقاء', 'requests')}
    ${item('chats', I.chat, I.chat, 'المحادثات', 'messages')}
    ${item('me', I.user, I.user, 'حسابي')}
  </nav>`;
}

function wireShell() {
  document.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => {
      const dest = b.dataset.go;
      if (dest === 'me') return navigate('profile', { id: store.me.id });
      navigate(dest);
    });
  });
}

function paintBadges() {
  document.querySelectorAll('[data-badge]').forEach((el) => {
    const v = store.counts[el.dataset.badge] || 0;
    if (v > 0) { el.hidden = false; el.textContent = v > 99 ? '99+' : v; } else { el.hidden = true; }
  });
}

/* ============================ ROUTER ============================ */
function render() {
  const { name } = store.route;
  if (!store.token) return renderAuth();
  if (name === 'feed') return viewFeed();
  if (name === 'friends') return viewFriends();
  if (name === 'chats') return viewChats();
  if (name === 'chat') return viewChat();
  if (name === 'profile') return viewProfile();
  if (name === 'notifications') return viewNotifications();
  if (name === 'search') return viewSearch();
  viewFeed();
}

/* ============================ FEED ============================ */
async function viewFeed() {
  shell(`
    <div class="feed">
      <div class="card composer-trigger" id="composeBtn">
        ${avatar(store.me, 'sm')}
        <div class="fake-input">بم تفكّر يا ${esc(store.me.name.split(' ')[0])}؟</div>
      </div>
      <div id="feedList"><div class="spinner"></div></div>
    </div>`);
  document.getElementById('composeBtn').addEventListener('click', openComposer);
  try {
    const posts = await api('/api/posts');
    const list = document.getElementById('feedList');
    if (!posts.length) {
      list.innerHTML = `<div class="empty"><div class="big">👋</div><p>لا يوجد منشورات بعد.</p><p>أضف أصدقاء أو انشر أول منشور لك!</p></div>`;
    } else {
      list.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px">${posts.map(postCard).join('')}</div>`;
      wirePosts(list);
    }
  } catch (e) { toast(e.message); }
}

function postCard(p) {
  return `<article class="card post" data-post="${p.id}">
    <div class="post-head">
      <span data-profile="${p.author.id}">${avatar(p.author, 'sm')}</span>
      <div class="meta">
        <div class="name" data-profile="${p.author.id}">${esc(p.author.name)}</div>
        <div class="time">${timeAgo(p.created_at)}</div>
      </div>
      ${p.author.id === store.me.id ? `<button class="icon-btn" data-del="${p.id}" style="width:34px;height:34px;background:transparent;color:var(--text-3)">${I.x}</button>` : ''}
    </div>
    ${p.content ? `<div class="post-body">${esc(p.content)}</div>` : ''}
    ${p.image ? `<div class="post-image"><img src="${esc(p.image)}" alt=""></div>` : ''}
    <div class="post-stats">
      ${p.likes ? `<span>${p.likes} ❤️</span>` : '<span></span>'}
      <span class="spacer" style="flex:1"></span>
      ${p.comments ? `<span>${p.comments} تعليق</span>` : ''}
    </div>
    <div class="post-actions">
      <button data-like="${p.id}" class="${p.liked ? 'liked' : ''}">${p.liked ? I.heartFill : I.heart}<span>إعجاب</span></button>
      <button data-comments="${p.id}">${I.comment}<span>تعليق</span></button>
      <button data-share="${p.id}">${I.share}<span>مشاركة</span></button>
    </div>
  </article>`;
}

function wirePosts(root) {
  root.querySelectorAll('[data-profile]').forEach((el) =>
    el.addEventListener('click', () => navigate('profile', { id: Number(el.dataset.profile) })));
  root.querySelectorAll('[data-like]').forEach((el) =>
    el.addEventListener('click', async () => {
      try {
        const updated = await api(`/api/posts/${el.dataset.like}/like`, { method: 'POST' });
        const card = el.closest('.post');
        const fresh = document.createElement('div'); fresh.innerHTML = postCard(updated);
        card.replaceWith(fresh.firstElementChild);
        wirePosts(fresh); // rewire replaced node
      } catch (e) { toast(e.message); }
    }));
  root.querySelectorAll('[data-comments]').forEach((el) =>
    el.addEventListener('click', () => openComments(Number(el.dataset.comments))));
  root.querySelectorAll('[data-share]').forEach((el) =>
    el.addEventListener('click', () => { toast('تم نسخ رابط المنشور'); }));
  root.querySelectorAll('[data-del]').forEach((el) =>
    el.addEventListener('click', async () => {
      if (!confirm('حذف هذا المنشور؟')) return;
      try { await api(`/api/posts/${el.dataset.del}`, { method: 'DELETE' }); el.closest('.post').remove(); toast('تم الحذف'); }
      catch (e) { toast(e.message); }
    }));
}

/* ---------------------- composer modal ---------------------- */
function openComposer() {
  let image = null;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-head">
        <button class="icon-btn" id="cClose" style="background:transparent">${I.x}</button>
        <h3>إنشاء منشور</h3>
        <button class="btn sm" id="cPost">نشر</button>
      </div>
      <div class="compose-row">
        ${avatar(store.me, 'sm')}
        <textarea id="cText" placeholder="بم تفكّر؟" autofocus></textarea>
      </div>
      <div id="cPreview"></div>
      <div class="compose-tools">
        <label class="chip">${I.image} صورة<input id="cImg" type="file" accept="image/*" hidden></label>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelector('#cClose').addEventListener('click', close);
  const preview = backdrop.querySelector('#cPreview');
  backdrop.querySelector('#cImg').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    image = await readFileAsDataURL(file);
    preview.innerHTML = `<div class="img-preview"><img src="${image}"><button class="x" id="rmImg">${I.x}</button></div>`;
    preview.querySelector('#rmImg').addEventListener('click', () => { image = null; preview.innerHTML = ''; });
  });
  backdrop.querySelector('#cPost').addEventListener('click', async () => {
    const content = backdrop.querySelector('#cText').value.trim();
    if (!content && !image) return toast('اكتب شيئاً أو أضف صورة');
    try { await api('/api/posts', { method: 'POST', body: { content, image } }); close(); toast('تم النشر 🎉'); viewFeed(); }
    catch (err) { toast(err.message); }
  });
}

/* ---------------------- comments modal ---------------------- */
async function openComments(postId) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" style="height:80vh;display:flex;flex-direction:column">
      <div class="modal-head">
        <button class="icon-btn" id="kClose" style="background:transparent">${I.x}</button>
        <h3>التعليقات</h3><span style="width:34px"></span>
      </div>
      <div id="kList" style="flex:1;overflow-y:auto"><div class="spinner"></div></div>
      <div style="display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--border);padding-top:12px">
        <textarea id="kInput" class="input" rows="1" placeholder="اكتب تعليقاً..." style="flex:1"></textarea>
        <button class="chat-send" id="kSend">${I.send}</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  backdrop.querySelector('#kClose').addEventListener('click', () => backdrop.remove());
  const list = backdrop.querySelector('#kList');
  async function load() {
    const comments = await api(`/api/posts/${postId}/comments`);
    list.innerHTML = comments.length
      ? comments.map((c) => `<div class="comment">${avatar(c.author, 'xs')}<div><div class="bubble2"><div class="name">${esc(c.author.name)}</div><div class="txt">${esc(c.content)}</div></div><div class="time">${timeAgo(c.created_at)}</div></div></div>`).join('')
      : `<div class="empty"><p>لا تعليقات بعد. كن أول من يعلّق!</p></div>`;
    list.scrollTop = list.scrollHeight;
  }
  load();
  const send = async () => {
    const input = backdrop.querySelector('#kInput');
    const content = input.value.trim(); if (!content) return;
    input.value = '';
    try { await api(`/api/posts/${postId}/comments`, { method: 'POST', body: { content } }); await load(); }
    catch (e) { toast(e.message); }
  };
  backdrop.querySelector('#kSend').addEventListener('click', send);
  backdrop.querySelector('#kInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}

/* ============================ FRIENDS ============================ */
async function viewFriends() {
  shell(`
    <div>
      <div id="reqSection"></div>
      <div class="section-title">أصدقائي</div>
      <div id="friendList" class="list"><div class="spinner"></div></div>
    </div>`);
  try {
    const [reqs, friends] = await Promise.all([api('/api/friends/requests'), api('/api/friends')]);
    const reqEl = document.getElementById('reqSection');
    if (reqs.length) {
      reqEl.innerHTML = `<div class="section-title">طلبات الصداقة (${reqs.length})</div><div class="list">${
        reqs.map((r) => `<div class="row" data-req="${r.request_id}">
          <span data-profile="${r.id}">${avatar(r, 'sm')}</span>
          <div class="meta" data-profile="${r.id}"><div class="name">${esc(r.name)}</div><div class="sub">يريد إضافتك صديقاً</div></div>
          <div class="actions">
            <button class="btn sm" data-accept="${r.request_id}">قبول</button>
            <button class="btn sm ghost" data-decline="${r.request_id}">تجاهل</button>
          </div></div>`).join('')}</div>`;
      reqEl.querySelectorAll('[data-accept]').forEach((b) => b.addEventListener('click', () => respondReq(b.dataset.accept, true)));
      reqEl.querySelectorAll('[data-decline]').forEach((b) => b.addEventListener('click', () => respondReq(b.dataset.decline, false)));
      reqEl.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
    }
    const fl = document.getElementById('friendList');
    fl.innerHTML = friends.length
      ? friends.map((f) => `<div class="row">
          <span data-profile="${f.id}">${avatar(f, 'sm')}</span>
          <div class="meta" data-profile="${f.id}"><div class="name">${esc(f.name)}</div><div class="sub">${esc(f.bio || '@' + f.username)}</div></div>
          <div class="actions"><button class="btn sm ghost" data-chat="${f.id}">مراسلة</button></div></div>`).join('')
      : `<div class="empty"><div class="big">🧑‍🤝‍🧑</div><p>لا أصدقاء بعد.</p><p>ابحث عن أشخاص لإضافتهم.</p><button class="btn" data-go2="search" style="margin-top:12px">ابحث عن أصدقاء</button></div>`;
    fl.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
    fl.querySelectorAll('[data-chat]').forEach((b) => b.addEventListener('click', () => navigate('chat', { userId: Number(b.dataset.chat) })));
    fl.querySelector('[data-go2]')?.addEventListener('click', () => navigate('search'));
  } catch (e) { toast(e.message); }
}

async function respondReq(requestId, accept) {
  try { await api('/api/friends/respond', { method: 'POST', body: { request_id: Number(requestId), accept } });
    store.counts.requests = Math.max(0, store.counts.requests - 1); viewFriends(); refreshCounts(); }
  catch (e) { toast(e.message); }
}

/* ============================ SEARCH ============================ */
function viewSearch() {
  shell(`
    <div style="padding:12px">
      <div style="display:flex;gap:8px;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:8px 14px">
        ${I.search}
        <input id="sInput" class="input" style="border:none;background:transparent;padding:4px" placeholder="ابحث عن أشخاص..." autofocus>
      </div>
      <div id="sResults" class="list" style="padding:8px 0"></div>
    </div>`);
  const input = document.getElementById('sInput');
  const results = document.getElementById('sResults');
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (!q) { results.innerHTML = ''; return; }
    timer = setTimeout(async () => {
      try {
        const users = await api('/api/users?q=' + encodeURIComponent(q));
        results.innerHTML = users.length
          ? users.map(userRow).join('')
          : `<div class="empty"><p>لا نتائج لـ "${esc(q)}"</p></div>`;
        wireUserRows(results);
      } catch (e) { toast(e.message); }
    }, 300);
  });
}

function userRow(u) {
  const label = { none: 'إضافة', request_sent: 'أُرسل الطلب', request_received: 'قبول الطلب', friends: 'أصدقاء', self: 'أنت' }[u.friend_status];
  const cls = u.friend_status === 'none' || u.friend_status === 'request_received' ? 'btn sm' : 'btn sm ghost';
  return `<div class="row" data-uid="${u.id}">
    <span data-profile="${u.id}">${avatar(u, 'sm')}</span>
    <div class="meta" data-profile="${u.id}"><div class="name">${esc(u.name)}</div><div class="sub">${esc(u.bio || '@' + u.username)}</div></div>
    <div class="actions">${u.friend_status !== 'self' ? `<button class="${cls}" data-add="${u.id}" data-st="${u.friend_status}" ${u.friend_status === 'friends' || u.friend_status === 'request_sent' ? 'disabled' : ''}>${label}</button>` : ''}</div>
  </div>`;
}
function wireUserRows(root) {
  root.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
  root.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', async () => {
    try {
      const r = await api('/api/friends/request', { method: 'POST', body: { user_id: Number(b.dataset.add) } });
      b.disabled = true; b.textContent = r.status === 'friends' ? 'أصدقاء' : 'أُرسل الطلب';
      toast(r.status === 'friends' ? 'صرتوا أصدقاء 🎉' : 'تم إرسال الطلب');
    } catch (e) { toast(e.message); }
  }));
}

/* ============================ PROFILE ============================ */
async function viewProfile() {
  const id = store.route.params.id;
  const isMe = id === store.me.id;
  shell(`<div id="profileWrap"><div class="spinner"></div></div>`, { topbar: !isMe ? false : true });
  // custom top area with back for other profiles
  try {
    const u = await api('/api/users/' + id);
    const posts = await api(`/api/users/${id}/posts`);
    const wrap = document.getElementById('profileWrap');
    const statusBtn = () => {
      if (u.friend_status === 'self') return `<button class="btn ghost" id="editBtn">تعديل الملف</button><button class="btn outline" id="logoutBtn">${I.logout} خروج</button>`;
      if (u.friend_status === 'friends') return `<button class="btn ghost" id="msgBtn">مراسلة</button><button class="btn outline" id="unfriendBtn">إزالة صداقة</button>`;
      if (u.friend_status === 'request_sent') return `<button class="btn ghost" disabled>تم إرسال الطلب</button>`;
      if (u.friend_status === 'request_received') return `<button class="btn" id="addBtn">قبول الطلب</button>`;
      return `<button class="btn" id="addBtn">إضافة صديق</button>`;
    };
    wrap.innerHTML = `
      <div class="profile-head">
        <div class="profile-cover">${u.cover ? `<img src="${esc(u.cover)}">` : ''}
          ${!isMe ? `<button class="icon-btn back-btn" id="backBtn" style="position:absolute;top:calc(12px + var(--safe-t));inset-inline-start:12px;background:rgba(0,0,0,.4);color:#fff">${I.back}</button>` : ''}
        </div>
        <div class="profile-info">
          ${avatar(u, 'lg')}
          <div class="name">${esc(u.name)}</div>
          <div class="username" dir="ltr">@${esc(u.username)}</div>
          ${u.bio ? `<div class="bio">${esc(u.bio)}</div>` : ''}
          <div class="profile-stats"><span><b>${u.post_count}</b> منشور</span><span><b>${u.friend_count}</b> صديق</span></div>
          <div class="profile-cta">${statusBtn()}</div>
        </div>
      </div>
      <div class="feed" style="padding-top:10px">${posts.length ? posts.map(postCard).join('') : `<div class="empty"><p>لا منشورات بعد</p></div>`}</div>`;
    wirePosts(wrap);
    wrap.querySelector('#backBtn')?.addEventListener('click', () => history.length > 1 ? navigate('feed') : navigate('feed'));
    wrap.querySelector('#logoutBtn')?.addEventListener('click', () => { if (confirm('تسجيل الخروج؟')) logout(); });
    wrap.querySelector('#editBtn')?.addEventListener('click', () => openEditProfile(u));
    wrap.querySelector('#msgBtn')?.addEventListener('click', () => navigate('chat', { userId: u.id }));
    wrap.querySelector('#addBtn')?.addEventListener('click', async () => {
      try { await api('/api/friends/request', { method: 'POST', body: { user_id: u.id } }); toast('تم'); viewProfile(); } catch (e) { toast(e.message); }
    });
    wrap.querySelector('#unfriendBtn')?.addEventListener('click', async () => {
      if (!confirm('إزالة من الأصدقاء؟')) return;
      try { await api('/api/friends/remove', { method: 'POST', body: { user_id: u.id } }); viewProfile(); } catch (e) { toast(e.message); }
    });
  } catch (e) { toast(e.message); }
}

function openEditProfile(u) {
  let avatarData = u.avatar;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-head"><button class="icon-btn" id="eClose" style="background:transparent">${I.x}</button><h3>تعديل الملف</h3><button class="btn sm" id="eSave">حفظ</button></div>
      <div style="text-align:center;margin-bottom:14px">
        <label style="cursor:pointer;display:inline-block" id="eAvatarWrap">${avatar(u, 'lg')}<div style="color:var(--brand);font-size:13px;font-weight:700;margin-top:8px">تغيير الصورة</div><input id="eAvatar" type="file" accept="image/*" hidden></label>
      </div>
      <div class="field"><label>الاسم</label><input class="input" id="eName" value="${esc(u.name)}"></div>
      <div class="field"><label>نبذة</label><textarea class="input" id="eBio" rows="3" placeholder="عرّف عن نفسك...">${esc(u.bio || '')}</textarea></div>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  backdrop.querySelector('#eClose').addEventListener('click', () => backdrop.remove());
  backdrop.querySelector('#eAvatar').addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    avatarData = await readFileAsDataURL(file, 600, 0.85);
    backdrop.querySelector('#eAvatarWrap').querySelector('.avatar').outerHTML = `<img class="avatar lg" src="${avatarData}">`;
  });
  backdrop.querySelector('#eSave').addEventListener('click', async () => {
    try {
      const me = await api('/api/me', { method: 'PUT', body: {
        name: backdrop.querySelector('#eName').value.trim(),
        bio: backdrop.querySelector('#eBio').value.trim(),
        avatar: avatarData,
      }});
      store.me = me; backdrop.remove(); toast('تم الحفظ'); viewProfile();
    } catch (e) { toast(e.message); }
  });
}

/* ============================ CHATS LIST ============================ */
async function viewChats() { shell(`<div><div class="section-title">المحادثات</div><div id="chatList" class="list"><div class="spinner"></div></div></div>`); loadChats(); }
async function loadChats() {
  try {
    const convs = await api('/api/conversations');
    const el = document.getElementById('chatList'); if (!el) return;
    el.innerHTML = convs.length
      ? convs.map((c) => `<div class="row" data-chat="${c.user.id}">
          ${avatar(c.user, 'sm')}
          <div class="meta"><div class="name">${esc(c.user.name)}</div><div class="sub">${c.last ? (c.last.sender_id === store.me.id ? 'أنت: ' : '') + esc(c.last.content) : ''}</div></div>
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px">
            <span style="font-size:11px;color:var(--text-3)">${c.last ? timeAgo(c.last.created_at) : ''}</span>
            ${c.unread ? `<span class="badge" style="position:static">${c.unread}</span>` : ''}
          </div></div>`).join('')
      : `<div class="empty"><div class="big">💬</div><p>لا محادثات بعد.</p><p>راسل أحد أصدقائك لتبدأ.</p></div>`;
    el.querySelectorAll('[data-chat]').forEach((b) => b.addEventListener('click', () => navigate('chat', { userId: Number(b.dataset.chat) })));
  } catch (e) { toast(e.message); }
}

/* ============================ CHAT CONVERSATION ============================ */
async function viewChat() {
  const other = store.route.params.userId;
  let u = {};
  try { u = await api('/api/users/' + other); } catch {}
  $app.innerHTML = `
    <div class="screen">
      <header class="chat-head">
        <button class="icon-btn back-btn" id="cBack" style="background:transparent">${I.back}</button>
        <span data-profile="${other}">${avatar(u, 'xs')}</span>
        <div class="name" data-profile="${other}">${esc(u.name || '')}</div>
      </header>
      <div class="chat-body" id="chatBody"><div class="spinner"></div></div>
      <div class="chat-input">
        <textarea id="mInput" rows="1" placeholder="اكتب رسالة..."></textarea>
        <button class="chat-send" id="mSend">${I.send}</button>
      </div>
    </div>`;
  document.getElementById('cBack').addEventListener('click', () => navigate('chats'));
  document.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(other) })));
  const body = document.getElementById('chatBody');
  try {
    const msgs = await api('/api/messages/' + other);
    body.innerHTML = msgs.map(bubbleHTML).join('') || `<div class="empty"><p>ابدأ المحادثة 👋</p></div>`;
    body.scrollTop = body.scrollHeight;
    store.counts.messages = Math.max(0, store.counts.messages - msgs.filter((m) => m.receiver_id === store.me.id && !m.read_at).length);
  } catch (e) { toast(e.message); }

  const input = document.getElementById('mInput');
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; });
  const send = async () => {
    const content = input.value.trim(); if (!content) return;
    input.value = ''; input.style.height = 'auto';
    try { await api('/api/messages', { method: 'POST', body: { to: Number(other), content } }); }
    catch (e) { toast(e.message); }
  };
  document.getElementById('mSend').addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
}

function bubbleHTML(m) {
  const mine = m.sender_id === store.me.id;
  return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.content)}<div class="t">${clockTime(m.created_at)}</div></div>`;
}
function appendChatMessage(m) {
  const body = document.getElementById('chatBody'); if (!body) return;
  const empty = body.querySelector('.empty'); if (empty) body.innerHTML = '';
  body.insertAdjacentHTML('beforeend', bubbleHTML(m));
  body.scrollTop = body.scrollHeight;
}

/* ============================ NOTIFICATIONS ============================ */
async function viewNotifications() {
  shell(`<div><div class="section-title">الإشعارات</div><div id="notifList" class="list"><div class="spinner"></div></div></div>`);
  try {
    const items = await api('/api/notifications');
    store.counts.notifications = 0; paintBadges();
    const el = document.getElementById('notifList');
    const verb = { like: 'أعجب بمنشورك', comment: 'علّق على منشورك', friend_request: 'أرسل لك طلب صداقة', friend_accept: 'قبل طلب صداقتك' };
    el.innerHTML = items.length
      ? items.map((n) => `<div class="notif ${n.was_read ? '' : 'unread'}" ${n.actor ? `data-profile="${n.actor.id}"` : ''}>
          ${n.actor ? avatar(n.actor, 'sm') : ''}
          <div class="txt"><b>${esc(n.actor ? n.actor.name : 'أحدهم')}</b> ${verb[n.type] || ''}</div>
          <span style="font-size:12px;color:var(--text-3)">${timeAgo(n.created_at)}</span></div>`).join('')
      : `<div class="empty"><div class="big">🔔</div><p>لا إشعارات بعد</p></div>`;
    el.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
  } catch (e) { toast(e.message); }
}

/* ----------------------------- start ----------------------------- */
boot();
