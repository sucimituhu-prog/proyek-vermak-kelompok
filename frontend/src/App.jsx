import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddOrder from './pages/AddOrder';
import CustomerList from './pages/CustomerList';
import FinanceReport from './pages/FinanceReport';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/add-order" style={{ marginRight: '15px' }}>Tambah Pesanan</Link>
          <Link to="/customers" style={{ marginRight: '15px' }}>Data Pelanggan</Link>
          <Link to="/reports">Laporan</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/reports" element={<FinanceReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;