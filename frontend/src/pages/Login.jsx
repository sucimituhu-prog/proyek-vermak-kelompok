import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✂️</div>
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '1.6rem', fontWeight: '800' }}>
            Al-Ziran Vermak
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '0.9rem' }}>
            Masuk ke panel admin
          </p>
        </div>

        {/* Form */}
        <div style={{
          backgroundColor: 'white', borderRadius: '20px', padding: '32px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
        }}>
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '6px', color: '#374151' }}>
                Username
              </label>
              <input
                type="text" required autoFocus
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '6px', color: '#374151' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#94a3b8' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '12px', backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white', border: 'none', borderRadius: '10px',
              fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', fontFamily: 'inherit', marginTop: '4px',
            }}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '20px' }}>
          Halaman publik cek pesanan:{' '}
          <a href="/cek-pesanan" style={{ color: '#2563eb' }}>/cek-pesanan</a>
        </p>
      </div>
    </div>
  );
}