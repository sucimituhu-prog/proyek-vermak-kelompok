import { useState } from "react";

const LAYANAN = [
  { nama: "Potong Celana",   harga: 25000,  deadlineHari: 2 },
  { nama: "Ganti Resleting", harga: 20000,  deadlineHari: 1 },
  { nama: "Permak Jas",      harga: 75000,  deadlineHari: 5 },
];

function hitungDeadline(deadlineHari) {
  const now = new Date();
  now.setDate(now.getDate() + deadlineHari);
  return now.toISOString().slice(0, 10);
}

function hitungTotal(namaLayanan, qty) {
  const layanan = LAYANAN.find((l) => l.nama === namaLayanan);
  if (!layanan || !qty) return 0;
  return layanan.harga * parseInt(qty, 10);
}

export default function AddOrder() {
  const [form, setForm] = useState({
    namaPelanggan: "",
    nomorHP: "",
    layanan: "",
    qty: "",
    catatan: "",
  });

  const [loading, setLoading] = useState(false);
  const [pesan,   setPesan]   = useState(null);
  const [error,   setError]   = useState(null);

  const layananDipilih = LAYANAN.find((l) => l.nama === form.layanan);
  const total    = hitungTotal(form.layanan, form.qty);
  const deadline = layananDipilih ? hitungDeadline(layananDipilih.deadlineHari) : null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setPesan(null);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.namaPelanggan || !form.nomorHP || !form.layanan || !form.qty) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (parseInt(form.qty, 10) < 1) {
      setError("Jumlah item minimal 1.");
      return;
    }

    const payload = {
      namaPelanggan: form.namaPelanggan,
      nomorHP:       form.nomorHP,
      layanan:       form.layanan,
      qty:           parseInt(form.qty, 10),
      catatan:       form.catatan,
      totalHarga:    total,
      deadline,
      status:        "menunggu",
    };

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan pesanan.");
      setPesan(`Pesanan berhasil disimpan! ID: ${data.orderId}`);
      setForm({ namaPelanggan: "", nomorHP: "", layanan: "", qty: "", catatan: "" });
    } catch (err) {
      setError(err.message || "Gagal menyimpan pesanan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header" style={{ gridTemplateColumns: '1fr' }}>
        <div className="page-header__body">
          <p className="page-header__eyebrow">Formulir Pesanan</p>
          <h2 className="page-header__title">Tambah Pesanan Vermak</h2>
          <p className="page-header__subtitle">Isi form di bawah untuk mencatat pesanan baru dari pelanggan.</p>
        </div>
      </header>

      <section className="panel" style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div className="form-group">
            <label className="form-label">Nama Pelanggan</label>
            <input className="form-input" name="namaPelanggan" value={form.namaPelanggan}
              onChange={handleChange} placeholder="Contoh: Budi Santoso" />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor HP</label>
            <input className="form-input" name="nomorHP" value={form.nomorHP}
              onChange={handleChange} placeholder="Contoh: 08123456789" />
          </div>

          <div className="form-group">
            <label className="form-label">Jenis Layanan</label>
            <select className="form-select" name="layanan" value={form.layanan} onChange={handleChange}>
              <option value="">-- Pilih Layanan --</option>
              {LAYANAN.map((l) => (
                <option key={l.nama} value={l.nama}>
                  {l.nama} — Rp {l.harga.toLocaleString("id-ID")} / item
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Jumlah Item</label>
            <input className="form-input" name="qty" type="number" min="1"
              value={form.qty} onChange={handleChange} placeholder="Contoh: 2" />
          </div>

          <div className="form-group">
            <label className="form-label">Catatan (opsional)</label>
            <textarea className="form-textarea"
              name="catatan" value={form.catatan} onChange={handleChange}
              placeholder="Contoh: celana panjang, potong 3 cm" />
          </div>

          {form.layanan && form.qty && (
            <div className="card" style={{ '--card-accent': 'var(--primary-500)' }}>
              <div className="card--accent-left" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--slate-700)' }}>
                  <span>💰 Total Harga</span>
                  <strong>Rp {total.toLocaleString("id-ID")}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--slate-700)' }}>
                  <span>📅 Estimasi Selesai</span>
                  <strong>{deadline}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--slate-700)' }}>
                  <span>⏱ Pengerjaan</span>
                  <strong>{layananDipilih.deadlineHari} hari kerja</strong>
                </div>
              </div>
            </div>
          )}

          {pesan && <div className="alert alert--success">✅ {pesan}</div>}
          {error && <div className="alert alert--error">⚠️ {error}</div>}

          <button type="submit" disabled={loading} className="btn btn--primary" style={{ marginTop: 4 }}>
            {loading ? "Menyimpan..." : "💾 Simpan Pesanan"}
          </button>
        </form>
      </section>
    </div>
  );
}

