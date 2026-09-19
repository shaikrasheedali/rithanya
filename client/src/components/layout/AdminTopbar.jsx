import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Eye, Shield, User, Bell, Menu } from 'lucide-react';
import { getStoredUser } from '../../utils/auth';

export default function AdminTopbar({ title, subtitle, actions, onMenuClick }) {
  const user = getStoredUser();
  const outletCtx = useOutletContext();
  const handleToggle = onMenuClick || (outletCtx && outletCtx.toggleSidebar);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        {handleToggle && (
          <button
            type="button"
            className="admin-menu-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2>{title || 'Dashboard'}</h2>
          {subtitle && <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>{subtitle}</p>}
        </div>
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
