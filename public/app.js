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
Object.assign(STR.ar, {
  more: 'المزيد', edit: 'تعديل', savePost: 'حفظ المنشور', unsave: 'إلغاء الحفظ', copyLink: 'نسخ الرابط', report: 'إبلاغ', reportQ: 'سبب الإبلاغ؟', reported: 'تم الإبلاغ، شكراً', copied: 'تم النسخ',
  reply: 'رد', deleteComment: 'حذف التعليق', edited: 'مُعدّل', saved2: 'تم الحفظ', savedPosts: 'المنشورات المحفوظة', noSaved: 'لا منشورات محفوظة',
  follow: 'متابعة', unfollow: 'إلغاء المتابعة', followers: 'متابِع', followingL: 'يتابع', block: 'حظر', unblock: 'إلغاء الحظر', blocked2: 'تم الحظر', blockQ: 'حظر هذا المستخدم؟', unblockQ: 'إلغاء حظر هذا المستخدم؟', blockedUser: 'أنت حاظر هذا المستخدم', saveEdit: 'حفظ',
  online: 'متصل الآن', lastSeen: 'آخر ظهور', typing: 'يكتب…', seen: 'تمت القراءة', sent2: 'أُرسلت',
  tabPosts: 'المنشورات', tabPhotos: 'الصور', tabVideos: 'الفيديوهات', shareProfile: 'مشاركة الملف', noPhotos: 'لا صور', noVideos: 'لا فيديوهات',
  markAllRead: 'تعليم الكل كمقروء', accountSec: 'الحساب', privacy: 'الخصوصية', changePassword: 'تغيير كلمة المرور', currentPassword: 'كلمة المرور الحالية', newPassword: 'كلمة المرور الجديدة',
  emailPhone: 'البريد والهاتف', email: 'البريد الإلكتروني', phone: 'الهاتف', showOnline: 'إظهار «متصل الآن»', showLastSeen: 'إظهار «آخر ظهور»',
  logoutAll: 'تسجيل الخروج من جميع الأجهزة', deleteAccount: 'حذف الحساب', deleteAccountQ: 'حذف حسابك نهائياً؟ لا يمكن التراجع.', logoutAllQ: 'تسجيل الخروج من كل الأجهزة؟', pwChanged: 'تم تغيير كلمة المرور',
});
Object.assign(STR.en, {
  more: 'More', edit: 'Edit', savePost: 'Save post', unsave: 'Unsave', copyLink: 'Copy link', report: 'Report', reportQ: 'Reason for report?', reported: 'Reported, thank you', copied: 'Copied',
  reply: 'Reply', deleteComment: 'Delete comment', edited: 'edited', saved2: 'Saved', savedPosts: 'Saved posts', noSaved: 'No saved posts',
  follow: 'Follow', unfollow: 'Unfollow', followers: 'followers', followingL: 'following', block: 'Block', unblock: 'Unblock', blocked2: 'Blocked', blockQ: 'Block this user?', unblockQ: 'Unblock this user?', blockedUser: "You've blocked this user", saveEdit: 'Save',
  online: 'Online', lastSeen: 'Last seen', typing: 'typing…', seen: 'Seen', sent2: 'Sent',
  tabPosts: 'Posts', tabPhotos: 'Photos', tabVideos: 'Videos', shareProfile: 'Share profile', noPhotos: 'No photos', noVideos: 'No videos',
  markAllRead: 'Mark all as read', accountSec: 'Account', privacy: 'Privacy', changePassword: 'Change password', currentPassword: 'Current password', newPassword: 'New password',
  emailPhone: 'Email & phone', email: 'Email', phone: 'Phone', showOnline: 'Show "Online"', showLastSeen: 'Show "Last seen"',
  logoutAll: 'Log out of all devices', deleteAccount: 'Delete account', deleteAccountQ: 'Permanently delete your account? This cannot be undone.', logoutAllQ: 'Log out of all devices?', pwChanged: 'Password changed',
});

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
function actionSheet(items) {
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="asC" style="background:transparent">${I.x}</button><h3>${t('more')}</h3><span style="width:34px"></span></div><div id="asL"></div></div>`;
  document.body.appendChild(b);
  const close = () => b.remove();
  b.addEventListener('click', (e) => { if (e.target === b) close(); });
  b.querySelector('#asC').addEventListener('click', close);
  const L = b.querySelector('#asL');
  items.filter(Boolean).forEach((it) => { const el = document.createElement('div'); el.className = 'sheet-item' + (it.danger ? ' danger' : ''); el.innerHTML = `${it.icon || ''}<span>${it.label}</span>`; el.addEventListener('click', () => { close(); it.onClick(); }); L.appendChild(el); });
}
function copyText(text) { try { navigator.clipboard.writeText(text); } catch {} toast(t('copied')); }
async function reportTarget(type, id) { const reason = prompt(t('reportQ')); if (reason === null) return; try { await api('/api/reports', { method: 'POST', body: { target_type: type, target_id: Number(id), reason: reason || '' } }); toast(t('reported')); } catch (e) { toast(e.message); } }
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
  dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z" stroke-linejoin="round"/></svg>',
  bookmarkFill:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-4-7 4V5a1 1 0 0 1 1-1z"/></svg>',
  reply:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 5 5v3"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" stroke-linejoin="round"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
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
  es.addEventListener('typing', (e) => { try { const d = JSON.parse(e.data); if (store.route.name === 'chat' && Number(store.route.params.userId) === Number(d.from)) showTyping(); } catch {} });
  es.addEventListener('seen', (e) => { try { const d = JSON.parse(e.data); if (store.route.name === 'chat' && Number(store.route.params.userId) === Number(d.by)) { const el = document.getElementById('seenStatus'); if (el) el.textContent = t('seen'); } } catch {} });
  es.addEventListener('presence', (e) => { try { const d = JSON.parse(e.data); if (store.route.name === 'chat' && Number(store.route.params.userId) === Number(d.user)) setPresence(d.online, d.last_active); } catch {} });
  es.onerror = () => {};
}
let typingTimer = null;
function showTyping() {
  const sub = document.getElementById('presSub'); if (!sub) return;
  const prev = sub.textContent; sub.textContent = t('typing'); sub.classList.add('on');
  clearTimeout(typingTimer); typingTimer = setTimeout(() => { sub.textContent = prev; }, 2500);
}
function setPresence(online, lastActive) {
  const sub = document.getElementById('presSub'); if (!sub) return;
  sub.classList.toggle('on', !!online);
  sub.textContent = online ? t('online') : (lastActive ? `${t('lastSeen')} ${timeAgo(lastActive)}` : '');
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
  return `<nav class="bottomnav">${item('feed', I.home, I.homeFill, t('navHome'))}${item('friends', I.friends, I.friends, t('navFriends'), 'requests')}<button class="nav-create" data-create="1" aria-label="${t('createPost')}">${I.plus}</button>${item('chats', I.chat, I.chat, t('navChats'), 'messages')}${item('me', I.user, I.user, t('navProfile'))}</nav>`;
}
function wireShell() {
  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    const d = b.dataset.go; if (d === 'me') return navigate('profile', { id: store.me.id }); navigate(d);
  }));
  document.querySelector('[data-create]')?.addEventListener('click', () => openComposer());
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
  if (name === 'saved') return viewSaved();
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
      <div class="meta"><div class="name" data-profile="${p.author.id}">${esc(p.author.name)}</div><div class="time">${timeAgo(p.created_at)}${p.edited_at ? ` · <span class="edited-tag">${t('edited')}</span>` : ''}</div></div>
      <button class="icon-btn" data-more="${p.id}" style="width:34px;height:34px;background:transparent;color:var(--text-3)">${I.dots}</button></div>
    ${p.content ? `<div class="post-body">${esc(p.content)}</div>` : ''}
    ${p.image ? `<div class="post-image"><img src="${esc(p.image)}" alt=""></div>` : ''}
    <div class="post-stats">${p.likes ? `<span>${p.likes} ❤️</span>` : '<span></span>'}<span style="flex:1"></span>${p.comments ? `<span>${p.comments} ${t('comment')}</span>` : ''}</div>
    <div class="post-actions">
      <button data-like="${p.id}" class="${p.liked ? 'liked' : ''}">${p.liked ? I.heartFill : I.heart}<span>${t('like')}</span></button>
      <button data-comments="${p.id}">${I.comment}<span>${t('comment')}</span></button>
      <button data-share="${p.id}">${I.share}<span>${t('share')}</span></button>
      <button data-save="${p.id}" class="${p.saved ? 'liked' : ''}">${p.saved ? I.bookmarkFill : I.bookmark}<span>${t('save')}</span></button></div></article>`;
}
function postMenu(p) {
  const mine = p.author.id === store.me.id;
  actionSheet([
    { icon: p.saved ? I.bookmarkFill : I.bookmark, label: p.saved ? t('unsave') : t('savePost'), onClick: () => toggleSave(p.id) },
    { icon: I.share, label: t('copyLink'), onClick: () => copyText(location.origin) },
    mine ? { icon: I.image, label: t('edit'), onClick: () => editPost(p) } : null,
    mine ? { icon: I.trash, label: t('deleted'), danger: true, onClick: () => delPost(p.id) } : null,
    !mine ? { icon: I.x, label: t('report'), danger: true, onClick: () => reportTarget('post', p.id) } : null,
  ]);
}
async function toggleSave(id) { try { await api(`/api/posts/${id}/save`, { method: 'POST' }); refreshCurrentFeed(); } catch (e) { toast(e.message); } }
async function delPost(id) { if (!confirm(t('deletePostQ'))) return; try { await api(`/api/posts/${id}`, { method: 'DELETE' }); document.querySelector(`.post[data-post="${id}"]`)?.remove(); toast(t('deleted')); } catch (e) { toast(e.message); } }
function refreshCurrentFeed() { if (store.route.name === 'feed') viewFeed(); else if (store.route.name === 'profile') viewProfile(); else if (store.route.name === 'saved') viewSaved(); }
function editPost(p) {
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="epC" style="background:transparent">${I.x}</button><h3>${t('edit')}</h3><button class="btn sm" id="epS">${t('save')}</button></div><div class="compose-row"><textarea id="epT">${esc(p.content || '')}</textarea></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#epC').addEventListener('click', () => b.remove());
  b.querySelector('#epS').addEventListener('click', async () => { try { await api(`/api/posts/${p.id}`, { method: 'PUT', body: { content: b.querySelector('#epT').value.trim() } }); b.remove(); toast(t('saved')); refreshCurrentFeed(); } catch (e) { toast(e.message); } });
}
function wirePosts(root) {
  root.querySelectorAll('[data-profile]').forEach((el) => el.addEventListener('click', () => navigate('profile', { id: Number(el.dataset.profile) })));
  root.querySelectorAll('[data-like]').forEach((el) => el.addEventListener('click', async () => {
    try { const updated = await api(`/api/posts/${el.dataset.like}/like`, { method: 'POST' });
      const card = el.closest('.post'); const fresh = document.createElement('div'); fresh.innerHTML = postCard(updated);
      card.replaceWith(fresh.firstElementChild); wirePosts(fresh);
    } catch (e) { toast(e.message); }
  }));
  root.querySelectorAll('[data-save]').forEach((el) => el.addEventListener('click', async () => {
    try { await api(`/api/posts/${el.dataset.save}/save`, { method: 'POST' });
      const pid = el.dataset.save; const updated = await api(`/api/posts/${pid}`);
      const card = el.closest('.post'); const fresh = document.createElement('div'); fresh.innerHTML = postCard(updated);
      card.replaceWith(fresh.firstElementChild); wirePosts(fresh);
    } catch (e) { toast(e.message); }
  }));
  root.querySelectorAll('[data-comments]').forEach((el) => el.addEventListener('click', () => openComments(Number(el.dataset.comments))));
  root.querySelectorAll('[data-share]').forEach((el) => el.addEventListener('click', () => copyText(location.origin)));
  root.querySelectorAll('[data-more]').forEach((el) => el.addEventListener('click', async () => {
    try { const p = await api(`/api/posts/${el.dataset.more}`); postMenu(p); } catch (e) { toast(e.message); }
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
  let replyTo = null;
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal" style="height:82vh;display:flex;flex-direction:column"><div class="modal-head"><button class="icon-btn" id="kClose" style="background:transparent">${I.x}</button><h3>${t('comments')}</h3><span style="width:34px"></span></div>
    <div id="kList" style="flex:1;overflow-y:auto"><div class="spinner"></div></div>
    <div id="replyBar" hidden style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--surface-2);border-radius:8px;margin-bottom:6px;font-size:13px"><span id="replyTxt" style="flex:1;color:var(--text-2)"></span><button class="icon-btn" id="replyX" style="width:26px;height:26px;background:transparent">${I.x}</button></div>
    <div style="display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--border);padding-top:10px"><textarea id="kInput" class="input" rows="1" placeholder="${t('writeComment')}" style="flex:1"></textarea><button class="chat-send" id="kSend">${I.send}</button></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#kClose').addEventListener('click', () => b.remove());
  const list = b.querySelector('#kList');
  const renderComment = (c, isReply) => `<div class="comment ${isReply ? 'reply' : ''}" data-cid="${c.id}">${avatar(c.author, 'xs')}<div style="flex:1"><div class="bubble2"><div class="name">${esc(c.author.name)}</div><div class="txt">${esc(c.content)}</div></div><div class="comment-acts"><span class="${c.liked ? 'liked' : ''}" data-likec="${c.id}">${t('like')}${c.like_count ? ' (' + c.like_count + ')' : ''}</span>${!isReply ? `<span data-replyc="${c.id}" data-rname="${esc(c.author.name)}">${t('reply')}</span>` : ''}${c.author.id === store.me.id ? `<span style="color:var(--accent)" data-delc="${c.id}">${t('deleteComment')}</span>` : ''}<span style="color:var(--text-3)">${timeAgo(c.created_at)}</span></div></div></div>`;
  async function load() {
    const all = await api(`/api/posts/${postId}/comments`);
    const tops = all.filter((c) => !c.parent_id);
    const byParent = {}; all.filter((c) => c.parent_id).forEach((r) => { (byParent[r.parent_id] = byParent[r.parent_id] || []).push(r); });
    list.innerHTML = tops.length ? tops.map((c) => renderComment(c, false) + (byParent[c.id] || []).map((r) => renderComment(r, true)).join('')).join('') : `<div class="empty"><p>${t('noComments')}</p></div>`;
    list.querySelectorAll('[data-likec]').forEach((el) => el.addEventListener('click', async () => { try { await api(`/api/comments/${el.dataset.likec}/like`, { method: 'POST' }); load(); } catch (e) { toast(e.message); } }));
    list.querySelectorAll('[data-replyc]').forEach((el) => el.addEventListener('click', () => { replyTo = { id: el.dataset.replyc, name: el.dataset.rname }; b.querySelector('#replyBar').hidden = false; b.querySelector('#replyTxt').textContent = `${t('reply')} → ${el.dataset.rname}`; b.querySelector('#kInput').focus(); }));
    list.querySelectorAll('[data-delc]').forEach((el) => el.addEventListener('click', async () => { try { await api(`/api/comments/${el.dataset.delc}`, { method: 'DELETE' }); load(); } catch (e) { toast(e.message); } }));
  }
  load();
  b.querySelector('#replyX').addEventListener('click', () => { replyTo = null; b.querySelector('#replyBar').hidden = true; });
  const send = async () => {
    const input = b.querySelector('#kInput'); const content = input.value.trim(); if (!content) return; input.value = '';
    const body = { content }; if (replyTo) body.parent_id = Number(replyTo.id);
    replyTo = null; b.querySelector('#replyBar').hidden = true;
    try { await api(`/api/posts/${postId}/comments`, { method: 'POST', body }); await load(); } catch (e) { toast(e.message); }
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
    const followBtn = () => u.am_following ? `<button class="btn ghost" id="followBtn">${t('unfollow')}</button>` : `<button class="btn" id="followBtn">${t('follow')}</button>`;
    const statusBtn = () => {
      if (u.friend_status === 'self') return `<button class="btn ghost" id="editBtn">${t('editProfile')}</button><button class="btn ghost" id="shareBtn">${I.share}</button><button class="btn ghost" id="privBtn">${I.shield}</button>`;
      if (u.blocked) return `<button class="btn" id="unblockBtn">${t('unblock')}</button>`;
      let left = '';
      if (u.friend_status === 'friends') left = `<button class="btn ghost" id="msgBtn">${t('message')}</button><button class="btn" id="callBtn">${I.phone}</button><button class="btn" id="vcallBtn">${I.video}</button>`;
      else if (u.friend_status === 'request_sent') left = `<button class="btn ghost" disabled>${t('requestSentBtn')}</button>`;
      else if (u.friend_status === 'request_received') left = `<button class="btn" id="addBtn">${t('acceptReq')}</button>`;
      else left = `<button class="btn" id="addBtn">${t('addFriend')}</button>`;
      return left + followBtn();
    };
    wrap.innerHTML = `<div class="profile-head"><div class="profile-cover">${u.cover ? `<img src="${esc(u.cover)}">` : ''}${!isMe ? `<button class="icon-btn back-btn" id="backBtn" style="position:absolute;top:calc(12px + var(--safe-t));inset-inline-start:12px;background:rgba(0,0,0,.4);color:#fff">${I.back}</button><button class="icon-btn" id="moreBtn" style="position:absolute;top:calc(12px + var(--safe-t));inset-inline-end:12px;background:rgba(0,0,0,.4);color:#fff">${I.dots}</button>` : ''}</div>
      <div class="profile-info">${avatar(u, 'lg')}<div class="name">${esc(u.name)}</div><div class="username" dir="ltr">@${esc(u.username)}</div>${u.bio ? `<div class="bio">${esc(u.bio)}</div>` : ''}
      <div class="profile-stats"><span><b>${u.post_count}</b> ${t('postsLbl')}</span><span><b>${u.friend_count}</b> ${t('friendsCountLbl')}</span><span><b>${u.followers}</b> ${t('followers')}</span><span><b>${u.following}</b> ${t('followingL')}</span></div>
      <div class="profile-cta">${statusBtn()}</div></div></div>
      ${u.blocked ? `<div class="empty"><p>${t('blockedUser')}</p></div>` : `<div class="ptabs"><button class="on" data-ptab="posts">${t('tabPosts')}</button><button data-ptab="photos">${t('tabPhotos')}</button><button data-ptab="videos">${t('tabVideos')}</button></div><div id="ptabContent"></div>`}`;
    const photos = posts.filter((p) => p.image);
    const renderTab = (tab) => {
      const c = wrap.querySelector('#ptabContent'); if (!c) return;
      if (tab === 'posts') { c.innerHTML = posts.length ? `<div class="feed" style="padding-top:10px">${posts.map(postCard).join('')}</div>` : `<div class="empty"><p>${t('noPosts')}</p></div>`; wirePosts(c); }
      else if (tab === 'photos') { c.innerHTML = photos.length ? `<div class="media-grid">${photos.map((p) => `<div class="cell" data-openpost="${p.id}"><img src="${esc(p.image)}"></div>`).join('')}</div>` : `<div class="empty"><p>${t('noPhotos')}</p></div>`; c.querySelectorAll('[data-openpost]').forEach((el) => el.addEventListener('click', () => openComments(Number(el.dataset.openpost)))); }
      else { c.innerHTML = `<div class="empty"><div class="big">🎬</div><p>${t('noVideos')}</p></div>`; }
    };
    if (!u.blocked) {
      renderTab('posts');
      wrap.querySelectorAll('[data-ptab]').forEach((b) => b.addEventListener('click', () => { wrap.querySelectorAll('[data-ptab]').forEach((x) => x.classList.toggle('on', x === b)); renderTab(b.dataset.ptab); }));
    }
    wrap.querySelector('#backBtn')?.addEventListener('click', () => navigate('feed'));
    wrap.querySelector('#editBtn')?.addEventListener('click', () => openEditProfile(u));
    wrap.querySelector('#shareBtn')?.addEventListener('click', () => copyText(location.origin));
    wrap.querySelector('#privBtn')?.addEventListener('click', () => navigate('settings'));
    wrap.querySelector('#msgBtn')?.addEventListener('click', () => navigate('chat', { userId: u.id }));
    wrap.querySelector('#callBtn')?.addEventListener('click', () => startCall(u, false));
    wrap.querySelector('#vcallBtn')?.addEventListener('click', () => startCall(u, true));
    wrap.querySelector('#addBtn')?.addEventListener('click', async () => { try { await api('/api/friends/request', { method: 'POST', body: { user_id: u.id } }); viewProfile(); } catch (e) { toast(e.message); } });
    wrap.querySelector('#followBtn')?.addEventListener('click', async () => { try { await api(`/api/users/${u.id}/follow`, { method: u.am_following ? 'DELETE' : 'POST' }); viewProfile(); } catch (e) { toast(e.message); } });
    wrap.querySelector('#unblockBtn')?.addEventListener('click', async () => { if (!confirm(t('unblockQ'))) return; try { await api(`/api/users/${u.id}/block`, { method: 'DELETE' }); viewProfile(); } catch (e) { toast(e.message); } });
    wrap.querySelector('#moreBtn')?.addEventListener('click', () => actionSheet([
      { icon: I.share, label: t('copyLink'), onClick: () => copyText(location.origin) },
      { icon: I.x, label: t('report'), danger: true, onClick: () => reportTarget('user', u.id) },
      u.blocked ? { icon: I.x, label: t('unblock'), onClick: () => api(`/api/users/${u.id}/block`, { method: 'DELETE' }).then(viewProfile) }
                : { icon: I.x, label: t('block'), danger: true, onClick: async () => { if (!confirm(t('blockQ'))) return; try { await api(`/api/users/${u.id}/block`, { method: 'POST' }); toast(t('blocked2')); viewProfile(); } catch (e) { toast(e.message); } } },
    ]));
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
  const presInit = u.online ? t('online') : (u.last_active ? `${t('lastSeen')} ${timeAgo(u.last_active)}` : '');
  $app.innerHTML = `<div class="screen"><header class="chat-head"><button class="icon-btn back-btn" id="cBack" style="background:transparent">${I.back}</button>
      <span class="avatar-wrap" data-profile="${other}">${avatar(u, 'xs')}${u.online ? '<span class="online-dot"></span>' : ''}</span>
      <div style="flex:1;min-width:0"><div class="name" data-profile="${other}">${esc(u.name || '')}</div><div class="sub ${u.online ? 'on' : ''}" id="presSub">${presInit}</div></div>
      <div class="call-head-btns"><button class="icon-btn" id="voiceBtn">${I.phone}</button><button class="icon-btn" id="videoBtn">${I.video}</button></div></header>
    <div class="chat-body" id="chatBody"><div class="spinner"></div></div>
    <div class="seen-status" id="seenStatus"></div>
    <div class="chat-input"><textarea id="mInput" rows="1" placeholder="${t('typeMessage')}"></textarea><button class="chat-send" id="mSend">${I.send}</button></div></div>`;
  document.getElementById('cBack').addEventListener('click', () => navigate('chats'));
  document.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(other) })));
  document.getElementById('voiceBtn').addEventListener('click', () => startCall(u, false));
  document.getElementById('videoBtn').addEventListener('click', () => startCall(u, true));
  const body = document.getElementById('chatBody');
  const updateSeen = (msgs) => { const mine = msgs.filter((m) => m.sender_id === store.me.id); const last = mine[mine.length - 1]; const el = document.getElementById('seenStatus'); if (el) el.textContent = last ? (last.read_at ? t('seen') : t('sent2')) : ''; };
  try {
    const msgs = await api('/api/messages/' + other);
    body.innerHTML = msgs.map(bubbleHTML).join('') || `<div class="empty"><p>${t('startChat')}</p></div>`;
    body.scrollTop = body.scrollHeight; updateSeen(msgs);
    store.counts.messages = Math.max(0, store.counts.messages - msgs.filter((m) => m.receiver_id === store.me.id && !m.read_at).length); paintBadges();
  } catch (e) { toast(e.message); }
  const input = document.getElementById('mInput');
  let lastTyping = 0;
  input.addEventListener('input', () => {
    input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px';
    const n = Date.now(); if (n - lastTyping > 2000) { lastTyping = n; api('/api/typing', { method: 'POST', body: { to: Number(other) } }).catch(() => {}); }
  });
  const send = async () => { const content = input.value.trim(); if (!content) return; input.value = ''; input.style.height = 'auto';
    try { await api('/api/messages', { method: 'POST', body: { to: Number(other), content } }); const el = document.getElementById('seenStatus'); if (el) el.textContent = t('sent2'); } catch (e) { toast(e.message); } };
  document.getElementById('mSend').addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
}
function bubbleHTML(m) { const mine = m.sender_id === store.me.id; return `<div class="bubble ${mine ? 'me' : 'them'}">${esc(m.content)}<div class="t">${clockTime(m.created_at)}</div></div>`; }
function appendChatMessage(m) { const body = document.getElementById('chatBody'); if (!body) return; const empty = body.querySelector('.empty'); if (empty) body.innerHTML = ''; body.insertAdjacentHTML('beforeend', bubbleHTML(m)); body.scrollTop = body.scrollHeight; }

