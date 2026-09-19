import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { setSession } from '../../utils/auth';
import { useToast } from '../../components/common/Toast';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      setSession(res.token, res.user);
      addToast(`Welcome back, ${res.user.name}! Authenticated with Argon2.`, 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
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
      <div className="card" style={{ maxWidth: 460, width: '100%', padding: 40, border: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            className="brand-icon"
            style={{ width: 54, height: 54, margin: '0 auto 16px', borderRadius: 16 }}
          >
            <Activity size={28} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Rithanya Hospital</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 4 }}>
            Clinical ERP & Hospital Administrative Login
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Hospital Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: 40 }}
                placeholder="staff@rithanya.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <span>{loading ? 'Authenticating with Argon2...' : 'Secure Staff Login'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Credentials Helper */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)', fontSize: 12 }}>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 8, fontWeight: 600 }}>Quick Login Credentials:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('mgrhameed@gmail.com', 'Hameed@2026')}
            >
              Superadmin (Hameed)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillQuickLogin('staff@rithanya.in', 'Staff@2026')}
            >
              Staff (Dr. Murthy)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Protected by Argon2id Cryptographic Hashes & Local JWT Sessions
          </span>
        </div>
      </div>
    </div>
  );
}
