import React, { useState, useEffect } from 'react';
import {
  Plus,
  KeyRound,
  Shield,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Lock,
  Unlock,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import { formatDateTime } from '../../utils/formatters';
import { getStoredUser, isSuperAdmin } from '../../utils/auth';

const ALL_MODULES = [
  { key: 'dashboard', label: 'Dashboard & KPI Analytics', cat: 'Operations', desc: 'Real-time patient inflow, clinical stats, and daycare census' },
  { key: 'patients', label: 'Patients EMR', cat: 'Clinical', desc: 'Digital medical records, history, and inpatient conversion' },
  { key: 'clinical', label: 'Clinical Vitals & Consults', cat: 'Clinical', desc: 'Blood pressure, SPO2, Hb levels, transfusion charting' },
  { key: 'admissions', label: 'Daycare Admissions', cat: 'Clinical', desc: 'Bed allocation, ward occupancy, and admission tracking' },
  { key: 'inventory', label: 'Blood Bank & Inventory', cat: 'Operations', desc: 'PRBC blood units, consumables, and pharmaceutical stock' },
  { key: 'appointments', label: 'OPD Appointments', cat: 'Operations', desc: 'Outpatient scheduling, token queue, and visit check-ins' },
  { key: 'treatments', label: 'Treatments CMS', cat: 'Content', desc: 'Clinical treatment protocols, procedures, and indications' },
  { key: 'services', label: 'Specialty Services', cat: 'Content', desc: 'Hospital departments and clinical service offerings' },
  { key: 'blogs', label: 'Insights & Health Library', cat: 'Content', desc: 'Patient education articles, preventative guides, and news' },
  { key: 'specialists', label: 'Doctors Directory', cat: 'Content', desc: 'Consultant physician profiles, qualifications, and OPD timings' },
  { key: 'products', label: 'Healthcare Products', cat: 'E-Commerce', desc: 'Diabetes care products, testing kits, and supplements' },
  { key: 'orders', label: 'Product Orders', cat: 'E-Commerce', desc: 'Fulfillment workflow, order status, and customer delivery info' },
  { key: 'gallery', label: 'Media Gallery', cat: 'Content', desc: 'Hospital facility photos and social media video embeds' },
  { key: 'media', label: 'Media & File Uploads', cat: 'System', desc: 'Uploaded banners, photos, and clinical assets' },
  { key: 'staff', label: 'Staff HR Directory', cat: 'Administration', desc: 'Hospital employee profiles, duty shifts, and contacts' },
  { key: 'credentials', label: 'Credentials & RBAC', cat: 'Administration', desc: 'User login management and fine-grained module access' },
  { key: 'finance', label: 'Finance & Invoices', cat: 'Administration', desc: 'OPD billing, admission charges, and revenue reports' },
  { key: 'erasure', label: 'DPDP Privacy Requests', cat: 'Compliance', desc: 'Data principal right-to-be-forgotten and erasure requests' },
  { key: 'settings', label: 'System & Emergency Settings', cat: 'Administration', desc: 'Emergency contacts, operating hours, and hospital configuration' }
];

export default function CredentialsPage() {
  const { addToast } = useToast();
  const currentUser = getStoredUser();
  const superAdmin = isSuperAdmin(currentUser);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Create credential modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
    allowedModules: ['dashboard', 'patients', 'clinical', 'admissions', 'inventory', 'appointments']
  });

  // Password Reset Modal
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Permissions Modal
  const [permTarget, setPermTarget] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest('/credentials');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to load credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCopyPassword = (userId, password) => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopiedId(userId);
    addToast('Password copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      addToast('Please fill all required fields', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const permissionsObj = (formData.allowedModules || []).reduce((acc, k) => {
        acc[k] = true;
        return acc;
      }, {});

      await apiRequest('/credentials', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          allowedModules: formData.allowedModules,
          permissions: permissionsObj
        })
      });
      addToast(`Credential created successfully for ${formData.name}`, 'success');
      setIsOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'STAFF',
        allowedModules: ['dashboard', 'patients', 'clinical', 'admissions', 'inventory', 'appointments']
      });
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to create credential', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEnabled = async (targetUser) => {
    try {
      await apiRequest(`/credentials/${targetUser.id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !targetUser.enabled })
      });
      addToast(`Account ${targetUser.enabled ? 'disabled' : 'enabled'} successfully`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const openPermModal = (targetUser) => {
    setPermTarget(targetUser);
    let initialModules = [];
    if (Array.isArray(targetUser.allowedModules)) {
      initialModules = [...targetUser.allowedModules];
    } else if (targetUser.permissions) {
      initialModules = Object.keys(targetUser.permissions).filter((k) => targetUser.permissions[k]);
    } else {
      initialModules = ['dashboard'];
    }
    setSelectedModules(initialModules);
  };

  const handleToggleModule = (key) => {
    setSelectedModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    setSelectedModules(ALL_MODULES.map((m) => m.key));
  };

  const handleDeselectAll = () => {
    setSelectedModules([]);
  };

  const handleSavePermissions = async () => {
    if (!permTarget) return;
    setSubmitting(true);
    try {
      const permissionsObj = selectedModules.reduce((acc, k) => {
        acc[k] = true;
        return acc;
      }, {});

      await apiRequest(`/credentials/${permTarget.id}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({
          allowedModules: selectedModules,
          permissions: permissionsObj
        })
      });
      addToast(`Module access updated for ${permTarget.name}`, 'success');
      setPermTarget(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to update module access', 'error');
    } finally {
      setSubmitting(false);
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
      addToast(`Password updated for ${resetTarget.name}`, 'success');
      setResetTarget(null);
      setNewPassword('');
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to reset password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await apiRequest(`/credentials/${deleteTarget.id}`, {
        method: 'DELETE'
      });
      addToast(`Account for ${deleteTarget.name} deleted`, 'success');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to delete account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Staff Credentials & Access Control (RBAC)"
        subtitle="Hierarchical 3-Tier Security, Argon2id & AES Protected Credentials"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            <span>{superAdmin ? 'Create Account' : 'Create Staff Account'}</span>
          </button>
        }
      />

      <div className="admin-content">
        {/* Role Hierarchy Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(223, 56, 80, 0.08) 0%, rgba(30, 41, 59, 0.04) 100%)',
            border: '1px solid rgba(223, 56, 80, 0.2)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Sparkles size={18} style={{ color: 'var(--red-600)' }} />
              <strong style={{ fontSize: 14 }}>Hierarchical Role-Based Access Control Active</strong>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
              You are logged in with Administrator privileges. You can manage staff accounts, configure credentials, and customize module access.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge badge-blue" style={{ padding: '6px 12px' }}>Tier: Administrator</span>
            <span className="badge badge-green" style={{ padding: '6px 12px' }}>Tier: Staff (Granular Access)</span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role Tier</th>
                <th>Password</th>
                <th>Module Access</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30 }}>
                    Loading credentials...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30 }}>
                    No credentials found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isUserSuperAdmin = u.role === 'SUPERADMIN';
                  const isUserAdmin = u.role === 'ADMIN';
                  const isVisible = visiblePasswords[u.id];
                  const passwordText = u.visiblePassword || '••••••••';
                  const modulesCount = Array.isArray(u.allowedModules) ? u.allowedModules.length : 0;

                  return (
                    <tr key={u.id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--ink)' }}>{u.name}</strong>
                        <small style={{ color: 'var(--ink-soft)' }}>{u.email}</small>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            (isUserSuperAdmin || isUserAdmin) ? 'badge-blue' : 'badge-green'
                          }`}
                        >
                          {isUserSuperAdmin ? 'ADMIN' : u.role}
                        </span>
                      </td>
                      <td>
                        {u.visiblePassword ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <code
                              style={{
                                background: 'var(--canvas-warm, #f8f9fa)',
                                padding: '4px 8px',
                                borderRadius: 6,
                                fontSize: 13,
                                letterSpacing: isVisible ? '0.03em' : '0.15em',
                                color: isVisible ? 'var(--red-700)' : 'inherit',
                                fontWeight: isVisible ? 700 : 400
                              }}
                            >
                              {isVisible ? u.visiblePassword : '••••••••'}
                            </code>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px' }}
                              title={isVisible ? 'Hide Password' : 'Show Password'}
                            >
                              {isVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(u.id, u.visiblePassword)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px' }}
                              title="Copy Password"
                            >
                              {copiedId === u.id ? <Check size={13} style={{ color: 'green' }} /> : <Copy size={13} />}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                            <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />
                            Protected
                          </span>
                        )}
                      </td>
                      <td>
                        {isUserSuperAdmin ? (
                          <span className="badge badge-red">Full Access (All Modules)</span>
                        ) : isUserAdmin ? (
                          <span className="badge badge-blue">Admin Access ({modulesCount || 'All'} Modules)</span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="badge badge-green">
                              {modulesCount} Modules Enabled
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${u.enabled ? 'badge-green' : 'badge-red'}`}>
                          {u.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>{u.lastLogin ? formatDateTime(u.lastLogin) : 'Never'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {/* Module Access Config Button: Superadmin can config Admin & Staff; Admin can config Staff */}
                          {(superAdmin || (!isUserSuperAdmin && !isUserAdmin)) && !isUserSuperAdmin && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => openPermModal(u)}
                              title="Configure Module Pages Access"
                            >
                              <Shield size={13} />
                              <span>Access Pages</span>
                            </button>
                          )}

                          {/* Reset Password: Superadmin can reset any; Admin can reset Staff */}
                          {(superAdmin || !isUserAdmin) && !isUserSuperAdmin && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setResetTarget(u)}
                              title="Reset Password"
                            >
                              <KeyRound size={13} />
                              <span>Reset</span>
                            </button>
                          )}

                          {/* Enable/Disable toggle */}
                          {!isUserSuperAdmin && (
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

                          {/* Superadmin delete account */}
                          {superAdmin && !isUserSuperAdmin && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ color: '#d32f2f' }}
                              onClick={() => setDeleteTarget(u)}
                              title="Delete Account"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE CREDENTIAL MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={superAdmin ? 'Create Administrator or Staff Credential' : 'Create New Staff Credential'}
          size="md"
        >
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. K. Ramesh or Sister Mary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Login ID) *</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. ramesh@rithanya.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Login Password * (Encrypted & Viewable by Admin)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                Stored using Argon2id irreversible hash for auth + AES-256 reversible encryption for authorized administrative viewing.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">System Role Tier</label>
              {superAdmin ? (
                <select
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="STAFF">STAFF (Clinical / Operational - Configurable Modules)</option>
                  <option value="ADMIN">ADMIN (Hospital Administrator - Full Operational Control)</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  value="STAFF (Clinical / Operational)"
                  disabled
                  readOnly
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Credential'}
              </button>
            </div>
          </form>
        </Modal>

        {/* MODULAR ACCESS PERMISSIONS MODAL */}
        <Modal
          isOpen={!!permTarget}
          onClose={() => setPermTarget(null)}
          title={`Configure Dashboard Pages Access: ${permTarget?.name}`}
          size="lg"
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid var(--line)'
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
                  Toggle ON or OFF specific feature pages in the dashboard for <strong>{permTarget?.email}</strong>.
                  When toggled OFF, the module is hidden from their sidebar and access is blocked.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12 }}
                >
                  <CheckSquare size={13} />
                  <span>Select All</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12 }}
                >
                  <Square size={13} />
                  <span>Deselect All</span>
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                gap: 12,
                maxHeight: '55vh',
                overflowY: 'auto',
                paddingRight: 4
              }}
            >
              {ALL_MODULES.map((m) => {
                const isChecked = selectedModules.includes(m.key);
                return (
                  <div
                    key={m.key}
                    onClick={() => handleToggleModule(m.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 14px',
                      background: isChecked ? 'rgba(223, 56, 80, 0.04)' : 'var(--canvas)',
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: isChecked ? '1.5px solid var(--red-600)' : '1px solid var(--line)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // Handled by container onClick
                      style={{ marginTop: 3, cursor: 'pointer' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{m.label}</span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--canvas-warm, #f0f0f0)',
                            color: 'var(--ink-soft)',
                            fontWeight: 600
                          }}
                        >
                          {m.cat}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                <strong>{selectedModules.length}</strong> of {ALL_MODULES.length} modules granted access
              </span>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setPermTarget(null)} disabled={submitting}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSavePermissions} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Module Access'}
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* RESET PASSWORD MODAL */}
        <Modal
          isOpen={!!resetTarget}
          onClose={() => setResetTarget(null)}
          title={`Update Password: ${resetTarget?.name}`}
        >
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password (at least 6 characters)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                This password will be immediately visible to you in the table and hashed for staff login.
              </small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setResetTarget(null)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Save & Update Password'}
              </button>
            </div>
          </form>
        </Modal>

        {/* DELETE ACCOUNT MODAL */}
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title={`Confirm Delete Account: ${deleteTarget?.name}`}
        >
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 16 }}>
              Are you sure you want to permanently delete the account for <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={submitting}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteUser} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