/* ============================ NOTIFICATIONS ============================ */
async function viewNotifications() {
  shell(`<div><div class="section-title" style="display:flex;align-items:center"><span style="flex:1">${t('notifs')}</span><button class="btn sm ghost" id="markAll">${t('markAllRead')}</button></div><div id="notifList" class="list"><div class="spinner"></div></div></div>`);
  document.getElementById('markAll').addEventListener('click', async () => { try { await api('/api/notifications/read-all', { method: 'POST' }); store.counts.notifications = 0; paintBadges(); viewNotifications(); } catch (e) { toast(e.message); } });
  try {
    const items = await api('/api/notifications'); store.counts.notifications = 0; paintBadges();
    const el = document.getElementById('notifList');
    const verb = { like: t('verbLike'), comment: t('verbComment'), friend_request: t('verbFriendRequest'), friend_accept: t('verbFriendAccept'), follow: prefs.lang === 'ar' ? 'بدأ متابعتك' : 'started following you' };
    el.innerHTML = items.length ? items.map((n) => `<div class="notif ${n.was_read ? '' : 'unread'}" ${n.actor ? `data-profile="${n.actor.id}"` : ''}>${n.actor ? avatar(n.actor, 'sm') : ''}<div class="txt"><b>${esc(n.actor ? n.actor.name : t('someone'))}</b> ${verb[n.type] || ''}</div><span style="font-size:12px;color:var(--text-3)">${timeAgo(n.created_at)}</span></div>`).join('') : `<div class="empty"><div class="big">🔔</div><p>${t('notifEmpty')}</p></div>`;
    el.querySelectorAll('[data-profile]').forEach((b) => b.addEventListener('click', () => navigate('profile', { id: Number(b.dataset.profile) })));
  } catch (e) { toast(e.message); }
}

