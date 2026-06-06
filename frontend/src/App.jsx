import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard      from './pages/Dashboard';
import AddOrder       from './pages/AddOrder';
import OrderList      from './pages/OrderList';
import CustomerList   from './pages/CustomerList';
import FinanceReport  from './pages/FinanceReport';
import LayananManager from './pages/LayananManager';
import CekPesanan     from './pages/CekPesanan';
import { OrderProvider } from './context/OrderContext';

function App() {
  const navItems = [
    { to: '/',          label: 'Dashboard'      },
    { to: '/add-order', label: 'Tambah Pesanan' },
    { to: '/orders',    label: 'Daftar Pesanan' },
    { to: '/customers', label: 'Data Pelanggan' },
    { to: '/layanan',   label: 'Layanan'        },
    { to: '/reports',   label: 'Laporan'        },
  ];

  return (
    <OrderProvider>
      <Router>
        <Routes>
          {/* Halaman publik — tanpa navbar admin */}
          <Route path="/cek-pesanan" element={<CekPesanan />} />

          {/* Halaman admin — dengan navbar */}
          <Route path="/*" element={
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
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;