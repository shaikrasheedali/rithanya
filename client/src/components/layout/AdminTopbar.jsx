import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Shield, User, Bell } from 'lucide-react';
import { getStoredUser } from '../../utils/auth';

export default function AdminTopbar({ title, subtitle, actions }) {
  const user = getStoredUser();

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <h2>{title || 'Dashboard'}</h2>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{subtitle}</p>}
      </div>

      <div className="topbar-right">
        {actions}

        <Link to="/" target="_blank" className="btn btn-secondary btn-sm" title="View Public Website">
          <Eye size={14} />
          <span>View Website</span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'var(--canvas)',
            borderRadius: 10,
            border: '1px solid var(--line)',
            fontSize: 13
          }}
        >
          <Shield size={14} style={{ color: 'var(--red-700)' }} />
          <span style={{ fontWeight: 600 }}>{user ? user.role : 'STAFF'}</span>
        </div>
      </div>
    </header>
  );
}
