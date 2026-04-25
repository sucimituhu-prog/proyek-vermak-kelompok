import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

const AddOrder = () => {
  const { addOrder } = useOrders();
  
  // 1. SESUAIKAN NAMA KEY DENGAN BACKEND ELSA
  const [formData, setFormData] = useState({
    namaPelanggan: '', // Mengikuti req.body.namaPelanggan di backend
    nomorHP: '',       // Mengikuti req.body.nomorHP di backend
    layanan: '', 
    qty: 1,            // Tambahkan default qty karena backend mewajibkan ini
    catatan: '',       // Tambahkan catatan
    total_harga: '',   // Tetap dihitung di frontend untuk tampilan
    deadline: '', 
    status: 'menunggu'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLayananChange = (e) => {
    const layananDipilih = e.target.value;
    let hargaDefault = 0;
    let estimasiHari = 0;

    switch (layananDipilih) {
      case 'Potong Celana':
        hargaDefault = 25000;
        estimasiHari = 1;
        break;
      case 'Ganti Resleting':
        hargaDefault = 20000;
        estimasiHari = 1;
        break;
      case 'Permak Jas':
        hargaDefault = 150000; // Sesuaikan dengan list harga tim
        estimasiHari = 5;
        break;
      case 'Kecilin Baju':
        hargaDefault = 35000;
        estimasiHari = 2;
        break;
      default:
        hargaDefault = 0;
        estimasiHari = 0;
    }

    const hariIni = new Date();
    hariIni.setDate(hariIni.getDate() + estimasiHari);
    const formatDeadline = hariIni.toISOString().split('T')[0];

    setFormData({
      ...formData,
      layanan: layananDipilih,
      total_harga: hargaDefault * formData.qty, // Hitung berdasarkan qty
      deadline: formatDeadline
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 2. KIRIM DATA KE CONTEXT
      await addOrder(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        namaPelanggan: '',
        nomorHP: '',
        layanan: '',
        qty: 1,
        catatan: '',
        total_harga: '',
        deadline: '',
        status: 'menunggu'
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Gagal menyimpan! Periksa koneksi backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order-page" style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>Tambah Pesanan</h2>
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.9rem' }}>Input data pesanan dengan perhitungan deadline otomatis.</p>
        
        {success && (
          <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>
            ✅ Pesanan & Deadline berhasil dicatat!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Nama Pelanggan</label>
              <input type="text" required value={formData.namaPelanggan} onChange={(e) => setFormData({...formData, namaPelanggan: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>WhatsApp</label>
              <input type="text" required value={formData.nomorHP} onChange={(e) => setFormData({...formData, nomorHP: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Jenis Layanan</label>
              <select required value={formData.layanan} onChange={handleLayananChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc' }}>
                <option value="">-- Pilih Layanan --</option>
                <option value="Potong Celana">Potong Celana (1 Hari)</option>
                <option value="Ganti Resleting">Ganti Resleting (1 Hari)</option>
                <option value="Kecilin Baju">Kecilin Baju (2 Hari)</option>
                <option value="Permak Jas">Permak Jas (5 Hari)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Jumlah (Qty)</label>
              <input type="number" min="1" required value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Catatan Tambahan</label>
            <textarea value={formData.catatan} onChange={(e) => setFormData({...formData, catatan: e.target.value})} placeholder="Contoh: Potong 3cm, pakai benang biru" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '80px' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Estimasi Biaya (Rp)</label>
              <input type="number" readOnly value={formData.total_harga} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', fontWeight: '600' }}>Deadline Otomatis</label>
              <input type="date" readOnly value={formData.deadline} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', transition: '0.3s' }}>
            {loading ? 'Memproses ke Database...' : 'Simpan Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;