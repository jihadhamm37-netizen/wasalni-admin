import { useEffect, useState } from 'react';
import { API_BASE } from '../api';


export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '', description: '', discount_type: 'percentage',
    discount_value: '', max_uses: '', min_order_price: '', valid_until: '',
  });

  useEffect(() => { fetchDiscounts(); }, []);

  async function fetchDiscounts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts`, { headers: { Authorization: `Bearer ${localStorage.getItem('wasalni_admin_token')}` } });
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch {
      setError('تعذر تحميل الخصومات');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!form.code || !form.discount_value) {
      setError('كود الخصم والقيمة مطلوبان');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('wasalni_admin_token')}`,
        },
        body: JSON.stringify({
          ...form,
          discount_value: Number(form.discount_value),
          max_uses: form.max_uses ? Number(form.max_uses) : null,
          min_order_price: form.min_order_price ? Number(form.min_order_price) : 0,
          valid_until: form.valid_until || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'فشل إنشاء الخصم');
        return;
      }
      setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '', min_order_price: '', valid_until: '' });
      fetchDiscounts();
    } catch {
      setError('خطأ بالاتصال بالسيرفر');
    }
  }

  async function toggleActive(discount) {
    await fetch(`${API_BASE}/api/admin/discounts/${discount.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('wasalni_admin_token')}`,
      },
      body: JSON.stringify({ active: !discount.active }),
    });
    fetchDiscounts();
  }

  async function handleDelete(id) {
    if (!confirm('حذف هذا الخصم نهائياً؟')) return;
    await fetch(`${API_BASE}/api/admin/discounts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('wasalni_admin_token')}` } });
    fetchDiscounts();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">إدارة خصومات الزبائن</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3 mb-6 max-w-xl">
        <input placeholder="كود الخصم (مثال: WELCOME10)" value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
          className="border rounded px-3 py-2 col-span-2" />
        <input placeholder="وصف الخصم" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2 col-span-2" />
        <select value={form.discount_type}
          onChange={e => setForm({ ...form, discount_type: e.target.value })}
          className="border rounded px-3 py-2">
          <option value="percentage">نسبة مئوية %</option>
          <option value="fixed">مبلغ ثابت (دينار)</option>
        </select>
        <input type="number" placeholder="قيمة الخصم" value={form.discount_value}
          onChange={e => setForm({ ...form, discount_value: e.target.value })}
          className="border rounded px-3 py-2" />
        <input type="number" placeholder="حد أقصى للاستخدام (اختياري)" value={form.max_uses}
          onChange={e => setForm({ ...form, max_uses: e.target.value })}
          className="border rounded px-3 py-2" />
        <input type="number" placeholder="أقل سعر طلب (اختياري)" value={form.min_order_price}
          onChange={e => setForm({ ...form, min_order_price: e.target.value })}
          className="border rounded px-3 py-2" />
        <input type="date" value={form.valid_until}
          onChange={e => setForm({ ...form, valid_until: e.target.value })}
          className="border rounded px-3 py-2 col-span-2" />
        {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="col-span-2 bg-blue-700 text-white rounded px-4 py-2">
          إضافة خصم
        </button>
      </form>

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-right border-b">
              <th className="py-2">الكود</th>
              <th>القيمة</th>
              <th>الاستخدام</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(d => (
              <tr key={d.id} className="border-b">
                <td className="py-2">{d.code}</td>
                <td>{d.discount_type === 'percentage' ? `${d.discount_value}%` : `${d.discount_value} دينار`}</td>
                <td>{d.used_count}{d.max_uses ? ` / ${d.max_uses}` : ''}</td>
                <td>{d.active ? 'مفعّل' : 'معطّل'}</td>
                <td className="flex gap-2 py-2">
                  <button onClick={() => toggleActive(d)} className="text-blue-700">
                    {d.active ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
