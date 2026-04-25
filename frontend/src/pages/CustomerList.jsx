import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';

const CustomerList = () => {
  // 1. Ambil fungsi CRUD dari context
  const { orders, deleteOrder, updateOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  // Logika Edit (Prompt Sederhana agar Cepat & Fungsional)
  const handleEdit = (customer) => {
    const newName = prompt("Ubah Nama Pelanggan:", customer.nama_pelanggan);
    const newPhone = prompt("Ubah Nomor WhatsApp:", customer.nomor_hp);
    
    if (newName && newPhone) {
      // Kirim data baru ke backend lewat context
      updateOrder(customer.id, {
        ...customer,
        nama_pelanggan: newName,
        nomor_hp: newPhone
      });
    }
  };

  // Logika Hapus dengan Konfirmasi
  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pelanggan ini?")) {
      deleteOrder(id);
    }
  };

  const filteredCustomers = orders.filter((customer) =>
    customer.nama_pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nomor_hp.includes(searchTerm)
  );

  return (
    <div className="customers-page" style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#1e293b', fontWeight: 'bold' }}>Database Pelanggan</h1>
        <p style={{ color: '#64748b' }}>Kelola data profil dan riwayat order pelanggan secara real-time.</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <input
          type="text"
          placeholder="Cari nama atau nomor HP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card" style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{customer.nama_pelanggan}</h3>
                <small style={{ color: '#94a3b8' }}>ID Pelanggan: #{customer.id}</small>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '20px' }}>
                <p>📞 <strong>WhatsApp:</strong> {customer.nomor_hp}</p>
                <p>👗 <strong>Layanan Terakhir:</strong> {customer.layanan}</p>
                <p>🗓️ <strong>Tgl Bergabung:</strong> {new Date(customer.created_at).toLocaleDateString('id-ID')}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleEdit(customer)}
                  style={{ 
                    flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #2563eb', 
                    color: '#2563eb', backgroundColor: 'transparent', cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Edit Profil
                </button>
                <button 
                  onClick={() => handleDelete(customer.id)}
                  style={{ 
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', 
                    backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            Data pelanggan tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;