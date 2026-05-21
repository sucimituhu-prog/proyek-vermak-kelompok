import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/layanan';

const emptyForm = { nama: '', harga: '', deadline_hari: '', deskripsi: '', aktif: 1 };

export default function LayananManager() {
  const [layananList, setLayananList]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [isEdit, setIsEdit]             = useState(false);
  const [selectedId, setSelectedId]     = useState(null);
  const [formData, setFormData]         = useState(emptyForm);
  const [saving, setSaving]             = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');

  const fetchLayanan = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/all`);
      setLayananList(res.data);
    } catch (err) {
      console.error("Gagal fetch layanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLayanan(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openTambah = () => {
    setIsEdit(false);
    setSelectedId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);
    setFormData({
      nama: item.nama,
      harga: item.harga,
      deadline_hari: item.deadline_hari,
      deskripsi: item.deskripsi || '',
      aktif: item.aktif,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama || !formData.harga || !formData.deadline_hari) {
      alert('Nama, harga, dan deadline wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await axios.put(`${API}/${selectedId}`, formData);
        showSuccess('Layanan berhasil diperbarui.');
      } else {
        await axios.post(API, formData);
        showSuccess('Layanan baru berhasil ditambahkan.');
      }
      await fetchLayanan();
      setModalOpen(false);
    } catch (err) {
      alert('Gagal menyimpan layanan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAktif = async (item) => {
    try {
      await axios.put(`${API}/${item.id}`, { ...item, aktif: item.aktif === 1 ? 0 : 1 });
      await fetchLayanan();
      showSuccess(`Layanan ${item.aktif === 1 ? 'dinonaktifkan' : 'diaktifkan'}.`);
    } catch {
      alert('Gagal mengubah status layanan.');
    }
  };

  const handleHapus = async (id, nama) => {
    if (!window.confirm(`Hapus layanan "${nama}"? Data tidak bisa dikembalikan.`)) return;
    try {
      await axios.delete(`${API}/${id}`);
      await fetchLayanan();
      showSuccess('Layanan berhasil dihapus.');
    } catch {
      alert('Gagal menghapus layanan.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px',
    border: '1px solid #cbd5e1', fontFamily: 'inherit',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    fontWeight: '600', fontSize: '0.85rem',
    display: 'block', marginBottom: '6px', color: '#374151',
  };

  return (
    <div className="page" style={{ padding: '30px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Manajemen
          </p>
          <h2 style={{ color: '#1e293b', fontWeight: 'bold', margin: 0, fontSize: '1.6rem' }}>
            Daftar Layanan
          </h2>
          <p style={{ color: '#64748b', margin: '4px 0 0' }}>
            Kelola jenis layanan, harga, dan estimasi deadline dari sini.
          </p>
        </div>
        <button
          onClick={openTambah}
          style={{
            padding: '10px 20px', backgroundColor: '#2563eb', color: 'white',
            border: 'none', borderRadius: '10px', fontWeight: 'bold',
            cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem',
          }}
        >
          + Tambah Layanan
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#dcfce7', color: '#166534',
          borderRadius: '10px', marginBottom: '20px', fontWeight: '600',
        }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Tabel */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            Memuat data layanan...
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nama Layanan</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {layananList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                      Belum ada layanan. Klik "+ Tambah Layanan" untuk mulai.
                    </td>
                  </tr>
                ) : (
                  layananList.map((item) => (
                    <tr key={item.id} style={{ opacity: item.aktif ? 1 : 0.5 }}>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.id}</td>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama}</td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                        {item.deskripsi || '-'}
                      </td>
                      <td style={{ color: '#059669', fontWeight: '600' }}>
                        Rp {Number(item.harga).toLocaleString('id-ID')}
                      </td>
                      <td>{item.deadline_hari} hari</td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                          backgroundColor: item.aktif ? '#d1fae5' : '#f3f4f6',
                          color: item.aktif ? '#065f46' : '#6b7280',
                        }}>
                          {item.aktif ? '✅ Aktif' : '⏸ Nonaktif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => openEdit(item)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #2563eb', color: '#2563eb', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.8rem' }}
                          >✏️</button>
                          <button
                            onClick={() => handleToggleAktif(item)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.8rem', color: '#64748b' }}
                            title={item.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                          >{item.aktif ? '⏸' : '▶️'}</button>
                          <button
                            onClick={() => handleHapus(item.id, item.nama)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem' }}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '20px',
            width: '100%', maxWidth: '480px',
          }}>
            <h2 style={{ marginBottom: '24px', color: '#1e293b' }}>
              {isEdit ? '✏️ Edit Layanan' : '➕ Tambah Layanan Baru'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nama Layanan *</label>
                <input
                  style={inputStyle} placeholder="contoh: Permak Jaket"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Harga (Rp) *</label>
                  <input
                    style={inputStyle} type="number" min="0" placeholder="50000"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Deadline (hari) *</label>
                  <input
                    style={inputStyle} type="number" min="1" placeholder="3"
                    value={formData.deadline_hari}
                    onChange={(e) => setFormData({ ...formData, deadline_hari: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Deskripsi</label>
                <textarea
                  style={{ ...inputStyle, height: '70px', resize: 'vertical' }}
                  placeholder="Keterangan singkat layanan (opsional)"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>

              {isEdit && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox" id="aktif" checked={formData.aktif === 1}
                    onChange={(e) => setFormData({ ...formData, aktif: e.target.checked ? 1 : 0 })}
                  />
                  <label htmlFor="aktif" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Layanan aktif (tampil di form order)
                  </label>
                </div>
              )}
            </div>

            <div style={{ marginTop: '28px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setModalOpen(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', fontFamily: 'inherit' }}
              >Batal</button>
              <button
                onClick={handleSave} disabled={saving}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                  backgroundColor: saving ? '#93c5fd' : '#2563eb',
                  color: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Layanan')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}