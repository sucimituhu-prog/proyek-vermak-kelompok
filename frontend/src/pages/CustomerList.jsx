import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

const STATUS_CONFIG = {
  menunggu: { label: '⏳ Menunggu', color: '#92400e', bg: '#fef3c7' },
  diproses: { label: '🔧 Diproses', color: '#1e40af', bg: '#dbeafe' },
  selesai:  { label: '✅ Selesai',  color: '#065f46', bg: '#d1fae5' },
  diambil:  { label: '📦 Diambil', color: '#4b5563', bg: '#f3f4f6' },
};

const CustomerList = () => {
  const { orders, deleteOrder, updateOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editData, setEditData] = useState({ nama_pelanggan: '', nomor_hp: '', catatan: '' });

  // Deduplikasi: 1 kartu per nomor HP unik, kumpulkan semua ordernya
  const pelangganMap = {};
  orders.forEach((o) => {
    const key = o.nomor_hp || o.nomorHP || 'unknown';
    if (!pelangganMap[key]) {
      pelangganMap[key] = {
        id: o.id,
        nama_pelanggan: o.nama_pelanggan || o.namaPelanggan || '-',
        nomor_hp: key,
        catatan: o.catatan || '',
        orders: [],
      };
    }
    pelangganMap[key].orders.push(o);
  });

  const pelangganList = Object.values(pelangganMap).filter((p) =>
    p.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nomor_hp.includes(searchTerm)
  );

  const openEditModal = (pelanggan) => {
    setSelectedCustomer(pelanggan);
    setEditData({
      nama_pelanggan: pelanggan.nama_pelanggan,
      nomor_hp: pelanggan.nomor_hp,
      catatan: pelanggan.catatan,
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      // Update semua order milik pelanggan ini
      await Promise.all(
        selectedCustomer.orders.map((o) => updateOrder(o.id, editData))
      );
      setIsModalOpen(false);
    } catch {
      alert('Gagal update data');
    }
  };

  const handleHapusSemua = (pelanggan) => {
    if (window.confirm(`Hapus semua ${pelanggan.orders.length} pesanan milik ${pelanggan.nama_pelanggan}?`)) {
      pelanggan.orders.forEach((o) => deleteOrder(o.id));
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* Modal Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Edit Profil Pelanggan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Nama Pelanggan
                </label>
                <input
                  type="text" value={editData.nama_pelanggan}
                  onChange={(e) => setEditData({ ...editData, nama_pelanggan: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  WhatsApp
                </label>
                <input
                  type="text" value={editData.nomor_hp}
                  onChange={(e) => setEditData({ ...editData, nomor_hp: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Catatan Khusus
                </label>
                <textarea
                  value={editData.catatan}
                  onChange={(e) => setEditData({ ...editData, catatan: e.target.value })}
                  placeholder="Contoh: Pelanggan minta jahitan double."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit' }}
              >Batal</button>
              <button
                onClick={handleSaveEdit}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}
              >Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1e293b', fontWeight: 'bold', margin: 0 }}>Data Pelanggan</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          {pelangganList.length} pelanggan terdaftar
        </p>
      </header>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
        <input
          type="text"
          placeholder="Cari nama atau nomor HP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px 10px 34px',
            borderRadius: '10px', border: '1px solid #e2e8f0',
            fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
            backgroundColor: 'white',
          }}
        />
      </div>

      {/* Grid Kartu */}
      {pelangganList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          {searchTerm ? 'Tidak ada pelanggan yang cocok.' : 'Belum ada data pelanggan.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {pelangganList.map((pelanggan) => (
            <div key={pelanggan.nomor_hp} style={{
              backgroundColor: 'white', padding: '20px',
              borderRadius: '16px', border: '1px solid #e2e8f0',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              {/* Info utama */}
              <div>
                <h3 style={{ margin: 0, color: '#1e293b' }}>{pelanggan.nama_pelanggan}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
                  📞 {pelanggan.nomor_hp}
                </p>
              </div>

              {/* Riwayat order */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Riwayat Pesanan ({pelanggan.orders.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pelanggan.orders.slice(0, 3).map((o) => {
                    const sKey = (o.status || 'menunggu').toLowerCase();
                    const cfg  = STATUS_CONFIG[sKey] || STATUS_CONFIG['menunggu'];
                    return (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: '#475569' }}>{o.layanan}</span>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: '700',
                          padding: '2px 8px', borderRadius: '10px',
                          backgroundColor: cfg.bg, color: cfg.color,
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                  {pelanggan.orders.length > 3 && (
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                      +{pelanggan.orders.length - 3} pesanan lainnya
                    </p>
                  )}
                </div>
              </div>

              {/* Catatan */}
              {pelanggan.catatan && (
                <div style={{ padding: '10px 12px', backgroundColor: '#fff7ed', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9a3412', margin: '0 0 4px' }}>CATATAN</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                    "{pelanggan.catatan}"
                  </p>
                </div>
              )}

              {/* Tombol aksi */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => openEditModal(pelanggan)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #2563eb', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'transparent', fontFamily: 'inherit' }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleHapusSemua(pelanggan)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;