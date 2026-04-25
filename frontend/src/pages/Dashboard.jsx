import React from 'react';
import { useOrders } from '../context/OrderContext'; 

const Dashboard = () => {
  // 1. Ambil data DAN fungsi update dari Context di sini (hanya sekali saja)
  const { orders, updateOrderStatus } = useOrders(); 

  const stats = [
    { label: 'Total Pesanan', value: orders.length, color: '#3b82f6' },
    { label: 'Sedang Diproses', value: orders.filter(o => o.status === 'menunggu').length, color: '#f59e0b' },
    { label: 'Selesai', value: orders.filter(o => o.status === 'selesai').length, color: '#10b981' },
  ];

  const quickNotes = [
    'Pantau antrean yang sedang dikerjakan hari ini.',
    'Pastikan layanan dengan deadline dekat diprioritaskan.',
    'Gunakan data pelanggan untuk repeat order yang lebih cepat.',
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Ringkasan Harian</p>
          <h2 className="dashboard-hero__title">Operasional vermak hari ini terlihat jelas.</h2>
          <p className="dashboard-hero__subtitle">Data real-time dari database Studio Vermak.</p>
        </div>
        <div className="dashboard-highlight">
          <span className="dashboard-highlight__label">Fokus Hari Ini</span>
          <strong className="dashboard-highlight__value">
            {orders.filter(o => o.status === 'menunggu').length} pesanan menunggu
          </strong>
        </div>
      </header>

      <section className="dashboard-stats">
        {stats.map((item, index) => (
          <div key={index} className="stat-card" style={{ '--stat-accent': item.color }}>
            <span className="stat-card__label">{item.label}</span>
            <h3 className="stat-card__value">{item.value}</h3>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Pesanan Aktif</p>
              <h3 className="dashboard-panel__title">Antrean Pesanan Terbaru</h3>
            </div>
          </div>

          <div className="dashboard-table-wrap">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nama Pelanggan</th>
                  <th>Jenis Layanan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.nama_pelanggan}</td>
                    <td>{order.layanan}</td>
                    <td>
                      <button 
                        onClick={() => {
                          const nextStatus = order.status === 'menunggu' ? 'selesai' : 'menunggu';
                          updateOrderStatus(order.id, nextStatus);
                        }}
                        className={`status-pill${order.status === 'selesai' ? ' is-complete' : ''}`}
                        style={{ 
                          cursor: 'pointer', 
                          border: 'none', 
                          fontFamily: 'inherit',
                          display: 'inline-block'
                        }}
                        title="Klik untuk ubah status"
                      >
                        {order.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="dashboard-panel dashboard-panel--compact">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Catatan Cepat</p>
              <h3 className="dashboard-panel__title">Prioritas Tim</h3>
            </div>
          </div>
          <div className="note-list">
            {quickNotes.map((note) => (
              <div key={note} className="note-item">
                <span className="note-item__dot" aria-hidden="true"></span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;