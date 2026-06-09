import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard      from './pages/Dashboard';
import AddOrder       from './pages/AddOrder';
import OrderList      from './pages/OrderList';
import CustomerList   from './pages/CustomerList';
import FinanceReport  from './pages/FinanceReport';
import LayananManager from './pages/LayananManager';
import CekPesanan     from './pages/CekPesanan';
import Login          from './pages/Login';
import { OrderProvider } from './context/OrderContext';

function AdminShell({ onLogout }) {
  const navItems = [
    { to: '/',          label: 'Dashboard'      },
    { to: '/add-order', label: 'Tambah Pesanan' },
    { to: '/orders',    label: 'Daftar Pesanan' },
    { to: '/customers', label: 'Data Pelanggan' },
    { to: '/layanan',   label: 'Layanan'        },
    { to: '/reports',   label: 'Laporan'        },
  ];

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-brand">
          <span className="app-brand__eyebrow">Studio Vermak</span>
          <h1 className="app-brand__title">Kelola pesanan dan pelanggan dengan lebih rapi.</h1>
        </div>
        <nav className="app-nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={onLogout}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0',
              backgroundColor: 'white', color: '#dc2626', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: '600', fontSize: '0.85rem', marginLeft: '8px',
            }}
          >
            Keluar
          </button>
        </nav>
      </header>
      <main className="app-content">
        <Routes>
          <Route path="/"          element={<Dashboard />}      />
          <Route path="/add-order" element={<AddOrder />}       />
          <Route path="/orders"    element={<OrderList />}      />
          <Route path="/customers" element={<CustomerList />}   />
          <Route path="/layanan"   element={<LayananManager />} />
          <Route path="/reports"   element={<FinanceReport />}  />
          <Route path="*"          element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking]     = useState(true);

  // Cek token saat app pertama dibuka
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setChecking(false); return; }

    axios.get('https://proyek-vermak-kelompok-production.up.railway.app/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsLoggedIn(true))
      .catch(() => { localStorage.removeItem('token'); })
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Set token di semua request axios secara global
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isLoggedIn]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Memuat...
      </div>
    );
  }

  return (
    <OrderProvider>
      <Router>
        <Routes>
          {/* Halaman publik — selalu bisa diakses */}
          <Route path="/cek-pesanan" element={<CekPesanan />} />

          {/* Halaman login */}
          <Route path="/login" element={
            isLoggedIn
              ? <Navigate to="/" />
              : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          } />

          {/* Halaman admin — redirect ke login kalau belum login */}
          <Route path="/*" element={
            isLoggedIn
              ? <AdminShell onLogout={handleLogout} />
              : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;