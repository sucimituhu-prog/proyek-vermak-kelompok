import React, { useState, useEffect } from 'react';
import { useOrders } from '../context/OrderContext';
import axios from 'axios';

const AddOrder = () => {
  const { addOrder } = useOrders();

  const [layananOptions, setLayananOptions] = useState([]);
  const [loadingLayanan, setLoadingLayanan] = useState(true);

  const [formData, setFormData] = useState({
    namaPelanggan: '',
    nomorHP: '',
    layanan: '',
    qty: 1,
    catatan: '',
    total_harga: 0,
    deadline: '',
    status: 'menunggu',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch daftar layanan dari API saat halaman dibuka
  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/layanan');
        setLayananOptions(res.data);
      } catch (err) {
        console.error("Gagal fetch layanan:", err);
      } finally {
        setLoadingLayanan(false);
      }
    };
    fetchLayanan();
  }, []);

  const handleLayananChange = (e) => {
    const namaLayanan = e.target.value;
    const dipilih = layananOptions.find(l => l.nama === namaLayanan);

    if (dipilih) {
      const tgl = new Date();
      tgl.setDate(tgl.getDate() + dipilih.deadline_hari);
      setFormData({
        ...formData,
        layanan: namaLayanan,
        total_harga: dipilih.harga * formData.qty,
        deadline: tgl.toISOString().split('T')[0],
      });
    } else {
      setFormData({ ...formData, layanan: namaLayanan, total_harga: 0, deadline: '' });
    }
  };

  const handleQtyChange = (e) => {
    const qty = parseInt(e.target.value) || 1;
    const dipilih = layananOptions.find(l => l.nama === formData.layanan);
    setFormData({
      ...formData,
      qty,
      total_harga: dipilih ? dipilih.harga * qty : 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOrder(formData);
      setSuccess(true);
      setFormData({
        namaPelanggan: '', nomorHP: '', layanan: '',
        qty: 1, catatan: '', total_harga: 0,
        deadline: '', status: 'menunggu',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Gagal menyimpan ke database!");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '8px',
    border: '1px solid #cbd5e1', fontFamily: 'inherit', fontSize: '0.9rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '6px' };

  return (
    <div className="page" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 className="page-header__title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>
          Tambah Pesanan Vermak
        </h2>
        <p className="page-header__subtitle" style={{ color: '#64748b' }}>
          Catat pesanan baru dan hitung estimasi biaya otomatis.
        </p>
      </header>

      <section style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '20px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      }}>
        {success && (
          <div style={{
            padding: '12px', backgroundColor: '#dcfce7', color: '#166534',
            borderRadius: '8px', marginBottom: '20px', textAlign: 'center',
          }}>
            ✅ Pesanan berhasil masuk database!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Nama Pelanggan</label>
              <input
                style={inputStyle} required placeholder="Budi Santoso"
                value={formData.namaPelanggan}
                onChange={(e) => setFormData({ ...formData, namaPelanggan: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Nomor WhatsApp</label>
              <input
                style={inputStyle} required placeholder="0812xxxx"
                value={formData.nomorHP}
                onChange={(e) => setFormData({ ...formData, nomorHP: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Jenis Layanan</label>
              <select
                style={inputStyle} required
                value={formData.layanan}
                onChange={handleLayananChange}
                disabled={loadingLayanan}
              >
                <option value="">
                  {loadingLayanan ? 'Memuat layanan...' : '-- Pilih Layanan --'}
                </option>
                {layananOptions.map((l) => (
                  <option key={l.id} value={l.nama}>
                    {l.nama} — Rp {Number(l.harga).toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Jumlah (Qty)</label>
              <input
                style={inputStyle} type="number" min="1" required
                value={formData.qty}
                onChange={handleQtyChange}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Catatan</label>
            <textarea
              style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
              placeholder="Detail permak (misal: potong 2cm)"
              value={formData.catatan}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
            />
          </div>

          {/* Info Otomatis */}
          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>💰 Total Biaya:</span>
              <strong style={{ color: '#2563eb' }}>
                Rp {Number(formData.total_harga).toLocaleString('id-ID')}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>📅 Estimasi Selesai:</span>
              <strong style={{ color: '#0f172a' }}>{formData.deadline || '-'}</strong>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              padding: '12px', backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '8px',
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Menyimpan...' : '💾 Simpan Pesanan'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddOrder;