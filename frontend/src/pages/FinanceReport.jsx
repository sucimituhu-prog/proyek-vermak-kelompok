import React from 'react';
import { useOrders } from '../context/OrderContext';
// 1. Import komponen dari Recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FinanceReport = () => {
  const { orders, getTotalIncome, getOrderCount } = useOrders();

  // Logika Statistik Utama
  const totalPendapatan = getTotalIncome();
  const jumlahPesanan = getOrderCount();
  const rataRata = jumlahPesanan ? totalPendapatan / jumlahPesanan : 0;
  const selesaiCount = orders.filter(o => o.status === 'selesai' || o.status === 'Selesai').length;

  // 2. LOGIKA GRAFIK: Mengelompokkan jumlah order berdasarkan jenis layanan
  const dataGrafik = orders.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.layanan);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.layanan, value: 1 });
    }
    return acc;
  }, []);

  const summaryCards = [
    { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Jumlah Pesanan', value: `${jumlahPesanan} Pesanan`, color: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Rata-rata per Order', value: `Rp ${Math.round(rataRata).toLocaleString('id-ID')}`, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Pesanan Selesai', value: `${selesaiCount} Selesai`, color: '#059669', bg: '#ecfdf5' },
  ];

  const COLORS = ['#2563eb', '#0ea5e9', '#f59e0b', '#059669'];

  return (
    <div className="report-page" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 'bold' }}>Ringkasan Keuangan Studio Vermak</h2>
        <p style={{ color: '#64748b' }}>Pantau pendapatan dan performa bisnis secara real-time.</p>
      </header>

      {/* Kartu Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {summaryCards.map((item, idx) => (
          <div key={idx} style={{ padding: '20px', backgroundColor: item.bg, borderRadius: '16px', border: `1px solid ${item.color}20` }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '500' }}>{item.label}</p>
            <h3 style={{ fontSize: '1.5rem', color: item.color, fontWeight: 'bold', margin: 0 }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Tabel Rincian */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <h4 style={{ margin: 0, color: '#1e293b' }}>Daftar Transaksi Terbaru</h4>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '15px', color: '#64748b', fontSize: '0.8rem' }}>ID</th>
                  <th style={{ padding: '15px', color: '#64748b', fontSize: '0.8rem' }}>PELANGGAN</th>
                  <th style={{ padding: '15px', color: '#64748b', fontSize: '0.8rem' }}>LAYANAN</th>
                  <th style={{ padding: '15px', color: '#64748b', fontSize: '0.8rem' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Belum ada data transaksi.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', color: '#94a3b8' }}>#{order.id}</td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{order.nama_pelanggan || order.namaPelanggan}</td>
                      <td style={{ padding: '15px' }}>{order.layanan}</td>
                      <td style={{ padding: '15px', color: '#059669', fontWeight: '600' }}>
                        Rp {(Number(order.total_harga || order.totalHarga) || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. GRAFIK AKTIF (Menggantikan Placeholder) */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h4 style={{ color: '#1e293b', marginBottom: '20px' }}>Distribusi Layanan</h4>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dataGrafik}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {dataGrafik.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '15px', textAlign: 'center' }}>
            Data berdasarkan total frekuensi pesanan per layanan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceReport;