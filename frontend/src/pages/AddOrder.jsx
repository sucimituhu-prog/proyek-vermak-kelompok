import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

// Konfigurasi Layanan (Gaya Adit agar mudah diubah)
const LAYANAN_OPTIONS = [
  { nama: "Potong Celana",  harga: 25000,  deadlineHari: 1 },
  { nama: "Ganti Resleting", harga: 20000,  deadlineHari: 1 },
  { nama: "Kecilin Baju",    harga: 35000,  deadlineHari: 2 },
  { nama: "Permak Jas",      harga: 150000, deadlineHari: 5 },
];

const AddOrder = () => {
  const { addOrder } = useOrders();
  
  const [formData, setFormData] = useState({
    namaPelanggan: '',
    nomorHP: '',
    layanan: '', 
    qty: 1,
    catatan: '',
    total_harga: 0,
    deadline: '', 
    status: 'menunggu'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fungsi hitung otomatis saat layanan dipilih
  const handleLayananChange = (e) => {
    const namaLayanan = e.target.value;
    const layananDipilih = LAYANAN_OPTIONS.find(l => l.nama === namaLayanan);

    if (layananDipilih) {
      const hariIni = new Date();
      hariIni.setDate(hariIni.getDate() + layananDipilih.deadlineHari);
      const formatDeadline = hariIni.toISOString().split('T')[0];

      setFormData({
        ...formData,
        layanan: namaLayanan,
        total_harga: layananDipilih.harga * formData.qty,
        deadline: formatDeadline
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // KIRIM KE CONTEXT (DATABASE)
      await addOrder(formData);
      setSuccess(true);
      
      // Reset form ke awal
      setFormData({
        namaPelanggan: '', nomorHP: '', layanan: '',
        qty: 1, catatan: '', total_harga: 0,
        deadline: '', status: 'menunggu'
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Gagal menyimpan ke database!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h2 className="page-header__title" style={{ fontSize: '1.8rem', color: '#1e293b' }}>Tambah Pesanan Vermak</h2>
        <p className="page-header__subtitle" style={{ color: '#64748b' }}>Catat pesanan baru dan hitung estimasi biaya otomatis.</p>
      </header>

      <section className="panel" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        {success && (
          <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            ✅ Pesanan berhasil masuk database!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Nama Pelanggan</label>
              <input className="form-input" required value={formData.namaPelanggan} onChange={(e) => setFormData({...formData, namaPelanggan: e.target.value})} placeholder="Budi Santoso" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Nomor WhatsApp</label>
              <input className="form-input" required value={formData.nomorHP} onChange={(e) => setFormData({...formData, nomorHP: e.target.value})} placeholder="0812xxxx" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Jenis Layanan</label>
              <select className="form-select" required value={formData.layanan} onChange={handleLayananChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="">-- Pilih Layanan --</option>
                {LAYANAN_OPTIONS.map(l => (
                  <option key={l.nama} value={l.nama}>{l.nama} (Rp {l.harga.toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Jumlah (Qty)</label>
              <input className="form-input" type="number" min="1" required value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Catatan</label>
            <textarea className="form-textarea" value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} placeholder="Detail permak (misal: potong 2cm)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '80px' }} />
          </div>

          {/* Info Otomatis */}
          <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#64748b' }}>💰 Total Biaya:</span>
              <strong style={{ color: '#2563eb' }}>Rp {formData.total_harga.toLocaleString('id-ID')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>📅 Estimasi Selesai:</span>
              <strong style={{ color: '#0f172a' }}>{formData.deadline || '-'}</strong>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? "Menyimpan..." : "💾 Simpan Pesanan"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddOrder;