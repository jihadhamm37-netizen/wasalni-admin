/* ===================== Lamma — frontend SPA (zero deps) ===================== */
const API = (window.LAMMA_API || '').replace(/\/$/, '');

/* ----------------------------- prefs (lang + theme) ----------------------------- */
const prefs = {
  lang: localStorage.getItem('lamma_lang') || 'ar',
  theme: localStorage.getItem('lamma_theme') || null, // 'dark' | 'light' | null(system)
};
function applyPrefs() {
  const html = document.documentElement;
  html.setAttribute('lang', prefs.lang);
  html.setAttribute('dir', prefs.lang === 'ar' ? 'rtl' : 'ltr');
  if (prefs.theme === 'dark') html.setAttribute('data-theme', 'dark');
  else if (prefs.theme === 'light') html.setAttribute('data-theme', 'light');
  else html.removeAttribute('data-theme');
}
function setLang(l) { prefs.lang = l; localStorage.setItem('lamma_lang', l); applyPrefs(); store.token ? render() : renderAuth(); }
function setTheme(t) { prefs.theme = t; localStorage.setItem('lamma_theme', t); applyPrefs(); }
function isDark() { return prefs.theme ? prefs.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; }

/* ----------------------------- i18n ----------------------------- */
const STR = {
  ar: {
    appName: 'لمّة', loginSub: 'سجّل دخولك وابقَ على تواصل', registerSub: 'أنشئ حسابك وانضمّ للمّة',
    fullName: 'الاسم الكامل', fullNamePh: 'مثال: عمر خالد', username: 'اسم المستخدم', password: 'كلمة المرور',
    login: 'دخول', register: 'إنشاء حساب', noAccount: 'ما عندك حساب؟', createAccount: 'أنشئ حساب', haveAccount: 'عندك حساب؟',
    navHome: 'الرئيسية', navFriends: 'الأصدقاء', navChats: 'المحادثات', navProfile: 'حسابي',
    whatsOnMind: (n) => `بم تفكّر يا ${n}؟`, feedEmpty1: 'لا يوجد منشورات بعد.', feedEmpty2: 'أضف أصدقاء أو انشر أول منشور لك!',
    like: 'إعجاب', comment: 'تعليق', share: 'مشاركة', linkCopied: 'تم نسخ رابط المنشور', deletePostQ: 'حذف هذا المنشور؟', deleted: 'تم الحذف',
    writeSomething: 'اكتب شيئاً أو أضف صورة', posted: 'تم النشر 🎉', createPost: 'إنشاء منشور', whatsOnMindShort: 'بم تفكّر؟', photo: 'صورة', publish: 'نشر',
    comments: 'التعليقات', noComments: 'لا تعليقات بعد. كن أول من يعلّق!', writeComment: 'اكتب تعليقاً...',
    myFriends: 'أصدقائي', friendRequests: 'طلبات الصداقة', wantsToAdd: 'يريد إضافتك صديقاً', accept: 'قبول', ignore: 'تجاهل', message: 'مراسلة',
    noFriends1: 'لا أصدقاء بعد.', noFriends2: 'ابحث عن أشخاص لإضافتهم.', findFriends: 'ابحث عن أصدقاء', searchPeople: 'ابحث عن أشخاص...', noResultsFor: (q) => `لا نتائج لـ "${q}"`,
    add: 'إضافة', requestSentShort: 'أُرسل الطلب', acceptReq: 'قبول الطلب', friendsLbl: 'أصدقاء', youLbl: 'أنت', becameFriends: 'صرتوا أصدقاء 🎉', sentReq: 'تم إرسال الطلب',
    editProfile: 'تعديل الملف', logoutQ: 'تسجيل الخروج؟', removeFriendQ: 'إزالة من الأصدقاء؟', addFriend: 'إضافة صديق', requestSentBtn: 'تم إرسال الطلب', removeFriend: 'إزالة صداقة',
    postsLbl: 'منشور', friendsCountLbl: 'صديق', noPosts: 'لا منشورات بعد', saved: 'تم الحفظ', changePhoto: 'تغيير الصورة', changeCover: 'تغيير الغلاف', name: 'الاسم', bio: 'نبذة', bioPh: 'عرّف عن نفسك...', save: 'حفظ', logout: 'خروج',
    noChats1: 'لا محادثات بعد.', noChats2: 'راسل أحد أصدقائك لتبدأ.', startChat: 'ابدأ المحادثة 👋', typeMessage: 'اكتب رسالة...', youPrefix: 'أنت: ',
    notifs: 'الإشعارات', notifEmpty: 'لا إشعارات بعد', verbLike: 'أعجب بمنشورك', verbComment: 'علّق على منشورك', verbFriendRequest: 'أرسل لك طلب صداقة', verbFriendAccept: 'قبل طلب صداقتك', someone: 'أحدهم',
    settings: 'الإعدادات', appearance: 'المظهر', darkMode: 'الوضع الداكن', language: 'اللغة', account: 'الحساب', arabic: 'العربية', english: 'English',
    callVoice: 'مكالمة صوتية', callVideo: 'مكالمة فيديو', incomingVoice: 'مكالمة صوتية واردة', incomingVideo: 'مكالمة فيديو واردة', calling: 'جارٍ الاتصال…', connecting: 'جارٍ الاتصال…', ringing: 'يرن…', callEnded: 'انتهت المكالمة', decline: 'رفض', endCall: 'إنهاء', mute: 'كتم', camera: 'كاميرا', callFailed: 'فشل الاتصال', mediaDenied: 'لازم تسمح بالوصول للكاميرا/المايك', userBusy: 'المستخدم مشغول', connected: 'متصل',
    genericErr: 'حدث خطأ، حاول مرة أخرى', now: 'الآن',
  },
  en: {
    appName: 'Lamma', loginSub: 'Sign in and stay connected', registerSub: 'Create your account and join Lamma',
    fullName: 'Full name', fullNamePh: 'e.g. Omar Khaled', username: 'Username', password: 'Password',
    login: 'Log in', register: 'Sign up', noAccount: "Don't have an account?", createAccount: 'Create one', haveAccount: 'Have an account?',
    navHome: 'Home', navFriends: 'Friends', navChats: 'Chats', navProfile: 'Profile',
    whatsOnMind: (n) => `What's on your mind, ${n}?`, feedEmpty1: 'No posts yet.', feedEmpty2: 'Add friends or share your first post!',
    like: 'Like', comment: 'Comment', share: 'Share', linkCopied: 'Post link copied', deletePostQ: 'Delete this post?', deleted: 'Deleted',
    writeSomething: 'Write something or add a photo', posted: 'Posted 🎉', createPost: 'Create post', whatsOnMindShort: "What's on your mind?", photo: 'Photo', publish: 'Post',
    comments: 'Comments', noComments: 'No comments yet. Be the first!', writeComment: 'Write a comment...',
    myFriends: 'My friends', friendRequests: 'Friend requests', wantsToAdd: 'wants to be your friend', accept: 'Accept', ignore: 'Ignore', message: 'Message',
    noFriends1: 'No friends yet.', noFriends2: 'Search for people to add.', findFriends: 'Find friends', searchPeople: 'Search people...', noResultsFor: (q) => `No results for "${q}"`,
    add: 'Add', requestSentShort: 'Requested', acceptReq: 'Accept request', friendsLbl: 'Friends', youLbl: 'You', becameFriends: "You're now friends 🎉", sentReq: 'Request sent',
    editProfile: 'Edit profile', logoutQ: 'Log out?', removeFriendQ: 'Remove from friends?', addFriend: 'Add friend', requestSentBtn: 'Request sent', removeFriend: 'Unfriend',
    postsLbl: 'posts', friendsCountLbl: 'friends', noPosts: 'No posts yet', saved: 'Saved', changePhoto: 'Change photo', changeCover: 'Change cover', name: 'Name', bio: 'Bio', bioPh: 'Tell us about yourself...', save: 'Save', logout: 'Log out',
    noChats1: 'No chats yet.', noChats2: 'Message a friend to start.', startChat: 'Start the conversation 👋', typeMessage: 'Type a message...', youPrefix: 'You: ',
    notifs: 'Notifications', notifEmpty: 'No notifications yet', verbLike: 'liked your post', verbComment: 'commented on your post', verbFriendRequest: 'sent you a friend request', verbFriendAccept: 'accepted your request', someone: 'Someone',
    settings: 'Settings', appearance: 'Appearance', darkMode: 'Dark mode', language: 'Language', account: 'Account', arabic: 'العربية', english: 'English',
    callVoice: 'Voice call', callVideo: 'Video call', incomingVoice: 'Incoming voice call', incomingVideo: 'Incoming video call', calling: 'Calling…', connecting: 'Connecting…', ringing: 'Ringing…', callEnded: 'Call ended', decline: 'Decline', endCall: 'End', mute: 'Mute', camera: 'Camera', callFailed: 'Call failed', mediaDenied: 'Allow camera/microphone access', userBusy: 'User is busy', connected: 'Connected',
    genericErr: 'Something went wrong, try again', now: 'now',
  },
};
function t(key, arg) { const v = (STR[prefs.lang] || STR.ar)[key]; return typeof v === 'function' ? v(arg) : (v ?? key); }

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
    headers: { 'Content-Type': 'application/json', ...(store.token ? { Authorization: 'Bearer ' + store.token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || t('genericErr'));
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
  const L = prefs.lang === 'ar' ? { m: 'د', h: 'س', d: 'ي' } : { m: 'm', h: 'h', d: 'd' };
  if (s < 60) return t('now');
  const m = Math.floor(s / 60); if (m < 60) return `${m} ${L.m}`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} ${L.h}`;
  const d = Math.floor(h / 24); if (d < 7) return `${d} ${L.d}`;
  return new Date(ts).toLocaleDateString(prefs.lang, { day: 'numeric', month: 'short' });
}
const clockTime = (ts) => new Date(ts).toLocaleTimeString(prefs.lang, { hour: '2-digit', minute: '2-digit' });
function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }
function readFileAsDataURL(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image(), reader = new FileReader();
    reader.onload = () => { img.src = reader.result; }; reader.onerror = reject;
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) { const r = Math.min(maxDim / width, maxDim / height); width = Math.round(width * r); height = Math.round(height * r); }
      const c = document.createElement('canvas'); c.width = width; c.height = height;
      c.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject; reader.readAsDataURL(file);
  });
}

/* icons */
const I = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" stroke-linejoin="round"/></svg>',
  homeFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  friends:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9" stroke-linecap="round"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a7.5 8.5 0 0 1-10.9 7.2L4 20l1.4-3.6A8 8 0 1 1 21 11.5z" stroke-linejoin="round"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-2 8-2 8h16s-2-1-2-8" stroke-linejoin="round"/><path d="M10.5 21a2 2 0 0 0 3 0" stroke-linecap="round"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.4-9.3 9-9.3 9z" stroke-linejoin="round"/></svg>',
  heartFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.4-9.3 9-9.3 9z"/></svg>',
  comment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a7.5 8.5 0 0 1-10.9 7.2L4 20l1.4-3.6A8 8 0 1 1 21 11.5z" stroke-linejoin="round"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 3v13M8 7l4-4 4 4"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M3 12h18"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2.5-7.5L3 11z"/></svg>',
  image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="M4 17l4.5-4.5 4 4L16 12l4 4" stroke-linejoin="round"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 12H3m0 0 4-4m-4 4 4 4"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V19a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 17.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.3 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" stroke-linejoin="round"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2z"/></svg>',
  video:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3" stroke-linejoin="round"/></svg>',
  micOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 9v3a3 3 0 0 0 5 2.2M15 11V5a3 3 0 0 0-6 0M3 3l18 18M5 11a7 7 0 0 0 10 6.3M12 19v3"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  camOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 3l18 18M16 10l6-3v10M10.5 6H16a2 2 0 0 1 2 2v5M2 8v8a2 2 0 0 0 2 2h9"/></svg>',
  phoneOff:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 15.5c-1.2 0-2.4-.2-3.6-.6-.4-.1-.8 0-1 .2l-2.2 2.2a15.7 15.7 0 0 1-3-2l13-13-1.4-1.4L2 17.6 3.4 19l2.9-2.9c.9.7 1.9 1.3 2.9 1.8l-.9.9c.2.2.5.3.7.3.1 0 .2 0 .3-.1C12 21 18 21 21 20c.6 0 1-.4 1-1v-2.5c0-.6-.4-1-1-1z"/></svg>',
};

/* ----------------------------- navigation ----------------------- */
function navigate(name, params = {}) { store.route = { name, params }; render(); window.scrollTo(0, 0); }

/* ----------------------------- boot ----------------------------- */
async function boot() {
  applyPrefs();
  if (!store.token) return renderAuth();
  try { store.me = await api('/api/me'); connectStream(); refreshCounts(); render(); }
  catch { logout(); }
}
function logout() {
  localStorage.removeItem('lamma_token'); store.token = null; store.me = null;
  if (store.es) { store.es.close(); store.es = null; }
  renderAuth();
}

/* ----------------------------- realtime (SSE) ------------------- */
function connectStream() {
  if (store.es) store.es.close();
  const es = new EventSource(`${API}/api/stream?token=${encodeURIComponent(store.token)}`);
  store.es = es;
  es.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data); const r = store.route;
    if (r.name === 'chat' && Number(r.params.userId) === (msg.sender_id === store.me.id ? msg.receiver_id : msg.sender_id)) {
      appendChatMessage(msg);
      if (msg.receiver_id === store.me.id) api(`/api/messages/${msg.sender_id}`).catch(() => {});
    } else if (msg.receiver_id === store.me.id) {
      store.counts.messages++; paintBadges();
      if (r.name === 'chats') loadChats();
    }
  });
  es.addEventListener('notification', () => { store.counts.notifications++; paintBadges(); });
  es.addEventListener('signal', (e) => { try { handleSignal(JSON.parse(e.data)); } catch {} });
  es.onerror = () => {};
}
async function refreshCounts() { try { store.counts = await api('/api/notifications/count'); paintBadges(); } catch {} }

/* ============================ AUTH ============================ */
function renderAuth(mode = 'login') {
  $app.innerHTML = `
    <div class="screen"><div class="auth view">
      <div class="brand"><img class="mark" src="/icon-192.png" alt="لمّة" /><h1>لمّة</h1>
        <p>${mode === 'login' ? t('loginSub') : t('registerSub')}</p></div>
      <div id="authErr"></div>
      <form id="authForm">
        ${mode === 'register' ? `<div class="field"><label>${t('fullName')}</label><input class="input" name="name" placeholder="${t('fullNamePh')}" required></div>` : ''}
        <div class="field"><label>${t('username')}</label><input class="input" name="username" placeholder="username" autocapitalize="off" autocorrect="off" dir="ltr" required></div>
        <div class="field"><label>${t('password')}</label><input class="input" name="password" type="password" placeholder="••••••" required></div>
        <button class="btn block" type="submit">${mode === 'login' ? t('login') : t('register')}</button>
      </form>
      <div class="switch" style="position:static;width:auto;height:auto">${mode === 'login' ? `${t('noAccount')} <button id="toReg" style="background:none">${t('createAccount')}</button>` : `${t('haveAccount')} <button id="toLogin" style="background:none">${t('login')}</button>`}</div>
      <div class="switch" style="position:static;width:auto;height:auto;margin-top:14px;color:var(--text-3)">
        <button id="langSwap" style="background:none;color:var(--brand);font-weight:700">${prefs.lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
    </div></div>`;
  document.getElementById('toReg')?.addEventListener('click', () => renderAuth('register'));
  document.getElementById('toLogin')?.addEventListener('click', () => renderAuth('login'));
  document.getElementById('langSwap').addEventListener('click', () => { prefs.lang = prefs.lang === 'ar' ? 'en' : 'ar'; localStorage.setItem('lamma_lang', prefs.lang); applyPrefs(); renderAuth(mode); });
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]'); btn.disabled = true;
    const f = Object.fromEntries(new FormData(e.target));
    try {
      const data = await api(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: f });
      store.token = data.token; localStorage.setItem('lamma_token', data.token); store.me = data.user;
      connectStream(); refreshCounts(); navigate('feed');
    } catch (err) { document.getElementById('authErr').innerHTML = `<div class="err">${esc(err.message)}</div>`; btn.disabled = false; }
  });
}

/* ============================ SHELL ============================ */
function shell(inner, { topbar = true, nav = true } = {}) {
  $app.innerHTML = `<div class="screen">${topbar ? topBar() : ''}<main class="app-main">${inner}</main>${nav ? bottomNav() : ''}</div>`;
  wireShell(); paintBadges();
}
function topBar() {
  return `<header class="topbar"><span class="logo">لمّة</span><span class="spacer"></span>
    <button class="icon-btn" data-go="settings">${I.gear}</button>
    <button class="icon-btn" data-go="search">${I.search}</button>
    <button class="icon-btn" data-go="notifications">${I.bell}<span class="badge" data-badge="notifications" hidden></span></button></header>`;
}
function bottomNav() {
  const n = store.route.name;
  const item = (name, icon, iconFill, label, badge) => `<button data-go="${name}" class="${n === name ? 'active' : ''}">${n === name ? iconFill : icon}${badge ? `<span class="badge" data-badge="${badge}" hidden></span>` : ''}<span class="lbl">${label}</span></button>`;
  return `<nav class="bottomnav">${item('feed', I.home, I.homeFill, t('navHome'))}${item('friends', I.friends, I.friends, t('navFriends'), 'requests')}${item('chats', I.chat, I.chat, t('navChats'), 'messages')}${item('me', I.user, I.user, t('navProfile'))}</nav>`;
}
function wireShell() {
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const d = b.dataset.go; if (d === 'me') return navigate('profile', { id: store.me.id }); navigate(d);
  }));
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
  if (name === 'settings') return viewSettings();
  viewFeed();
}

/* ============================ FEED ============================ */
async function viewFeed() {
  shell(`<div class="feed"><div class="card composer-trigger" id="composeBtn">${avatar(store.me, 'sm')}<div class="fake-input">${t('whatsOnMind', esc(store.me.name.split(' ')[0]))}</div></div><div id="feedList"><div class="spinner"></div></div></div>`);
  document.getElementById('composeBtn').addEventListener('click', openComposer);
  try {
    const posts = await api('/api/posts'); const list = document.getElementById('feedList');
    if (!posts.length) list.innerHTML = `<div class="empty"><div class="big">👋</div><p>${t('feedEmpty1')}</p><p>${t('feedEmpty2')}</p></div>`;
    else { list.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px">${posts.map(postCard).join('')}</div>`; wirePosts(list); }
  } catch (e) { toast(e.message); }
}
function postCard(p) {
  return `<article class="card post" data-post="${p.id}">
    <div class="post-head"><span data-profile="${p.author.id}">${avatar(p.author, 'sm')}</span>
      <div class="meta"><div class="name" data-profile="${p.author.id}">${esc(p.author.name)}</div><div class="time">${timeAgo(p.created_at)}</div></div>
      ${p.author.id === store.me.id ? `<button class="icon-btn" data-del="${p.id}" style="width:34px;height:34px;background:transparent;color:var(--text-3)">${I.x}</button>` : ''}</div>
    ${p.content ? `<div class="post-body">${esc(p.content)}</div>` : ''}
    ${p.image ? `<div class="post-image"><img src="${esc(p.image)}" alt=""></div>` : ''}
    <div class="post-stats">${p.likes ? `<span>${p.likes} ❤️</span>` : '<span></span>'}<span style="flex:1"></span>${p.comments ? `<span>${p.comments} ${t('comment')}</span>` : ''}</div>
    <div class="post-actions">
      <button data-like="${p.id}" class="${p.liked ? 'liked' : ''}">${p.liked ? I.heartFill : I.heart}<span>${t('like')}</span></button>
      <button data-comments="${p.id}">${I.comment}<span>${t('comment')}</span></button>
      <button data-share="${p.id}">${I.share}<span>${t('share')}</span></button></div></article>`;
}
function wirePosts(root) {
  root.querySelectorAll('[data-profile]').forEach((el) => el.addEventListener('click', () => navigate('profile', { id: Number(el.dataset.profile) })));
  root.querySelectorAll('[data-like]').forEach((el) => el.addEventListener('click', async () => {
    try { const updated = await api(`/api/posts/${el.dataset.like}/like`, { method: 'POST' });
      const card = el.closest('.post'); const fresh = document.createElement('div'); fresh.innerHTML = postCard(updated);
      card.replaceWith(fresh.firstElementChild); wirePosts(fresh);
    } catch (e) { toast(e.message); }
  }));
  root.querySelectorAll('[data-comments]').forEach((el) => el.addEventListener('click', () => openComments(Number(el.dataset.comments))));
  root.querySelectorAll('[data-share]').forEach((el) => el.addEventListener('click', () => toast(t('linkCopied'))));
  root.querySelectorAll('[data-del]').forEach((el) => el.addEventListener('click', async () => {
    if (!confirm(t('deletePostQ'))) return;
    try { await api(`/api/posts/${el.dataset.del}`, { method: 'DELETE' }); el.closest('.post').remove(); toast(t('deleted')); } catch (e) { toast(e.message); }
  }));
}
function openComposer() {
  let image = null;
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="cClose" style="background:transparent">${I.x}</button><h3>${t('createPost')}</h3><button class="btn sm" id="cPost">${t('publish')}</button></div>
    <div class="compose-row">${avatar(store.me, 'sm')}<textarea id="cText" placeholder="${t('whatsOnMindShort')}" autofocus></textarea></div>
    <div id="cPreview"></div><div class="compose-tools"><label class="chip">${I.image} ${t('photo')}<input id="cImg" type="file" accept="image/*" hidden></label></div></div>`;
  document.body.appendChild(b);
  const close = () => b.remove();
  b.addEventListener('click', (e) => { if (e.target === b) close(); });
  b.querySelector('#cClose').addEventListener('click', close);
  const preview = b.querySelector('#cPreview');
  b.querySelector('#cImg').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return; image = await readFileAsDataURL(f);
    preview.innerHTML = `<div class="img-preview"><img src="${image}"><button class="x" id="rmImg">${I.x}</button></div>`;
    preview.querySelector('#rmImg').addEventListener('click', () => { image = null; preview.innerHTML = ''; });
  });
  b.querySelector('#cPost').addEventListener('click', async () => {
    const content = b.querySelector('#cText').value.trim();
    if (!content && !image) return toast(t('writeSomething'));
    try { await api('/api/posts', { method: 'POST', body: { content, image } }); close(); toast(t('posted')); viewFeed(); } catch (err) { toast(err.message); }
  });
}
async function openComments(postId) {
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal" style="height:80vh;display:flex;flex-direction:column"><div class="modal-head"><button class="icon-btn" id="kClose" style="background:transparent">${I.x}</button><h3>${t('comments')}</h3><span style="width:34px"></span></div>
    <div id="kList" style="flex:1;overflow-y:auto"><div class="spinner"></div></div>
    <div style="display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--border);padding-top:12px"><textarea id="kInput" class="input" rows="1" placeholder="${t('writeComment')}" style="flex:1"></textarea><button class="chat-send" id="kSend">${I.send}</button></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#kClose').addEventListener('click', () => b.remove());
  const list = b.querySelector('#kList');
  async function load() {
    const comments = await api(`/api/posts/${postId}/comments`);
    list.innerHTML = comments.length ? comments.map((c) => `<div class="comment">${avatar(c.author, 'xs')}<div><div class="bubble2"><div class="name">${esc(c.author.name)}</div><div class="txt">${esc(c.content)}</div></div><div class="time">${timeAgo(c.created_at)}</div></div></div>`).join('') : `<div class="empty"><p>${t('noComments')}</p></div>`;
    list.scrollTop = list.scrollHeight;
  }
  load();
  const send = async () => {
    const input = b.querySelector('#kInput'); const content = input.value.trim(); if (!content) return; input.value = '';
    try { await api(`/api/posts/${postId}/comments`, { method: 'POST', body: { content } }); await load(); } catch (e) { toast(e.message); }
  };
  b.querySelector('#kSend').addEventListener('click', send);
  b.querySelector('#kInput').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
}

/* ============================ FRIENDS ============================ */
async function viewFriends() {
  shell(`<div><div id="reqSection"></div><div class="section-title">${t('myFriends')}</div><div id="friendList" class="list"><div class="spinner"></div></div></div>`);
  try {
    const [reqs, friends] = await Promise.all([api('/api/friends/requests'), api('/api/friends')]);
    const reqEl = document.getElementById('reqSection');
    if (reqs.length) {
      reqEl.innerHTML = `<div class="section-title">${t('friendRequests')} (${reqs.length})</div><div class="list">${reqs.map((r) => `<div class="row" data-req="${r.request_id}"><span data-profile="${r.id}">${avatar(r, 'sm')}</span><div class="meta" data-profile="${r.id}"><div class="name">${esc(r.name)}</div><div class="sub">${t('wantsToAdd')}</div></div><div class="actions"><button class="btn sm" data-accept="${r.request_id}">${t('accept')}</button><button class="btn sm ghost" data-decline="${r.request_id}">${t('ignore')}</button></div></div>`).join('')}</div>`;
      reqEl.querySelectorAll('[data-accept]').forEach((b) => b.addEventListener('click', () => respondReq(b.dataset.accept, true)));
      reqEl.querySelectorAll('[data-decline]').forEach((b) => b.addEventListener('click', () => respondReq(b.dataset.decline, false)));
      reqEl.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
    }
    const fl = document.getElementById('friendList');
    fl.innerHTML = friends.length ? friends.map((f) => `<div class="row"><span data-profile="${f.id}">${avatar(f, 'sm')}</span><div class="meta" data-profile="${f.id}"><div class="name">${esc(f.name)}</div><div class="sub">${esc(f.bio || '@' + f.username)}</div></div><div class="actions"><button class="btn sm ghost" data-chat="${f.id}">${t('message')}</button></div></div>`).join('') : `<div class="empty"><div class="big">🧑‍🤝‍🧑</div><p>${t('noFriends1')}</p><p>${t('noFriends2')}</p><button class="btn" data-go2="search" style="margin-top:12px">${t('findFriends')}</button></div>`;
    fl.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
    fl.querySelectorAll('[data-chat]').forEach((b) => b.addEventListener('click', () => navigate('chat', { userId: Number(b.dataset.chat) })));
    fl.querySelector('[data-go2]')?.addEventListener('click', () => navigate('search'));
  } catch (e) { toast(e.message); }
}
async function respondReq(requestId, accept) {
  try { await api('/api/friends/respond', { method: 'POST', body: { request_id: Number(requestId), accept } });
    store.counts.requests = Math.max(0, store.counts.requests - 1); viewFriends(); refreshCounts(); } catch (e) { toast(e.message); }
}

/* ============================ SEARCH ============================ */
function viewSearch() {
  shell(`<div style="padding:12px"><div style="display:flex;gap:8px;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:8px 14px">${I.search}<input id="sInput" class="input" style="border:none;background:transparent;padding:4px" placeholder="${t('searchPeople')}" autofocus></div><div id="sResults" class="list" style="padding:8px 0"></div></div>`);
  const input = document.getElementById('sInput'), results = document.getElementById('sResults'); let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer); const q = input.value.trim(); if (!q) { results.innerHTML = ''; return; }
    timer = setTimeout(async () => {
      try { const users = await api('/api/users?q=' + encodeURIComponent(q));
        results.innerHTML = users.length ? users.map(userRow).join('') : `<div class="empty"><p>${t('noResultsFor', esc(q))}</p></div>`;
        wireUserRows(results);
      } catch (e) { toast(e.message); }
    }, 300);
  });
}
function userRow(u) {
  const label = { none: t('add'), request_sent: t('requestSentShort'), request_received: t('acceptReq'), friends: t('friendsLbl'), self: t('youLbl') }[u.friend_status];
  const cls = u.friend_status === 'none' || u.friend_status === 'request_received' ? 'btn sm' : 'btn sm ghost';
  return `<div class="row" data-uid="${u.id}"><span data-profile="${u.id}">${avatar(u, 'sm')}</span><div class="meta" data-profile="${u.id}"><div class="name">${esc(u.name)}</div><div class="sub">${esc(u.bio || '@' + u.username)}</div></div><div class="actions">${u.friend_status !== 'self' ? `<button class="${cls}" data-add="${u.id}" ${u.friend_status === 'friends' || u.friend_status === 'request_sent' ? 'disabled' : ''}>${label}</button>` : ''}</div></div>`;
}
function wireUserRows(root) {
  root.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
  root.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', async () => {
    try { const r = await api('/api/friends/request', { method: 'POST', body: { user_id: Number(b.dataset.add) } });
      b.disabled = true; b.textContent = r.status === 'friends' ? t('friendsLbl') : t('requestSentShort');
      toast(r.status === 'friends' ? t('becameFriends') : t('sentReq'));
    } catch (e) { toast(e.message); }
  }));
}

/* ============================ PROFILE ============================ */
async function viewProfile() {
  const id = store.route.params.id, isMe = id === store.me.id;
  shell(`<div id="profileWrap"><div class="spinner"></div></div>`, { topbar: isMe });
  try {
    const u = await api('/api/users/' + id); const posts = await api(`/api/users/${id}/posts`);
    const wrap = document.getElementById('profileWrap');
    const statusBtn = () => {
      if (u.friend_status === 'self') return `<button class="btn ghost" id="editBtn">${t('editProfile')}</button>`;
      if (u.friend_status === 'friends') return `<button class="btn ghost" id="msgBtn">${t('message')}</button><button class="btn" id="callBtn">${I.phone}</button><button class="btn" id="vcallBtn">${I.video}</button>`;
      if (u.friend_status === 'request_sent') return `<button class="btn ghost" disabled>${t('requestSentBtn')}</button>`;
      if (u.friend_status === 'request_received') return `<button class="btn" id="addBtn">${t('acceptReq')}</button>`;
      return `<button class="btn" id="addBtn">${t('addFriend')}</button>`;
    };
    wrap.innerHTML = `<div class="profile-head"><div class="profile-cover">${u.cover ? `<img src="${esc(u.cover)}">` : ''}${!isMe ? `<button class="icon-btn back-btn" id="backBtn" style="position:absolute;top:calc(12px + var(--safe-t));inset-inline-start:12px;background:rgba(0,0,0,.4);color:#fff">${I.back}</button>` : ''}</div>
      <div class="profile-info">${avatar(u, 'lg')}<div class="name">${esc(u.name)}</div><div class="username" dir="ltr">@${esc(u.username)}</div>${u.bio ? `<div class="bio">${esc(u.bio)}</div>` : ''}
      <div class="profile-stats"><span><b>${u.post_count}</b> ${t('postsLbl')}</span><span><b>${u.friend_count}</b> ${t('friendsCountLbl')}</span></div>
      <div class="profile-cta">${statusBtn()}</div></div></div>
      <div class="feed" style="padding-top:10px">${posts.length ? posts.map(postCard).join('') : `<div class="empty"><p>${t('noPosts')}</p></div>`}</div>`;
    wirePosts(wrap);
    wrap.querySelector('#backBtn')?.addEventListener('click', () => navigate('feed'));
    wrap.querySelector('#editBtn')?.addEventListener('click', () => openEditProfile(u));
    wrap.querySelector('#msgBtn')?.addEventListener('click', () => navigate('chat', { userId: u.id }));
    wrap.querySelector('#callBtn')?.addEventListener('click', () => startCall(u, false));
    wrap.querySelector('#vcallBtn')?.addEventListener('click', () => startCall(u, true));
    wrap.querySelector('#addBtn')?.addEventListener('click', async () => { try { await api('/api/friends/request', { method: 'POST', body: { user_id: u.id } }); viewProfile(); } catch (e) { toast(e.message); } });
  } catch (e) { toast(e.message); }
}
function openEditProfile(u) {
  let avatarData = u.avatar, coverData = u.cover;
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="eClose" style="background:transparent">${I.x}</button><h3>${t('editProfile')}</h3><button class="btn sm" id="eSave">${t('save')}</button></div>
    <label style="display:block;cursor:pointer;margin-bottom:12px" id="eCoverWrap"><div style="height:90px;border-radius:12px;background:${u.cover ? `url(${u.cover}) center/cover` : 'linear-gradient(120deg,var(--brand),var(--brand-700))'};display:grid;place-items:center;color:#fff;font-size:13px;font-weight:700" id="eCoverBox">${t('changeCover')}</div><input id="eCover" type="file" accept="image/*" hidden></label>
    <div style="text-align:center;margin-bottom:14px"><label style="cursor:pointer;display:inline-block" id="eAvatarWrap">${avatar(u, 'lg')}<div style="color:var(--brand);font-size:13px;font-weight:700;margin-top:8px">${t('changePhoto')}</div><input id="eAvatar" type="file" accept="image/*" hidden></label></div>
    <div class="field"><label>${t('name')}</label><input class="input" id="eName" value="${esc(u.name)}"></div>
    <div class="field"><label>${t('bio')}</label><textarea class="input" id="eBio" rows="3" placeholder="${t('bioPh')}">${esc(u.bio || '')}</textarea></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#eClose').addEventListener('click', () => b.remove());
  b.querySelector('#eAvatar').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; avatarData = await readFileAsDataURL(f, 600, 0.85); b.querySelector('#eAvatarWrap').querySelector('.avatar').outerHTML = `<img class="avatar lg" src="${avatarData}">`; });
  b.querySelector('#eCover').addEventListener('change', async (e) => { const f = e.target.files[0]; if (!f) return; coverData = await readFileAsDataURL(f, 1000, 0.8); const box = b.querySelector('#eCoverBox'); box.style.background = `url(${coverData}) center/cover`; box.textContent = ''; });
  b.querySelector('#eSave').addEventListener('click', async () => {
    try { const me = await api('/api/me', { method: 'PUT', body: { name: b.querySelector('#eName').value.trim(), bio: b.querySelector('#eBio').value.trim(), avatar: avatarData, cover: coverData } });
      store.me = me; b.remove(); toast(t('saved')); viewProfile();
    } catch (e) { toast(e.message); }
  });
}

/* ============================ CHATS ============================ */
async function viewChats() { shell(`<div><div class="section-title">${t('navChats')}</div><div id="chatList" class="list"><div class="spinner"></div></div></div>`); loadChats(); }
async function loadChats() {
  try {
    const convs = await api('/api/conversations'); const el = document.getElementById('chatList'); if (!el) return;
    el.innerHTML = convs.length ? convs.map((c) => `<div class="row" data-chat="${c.user.id}">${avatar(c.user, 'sm')}<div class="meta"><div class="name">${esc(c.user.name)}</div><div class="sub">${c.last ? (c.last.sender_id === store.me.id ? t('youPrefix') : '') + esc(c.last.content) : ''}</div></div><div style="display:flex;flex-direction:column;align-items:flex-start;gap:6px"><span style="font-size:11px;color:var(--text-3)">${c.last ? timeAgo(c.last.created_at) : ''}</span>${c.unread ? `<span class="badge" style="position:static">${c.unread}</span>` : ''}</div></div>`).join('') : `<div class="empty"><div class="big">💬</div><p>${t('noChats1')}</p><p>${t('noChats2')}</p></div>`;
    el.querySelectorAll('[data-chat]').forEach((b) => b.addEventListener('click', () => navigate('chat', { userId: Number(b.dataset.chat) })));
  } catch (e) { toast(e.message); }
}

/* ============================ CHAT ============================ */
async function viewChat() {
  const other = store.route.params.userId; let u = {};
  try { u = await api('/api/users/' + other); } catch {}
  $app.innerHTML = `<div class="screen"><header class="chat-head"><button class="icon-btn back-btn" id="cBack" style="background:transparent">${I.back}</button><span data-profile="${other}">${avatar(u, 'xs')}</span><div class="name" data-profile="${other}" style="flex:1">${esc(u.name || '')}</div><div class="call-head-btns"><button class="icon-btn" id="voiceBtn">${I.phone}</button><button class="icon-btn" id="videoBtn">${I.video}</button></div></header>
    <div class="chat-body" id="chatBody"><div class="spinner"></div></div>
    <div class="chat-input"><textarea id="mInput" rows="1" placeholder="${t('typeMessage')}"></textarea><button class="chat-send" id="mSend">${I.send}</button></div></div>`;
  document.getElementById('cBack').addEventListener('click', () => navigate('chats'));
  document.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(other) })));
  document.getElementById('voiceBtn').addEventListener('click', () => startCall(u, false));
  document.getElementById('videoBtn').addEventListener('click', () => startCall(u, true));
  const body = document.getElementById('chatBody');
  try {
    const msgs = await api('/api/messages/' + other);
    body.innerHTML = msgs.map(bubbleHTML).join('') || `<div class="empty"><p>${t('startChat')}</p></div>`;
    body.scrollTop = body.scrollHeight;
    store.counts.messages = Math.max(0, store.counts.messages - msgs.filter((m) => m.receiver_id === store.me.id && !m.read_at).length); paintBadges();
  } catch (e) { toast(e.message); }
  const input = document.getElementById('mInput');
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; });
  const send = async () => { const content = input.value.trim(); if (!content) return; input.value = ''; input.style.height = 'auto';
    try { await api('/api/messages', { method: 'POST', body: { to: Number(other), content } }); } catch (e) { toast(e.message); } };
  document.getElementById('mSend').addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
}
function bubbleHTML(m) { const mine = m.sender_id === store.me.id; return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.content)}<div class="t">${clockTime(m.created_at)}</div></div>`; }
function appendChatMessage(m) { const body = document.getElementById('chatBody'); if (!body) return; const empty = body.querySelector('.empty'); if (empty) body.innerHTML = ''; body.insertAdjacentHTML('beforeend', bubbleHTML(m)); body.scrollTop = body.scrollHeight; }

