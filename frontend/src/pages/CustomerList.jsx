import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

const CustomerList = () => {
  const { orders, deleteOrder, updateOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  // STATE UNTUK MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editData, setEditData] = useState({
    nama_pelanggan: '',
    nomor_hp: '',
    catatan: '' // Ganti ukuran badan jadi catatan
  });

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setEditData({
      nama_pelanggan: customer.nama_pelanggan || '',
      nomor_hp: customer.nomor_hp || '',
      catatan: customer.catatan || '' // Ambil data catatan dari DB
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateOrder(selectedCustomer.id, editData);
      setIsModalOpen(false);
    } catch (err) {
      alert("Gagal update data");
    }
  };

  const filteredCustomers = orders.filter((customer) =>
    customer.nama_pelanggan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nomor_hp?.includes(searchTerm)
  );

  return (
    <div className="customers-page" style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- MODAL EDIT DENGAN KOLOM CATATAN --- */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Edit Profil</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Nama Pelanggan</label>
                <input type="text" value={editData.nama_pelanggan} onChange={(e) => setEditData({...editData, nama_pelanggan: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>WhatsApp</label>
                <input type="text" value={editData.nomor_hp} onChange={(e) => setEditData({...editData, nomor_hp: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Catatan Khusus</label>
                <textarea 
                  value={editData.catatan} 
                  onChange={(e) => setEditData({...editData, catatan: e.target.value})} 
                  placeholder="Contoh: Pelanggan minta jahitan double, deadline besok sore."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '80px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAMPILAN KARTU --- */}
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#1e293b', fontWeight: 'bold' }}>Database Pelanggan</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCustomers.map((customer) => (
          <div key={customer.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>{customer.nama_pelanggan}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>📞 {customer.nomor_hp}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                  <strong style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '5px' }}>CATATAN:</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                    "{customer.catatan || 'Tidak ada catatan tambahan.'}"
                  </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => openEditModal(customer)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #2563eb', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => deleteOrder(customer.id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;