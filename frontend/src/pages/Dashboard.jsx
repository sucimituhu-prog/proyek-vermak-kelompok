import { useOrders } from '../context/OrderContext';

export default function Dashboard() {
  const { orders } = useOrders();

  const menunggu = orders.filter(o => o.status === 'menunggu').length;
  const diproses = orders.filter(o => o.status === 'diproses').length;
  const selesai  = orders.filter(o => o.status === 'selesai').length;

  const stats = [
    { label: 'Pesanan Baru', value: menunggu, accent: 'var(--primary-500)' },
    { label: 'Sedang Diproses', value: diproses, accent: 'var(--warning-500)' },
    { label: 'Selesai', value: selesai, accent: 'var(--success-500)' },
  ];

  const recentOrders = orders.slice(0, 5);

  const quickNotes = [
    'Pantau antrean yang sedang dikerjakan hari ini.',
    'Pastikan layanan dengan deadline dekat diprioritaskan.',
    'Gunakan data pelanggan untuk repeat order yang lebih cepat.',
  ];

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header__body">
          <p className="page-header__eyebrow">Ringkasan Harian</p>
          <h2 className="page-header__title">Operasional vermak hari ini terlihat jelas dan cepat dipantau.</h2>
          <p className="page-header__subtitle">Lihat antrean aktif, progres layanan, dan gambaran kerja harian dalam satu layar.</p>
        </div>
        <div className="page-header__highlight">
          <span className="page-header__highlight-label">Fokus Hari Ini</span>
          <strong className="page-header__highlight-value">{diproses} pesanan masih diproses</strong>
          <span className="page-header__highlight-meta">Jaga ritme pengerjaan dan update status saat pesanan selesai.</span>
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
              <h3 className="panel__title">Antrean Pesanan Terbaru</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Pelanggan</th>
                  <th>Jenis Layanan</th>
                  <th>Status</th>
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
                      <td>{order.namaPelanggan}</td>
                      <td>{order.layanan}</td>
                      <td>
                        <span className={`status-pill ${order.status === 'selesai' ? 'is-complete' : 'is-waiting'}`}>
                          {order.status}
                        </span>
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