/* ============================ NOTIFICATIONS ============================ */
async function viewNotifications() {
  shell(`<div><div class="section-title">${t('notifs')}</div><div id="notifList" class="list"><div class="spinner"></div></div></div>`);
  try {
    const items = await api('/api/notifications'); store.counts.notifications = 0; paintBadges();
    const el = document.getElementById('notifList');
    const verb = { like: t('verbLike'), comment: t('verbComment'), friend_request: t('verbFriendRequest'), friend_accept: t('verbFriendAccept') };
    el.innerHTML = items.length ? items.map((n) => `<div class="notif ${n.was_read ? '' : 'unread'}" ${n.actor ? `data-profile="${n.actor.id}"` : ''}>${n.actor ? avatar(n.actor, 'sm') : ''}<div class="txt"><b>${esc(n.actor ? n.actor.name : t('someone'))}</b> ${verb[n.type] || ''}</div><span style="font-size:12px;color:var(--text-3)">${timeAgo(n.created_at)}</span></div>`).join('') : `<div class="empty"><div class="big">🔔</div><p>${t('notifEmpty')}</p></div>`;
    el.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
  } catch (e) { toast(e.message); }
}

/* ============================ SETTINGS ============================ */
function viewSettings() {
  shell(`<div><div class="section-title">${t('settings')}</div>
    <div class="set-group">
      <div class="set-row"><span class="ic">${isDark() ? I.homeFill : I.home}</span><span class="lbl">${t('darkMode')}</span>
        <label class="switch"><input type="checkbox" id="darkTog" ${isDark() ? 'checked' : ''}><span class="sl"></span></label></div>
      <div class="set-row"><span class="ic">🌐</span><span class="lbl">${t('language')}</span>
        <div class="seg"><button data-lang="ar" class="${prefs.lang === 'ar' ? 'on' : ''}">${t('arabic')}</button><button data-lang="en" class="${prefs.lang === 'en' ? 'on' : ''}">${t('english')}</button></div></div>
    </div>
    <div class="set-group"><div class="set-row" id="logoutRow"><span class="ic">${I.logout}</span><span class="lbl" style="color:var(--accent)">${t('logout')}</span></div></div>
    <div style="text-align:center;color:var(--text-3);font-size:12px;margin-top:16px">لمّة · Lamma</div></div>`);
  document.getElementById('darkTog').addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== prefs.lang) setLang(b.dataset.lang); }));
  document.getElementById('logoutRow').addEventListener('click', () => { if (confirm(t('logoutQ'))) logout(); });
}

