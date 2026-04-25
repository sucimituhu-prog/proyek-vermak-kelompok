import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'vermak-customers';
const serviceOptions = ['Potong Celana', 'Ganti Resleting', 'Permak Jas'];

const defaultCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08123456789',
    service: 'Potong Celana',
    bodyMeasurements: { height: 170, weight: 70, chest: 90, waist: 80, hips: 95 }
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '08198765432',
    service: 'Ganti Resleting',
    bodyMeasurements: { height: 165, weight: 60, chest: 85, waist: 75, hips: 90 }
  }
];

const normalizeCustomer = (customer) => ({
  ...customer,
  service: customer.service || '',
  bodyMeasurements: {
    height: customer.bodyMeasurements?.height ?? '',
    weight: customer.bodyMeasurements?.weight ?? '',
    chest:  customer.bodyMeasurements?.chest  ?? '',
    waist:  customer.bodyMeasurements?.waist  ?? '',
    hips:   customer.bodyMeasurements?.hips   ?? ''
  }
});

export default function CustomerList() {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultCustomers;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeCustomer) : defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [measurements, setMeasurements] = useState({ height: '', weight: '', chest: '', waist: '', hips: '' });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '', email: '', phone: '', service: serviceOptions[0],
    bodyMeasurements: { height: '', weight: '', chest: '', waist: '', hips: '' }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setMeasurements(customer.bodyMeasurements);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setCustomers(customers.map(cust =>
      cust.id === selectedCustomer.id ? { ...cust, bodyMeasurements: measurements } : cust
    ));
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setCustomers(current => current.filter(cust => cust.id !== id));
    }
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      setCustomers(current => [...current, { id: nextId, ...newCustomer }]);
      setNewCustomer({ name: '', email: '', phone: '', service: serviceOptions[0], bodyMeasurements: { height: '', weight: '', chest: '', waist: '', hips: '' } });
      setIsAddModalOpen(false);
    }
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (['height','weight','chest','waist','hips'].includes(name)) {
      setNewCustomer(prev => ({ ...prev, bodyMeasurements: { ...prev.bodyMeasurements, [name]: value } }));
    } else {
      setNewCustomer(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="page">
      <header className="page-header" style={{ gridTemplateColumns: '1fr' }}>
        <div className="page-header__body">
          <p className="page-header__eyebrow">Manajemen Pelanggan</p>
          <h2 className="page-header__title">Data Pelanggan</h2>
          <p className="page-header__subtitle">Kelola data pelanggan, ukuran badan, dan histori layanan dengan mudah.</p>
        </div>
      </header>

      <section style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Cari pelanggan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: 260 }}
        />
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn--success">
          + Tambah Pelanggan
        </button>
      </section>

      <section className="customer-grid">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card__bar" />
            <div className="customer-card__header">
              <h3 className="customer-card__name">{customer.name}</h3>
              <div className="customer-card__actions">
                <button onClick={() => handleEdit(customer)} className="btn btn--secondary" style={{ minHeight: 32, padding: '0 14px', fontSize: 13 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(customer.id)} className="btn btn--danger" style={{ minHeight: 32, padding: '0 14px', fontSize: 13 }}>
                  Hapus
                </button>
              </div>
            </div>

            <p className="customer-card__info"><strong>📧 Email:</strong> {customer.email}</p>
            <p className="customer-card__info"><strong>📱 Telepon:</strong> {customer.phone}</p>
            <p className="customer-card__info"><strong>🧵 Layanan:</strong> {customer.service || '-'}</p>

            <div>
              <h4 style={{ margin: '12px 0 8px', fontSize: 14, fontWeight: 800, color: 'var(--slate-700)' }}>Ukuran Badan</h4>
              <ul className="measurement-tags">
                <li>Tinggi: {customer.bodyMeasurements.height} cm</li>
                <li>Berat: {customer.bodyMeasurements.weight} kg</li>
                <li>Dada: {customer.bodyMeasurements.chest} cm</li>
                <li>Pinggang: {customer.bodyMeasurements.waist} cm</li>
                <li style={{ gridColumn: 'span 2' }}>Pinggul: {customer.bodyMeasurements.hips} cm</li>
              </ul>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal">
            <h2 className="modal__title">Edit Ukuran Badan — {selectedCustomer?.name}</h2>
            {['height','weight','chest','waist','hips'].map((field, index) => (
              <div className="form-group" key={field} style={{ marginBottom: 12 }}>
                <label className="form-label">
                  {['Tinggi (cm)', 'Berat (kg)', 'Dada (cm)', 'Pinggang (cm)', 'Pinggul (cm)'][index]}
                </label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleMeasurementChange}
                  className="form-input"
                />
              </div>
            ))}
            <div className="modal__actions">
              <button onClick={handleSave} className="btn btn--success">Simpan</button>
              <button onClick={() => setIsModalOpen(false)} className="btn btn--secondary">Batal</button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setIsAddModalOpen(false); }}>
          <div className="modal" style={{ maxWidth: 520 }}>
            <h2 className="modal__title">Tambah Pelanggan Baru</h2>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Nama Lengkap</label>
              <input type="text" name="name" value={newCustomer.name} onChange={handleNewCustomerChange} placeholder="Masukkan nama lengkap" className="form-input" />
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Email</label>
              <input type="email" name="email" value={newCustomer.email} onChange={handleNewCustomerChange} placeholder="Masukkan alamat email" className="form-input" />
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Nomor Telepon</label>
              <input type="tel" name="phone" value={newCustomer.phone} onChange={handleNewCustomerChange} placeholder="Masukkan nomor telepon" className="form-input" />
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Layanan</label>
              <select name="service" value={newCustomer.service} onChange={handleNewCustomerChange} className="form-select">
                {serviceOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            <h4 style={{ margin: '16px 0 10px', fontSize: 14, fontWeight: 800, color: 'var(--slate-700)' }}>Ukuran Badan (Opsional)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'height', label: 'Tinggi (cm)', placeholder: '170' },
                { key: 'weight', label: 'Berat (kg)', placeholder: '70' },
                { key: 'chest',  label: 'Dada (cm)',  placeholder: '90' },
                { key: 'waist',  label: 'Pinggang (cm)', placeholder: '80' },
                { key: 'hips',   label: 'Pinggul (cm)',  placeholder: '95' }
              ].map((field, idx) => (
                <div className="form-group" key={field.key} style={{ gridColumn: idx === 4 ? 'span 2' : 'auto' }}>
                  <label className="form-label">{field.label}</label>
                  <input type="number" name={field.key} value={newCustomer.bodyMeasurements[field.key]} onChange={handleNewCustomerChange} placeholder={field.placeholder} className="form-input" />
                </div>
              ))}
            </div>

            <div className="modal__actions">
              <button onClick={handleAddCustomer} className="btn btn--success">Tambah Pelanggan</button>
              <button onClick={() => setIsAddModalOpen(false)} className="btn btn--secondary">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

