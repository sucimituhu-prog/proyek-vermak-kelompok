import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

const STATUS_CONFIG = {
  menunggu: { label: '⏳ Menunggu', color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
  diproses: { label: '🔧 Diproses', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  selesai:  { label: '✅ Selesai',  color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
  diambil:  { label: '📦 Diambil', color: '#4b5563', bg: '#f3f4f6', border: '#d1d5db' },
};

const STATUS_URUTAN = ['semua', 'menunggu', 'diproses', 'selesai', 'diambil'];
const formatDeadline = (raw) => {
  if (!raw) return '-';
  return new Date(raw).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export default function OrderList() {
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchTerm, setSearchTerm]     = useState('');
  const [sortBy, setSortBy]             = useState('terbaru');

  // Filter
  let filtered = orders.filter((o) => {
    const cocokStatus = filterStatus === 'semua' || (o.status || '').toLowerCase() === filterStatus;
    const cocokSearch =
      (o.nama_pelanggan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.layanan        || '').toLowerCase().includes(searchTerm.toLowerCase());
    return cocokStatus && cocokSearch;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'terbaru')  return b.id - a.id;
    if (sortBy === 'terlama')  return a.id - b.id;
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });

  const handleStatusChange = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
  };

  return (
    <div className="page" style={{ padding: '30px' }}>
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-header__body">
          <p className="page-header__eyebrow">Manajemen</p>
          <h2 className="page-header__title">Daftar Pesanan</h2>
          <p className="page-header__subtitle">
            Semua pesanan masuk — filter, cari, dan update status dari sini.
          </p>
        </div>
        <div className="page-header__highlight">
          <span className="page-header__highlight-label">Total Pesanan</span>
          <strong className="page-header__highlight-value">{orders.length}</strong>
          <span className="page-header__highlight-meta">
            {orders.filter(o => o.status === 'menunggu').length} menunggu dikerjakan
          </span>
        </div>
      </header>

      {/* Toolbar: Search + Filter + Sort */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '20px',
        flexWrap: 'wrap', alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem'
          }}>🔍</span>
          <input
            type="text"
            placeholder="Cari nama pelanggan atau layanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 34px',
              borderRadius: '10px', border: '1px solid #e2e8f0',
              fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
              backgroundColor: 'white',
            }}
          />
        </div>

        {/* Filter status tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_URUTAN.map((s) => {
            const isActive = filterStatus === s;
            const cfg = s === 'semua' ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '8px 14px', borderRadius: '20px', fontSize: '0.8rem',
                  fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
                  border: isActive
                    ? `1.5px solid ${cfg ? cfg.border : '#2563eb'}`
                    : '1.5px solid #e2e8f0',
                  backgroundColor: isActive ? (cfg ? cfg.bg : '#eff6ff') : 'white',
                  color: isActive ? (cfg ? cfg.color : '#2563eb') : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                {s === 'semua' ? 'Semua' : STATUS_CONFIG[s].label}
                <span style={{
                  marginLeft: '6px', fontSize: '0.7rem',
                  backgroundColor: isActive ? 'rgba(0,0,0,0.08)' : '#f1f5f9',
                  padding: '1px 6px', borderRadius: '10px',
                }}>
                  {s === 'semua'
                    ? orders.length
                    : orders.filter(o => (o.status || '').toLowerCase() === s).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0',
            fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer',
            backgroundColor: 'white', color: '#374151', outline: 'none',
          }}
        >
          <option value="terbaru">Terbaru</option>
          <option value="terlama">Terlama</option>
          <option value="deadline">Deadline Terdekat</option>
        </select>
      </div>

      {/* Tabel Pesanan */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Deadline</th>
                <th>Status</th>
                <th style={{ width: '80px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    {searchTerm || filterStatus !== 'semua'
                      ? 'Tidak ada pesanan yang cocok dengan filter.'
                      : 'Belum ada pesanan masuk.'}
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const statusKey = (order.status || 'menunggu').toLowerCase();
                  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['menunggu'];
                  const isDeadlineDekat = order.deadline &&
                    (new Date(order.deadline) - new Date()) / (1000 * 60 * 60 * 24) <= 1 &&
                    statusKey !== 'selesai' && statusKey !== 'diambil';

                  return (
                    <tr key={order.id}>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          {order.nama_pelanggan || order.namaPelanggan}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {order.nomor_hp}
                        </div>
                      </td>
                      <td>{order.layanan}</td>
                      <td style={{ textAlign: 'center' }}>{order.qty || 1}</td>
                      <td style={{ color: '#059669', fontWeight: '600' }}>
                        Rp {Number(order.total_harga || 0).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span style={{
                          color: isDeadlineDekat ? '#dc2626' : '#475569',
                          fontWeight: isDeadlineDekat ? '700' : '400',
                          fontSize: '0.85rem',
                        }}>
                          {isDeadlineDekat && '⚠️ '}
                          {formatDeadline(order.deadline)}
                        </span>
                      </td>
                      <td>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={statusKey}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              appearance: 'none', WebkitAppearance: 'none',
                              padding: '5px 28px 5px 10px', borderRadius: '20px',
                              border: `1.5px solid ${cfg.border}`,
                              backgroundColor: cfg.bg, color: cfg.color,
                              fontWeight: '700', fontSize: '0.75rem',
                              cursor: 'pointer', fontFamily: 'inherit', outline: 'none',
                            }}
                          >
                            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                              <option key={key} value={key}>{val.label}</option>
                            ))}
                          </select>
                          <span style={{
                            position: 'absolute', right: '9px', top: '50%',
                            transform: 'translateY(-50%)', pointerEvents: 'none',
                            fontSize: '0.6rem', color: cfg.color,
                          }}>▼</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          style={{
                            padding: '6px 10px', borderRadius: '8px',
                            border: 'none', backgroundColor: '#fee2e2',
                            color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem',
                          }}
                          title="Hapus pesanan"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{
            padding: '12px 20px', borderTop: '1px solid #f1f5f9',
            fontSize: '0.8rem', color: '#94a3b8',
          }}>
            Menampilkan {filtered.length} dari {orders.length} pesanan
          </div>
        )}
      </div>
    </div>
  );
}