/* ============================ CALLS (WebRTC) ============================ */
const RTC_CFG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478' }] };
let call = null; // { pc, otherId, other, withVideo, localStream, remoteSet, pendingIce:[], state }

function signal(to, payload) { api('/api/signal', { method: 'POST', body: { to: Number(to), ...payload } }).catch(() => {}); }

function callUI({ name, status, withVideo, incoming }) {
  closeCallUI();
  const el = document.createElement('div'); el.className = 'call'; el.id = 'callScreen';
  el.innerHTML = `
    <video class="remote" id="remoteV" autoplay playsinline ${withVideo ? '' : 'style="display:none"'}></video>
    ${withVideo ? `<video class="local" id="localV" autoplay playsinline muted></video>` : ''}
    <div class="cavatar">${!withVideo ? avatar(call && call.other, 'lg') : ''}</div>
    <div class="cinfo"><div class="nm">${esc(name)}</div><div class="st" id="callStatus">${status}</div></div>
    <div class="controls" id="callControls">
      ${incoming ? `<button class="cbtn end" id="declineBtn">${I.phoneOff}</button><button class="cbtn" style="background:#22c55e" id="acceptBtn">${withVideo ? I.video : I.phone}</button>`
        : `<button class="cbtn" id="muteBtn">${I.mic}</button>${withVideo ? `<button class="cbtn" id="camBtn">${I.video}</button>` : ''}<button class="cbtn end" id="hangBtn">${I.phoneOff}</button>`}
    </div>`;
  document.body.appendChild(el);
}
function closeCallUI() { const el = document.getElementById('callScreen'); if (el) el.remove(); }
function setCallStatus(s) { const el = document.getElementById('callStatus'); if (el) el.textContent = s; }

