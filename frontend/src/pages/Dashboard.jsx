import React from 'react';

const Dashboard = () => {
  // Dummy data untuk simulasi (Nanti diganti data dari Backend/Context)
  const stats = [
    { label: 'Pesanan Baru', value: '8', color: '#3b82f6' }, // Biru
    { label: 'Sedang Diproses', value: '5', color: '#f59e0b' }, // Oranye
    { label: 'Selesai Hari Ini', value: '12', color: '#10b981' }, // Hijau
  ];

  const recentOrders = [
    { id: 1, nama: 'Budi', layanan: 'Potong Celana', status: 'Proses' },
    { id: 2, nama: 'Siti', layanan: 'Ganti Resleting', status: 'Selesai' },
    { id: 3, nama: 'Andi', layanan: 'Permak Jas', status: 'Proses' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#1f2937' }}>Ringkasan Operasional</h1>
        <p style={{ color: '#6b7280' }}>Halo, berikut progres vermak hari ini.</p>
      </header>

      {/* Barisan Kartu Statistik */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px' 
      }}>
        {stats.map((item, index) => (
          <div key={index} style={{
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            borderLeft: `6px solid ${item.color}`
          }}>
            <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>{item.label}</span>
            <h2 style={{ fontSize: '32px', margin: '10px 0 0 0', color: '#111827' }}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Tabel Pesanan Terbaru */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Antrean Pesanan Terbaru</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f3f4f6' }}>
              <th style={{ padding: '12px' }}>Nama Pelanggan</th>
              <th style={{ padding: '12px' }}>Jenis Layanan</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px' }}>{order.nama}</td>
                <td style={{ padding: '12px' }}>{order.layanan}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    backgroundColor: order.status === 'Selesai' ? '#dcfce7' : '#fef3c7',
                    color: order.status === 'Selesai' ? '#166534' : '#92400e'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;