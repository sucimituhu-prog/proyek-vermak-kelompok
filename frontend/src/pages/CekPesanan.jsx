import React, { useState } from 'react';
import axios from 'axios';

const STATUS_CONFIG = {
  menunggu: { label: 'Menunggu', icon: '⏳', color: '#92400e', bg: '#fef3c7', step: 1 },
  diproses: { label: 'Diproses',   icon: '🔧', color: '#1e40af', bg: '#dbeafe', step: 2 },
  selesai:  { label: 'Selesai',             icon: '✅', color: '#065f46', bg: '#d1fae5', step: 3 },
  diambil:  { label: 'Diambil',       icon: '📦', color: '#4b5563', bg: '#f3f4f6', step: 4 },
};

const formatTanggal = (raw) => {
  if (!raw) return '-';
  return new Date(raw).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

export default function CekPesanan() {
  const [nomorOrder, setNomorOrder] = useState('');
  const [pesanan, setPesanan]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleCek = async (e) => {
    e.preventDefault();
    if (!nomorOrder) return;
    setLoading(true);
    setError('');
    setPesanan(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/cek/${nomorOrder}`);
      setPesanan(res.data);
    } catch (err) {
      setError(err.response?.status === 404
        ? 'Nomor order tidak ditemukan. Periksa kembali nomor yang kamu masukkan.'
        : 'Terjadi kesalahan. Coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  const statusKey = pesanan ? (pesanan.status || 'menunggu').toLowerCase() : null;
  const cfg       = statusKey ? STATUS_CONFIG[statusKey] : null;
  const steps     = ['menunggu', 'diproses', 'selesai', 'diambil'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e293b', fontSize: '2rem', margin: 0 }}>✂️ Al-Ziran Vermak</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Cek status dan tagihan pesanan kamu di sini</p>
      </div>

      {/* Form Cek */}
      <div style={{ maxWidth: '480px', margin: '0 auto 32px' }}>
        <form onSubmit={handleCek} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number" min="1" placeholder="Masukkan nomor order..."
            value={nomorOrder}
            onChange={(e) => setNomorOrder(e.target.value)}
            style={{
              flex: 1, padding: '14px 16px', borderRadius: '12px',
              border: '2px solid #e2e8f0', fontSize: '1rem',
              fontFamily: 'inherit', outline: 'none',
            }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '14px 24px', backgroundColor: '#2563eb', color: 'white',
            border: 'none', borderRadius: '12px', fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            {loading ? '...' : 'Cek'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '10px', fontSize: '0.9rem' }}>
            ❌ {error}
          </div>
        )}
      </div>

      {/* Hasil */}
      {pesanan && cfg && (
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Status Badge */}
          <div style={{ backgroundColor: cfg.bg, border: `2px solid ${cfg.color}30`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{cfg.icon}</div>
            <p style={{ color: cfg.color, fontWeight: '800', fontSize: '1.2rem', margin: 0 }}>{cfg.label}</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0' }}>Pesanan #{pesanan.id}</p>
          </div>

          {/* Progress Bar */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Progress Pesanan
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              {steps.map((s, i) => {
                const scfg    = STATUS_CONFIG[s];
                const isDone  = scfg.step <= cfg.step;
                const isActive = s === statusKey;
                return (
                  <React.Fragment key={s}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        backgroundColor: isDone ? '#2563eb' : '#e2e8f0',
                        color: isDone ? 'white' : '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 'bold',
                        border: isActive ? '3px solid #1d4ed8' : 'none',
                        boxShadow: isActive ? '0 0 0 4px #dbeafe' : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {isDone ? '✓' : i + 1}
                      </div>
                      <p style={{ fontSize: '0.65rem', color: isDone ? '#2563eb' : '#94a3b8', margin: '6px 0 0', textAlign: 'center', fontWeight: isDone ? '700' : '400' }}>
                        {scfg.label.split(' ')[0]}
                      </p>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{ height: '3px', flex: 1, backgroundColor: scfg.step < cfg.step ? '#2563eb' : '#e2e8f0', marginBottom: '20px' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Foto Pakaian */}
          {pesanan.foto && (
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Foto Pakaian
              </p>
              <img
                src={`http://localhost:5000${pesanan.foto}`}
                alt="Foto pakaian"
                style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', maxHeight: '250px' }}
              />
            </div>
          )}

          {/* Bill / Nota */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🧾 Rincian Tagihan
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Nama',          value: pesanan.nama_pelanggan },
                { label: 'Tanggal Masuk', value: formatTanggal(pesanan.created_at) },
                { label: 'Estimasi Selesai', value: formatTanggal(pesanan.deadline) },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{item.label}</span>
                  <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>{item.value}</span>
                </div>
              ))}

              <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '6px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Layanan</span>
                <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>{pesanan.layanan}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Jumlah</span>
                <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>{pesanan.qty} item</span>
              </div>

              <hr style={{ border: 'none', borderTop: '2px solid #e2e8f0', margin: '6px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1rem' }}>Total</span>
                <span style={{ color: '#2563eb', fontWeight: '800', fontSize: '1.3rem' }}>
                  Rp {Number(pesanan.total_harga).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px' }}>
            Ada pertanyaan? Hubungi kami via WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
}