import React, { useState } from 'react';

export default function CustomerList() {
  // State untuk daftar pelanggan
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '08123456789',
      bodyMeasurements: {
        height: 170,
        weight: 70,
        chest: 90,
        waist: 80,
        hips: 95
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '08198765432',
      bodyMeasurements: {
        height: 165,
        weight: 60,
        chest: 85,
        waist: 75,
        hips: 90
      }
    }
  ]);

  // State untuk pencarian
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: ''
  });

  // State untuk modal tambah pelanggan
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    bodyMeasurements: {
      height: '',
      weight: '',
      chest: '',
      waist: '',
      hips: ''
    }
  });

  // Filter pelanggan berdasarkan search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler untuk edit
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setMeasurements(customer.bodyMeasurements);
    setIsModalOpen(true);
  };

  // Handler untuk save
  const handleSave = () => {
    setCustomers(customers.map(cust =>
      cust.id === selectedCustomer.id
        ? { ...cust, bodyMeasurements: measurements }
        : cust
    ));
    setIsModalOpen(false);
  };

  // Handler untuk delete
  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setCustomers(customers.filter(cust => cust.id !== id));
    }
  };

  // Handler untuk change measurements
  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setMeasurements({ ...measurements, [name]: value });
  };

  // Handler untuk tambah pelanggan
  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const newId = Math.max(...customers.map(c => c.id)) + 1;
      setCustomers([...customers, {
        id: newId,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        bodyMeasurements: newCustomer.bodyMeasurements
      }]);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        bodyMeasurements: {
          height: '',
          weight: '',
          chest: '',
          waist: '',
          hips: ''
        }
      });
      setIsAddModalOpen(false);
    }
  };

  // Handler untuk change new customer
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (['height', 'weight', 'chest', 'waist', 'hips'].includes(name)) {
      setNewCustomer({
        ...newCustomer,
        bodyMeasurements: { ...newCustomer.bodyMeasurements, [name]: value }
      });
    } else {
      setNewCustomer({ ...newCustomer, [name]: value });
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#2c3e50',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>Daftar Pelanggan</h1>

      {/* Search Bar dan Tombol Add */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Cari pelanggan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '15px 20px',
            fontSize: '18px',
            border: '2px solid #3498db',
            borderRadius: '50px',
            boxSizing: 'border-box',
            outline: 'none',
            backgroundColor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => e.target.style.borderColor = '#2980b9'}
          onBlur={(e) => e.target.style.borderColor = '#3498db'}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '15px 30px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(39, 174, 96, 0.3)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
        >
           Tambah Pelanggan
        </button>
      </div>

      {/* Grid Pelanggan */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        marginTop: '20px'
      }}>
        {filteredCustomers.map(customer => (
          <div key={customer.id} style={{
            border: 'none',
            borderRadius: '15px',
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
          }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #3498db, #2980b9, #1abc9c)'
            }}></div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: '1.4rem',
                fontWeight: 'bold'
              }}>{customer.name}</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(customer)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '25px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                   Edit
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '25px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(231, 76, 60, 0.3)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                   Hapus
                </button>
              </div>
            </div>
            <div>
              <p style={{
                margin: '10px 0',
                color: '#34495e',
                fontSize: '16px'
              }}><strong style={{ color: '#3498db' }}>📧 Email:</strong> {customer.email}</p>
              <p style={{
                margin: '10px 0',
                color: '#34495e',
                fontSize: '16px'
              }}><strong style={{ color: '#3498db' }}>📱 Telepon:</strong> {customer.phone}</p>
              <div>
                <h4 style={{
                  margin: '15px 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '1.2rem',
                  borderBottom: '2px solid #3498db',
                  paddingBottom: '5px'
                }}> Ukuran Badan:</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px'
                }}>
                  <li style={{
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '14px',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>Tinggi: {customer.bodyMeasurements.height} cm</li>
                  <li style={{
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '14px',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>Berat: {customer.bodyMeasurements.weight} kg</li>
                  <li style={{
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '14px',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>Dada: {customer.bodyMeasurements.chest} cm</li>
                  <li style={{
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '14px',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    textAlign: 'center'
                  }}>Pinggang: {customer.bodyMeasurements.waist} cm</li>
                  <li style={{
                    margin: '5px 0',
                    color: '#7f8c8d',
                    fontSize: '14px',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    gridColumn: 'span 2'
                  }}>Pinggul: {customer.bodyMeasurements.hips} cm</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '450px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}> Edit Ukuran Badan - {selectedCustomer?.name}</h2>
            {['height', 'weight', 'chest', 'waist', 'hips'].map((field, index) => (
              <div key={field} style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#34495e',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {['Tinggi (cm)', 'Berat (kg)', 'Dada (cm)', 'Pinggang (cm)', 'Pinggul (cm)'][index]}:
                </label>
                <input
                  type="number"
                  name={field}
                  value={measurements[field]}
                  onChange={handleMeasurementChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    boxSizing: 'border-box',
                    border: '2px solid #bdc3c7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#bdc3c7'}
                />
              </div>
            ))}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              marginTop: '25px'
            }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(39, 174, 96, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
              >
                 Simpan
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(149, 165, 166, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
              >
                 Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Pelanggan */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <h2 style={{
              color: '#2c3e50',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}> Tambah Pelanggan Baru</h2>

            {/* Informasi Dasar */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                color: '#34495e',
                marginBottom: '15px',
                fontSize: '1.2rem',
                borderBottom: '2px solid #3498db',
                paddingBottom: '5px'
              }}>Informasi Dasar</h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#34495e',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleNewCustomerChange}
                  placeholder="Masukkan nama lengkap"
                  style={{
                    width: '100%',
                    padding: '12px',
                    boxSizing: 'border-box',
                    border: '2px solid #bdc3c7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#bdc3c7'}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#34495e',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.email}
                  onChange={handleNewCustomerChange}
                  placeholder="Masukkan alamat email"
                  style={{
                    width: '100%',
                    padding: '12px',
                    boxSizing: 'border-box',
                    border: '2px solid #bdc3c7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#bdc3c7'}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#34495e',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  Nomor Telepon:
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleNewCustomerChange}
                  placeholder="Masukkan nomor telepon"
                  style={{
                    width: '100%',
                    padding: '12px',
                    boxSizing: 'border-box',
                    border: '2px solid #bdc3c7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3498db'}
                  onBlur={(e) => e.target.style.borderColor = '#bdc3c7'}
                />
              </div>
            </div>

            {/* Ukuran Badan */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                color: '#34495e',
                marginBottom: '15px',
                fontSize: '1.2rem',
                borderBottom: '2px solid #3498db',
                paddingBottom: '5px'
              }}>Ukuran Badan (Opsional)</h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px'
              }}>
                {[
                  { key: 'height', label: 'Tinggi (cm)', placeholder: '170' },
                  { key: 'weight', label: 'Berat (kg)', placeholder: '70' },
                  { key: 'chest', label: 'Dada (cm)', placeholder: '90' },
                  { key: 'waist', label: 'Pinggang (cm)', placeholder: '80' },
                  { key: 'hips', label: 'Pinggul (cm)', placeholder: '95' }
                ].map((field, index) => (
                  <div key={field.key} style={{
                    marginBottom: '10px',
                    gridColumn: index === 4 ? 'span 2' : 'auto'
                  }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '5px',
                      color: '#34495e',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {field.label}:
                    </label>
                    <input
                      type="number"
                      name={field.key}
                      value={newCustomer.bodyMeasurements[field.key]}
                      onChange={handleNewCustomerChange}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '10px',
                        boxSizing: 'border-box',
                        border: '2px solid #bdc3c7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3498db'}
                      onBlur={(e) => e.target.style.borderColor = '#bdc3c7'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
              marginTop: '25px'
            }}>
              <button
                onClick={handleAddCustomer}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(39, 174, 96, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
              >
                 Tambah Pelanggan
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(149, 165, 166, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 768px) {
          .customer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}