import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('الإيميل وكلمة السر مطلوبين'); return; }
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError('بيانات الدخول غير صحيحة'); return; }
      const data = await res.json();
      localStorage.setItem('wasalni_admin_token', data.token);
      navigate('/orders');
    } catch {
      setError('تعذر الاتصال بالسيرفر');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 border rounded">
        <h1 className="text-lg font-medium mb-4">تسجيل دخول لوحة تحكم وصلني</h1>
        <input type="email" placeholder="الإيميل" value={email}
          onChange={e => setEmail(e.target.value)} className="border rounded w-full px-3 py-2 mb-3" />
        <input type="password" placeholder="كلمة السر" value={password}
          onChange={e => setPassword(e.target.value)} className="border rounded w-full px-3 py-2 mb-3" />
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <button type="submit" className="bg-blue-700 text-white rounded px-4 py-2 w-full">دخول</button>
      </form>
    </div>
  );
}