/* ============================ SETTINGS ============================ */
async function viewSettings() {
  let s = { show_online: true, show_last_seen: true, email: '', phone: '' };
  try { s = await api('/api/me/settings'); } catch {}
  shell(`<div><div class="section-title">${t('settings')}</div>
    <div class="set-group">
      <div class="set-row"><span class="ic">${isDark() ? I.homeFill : I.home}</span><span class="lbl">${t('darkMode')}</span>
        <label class="switch"><input type="checkbox" id="darkTog" ${isDark() ? 'checked' : ''}><span class="sl"></span></label></div>
      <div class="set-row"><span class="ic">🌐</span><span class="lbl">${t('language')}</span>
        <div class="seg"><button data-lang="ar" class="${prefs.lang === 'ar' ? 'on' : ''}">${t('arabic')}</button><button data-lang="en" class="${prefs.lang === 'en' ? 'on' : ''}">${t('english')}</button></div></div>
    </div>
    <div class="section-title">${t('privacy')}</div>
    <div class="set-group">
      <div class="set-row"><span class="ic">${I.shield}</span><span class="lbl">${t('showOnline')}</span><label class="switch"><input type="checkbox" id="soTog" ${s.show_online ? 'checked' : ''}><span class="sl"></span></label></div>
      <div class="set-row"><span class="ic">${I.shield}</span><span class="lbl">${t('showLastSeen')}</span><label class="switch"><input type="checkbox" id="slsTog" ${s.show_last_seen ? 'checked' : ''}><span class="sl"></span></label></div>
    </div>
    <div class="section-title">${t('accountSec')}</div>
    <div class="set-group">
      <div class="set-row" id="savedRow"><span class="ic">${I.bookmark}</span><span class="lbl">${t('savedPosts')}</span></div>
      <div class="set-row" id="contactRow"><span class="ic">${I.mail}</span><span class="lbl">${t('emailPhone')}</span></div>
      <div class="set-row" id="pwRow"><span class="ic">${I.lock}</span><span class="lbl">${t('changePassword')}</span></div>
      <div class="set-row" id="logoutAllRow"><span class="ic">${I.logout}</span><span class="lbl">${t('logoutAll')}</span></div>
    </div>
    <div class="set-group">
      <div class="set-row" id="logoutRow"><span class="ic">${I.logout}</span><span class="lbl" style="color:var(--accent)">${t('logout')}</span></div>
      <div class="set-row" id="delRow"><span class="ic">${I.trash}</span><span class="lbl" style="color:var(--accent)">${t('deleteAccount')}</span></div>
    </div>
    <div style="text-align:center;color:var(--text-3);font-size:12px;margin-top:16px">لمّة · Lamma</div></div>`);
  document.getElementById('darkTog').addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { if (b.dataset.lang !== prefs.lang) setLang(b.dataset.lang); }));
  document.getElementById('soTog').addEventListener('change', (e) => api('/api/me/privacy', { method: 'PUT', body: { show_online: e.target.checked } }).catch(() => {}));
  document.getElementById('slsTog').addEventListener('change', (e) => api('/api/me/privacy', { method: 'PUT', body: { show_last_seen: e.target.checked } }).catch(() => {}));
  document.getElementById('savedRow').addEventListener('click', () => navigate('saved'));
  document.getElementById('contactRow').addEventListener('click', () => editContact(s));
  document.getElementById('pwRow').addEventListener('click', () => changePassword());
  document.getElementById('logoutAllRow').addEventListener('click', async () => { if (!confirm(t('logoutAllQ'))) return; try { const r = await api('/api/me/logout-all', { method: 'POST' }); store.token = r.token; localStorage.setItem('lamma_token', r.token); toast(t('saved')); } catch (e) { toast(e.message); } });
  document.getElementById('delRow').addEventListener('click', async () => { if (!confirm(t('deleteAccountQ'))) return; try { await api('/api/me', { method: 'DELETE' }); logout(); } catch (e) { toast(e.message); } });
  document.getElementById('logoutRow').addEventListener('click', () => { if (confirm(t('logoutQ'))) logout(); });
}
function changePassword() {
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="pC" style="background:transparent">${I.x}</button><h3>${t('changePassword')}</h3><button class="btn sm" id="pS">${t('save')}</button></div>
    <div class="field"><label>${t('currentPassword')}</label><input class="input" id="pOld" type="password"></div>
    <div class="field"><label>${t('newPassword')}</label><input class="input" id="pNew" type="password"></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#pC').addEventListener('click', () => b.remove());
  b.querySelector('#pS').addEventListener('click', async () => {
    try { const r = await api('/api/me/password', { method: 'PUT', body: { old_password: b.querySelector('#pOld').value, new_password: b.querySelector('#pNew').value } });
      store.token = r.token; localStorage.setItem('lamma_token', r.token); b.remove(); toast(t('pwChanged'));
    } catch (e) { toast(e.message); }
  });
}
function editContact(s) {
  const b = document.createElement('div'); b.className = 'modal-backdrop';
  b.innerHTML = `<div class="modal"><div class="modal-head"><button class="icon-btn" id="cC" style="background:transparent">${I.x}</button><h3>${t('emailPhone')}</h3><button class="btn sm" id="cS">${t('save')}</button></div>
    <div class="field"><label>${t('email')}</label><input class="input" id="cEmail" type="email" dir="ltr" value="${esc(s.email || '')}"></div>
    <div class="field"><label>${t('phone')}</label><input class="input" id="cPhone" type="tel" dir="ltr" value="${esc(s.phone || '')}"></div></div>`;
  document.body.appendChild(b);
  b.addEventListener('click', (e) => { if (e.target === b) b.remove(); });
  b.querySelector('#cC').addEventListener('click', () => b.remove());
  b.querySelector('#cS').addEventListener('click', async () => {
    try { await api('/api/me/contact', { method: 'PUT', body: { email: b.querySelector('#cEmail').value.trim(), phone: b.querySelector('#cPhone').value.trim() } }); b.remove(); toast(t('saved')); } catch (e) { toast(e.message); }
  });
}

async function viewSaved() {
  shell(`<div><div class="section-title">${t('savedPosts')}</div><div class="feed" id="savedList"><div class="spinner"></div></div></div>`);
  try {
    const posts = await api('/api/posts/saved'); const list = document.getElementById('savedList');
    if (!posts.length) list.innerHTML = `<div class="empty"><div class="big">🔖</div><p>${t('noSaved')}</p></div>`;
    else { list.innerHTML = posts.map(postCard).join(''); wirePosts(list); }
  } catch (e) { toast(e.message); }
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
