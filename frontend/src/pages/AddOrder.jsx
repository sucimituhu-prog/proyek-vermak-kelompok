import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import axios from 'axios';

const AddOrder = () => {
  const { addOrder, fetchOrders, orders } = useOrders();
  const [layananOptions, setLayananOptions] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(true);
  const [fotoFile, setFotoFile]             = useState(null);
  const [fotoPreview, setFotoPreview]       = useState(null);
  const [isPelangganLama, setIsPelangganLama] = useState(false);
  const [formData, setFormData] = useState({
    namaPelanggan: '', nomorHP: '', layanan: '',
    qty: 1, catatan: '', total_harga: 0, deadline: '', status: 'menunggu',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Deduplikasi pelanggan dari orders yang sudah ada
  const pelangganLama = Object.values(
    orders.reduce((acc, o) => {
      const key = o.nomor_hp || '';
      if (key && !acc[key]) {
        acc[key] = { nama: o.nama_pelanggan, nomor_hp: key };
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    axios.get('https://proyek-vermak-kelompok-production.up.railway.app/api/layanan')
      .then(res => setLayananOptions(res.data))
      .catch(err => console.error("Gagal fetch layanan:", err))
      .finally(() => setLoadingLayanan(false));
  }, []);

  const handlePilihPelangganLama = (e) => {
    const nomorHP = e.target.value;
    const dipilih = pelangganLama.find(p => p.nomor_hp === nomorHP);
    if (dipilih) {
      setFormData({ ...formData, namaPelanggan: dipilih.nama, nomorHP: dipilih.nomor_hp });
    } else {
      setFormData({ ...formData, namaPelanggan: '', nomorHP: '' });
    }
  };

  const handleLayananChange = (e) => {
    const namaLayanan = e.target.value;
    const dipilih = layananOptions.find(l => l.nama === namaLayanan);
    if (dipilih) {
      const tgl = new Date();
      tgl.setDate(tgl.getDate() + dipilih.deadline_hari);
      setFormData({ ...formData, layanan: namaLayanan, total_harga: dipilih.harga * formData.qty, deadline: tgl.toISOString().split('T')[0] });
    } else {
      setFormData({ ...formData, layanan: namaLayanan, total_harga: 0, deadline: '' });
    }
  };

  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    const dipilih = layananOptions.find(l => l.nama === formData.layanan);
    setFormData({ ...formData, qty, total_harga: dipilih ? dipilih.harga * qty : 0 });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('namaPelanggan', formData.namaPelanggan);
      data.append('nomorHP',       formData.nomorHP);
      data.append('layanan',       formData.layanan);
      data.append('qty',           formData.qty);
      data.append('catatan',       formData.catatan);
      if (fotoFile) data.append('foto', fotoFile);

      const res = await axios.post('https://proyek-vermak-kelompok-production.up.railway.app/api/orders', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setOrderId(res.data.orderId);
      setSuccess(true);
      setFormData({ namaPelanggan: '', nomorHP: '', layanan: '', qty: 1, catatan: '', total_harga: 0, deadline: '', status: 'menunggu' });
      setFotoFile(null);
      setFotoPreview(null);
      setIsPelangganLama(false);
      await fetchOrders(); // ← auto-refresh data tanpa perlu reload halaman
      setTimeout(() => { setSuccess(false); setOrderId(null); }, 5000);
    } catch {
      alert("Gagal menyimpan ke database!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px',
    border: '1px solid #cbd5e1', fontFamily: 'inherit',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '6px' };

  return (
    <div className="page" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#1e293b', fontSize: '1.8rem', margin: 0 }}>Tambah Pesanan Vermak</h2>
        <p style={{ color: '#64748b', marginTop: '6px' }}>Catat pesanan baru dan hitung estimasi biaya otomatis.</p>
      </header>

      <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>

        {success && (
          <div style={{ padding: '14px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
            ✅ Pesanan #{orderId} berhasil disimpan! Berikan nomor ini ke pelanggan untuk cek status.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Toggle Pelanggan Lama / Baru */}
          <div style={{ display: 'flex', gap: '0', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {['Pelanggan Baru', 'Pelanggan Lama'].map((label, i) => {
              const active = i === 0 ? !isPelangganLama : isPelangganLama;
              return (
                <button
                  key={label} type="button"
                  onClick={() => {
                    setIsPelangganLama(i === 1);
                    setFormData({ ...formData, namaPelanggan: '', nomorHP: '' });
                  }}
                  style={{
                    flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: '600', fontSize: '0.85rem',
                    backgroundColor: active ? '#2563eb' : 'white',
                    color: active ? 'white' : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  {i === 0 ? '➕ ' : '👤 '}{label}
                </button>
              );
            })}
          </div>

          {/* Dropdown pelanggan lama */}
          {isPelangganLama ? (
            <div>
              <label style={labelStyle}>Pilih Pelanggan</label>
              {pelangganLama.length === 0 ? (
                <div style={{ padding: '12px', backgroundColor: '#fef9c3', borderRadius: '8px', color: '#854d0e', fontSize: '0.85rem' }}>
                  Belum ada data pelanggan tersimpan.
                </div>
              ) : (
                <select
                  style={inputStyle} required
                  value={formData.nomorHP}
                  onChange={handlePilihPelangganLama}
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {pelangganLama.map(p => (
                    <option key={p.nomor_hp} value={p.nomor_hp}>
                      {p.nama} — {p.nomor_hp}
                    </option>
                  ))}
                </select>
              )}
              {/* Tampilkan nama yang terisi otomatis */}
              {formData.namaPelanggan && (
                <div style={{ marginTop: '8px', padding: '10px 14px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#166534', fontSize: '0.85rem' }}>
                  ✅ <strong>{formData.namaPelanggan}</strong> — {formData.nomorHP}
                </div>
              )}
            </div>
          ) : (
            /* Input manual pelanggan baru */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Nama Pelanggan</label>
                <input style={inputStyle} required placeholder="Budi Santoso"
                  value={formData.namaPelanggan}
                  onChange={(e) => setFormData({ ...formData, namaPelanggan: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Nomor WhatsApp</label>
                <input style={inputStyle} required placeholder="0812xxxx"
                  value={formData.nomorHP}
                  onChange={(e) => setFormData({ ...formData, nomorHP: e.target.value })} />
              </div>
            </div>
          )}

          {/* Layanan & Qty */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Jenis Layanan</label>
              <select style={inputStyle} required value={formData.layanan}
                onChange={handleLayananChange} disabled={loadingLayanan}>
                <option value="">{loadingLayanan ? 'Memuat...' : '-- Pilih Layanan --'}</option>
                {layananOptions.map(l => (
                  <option key={l.id} value={l.nama}>
                    {l.nama} — Rp {Number(l.harga).toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Jumlah (Qty)</label>
              <input style={inputStyle} type="number" min="1" required
                value={formData.qty} onChange={handleQtyChange} />
            </div>
          </div>

          {/* Upload Foto */}
          <div>
            <label style={labelStyle}>Foto Pakaian</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              {fotoPreview ? (
                <div>
                  <img src={fotoPreview} alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '10px' }} />
                  <br />
                  <button type="button" onClick={() => { setFotoFile(null); setFotoPreview(null); }}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: 'white', color: '#64748b', fontFamily: 'inherit' }}>
                    🗑️ Hapus Foto
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#94a3b8', margin: '0 0 10px', fontSize: '0.9rem' }}>
                    📷 Upload foto pakaian agar tidak tertukar
                  </p>
                  <label style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Pilih Foto
                    <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
                  </label>
                  <p style={{ color: '#cbd5e1', fontSize: '0.75rem', marginTop: '8px' }}>JPG, PNG, WEBP — maks 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label style={labelStyle}>Catatan</label>
            <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              placeholder="Detail permak (misal: potong 2cm)"
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} />
          </div>

          {/* Info Otomatis */}
          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>💰 Total Biaya:</span>
              <strong style={{ color: '#2563eb' }}>Rp {Number(formData.total_harga).toLocaleString('id-ID')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>📅 Estimasi Selesai:</span>
              <strong style={{ color: '#0f172a' }}>{formData.deadline || '-'}</strong>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '12px', backgroundColor: loading ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem', fontFamily: 'inherit',
          }}>
            {loading ? 'Menyimpan...' : '💾 Simpan Pesanan'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddOrder;