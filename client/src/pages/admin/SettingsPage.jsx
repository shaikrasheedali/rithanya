import React, { useState, useEffect } from 'react';
import { Settings, Save, Download, ShieldCheck, Database, History } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDateTime } from '../../utils/formatters';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState({
    name: 'Rithanya Hospital & Diagnostics',
    tagline: 'Care with precision — Diabetology & Thalassemia Daycare Centre',
    phone: '+91 83285 81019',
    emergencyPhone: '+91 83285 81019',
    email: 'info@rithanya.in',
    address: 'Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana - 507001',
    timings: 'OPD: Mon-Sat 11:00 AM - 5:00 PM | Daycare: 24/7 Support',
    bloodThreshold: 10
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const [settRes, auditRes] = await Promise.all([
        apiRequest('/settings'),
        apiRequest('/audit?limit=40')
      ]);
      if (settRes.data?.hospital_profile) {
        setProfile((prev) => ({ ...prev, ...settRes.data.hospital_profile }));
      }
      setAuditLogs(auditRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest('/settings/hospital_profile', {
        method: 'PUT',
        body: JSON.stringify({ value: profile })
      });
      addToast('Hospital settings saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await apiRequest('/settings/backup/export');
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `rithanya_hospital_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('System database backup exported successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to export backup', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="System Settings & DPDP Audit Trail"
        subtitle="Hospital Configuration, Critical Thresholds & Detailed Audit Footprints"
        actions={
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportBackup}>
            <Download size={14} />
            <span>Export Database Backup</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="grid-2" style={{ gap: 28, alignItems: 'start', marginBottom: 36 }}>
          {/* PROFILE FORM */}
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: 18, marginBottom: 20 }}>Hospital Master Configuration</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Primary Hotline Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Bank Critical Alert Threshold</label>
                  <input
                    type="number"
                    className="form-control"
                    value={profile.bloodThreshold}
                    onChange={(e) => setProfile({ ...profile, bloodThreshold: parseInt(e.target.value, 10) || 10 })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Official Hospital Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation & Daycare Timings</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.timings}
                  onChange={(e) => setProfile({ ...profile, timings: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </form>
          </div>

          {/* DPDP POLICY INFO */}
          <div className="card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>DPDP Act 2023 Compliance Status</h3>
            <div style={{ background: 'var(--canvas)', padding: 18, borderRadius: 12, border: '1px solid var(--line)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green)', fontWeight: 700, marginBottom: 8 }}>
                <ShieldCheck size={20} />
                <span>Statutory DPDP Standards Active</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                All sensitive patient identifiers, clinical notes, and biometric webcam consent photo signatures are secured using field-level AES-256-GCM encryption and Argon2id passwords.
              </p>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <p><strong>DPO Officer:</strong> Dr. Narayana Murthy (Medical Director)</p>
              <p><strong>Statutory Right to Erasure:</strong> Fully Integrated (One-Click Cascading Purge)</p>
              <p><strong>Consent Capture Mode:</strong> Real-Time Camera Photo Modal</p>
              <p><strong>Audit Footprint Retention:</strong> Enabled across all modules</p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', marginTop: 24 }}
              onClick={handleExportBackup}
            >
              <Database size={16} />
              <span>Generate Full System Snapshot</span>
            </button>
          </div>
        </div>

        {/* AUDIT LOGS TABLE */}
        <div className="table-container">
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>System Audit Logs & Footprints</h3>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Latest {auditLogs.length} activity records
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Module</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30 }}>No audit logs found.</td></tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDateTime(log.createdAt)}</td>
                    <td><strong>{log.actorName}</strong></td>
                    <td><span className="badge badge-blue">{log.actorRole}</span></td>
                    <td><span className="badge badge-red">{log.module}</span></td>
                    <td><strong style={{ fontSize: 12 }}>{log.action}</strong></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{log.ipAddress}</td>
                    <td style={{ maxWidth: 260, fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'monospace' }}>
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