async function getMedia(withVideo) {
  try { return await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo ? { facingMode: 'user' } : false }); }
  catch (e) { toast(t('mediaDenied')); throw e; }
}
function newPC(otherId) {
  const pc = new RTCPeerConnection(RTC_CFG);
  pc.onicecandidate = (e) => { if (e.candidate) signal(otherId, { kind: 'ice', candidate: e.candidate }); };
  pc.ontrack = (e) => { const rv = document.getElementById('remoteV'); if (rv && e.streams[0]) { rv.srcObject = e.streams[0]; rv.style.display = ''; const av = document.querySelector('#callScreen .cavatar'); if (av) av.style.display = 'none'; } };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') setCallStatus(t('connected'));
    if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) { if (call && call.state !== 'ended') toast(t('callEnded')); endCall(false); }
  };
  return pc;
}
function wireInCallControls() {
  document.getElementById('hangBtn')?.addEventListener('click', () => endCall(true));
  document.getElementById('muteBtn')?.addEventListener('click', (ev) => {
    if (!call || !call.localStream) return; const tr = call.localStream.getAudioTracks()[0]; if (!tr) return;
    tr.enabled = !tr.enabled; ev.currentTarget.classList.toggle('off', !tr.enabled); ev.currentTarget.innerHTML = tr.enabled ? I.mic : I.micOff;
  });
  document.getElementById('camBtn')?.addEventListener('click', (ev) => {
    if (!call || !call.localStream) return; const tr = call.localStream.getVideoTracks()[0]; if (!tr) return;
    tr.enabled = !tr.enabled; ev.currentTarget.classList.toggle('off', !tr.enabled); ev.currentTarget.innerHTML = tr.enabled ? I.video : I.camOff;
  });
}

