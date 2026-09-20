import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { setSession } from '../../utils/auth';
import { useToast } from '../../components/common/Toast';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      addToast('Please enter your username/email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: identifier.trim(), password })
      });

      setSession(res.token, res.user);
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #fff3f4 0%, var(--canvas) 90%)',
        padding: 24
      }}
    >
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: 40, border: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="brand-icon"
            style={{ width: 54, height: 54, margin: '0 auto 16px', borderRadius: 16 }}
          >
            <Activity size={28} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Rithanya Hospital</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4 }}>
            Clinical ERP & Administrative Portal Login
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username or Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 40 }}
                placeholder="Enter username or email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: 40 }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Secure Staff Login'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Hospital Intranet · DPDP Act 2023 Digital Healthcare Standards
          </span>
        </div>
      </div>
    </div>
  );
}
