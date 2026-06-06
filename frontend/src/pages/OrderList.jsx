import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import axios from 'axios';

const STATUS_CONFIG = {
  menunggu: { label: '⏳ Menunggu', color: '#92400e', bg: '#fef3c7', border: '#fcd34d' },
  diproses: { label: '🔧 Diproses', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
  selesai:  { label: '✅ Selesai',  color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
  diambil:  { label: '📦 Diambil', color: '#4b5563', bg: '#f3f4f6', border: '#d1d5db' },
};
const STATUS_URUTAN = ['semua', 'menunggu', 'diproses', 'selesai', 'diambil'];

const formatTanggal = (raw) => {
  if (!raw) return '-';
  return new Date(raw).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function OrderList() {
  const { orders, updateOrderStatus, deleteOrder, fetchOrders } = useOrders();
  const [filterStatus, setFilterStatus]   = useState('semua');
  const [searchTerm, setSearchTerm]       = useState('');
  const [sortBy, setSortBy]               = useState('terbaru');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editCatatan, setEditCatatan]     = useState('');
  const [editingCatatan, setEditingCatatan] = useState(false);
  const [savingCatatan, setSavingCatatan]   = useState(false);

  let filtered = orders.filter((o) => {
    const cocokStatus = filterStatus === 'semua' || (o.status || '').toLowerCase() === filterStatus;
    const cocokSearch =
      (o.nama_pelanggan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.layanan        || '').toLowerCase().includes(searchTerm.toLowerCase());
    return cocokStatus && cocokSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'terbaru')  return b.id - a.id;
    if (sortBy === 'terlama')  return a.id - b.id;
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    return 0;
  });

  const handleStatusChange = (id, newStatus, e) => {
    e.stopPropagation();
    updateOrderStatus(id, newStatus);
  };

  const handleHapus = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Hapus pesanan ini?')) deleteOrder(id);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setEditCatatan(order.catatan || '');
    setEditingCatatan(false);
  };

  const handleSaveCatatan = async () => {
    setSavingCatatan(true);
    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}`, {
        nama_pelanggan: selectedOrder.nama_pelanggan,
        nomor_hp: selectedOrder.nomor_hp,
        catatan: editCatatan,
      });
      // Refresh orders dari context
      if (fetchOrders) await fetchOrders();
      setSelectedOrder({ ...selectedOrder, catatan: editCatatan });
      setEditingCatatan(false);
    } catch {
      alert('Gagal menyimpan catatan.');
    } finally {
      setSavingCatatan(false);
    }
  };

  const modalOrder = selectedOrder
    ? orders.find(o => o.id === selectedOrder.id) || selectedOrder
    : null;
  const modalCfg = modalOrder
    ? STATUS_CONFIG[(modalOrder.status || 'menunggu').toLowerCase()] || STATUS_CONFIG['menunggu']
    : null;

  return (
    <div className="page" style={{ padding: '30px' }}>

      {/* Modal Detail */}
      {modalOrder && modalCfg && (
        <div onClick={() => setSelectedOrder(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '88vh', overflowY: 'auto' }}>

            {/* Header modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detail Pesanan</p>
                <h3 style={{ margin: '2px 0 0', color: '#1e293b' }}>#{modalOrder.id} — {modalOrder.nama_pelanggan}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Foto — fix: contain agar tidak terpotong */}
              {modalOrder.foto ? (
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', maxHeight: '280px' }}>
                  <img
                    src={`http://localhost:5000${modalOrder.foto}`}
                    alt="Foto pakaian"
                    style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '12px' }}
                  />
                </div>
              ) : (
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#cbd5e1', fontSize: '0.85rem' }}>
                  📷 Tidak ada foto
                </div>
              )}

              {/* Status badge */}
              <div style={{ backgroundColor: modalCfg.bg, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{modalCfg.label.split(' ')[0]}</span>
                <span style={{ color: modalCfg.color, fontWeight: '700' }}>{modalCfg.label.slice(2)}</span>
              </div>

              {/* Info pesanan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Pelanggan',        value: modalOrder.nama_pelanggan },
                  { label: 'WhatsApp',         value: modalOrder.nomor_hp },
                  { label: 'Layanan',          value: modalOrder.layanan },
                  { label: 'Qty',              value: `${modalOrder.qty} item` },
                  { label: 'Total',            value: `Rp ${Number(modalOrder.total_harga || 0).toLocaleString('id-ID')}`, bold: true, blue: true },
                  { label: 'Tanggal Masuk',    value: formatTanggal(modalOrder.created_at) },
                  { label: 'Estimasi Selesai', value: formatTanggal(modalOrder.deadline) },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ fontWeight: item.bold ? '700' : '500', color: item.blue ? '#2563eb' : '#1e293b', fontSize: '0.9rem' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Catatan — bisa diedit */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p style={{ fontWeight: '700', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Catatan</p>
                  {!editingCatatan && (
                    <button onClick={() => { setEditCatatan(modalOrder.catatan || ''); setEditingCatatan(true); }}
                      style={{ fontSize: '0.75rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '2px 6px' }}>
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {editingCatatan ? (
                  <div>
                    <textarea
                      value={editCatatan}
                      onChange={(e) => setEditCatatan(e.target.value)}
                      placeholder="Tulis catatan pesanan..."
                      autoFocus
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #2563eb', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical', minHeight: '80px', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button onClick={() => setEditingCatatan(false)}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                        Batal
                      </button>
                      <button onClick={handleSaveCatatan} disabled={savingCatatan}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: savingCatatan ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 'bold', cursor: savingCatatan ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                        {savingCatatan ? 'Menyimpan...' : 'Simpan'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', color: modalOrder.catatan ? '#475569' : '#cbd5e1', fontSize: '0.9rem', fontStyle: modalOrder.catatan ? 'normal' : 'italic' }}>
                    {modalOrder.catatan || 'Belum ada catatan. Klik Edit untuk menambahkan.'}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-header__body">
          <p className="page-header__eyebrow">Manajemen</p>
          <h2 className="page-header__title">Daftar Pesanan</h2>
          <p className="page-header__subtitle">Klik baris pesanan untuk lihat detail, foto, dan catatan.</p>
        </div>
        <div className="page-header__highlight">
          <span className="page-header__highlight-label">Total Pesanan</span>
          <strong className="page-header__highlight-value">{orders.length}</strong>
          <span className="page-header__highlight-meta">
            {orders.filter(o => o.status === 'menunggu').length} menunggu dikerjakan
          </span>
        </div>
      </header>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          <input type="text" placeholder="Cari nama pelanggan atau layanan..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', backgroundColor: 'white' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_URUTAN.map((s) => {
            const isActive = filterStatus === s;
            const cfg = s === 'semua' ? null : STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '8px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit',
                border: isActive ? `1.5px solid ${cfg ? cfg.border : '#2563eb'}` : '1.5px solid #e2e8f0',
                backgroundColor: isActive ? (cfg ? cfg.bg : '#eff6ff') : 'white',
                color: isActive ? (cfg ? cfg.color : '#2563eb') : '#64748b',
              }}>
                {s === 'semua' ? 'Semua' : STATUS_CONFIG[s].label}
                <span style={{ marginLeft: '6px', fontSize: '0.7rem', backgroundColor: isActive ? 'rgba(0,0,0,0.08)' : '#f1f5f9', padding: '1px 6px', borderRadius: '10px' }}>
                  {s === 'semua' ? orders.length : orders.filter(o => (o.status || '').toLowerCase() === s).length}
                </span>
              </button>
            );
          })}
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'inherit', cursor: 'pointer', backgroundColor: 'white', color: '#374151', outline: 'none' }}>
          <option value="terbaru">Terbaru</option>
          <option value="terlama">Terlama</option>
          <option value="deadline">Deadline Terdekat</option>
        </select>
      </div>

      {/* Tabel */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div className="table-wrap">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Total</th>
                <th>Deadline</th>
                <th>Status</th>
                <th style={{ width: '50px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    {searchTerm || filterStatus !== 'semua' ? 'Tidak ada pesanan yang cocok.' : 'Belum ada pesanan masuk.'}
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
                    <tr key={order.id}
                      onClick={() => openModal(order)}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {order.foto && <span title="Ada foto">📷</span>}
                          {order.nama_pelanggan}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.nomor_hp}</div>
                      </td>
                      <td>
                        <div>{order.layanan}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.qty} item</div>
                      </td>
                      <td style={{ color: '#059669', fontWeight: '600' }}>
                        Rp {Number(order.total_harga || 0).toLocaleString('id-ID')}
                      </td>
                      <td>
                        <span style={{ color: isDeadlineDekat ? '#dc2626' : '#475569', fontWeight: isDeadlineDekat ? '700' : '400', fontSize: '0.85rem' }}>
                          {isDeadlineDekat && '⚠️ '}{formatTanggal(order.deadline)}
                        </span>
                      </td>
                      <td>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select value={statusKey}
                            onChange={(e) => handleStatusChange(order.id, e.target.value, e)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ appearance: 'none', WebkitAppearance: 'none', padding: '5px 28px 5px 10px', borderRadius: '20px', border: `1.5px solid ${cfg.border}`, backgroundColor: cfg.bg, color: cfg.color, fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                              <option key={key} value={key}>{val.label}</option>
                            ))}
                          </select>
                          <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.6rem', color: cfg.color }}>▼</span>
                        </div>
                      </td>
                      <td>
                        <button onClick={(e) => handleHapus(order.id, e)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}>
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
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#94a3b8' }}>
            Menampilkan {filtered.length} dari {orders.length} pesanan — klik baris untuk detail
          </div>
        )}
      </div>
    </div>
  );
}