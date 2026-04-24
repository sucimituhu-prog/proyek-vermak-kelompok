import React from 'react';

const Dashboard = () => {
  // Dummy data untuk simulasi (Nanti diganti data dari Backend/Context)
  const stats = [
    { label: 'Pesanan Baru', value: '8', color: '#3b82f6' }, // Biru
    { label: 'Sedang Diproses', value: '5', color: '#f59e0b' }, // Oranye
    { label: 'Selesai Hari Ini', value: '12', color: '#10b981' }, // Hijau
  ];

  const recentOrders = [
    { id: 1, nama: 'Budi', layanan: 'Potong Celana', status: 'Proses' },
    { id: 2, nama: 'Siti', layanan: 'Ganti Resleting', status: 'Selesai' },
    { id: 3, nama: 'Andi', layanan: 'Permak Jas', status: 'Proses' },
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
          <h2 className="dashboard-hero__title">Operasional vermak hari ini terlihat jelas dan cepat dipantau.</h2>
          <p className="dashboard-hero__subtitle">Lihat antrean aktif, progres layanan, dan gambaran kerja harian dalam satu layar.</p>
        </div>
        <div className="dashboard-highlight">
          <span className="dashboard-highlight__label">Fokus Hari Ini</span>
          <strong className="dashboard-highlight__value">5 pesanan masih diproses</strong>
          <span className="dashboard-highlight__meta">Jaga ritme pengerjaan dan update status saat pesanan selesai.</span>
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
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.nama}</td>
                    <td>{order.layanan}</td>
                    <td>
                      <span className={`status-pill${order.status === 'Selesai' ? ' is-complete' : ''}`}>
                        {order.status}
                      </span>
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
