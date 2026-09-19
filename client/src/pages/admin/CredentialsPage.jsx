import React, { useState, useEffect } from 'react';
import { Plus, KeyRound, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import { formatDateTime } from '../../utils/formatters';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'patients', label: 'Patients EMR' },
  { key: 'clinical', label: 'Clinical Vitals' },
  { key: 'admissions', label: 'Daycare Admissions' },
  { key: 'inventory', label: 'Blood Inventory' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'services', label: 'Services CMS' },
  { key: 'blogs', label: 'Health Blogs' },
  { key: 'specialists', label: 'Specialists' },
  { key: 'products', label: 'Packages' },
  { key: 'productInquiries', label: 'Package Inquiries' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'media', label: 'Media Library' },
  { key: 'staff', label: 'Staff HR' },
  { key: 'finance', label: 'Finance' },
  { key: 'settings', label: 'Settings' }
];

export default function CredentialsPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New credential modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    permissions: {}
  });

  // Password Reset Modal
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Permissions Modal
  const [permTarget, setPermTarget] = useState(null);
  const [permMatrix, setPermMatrix] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await apiRequest('/credentials');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiRequest('/credentials', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      addToast('Staff credential created with Argon2 security!', 'success');
      setIsOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'STAFF', permissions: {} });
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to create credential', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEnabled = async (user) => {
    try {
      await apiRequest(`/credentials/${user.id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !user.enabled })
      });
      addToast(`Account ${user.enabled ? 'disabled' : 'enabled'}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const openPermModal = (user) => {
    setPermTarget(user);
    setPermMatrix(user.permissions || {});
  };

  const handleSavePermissions = async () => {
    if (!permTarget) return;
    try {
      await apiRequest(`/credentials/${permTarget.id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions: permMatrix })
      });
      addToast('Module permissions updated successfully', 'success');
      setPermTarget(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to update permissions', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest(`/credentials/${resetTarget.id}/reset-password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword })
      });
      addToast('Password updated with Argon2id hash!', 'success');
      setResetTarget(null);
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Staff Credentials & Access Control (RBAC)"
        subtitle="Role-Based Permissions, Argon2 Hashing & Security Management"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            <span>Create Staff Credential</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{u.email}</small>
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'SUPERADMIN' ? 'badge-red' : u.role === 'ADMIN' ? 'badge-blue' : 'badge-green'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.enabled ? 'badge-green' : 'badge-red'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>{u.lastLogin ? formatDateTime(u.lastLogin) : 'Never'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openPermModal(u)}
                        title="Manage Module Permissions"
                      >
                        <Shield size={13} />
                        <span>Permissions</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setResetTarget(u)}
                        title="Reset Password"
                      >
                        <KeyRound size={13} />
                      </button>
                      {u.role !== 'SUPERADMIN' && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: u.enabled ? '#d32f2f' : 'var(--green)' }}
                          onClick={() => handleToggleEnabled(u)}
                          title={u.enabled ? 'Disable Account' : 'Enable Account'}
                        >
                          {u.enabled ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CREATE CREDENTIAL MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Create New Staff Credential"
        >
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Password * (Argon2 Hashed)</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">System Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STAFF">STAFF (Assigned Permissions)</option>
                <option value="ADMIN">ADMIN (Full Clinical & Operational)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Credential'}
              </button>
            </div>
          </form>
        </Modal>

        {/* PERMISSIONS MATRIX MODAL */}
        <Modal
          isOpen={!!permTarget}
          onClose={() => setPermTarget(null)}
          title={`Permissions Matrix: ${permTarget?.name}`}
          size="lg"
        >
          <div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
              Enable or disable specific modules for this user account. Superadmin accounts always have bypass access.
            </p>

            <div className="grid-3" style={{ gap: 14 }}>
              {MODULES.map((m) => (
                <label
                  key={m.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 10,
                    background: 'var(--canvas)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: '1px solid var(--line)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!permMatrix[m.key]}
                    onChange={(e) => setPermMatrix({ ...permMatrix, [m.key]: e.target.checked })}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setPermTarget(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSavePermissions}>
                Save Permissions
              </button>
            </div>
          </div>
        </Modal>

        {/* RESET PASSWORD MODAL */}
        <Modal
          isOpen={!!resetTarget}
          onClose={() => setResetTarget(null)}
          title={`Reset Password: ${resetTarget?.email}`}
        >
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password (at least 6 chars)</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setResetTarget(null)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Set New Password (Argon2)'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
