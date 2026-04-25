import { useOrders } from '../context/OrderContext';

export default function FinanceReport() {
  const { orders } = useOrders();

  const totalPendapatan = orders.reduce((sum, o) => sum + (o.totalHarga || 0), 0);
  const jumlahPesanan = orders.length;
  const rataRata = jumlahPesanan ? totalPendapatan / jumlahPesanan : 0;
  const selesaiCount = orders.filter(o => o.status === 'selesai').length;

  const summaryCards = [
    { label: 'Total Pendapatan', value: `Rp ${totalPendapatan.toLocaleString('id-ID')}`, accent: 'var(--success-500)' },
    { label: 'Jumlah Pesanan', value: jumlahPesanan, accent: 'var(--primary-500)' },
    { label: 'Rata-rata per Order', value: `Rp ${Math.round(rataRata).toLocaleString('id-ID')}`, accent: 'var(--warning-500)' },
    { label: 'Pesanan Selesai', value: selesaiCount, accent: '#0f766e' },
  ];

  return (
    <div className="page">
      <header className="page-header" style={{ gridTemplateColumns: '1fr' }}>
        <div className="page-header__body">
          <p className="page-header__eyebrow">Laporan Keuangan</p>
          <h2 className="page-header__title">Ringkasan Keuangan</h2>
          <p className="page-header__subtitle">Pantau pendapatan, jumlah pesanan, dan performa bisnis vermak secara real-time.</p>
        </div>
      </header>

      <section className="finance-summary">
        {summaryCards.map((item, idx) => (
          <div key={idx} className="card card--accent-left" style={{ '--card-accent': item.accent }}>
            <span className="card__label">{item.label}</span>
            <h3 className="card__value">{item.value}</h3>
          </div>
        ))}
      </section>

      <section className="panel-grid">
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Transaksi</p>
              <h3 className="panel__title">Daftar Pesanan & Pembayaran</h3>
            </div>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center" style={{ padding: 40, color: 'var(--slate-400)' }}>
                      Belum ada data pesanan.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.namaPelanggan}</td>
                      <td>{order.layanan}</td>
                      <td>Rp {(order.totalHarga || 0).toLocaleString('id-ID')}</td>
                      <td>
                        <span className={`status-pill ${order.status === 'selesai' ? 'is-complete' : 'is-waiting'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.deadline}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__eyebrow">Visualisasi</p>
              <h3 className="panel__title">Grafik Pendapatan</h3>
            </div>
          </div>
          <div className="finance-chart-placeholder">
            📊 Grafik akan tersedia di update berikutnya
          </div>
        </div>
      </section>
    </div>
  );
}

