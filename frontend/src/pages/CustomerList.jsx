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
    <div className="page">
      
      {/* --- MODAL EDIT DENGAN KOLOM CATATAN --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal__title">Edit Profil Pelanggan</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label">Nama Pelanggan</label>
                <input className="form-input" type="text" value={editData.nama_pelanggan} onChange={(e) => setEditData({...editData, nama_pelanggan: e.target.value})} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <input className="form-input" type="text" value={editData.nomor_hp} onChange={(e) => setEditData({...editData, nomor_hp: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Khusus</label>
                <textarea 
                  className="form-textarea"
                  value={editData.catatan} 
                  onChange={(e) => setEditData({...editData, catatan: e.target.value})} 
                  placeholder="Contoh: Pelanggan minta jahitan double, deadline besok sore."
                />
              </div>
            </div>

            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button className="btn btn--primary" onClick={handleSaveEdit}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAMPILAN KARTU --- */}
      <header className="page-header">
        <div className="page-header__body">
          <p className="page-header__eyebrow">Manajemen Data</p>
          <h1 className="page-header__title">Database Pelanggan</h1>
          <p className="page-header__subtitle">Cari dan kelola informasi pelanggan aktif Anda.</p>
        </div>
        <div className="page-header__highlight">
          <input 
            type="text" 
            className="form-input"
            placeholder="Cari nama atau nomor WhatsApp..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginTop: '10px' }}
          />
        </div>
      </header>

      <div className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card__bar"></div>
            <div className="customer-card__header">
              <h3 className="customer-card__name">{customer.nama_pelanggan}</h3>
              <span className="badge badge--primary">ID: #{customer.id}</span>
            </div>

            <p className="customer-card__info">📞 <strong>{customer.nomor_hp}</strong></p>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                  <strong style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '5px' }}>CATATAN:</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                    "{customer.catatan || 'Tidak ada catatan tambahan.'}"
                  </p>
              </div>
            </div>

            <div className="customer-card__actions">
              <button className="btn btn--secondary w-full" onClick={() => openEditModal(customer)}>Edit</button>
              <button className="btn btn--danger w-full" onClick={() => deleteOrder(customer.id)}>Hapus</button>
            </div>
          </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#64748b' }}>
            <p>Tidak ada data pelanggan yang ditemukan. Pastikan database sudah terisi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;