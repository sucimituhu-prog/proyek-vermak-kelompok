import React from 'react';
import { useOrders } from '../context/OrderContext';

const FinanceReport = () => {
  const { orders, getTotalIncome, getOrderCount } = useOrders();

  return (
    <div className="report-page" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a' }}>Laporan Keuangan Studio Vermak</h2>
        <p style={{ color: '#64748b' }}>Ringkasan pendapatan dan aktivitas transaksi dari database.</p>
      </header>

      {/* Ringkasan Angka */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '25px', background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' }}>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Total Pendapatan</p>
          <h3 style={{ fontSize: '2rem', margin: '10px 0' }}>Rp {getTotalIncome().toLocaleString('id-ID')}</h3>
        </div>

        <div style={{ padding: '25px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Total Transaksi</p>
          <h3 style={{ fontSize: '2rem', margin: '10px 0', color: '#0f172a' }}>{getOrderCount()} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Pesanan</span></h3>
        </div>
      </div>

      {/* Tabel Rincian Keuangan */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <h4 style={{ margin: 0, color: '#1e293b' }}>Rincian Pemasukan per Pesanan</h4>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Nama Pelanggan</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Layanan</th>
              <th style={{ padding: '15px', color: '#64748b', fontWeight: '600' }}>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', color: '#94a3b8' }}>#{order.id}</td>
                <td style={{ padding: '15px', fontWeight: '500' }}>{order.nama_pelanggan}</td>
                <td style={{ padding: '15px' }}>{order.layanan}</td>
                <td style={{ padding: '15px', color: '#059669', fontWeight: '600' }}>Rp {Number(order.total_harga).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceReport;