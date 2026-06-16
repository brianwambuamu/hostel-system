// frontend/src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLoginSuccess }) {
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // In production, this returns a signed JWT token string
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        regNumber: regNumber.toUpperCase(), 
        password 
      });
      
      // Pass the user profile meta payload upward to App state controller
      onLoginSuccess(res.data.user); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid institutional security credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 8px 0', color: '#0d47a1' }}>National Polytechnic</h2>
      <p style={{ textAlign: 'center', margin: '0 0 24px 0', color: '#666', fontSize: '14px' }}>Hostel Allocation Verification System</p>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
          <strong>Authentication Failure:</strong> {error}
        </div>
      )}

      <form onSubmit={handleLoginSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Registration / Staff Number</label>
          <input 
            type="text" 
            placeholder="e.g. POLY/2026/0892" 
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            required 
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Password Access Pin</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
            required 
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0d47a1', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '6px', fontSize: '16px', cursor: 'pointer' }}>
          Authenticate Session
        </button>
      </form>
    </div>
  );
}