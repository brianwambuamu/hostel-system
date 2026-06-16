// frontend/src/App.jsx
import { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import WardenDashboard from './components/WardenDashboard';

export default function App() {
  const [user, setUser] = useState(null); // Managed profile object placeholder

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(authenticatedUser) => setUser(authenticatedUser)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Structural Global Navigation Banner bar control */}
      <nav style={{ backgroundColor: '#0d47a1', color: '#fff', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          🏫 National Polytechnic Portal — Workspace Context: <span style={{ color: '#ffb300' }}>{user.role}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>User: <strong>{user.name}</strong></span>
          <button 
            onClick={handleLogout} 
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', transition: '0.2s' }}
          >
            Terminate Session
          </button>
        </div>
      </nav>

      {/* Role-Based Core Dashboard Routing Controller engine */}
      <main>
        {user.role === 'Warden' && <WardenDashboard wardenId={user._id} />}
        {user.role === 'Student' && <StudentDashboard studentId={user._id} />}
        {user.role === 'Admin' && (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>System Root Administrator Configuration Node</h2>
            <p>Access global cluster overrides, logs, or capacity settings via server configuration scripts.</p>
          </div>
        )}
      </main>
    </div>
  );
}
