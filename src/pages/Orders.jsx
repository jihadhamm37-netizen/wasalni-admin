import { API_BASE } from '../api';
import { useEffect, useState } from 'react';

const statusLabels = {
  pending: 'بانتظار سائق', accepted: 'تم القبول', in_progress: 'جاري التوصيل',
  delivered: 'تم التسليم', cancelled: 'ملغى',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('wasalni_admin_token');
    const url = filter ? `${API_BASE}/api/admin/orders?status=${filter}` : `${API_BASE}/api/admin/orders`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setOrders);
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">الطلبات</h1>
      <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-2 mb-4">
        <option value="">كل الحالات</option>
        {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <table className="w-full text-sm">
        <thead><tr className="text-right border-b"><th className="py-2">رقم الطلب</th><th>الحالة</th><th>السعر</th><th>التاريخ</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b">
              <td className="py-2">{o.id.slice(0, 8)}</td>
              <td>{statusLabels[o.status]}</td>
              <td>{o.final_price} دينار</td>
              <td>{new Date(o.created_at).toLocaleString('ar-JO')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