async function startCall(other, withVideo) {
  if (call) return toast(t('userBusy'));
  if (!navigator.mediaDevices || !window.RTCPeerConnection) return toast(t('callFailed'));
  call = { otherId: other.id, other, withVideo, pendingIce: [], remoteSet: false, state: 'calling', caller: true };
  callUI({ name: other.name, status: t('calling'), withVideo, incoming: false });
  wireInCallControls();
  try {
    call.localStream = await getMedia(withVideo);
    if (withVideo) { const lv = document.getElementById('localV'); if (lv) lv.srcObject = call.localStream; }
    call.pc = newPC(other.id);
    call.localStream.getTracks().forEach((tr) => call.pc.addTrack(tr, call.localStream));
    const offer = await call.pc.createOffer(); await call.pc.setLocalDescription(offer);
    signal(other.id, { kind: 'offer', media: withVideo ? 'video' : 'audio', sdp: offer });
    setCallStatus(t('ringing'));
  } catch { endCall(false); }
}

function showIncoming(msg) {
  const withVideo = msg.media === 'video';
  call = { otherId: msg.from, other: { id: msg.from, name: msg.fromName, avatar: msg.fromAvatar }, withVideo, pendingIce: [], remoteSet: false, state: 'incoming', offer: msg.sdp, caller: false };
  callUI({ name: msg.fromName || t('someone'), status: withVideo ? t('incomingVideo') : t('incomingVoice'), withVideo, incoming: true });
  document.getElementById('declineBtn').addEventListener('click', () => { signal(call.otherId, { kind: 'reject' }); endCall(false); });
  document.getElementById('acceptBtn').addEventListener('click', acceptCall);
}
async function acceptCall() {
  if (!call) return;
  try {
    call.localStream = await getMedia(call.withVideo);
    document.getElementById('callControls').innerHTML = `<button class="cbtn" id="muteBtn">${I.mic}</button>${call.withVideo ? `<button class="cbtn" id="camBtn">${I.video}</button>` : ''}<button class="cbtn end" id="hangBtn">${I.phoneOff}</button>`;
    if (call.withVideo) { let lv = document.getElementById('localV'); if (!lv) { lv = document.createElement('video'); lv.className = 'local'; lv.id = 'localV'; lv.autoplay = true; lv.playsInline = true; lv.muted = true; document.getElementById('callScreen').appendChild(lv); } lv.srcObject = call.localStream; }
    wireInCallControls();
    setCallStatus(t('connecting'));
    call.pc = newPC(call.otherId);
    call.localStream.getTracks().forEach((tr) => call.pc.addTrack(tr, call.localStream));
    await call.pc.setRemoteDescription(new RTCSessionDescription(call.offer)); call.remoteSet = true;
    for (const c of call.pendingIce) { try { await call.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {} }
    call.pendingIce = [];
    const answer = await call.pc.createAnswer(); await call.pc.setLocalDescription(answer);
    signal(call.otherId, { kind: 'answer', sdp: answer });
    call.state = 'active';
  } catch { endCall(true); }
}
async function handleSignal(msg) {
  if (msg.kind === 'offer') { if (call) { signal(msg.from, { kind: 'reject' }); return; } showIncoming(msg); return; }
  if (!call || Number(msg.from) !== Number(call.otherId)) return;
  if (msg.kind === 'answer') {
    try { await call.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)); call.remoteSet = true; call.state = 'active';
      for (const c of call.pendingIce) { try { await call.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {} } call.pendingIce = [];
    } catch {}
  } else if (msg.kind === 'ice') {
    if (call.pc && call.remoteSet) { try { await call.pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch {} }
    else call.pendingIce.push(msg.candidate);
  } else if (msg.kind === 'reject' || msg.kind === 'hangup') { toast(t('callEnded')); endCall(false); }
}
function endCall(notify) {
  if (!call) return;
  if (notify) signal(call.otherId, { kind: 'hangup' });
  call.state = 'ended';
  try { call.localStream && call.localStream.getTracks().forEach((tr) => tr.stop()); } catch {}
  try { call.pc && call.pc.close(); } catch {}
  call = null; closeCallUI();
}

/* ----------------------------- start ----------------------------- */
boot();
