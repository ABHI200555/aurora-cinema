import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';

const AuthModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      
      onLogin(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{
           width: '100%',
           maxWidth: '430px',
           padding: '2.5rem',
           position: 'relative',
           animation: 'fadeInUp 0.4s ease forwards'
        }}
      >
        <button className="modal-close" onClick={onClose} style={{ top: '15px', right: '15px' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '2rem', color: 'var(--text-primary)' }}>
          {isLogin ? 'Welcome Back' : 'Join Aurora'}
        </h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
             <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <div className="input-group" style={{ position: 'relative' }}>
              <User size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.25rem' }} />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }} />
            </div>
          )}

          <div className="input-group" style={{ position: 'relative' }}>
            <Mail size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.25rem' }} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }} />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.25rem' }} />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1rem' }} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '1rem', 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
              padding: '1.1rem', 
              borderRadius: '12px', 
              border: 'none', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: '1.1rem', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
            }}
            onMouseOver={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(20, 184, 166, 0.6)'; } }}
            onMouseOut={e => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.4)'; } }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
