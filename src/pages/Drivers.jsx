import { API_BASE } from '../api';
import { useEffect, useState } from 'react';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const token = localStorage.getItem('wasalni_admin_token');

  function load() {
    fetch(`${API_BASE}/api/admin/drivers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setDrivers);
  }
  useEffect(load, []);

  async function review(id, approval_status) {
    await fetch(`${API_BASE}/api/admin/drivers/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approval_status }),
    });
    load();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-medium mb-4">السائقين</h1>
      <table className="w-full text-sm">
        <thead><tr className="text-right border-b"><th className="py-2">الاسم</th><th>الهاتف</th><th>حالة الموافقة</th><th>التقييم</th><th>إجراءات</th></tr></thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d.id} className="border-b">
              <td className="py-2">{d.name || '—'}</td>
              <td>{d.phone}</td>
              <td>{d.approval_status}</td>
              <td>{d.rating_avg}</td>
              <td className="flex gap-2 py-2">
                {d.approval_status === 'pending' && (
                  <>
                    <button onClick={() => review(d.id, 'approved')} className="text-green-700">موافقة</button>
                    <button onClick={() => review(d.id, 'rejected')} className="text-red-600">رفض</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
