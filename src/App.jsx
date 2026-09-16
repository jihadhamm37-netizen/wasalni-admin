import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Drivers from './pages/Drivers';
import Discounts from './pages/Discounts';

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('wasalni_admin_token'));
  return { token, setToken };
}

function ProtectedLayout({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen">
      <nav className="w-48 border-l p-4 flex flex-col gap-3">
        <NavLink to="/orders">الطلبات</NavLink>
        <NavLink to="/drivers">السائقين</NavLink>
        <NavLink to="/discounts">الخصومات</NavLink>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
        <Route path="/drivers" element={<ProtectedLayout><Drivers /></ProtectedLayout>} />
        <Route path="/discounts" element={<ProtectedLayout><Discounts /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/orders" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
