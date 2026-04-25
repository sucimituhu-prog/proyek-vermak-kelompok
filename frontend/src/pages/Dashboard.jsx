import React from 'react';
import { useOrders } from '../context/OrderContext';

export default function Dashboard() {
  // Ambil data dan fungsi update dari Context
  const { orders, updateOrderStatus } = useOrders();

  // Logika statistik (mendukung status 'menunggu', 'diproses', dan 'selesai')
  const menunggu = orders.filter(o => o.status === 'menunggu').length;
  const diproses = orders.filter(o => o.status === 'diproses').length;
  const selesai  = orders.filter(o => o.status === 'selesai' || o.status === 'Selesai').length;

  const stats = [
    { label: 'Pesanan Baru', value: menunggu, accent: 'var(--primary-500)' },
    { label: 'Sedang Diproses', value: diproses, accent: 'var(--warning-500)' },
    { label: 'Selesai', value: selesai, accent: 'var(--success-500)' },
  ];

  // Tampilkan 5 pesanan terbaru saja di dashboard
  const recentOrders = orders.slice(0, 5);

  const quickNotes = [
    'Pantau antrean yang sedang dikerjakan hari ini.',
    'Pastikan layanan dengan deadline dekat diprioritaskan.',
    'Klik pada status pesanan untuk mengubah progres secara cepat.',
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__body">
          <p className="page-header__eyebrow">Ringkasan Harian</p>
          <h2 className="page-header__title">Operasional Studio Vermak</h2>
          <p className="page-header__subtitle">Data real-time langsung dari database tim.</p>
        </div>
        <div className="page-header__highlight">
          <span className="page-header__highlight-label">Fokus Hari Ini</span>
          <strong className="page-header__highlight-value">
            {menunggu + diproses} Pesanan Aktif
          </strong>
          <span className="page-header__highlight-meta">Jangan lupa update status jika sudah selesai dikerjakan!</span>
        </div>
      </header>

      <section className="card-grid">
        {stats.map((item, index) => (
          <div key={index} className="card card--accent-left" style={{ '--card-accent': item.accent }}>
            <span className="card__label">{item.label}</span>
            <h3 className="card__value">{item.value}</h3>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Pesanan Aktif</p>
              <h3 className="panel__title">5 Antrean Terbaru</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Pelanggan</th>
                  <th>Layanan</th>
                  <th>Status (Klik untuk Ubah)</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center" style={{ padding: 32, color: 'var(--slate-400)' }}>
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      {/* Mendukung nama_pelanggan (DB) dan namaPelanggan (Adit) */}
                      <td style={{ fontWeight: 500 }}>{order.nama_pelanggan || order.namaPelanggan}</td>
                      <td>{order.layanan}</td>
                      <td>
                        <button 
                          onClick={() => {
                            // Fungsi toggle status: Menunggu -> Selesai
                            const nextStatus = order.status === 'menunggu' ? 'selesai' : 'menunggu';
                            updateOrderStatus(order.id, nextStatus);
                          }}
                          className={`status-pill ${order.status === 'selesai' ? 'is-complete' : 'is-waiting'}`}
                          style={{ 
                            cursor: 'pointer', 
                            border: 'none', 
                            fontFamily: 'inherit',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                          title="Klik untuk ubah status"
                        >
                          {order.status}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Catatan Cepat</p>
              <h3 className="panel__title">Prioritas Tim</h3>
            </div>
          </div>
          <div className="note-list">
            {quickNotes.map((note, idx) => (
              <div key={idx} className="note-item">
                <span className="note-item__dot" aria-hidden="true"></span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}