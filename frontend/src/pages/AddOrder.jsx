import { useState } from "react";
import axios from "axios";


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
      const res = await axios.post("/api/orders", payload);
      setPesan(`Pesanan berhasil disimpan! ID: ${res.data.orderId}`);
      setForm({ namaPelanggan: "", nomorHP: "", layanan: "", qty: "", catatan: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan pesanan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.cardHeader}>
          <h2 style={s.title}>🧵 Tambah Pesanan Vermak</h2>
          <p style={s.subtitle}>Isi form di bawah untuk mencatat pesanan baru</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>

          <Field label="Nama Pelanggan">
            <input style={s.input} name="namaPelanggan" value={form.namaPelanggan}
              onChange={handleChange} placeholder="Contoh: Budi Santoso" />
          </Field>

          <Field label="Nomor HP">
            <input style={s.input} name="nomorHP" value={form.nomorHP}
              onChange={handleChange} placeholder="Contoh: 08123456789" />
          </Field>

          <Field label="Jenis Layanan">
            <select style={s.input} name="layanan" value={form.layanan} onChange={handleChange}>
              <option value="">-- Pilih Layanan --</option>
              {LAYANAN.map((l) => (
                <option key={l.nama} value={l.nama}>
                  {l.nama} — Rp {l.harga.toLocaleString("id-ID")} / item
                </option>
              ))}
            </select>
          </Field>

          <Field label="Jumlah Item">
            <input style={s.input} name="qty" type="number" min="1"
              value={form.qty} onChange={handleChange} placeholder="Contoh: 2" />
          </Field>

          <Field label="Catatan (opsional)">
            <textarea style={{ ...s.input, height: 72, resize: "vertical" }}
              name="catatan" value={form.catatan} onChange={handleChange}
              placeholder="Contoh: celana panjang, potong 3 cm" />
          </Field>

          {form.layanan && form.qty && (
            <div style={s.infoBox}>
              <div style={s.infoRow}>
                <span>💰 Total Harga</span>
                <strong>Rp {total.toLocaleString("id-ID")}</strong>
              </div>
              <div style={s.infoRow}>
                <span>📅 Estimasi Selesai</span>
                <strong>{deadline}</strong>
              </div>
              <div style={s.infoRow}>
                <span>⏱ Pengerjaan</span>
                <strong>{layananDipilih.deadlineHari} hari kerja</strong>
              </div>
            </div>
          )}

          {pesan && <div style={s.sukses}>✅ {pesan}</div>}
          {error && <div style={s.errorBox}>⚠️ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Menyimpan..." : "💾 Simpan Pesanan"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#4a5568" }}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
  },
  cardHeader: {
    background: "linear-gradient(90deg, #3498db, #2980b9)",
    padding: "24px 28px",
  },
  title:    { margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" },
  subtitle: { margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)" },
  form: {
    display: "flex", flexDirection: "column", gap: 16, padding: "24px 28px",
  },
  input: {
    padding: "10px 12px", borderRadius: 8, border: "1.5px solid #cbd5e0",
    fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
    fontFamily: "inherit", color: "#2d3748",
  },
  infoBox: {
    background: "#ebf8ff", border: "1.5px solid #bee3f8", borderRadius: 10,
    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
  },
  infoRow: {
    display: "flex", justifyContent: "space-between", fontSize: 14, color: "#2b6cb0",
  },
  btn: {
    background: "linear-gradient(90deg, #3498db, #2980b9)", color: "#fff",
    border: "none", borderRadius: 8, padding: "12px", fontSize: 15,
    fontWeight: 600, cursor: "pointer", marginTop: 4, fontFamily: "inherit",
  },
  sukses:   { background: "#c6f6d5", color: "#276749", borderRadius: 8, padding: "10px 14px", fontSize: 14 },
  errorBox: { background: "#fed7d7", color: "#9b2c2c", borderRadius: 8, padding: "10px 14px", fontSize: 14 },
};