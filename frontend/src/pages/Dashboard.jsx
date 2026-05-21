import React from 'react';
import { useOrders } from '../context/OrderContext';

// Konfigurasi 4 status: label, warna teks, warna background
const STATUS_CONFIG = {
  menunggu: {
    label: '⏳ Menunggu',
    color: '#92400e',
    bg: '#fef3c7',
    border: '#fcd34d',
  },
  diproses: {
    label: '🔧 Diproses',
    color: '#1e40af',
    bg: '#dbeafe',
    border: '#93c5fd',
  },
  selesai: {
    label: '✅ Selesai',
    color: '#065f46',
    bg: '#d1fae5',
    border: '#6ee7b7',
  },
  diambil: {
    label: '📦 Diambil',
    color: '#4b5563',
    bg: '#f3f4f6',
    border: '#d1d5db',
  },
};

const STATUS_URUTAN = ['menunggu', 'diproses', 'selesai', 'diambil'];
const formatDeadline = (raw) => {
  if (!raw) return '-';
  return new Date(raw).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export default function Dashboard() {
  const { orders, updateOrderStatus } = useOrders();

  // Statistik per status
  const menunggu = orders.filter(o => o.status === 'menunggu').length;
  const diproses  = orders.filter(o => o.status === 'diproses').length;
  const selesai   = orders.filter(o => o.status === 'selesai' || o.status === 'Selesai').length;
  const diambil   = orders.filter(o => o.status === 'diambil').length;

  const stats = [
    { label: 'Menunggu',       value: menunggu, accent: '#f59e0b' },
    { label: 'Sedang Diproses', value: diproses,  accent: 'var(--primary-500)' },
    { label: 'Selesai',        value: selesai,   accent: 'var(--success-500)' },
    { label: 'Sudah Diambil',  value: diambil,   accent: '#6b7280' },
  ];

  const recentOrders = orders.slice(0, 5);

  const quickNotes = [
    'Pantau antrean yang sedang dikerjakan hari ini.',
    'Pastikan layanan dengan deadline dekat diprioritaskan.',
    'Gunakan dropdown untuk mengubah progres pesanan.',
  ];

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

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

      {/* Stats — sekarang 4 kartu */}
      <section className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: 32, color: 'var(--slate-400)' }}>
                      Belum ada pesanan masuk.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const statusKey = (order.status || 'menunggu').toLowerCase();
                    const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['menunggu'];

                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 500 }}>
                          {order.nama_pelanggan || order.namaPelanggan}
                        </td>
                        <td>{order.layanan}</td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {formatDeadline(order.deadline)}
                        </td>
                        <td>
                          {/* Dropdown 4 status */}
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <select
                              value={statusKey}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                padding: '5px 28px 5px 10px',
                                borderRadius: '20px',
                                border: `1.5px solid ${cfg.border}`,
                                backgroundColor: cfg.bg,
                                color: cfg.color,
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                outline: 'none',
                              }}
                            >
                              {STATUS_URUTAN.map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_CONFIG[s].label}
                                </option>
                              ))}
                            </select>
                            {/* Ikon panah kustom */}
                            <span style={{
                              position: 'absolute',
                              right: '9px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none',
                              fontSize: '0.6rem',
                              color: cfg.color,
                            }}>▼</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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

          {/* Legend status */}
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 4px' }}>
            {STATUS_URUTAN.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    backgroundColor: cfg.border,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '0.8rem', color: cfg.color, fontWeight: '600' }}>
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto' }}>
                    {orders.filter(o => (o.status || '').toLowerCase() === s).length} pesanan
                  </span>
                </div>
              );
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }} />

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