// رابط السيرفر الخلفي — يُضبط من متغير بيئة VITE_API_BASE وقت النشر على Railway
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
