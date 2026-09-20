import React, { useState, useEffect } from 'react';
import { Settings, Save, Download, ShieldCheck, Database, Globe, Image as ImageIcon, Sparkles } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDateTime } from '../../utils/formatters';
import ImageUploadField from '../../components/common/ImageUploadField';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // profile, seo, dpdp, audit

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

  const [seo, setSeo] = useState({
    metaTitle: 'Rithanya Hospital & Daycare Transfusion Centre | Diabetology & HPLC Diagnostics Khammam',
    metaDescription: 'Premier healthcare facility in Khammam specializing in Thalassemia daycare transfusions with leukodepletion, longitudinal diabetology, and HPLC diagnostics under Dr. Narayana Murthy M.D.',
    keywords: 'hospital in khammam, thalassemia daycare transfusion, diabetology, blood bank, dr narayana murthy, HPLC diagnostics, emergency healthcare khammam',
    favicon: '/favicon.ico',
    ogImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
    author: 'Dr. Narayana Murthy M.D. / Rithanya Hospital',
    canonicalUrl: 'https://rithanya.in',
    robots: 'index, follow'
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSeo, setSavingSeo] = useState(false);

  const fetchSettings = async () => {
    try {
      const [settRes, auditRes] = await Promise.all([
        apiRequest('/settings'),
        apiRequest('/audit?limit=40')
      ]);
      if (settRes.data?.hospital_profile) {
        setProfile((prev) => ({ ...prev, ...settRes.data.hospital_profile }));
      }
      if (settRes.data?.seo_settings) {
        setSeo((prev) => ({ ...prev, ...settRes.data.seo_settings }));
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
    setSavingProfile(true);
    try {
      await apiRequest('/settings/hospital_profile', {
        method: 'PUT',
        body: JSON.stringify({ value: profile })
      });
      addToast('Hospital master configuration saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSavingSeo(true);
    try {
      await apiRequest('/settings/seo_settings', {
        method: 'PUT',
        body: JSON.stringify({ value: seo })
      });
      addToast('SEO metadata, favicon & thumbnail configuration updated successfully', 'success');

      // Immediate runtime reflection
      if (seo.metaTitle) document.title = seo.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && seo.metaDescription) metaDesc.content = seo.metaDescription;
      const linkIcon = document.querySelector("link[rel*='icon']");
      if (linkIcon && seo.favicon) linkIcon.href = seo.favicon;
    } catch (err) {
      addToast(err.message || 'Failed to save SEO settings', 'error');
    } finally {
      setSavingSeo(false);
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
        title="System Settings & Search Engine Optimization"
        subtitle="Hospital Identity, Search Engine Visibility, Favicons, Social Previews & DPDP Audit Logs"
        actions={
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportBackup}>
            <Download size={14} />
            <span>Export Database Backup</span>
          </button>
        }
      />

      <div className="admin-content">
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('profile')}
          >
            <Settings size={14} />
            <span>Hospital Profile</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'seo' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('seo')}
          >
            <Globe size={14} />
            <span>SEO & Social Thumbnail</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'dpdp' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dpdp')}
          >
            <ShieldCheck size={14} />
            <span>DPDP Compliance</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('audit')}
          >
            <Database size={14} />
            <span>System Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: HOSPITAL MASTER PROFILE */}
        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: 840, padding: 32 }}>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Hospital Master Configuration</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
              Defines the primary hospital identity, contact numbers, address, and live blood threshold alerts.
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Hospital Legal Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital Clinical Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Emergency & Transfusion Hotline *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Bank Critical Alert Threshold (Units)</label>
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
                <label className="form-label">Hospital Physical Address *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Consultation & Daycare Timings</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.timings}
                  onChange={(e) => setProfile({ ...profile, timings: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                <Save size={16} />
                <span>{savingProfile ? 'Saving...' : 'Save Hospital Profile'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: ADVANCED SEO, FAVICON & SOCIAL THUMBNAIL */}
        {activeTab === 'seo' && (
          <div className="card" style={{ maxWidth: 880, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Globe size={22} style={{ color: 'var(--red-700)' }} />
              <h3 style={{ fontSize: 18, margin: 0 }}>Search Engine Optimization (SEO) & Social Meta</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
              Customize how Rithanya Hospital appears in Google Search results and on social platforms (WhatsApp, Facebook, Twitter/X, LinkedIn previews).
            </p>

            <form onSubmit={handleSaveSeo}>
              <div className="form-group">
                <label className="form-label">SEO Page Title (Title Tag) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rithanya Hospital & Daycare Transfusion Centre | Diabetology & HPLC Diagnostics"
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  required
                />
                <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                  Recommended: 50–65 characters. Appears as the clickable headline in Google Search results.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Meta Description *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Comprehensive clinical summary of Rithanya Hospital services, treatments, and daycare transfusions..."
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  required
                />
                <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                  Recommended: 120–160 characters. Displayed beneath the title on search engines.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Target Search Keywords</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. hospital in khammam, thalassemia daycare, diabetology, blood bank, dr narayana murthy"
                  value={seo.keywords}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Canonical URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://rithanya.in"
                    value={seo.canonicalUrl}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Robots Indexing</label>
                  <select
                    className="form-control"
                    value={seo.robots}
                    onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                  >
                    <option value="index, follow">Index, Follow (Recommended for Production)</option>
                    <option value="noindex, nofollow">No Index, No Follow (Staging / Private)</option>
                  </select>
                </div>
              </div>

              {/* Favicon Upload */}
              <ImageUploadField
                label="Hospital Favicon Icon (32x32 or 64x64 PNG / ICO / SVG)"
                value={seo.favicon}
                onChange={(url) => setSeo({ ...seo, favicon: url })}
                helperText="Displayed on the browser tab, mobile bookmarks, and search snippets."
              />

              {/* Social Thumbnail / og:image Upload */}
              <ImageUploadField
                label="Social Share Thumbnail (Open Graph / og:image 1200x630)"
                value={seo.ogImage}
                onChange={(url) => setSeo({ ...seo, ogImage: url })}
                helperText="Displayed when your website link is shared on WhatsApp, Facebook, iMessage, Twitter/X, and LinkedIn."
              />

              {/* Live Search Engine Snippet Preview */}
              <div style={{ marginTop: 24, padding: 20, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: 0.5 }}>
                  Google Search Snippet Preview
                </span>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 13, color: '#202124' }}>
                    {seo.canonicalUrl || 'https://rithanya.in'}
                  </div>
                  <div style={{ fontSize: 18, color: '#1a0dab', fontWeight: 600, marginTop: 2, cursor: 'pointer', textDecoration: 'underline' }}>
                    {seo.metaTitle || 'Rithanya Hospital'}
                  </div>
                  <div style={{ fontSize: 13, color: '#4d5156', marginTop: 4, lineHeight: 1.5 }}>
                    {seo.metaDescription || 'No description provided.'}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 24 }} disabled={savingSeo}>
                <Save size={16} />
                <span>{savingSeo ? 'Updating SEO Metadata...' : 'Save SEO & Thumbnail Settings'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: DPDP STATUTORY COMPLIANCE */}
        {activeTab === 'dpdp' && (
          <div className="card" style={{ maxWidth: 840, padding: 32 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>DPDP Act 2023 Statutory Healthcare Standards</h3>
            <div style={{ background: 'var(--canvas)', padding: 20, borderRadius: 12, border: '1px solid var(--line)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green)', fontWeight: 700, marginBottom: 8 }}>
                <ShieldCheck size={22} />
                <span>Statutory DPDP Standards Active</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                All sensitive patient identifiers, clinical notes, and biometric webcam consent photo signatures are secured using field-level AES-256-GCM encryption and Argon2id passwords.
              </p>
            </div>

            <div style={{ fontSize: 13.5, lineHeight: 2 }}>
              <p><strong>DPO Officer:</strong> Dr. Narayana Murthy (Medical Director)</p>
              <p><strong>Statutory Right to Erasure:</strong> Fully Integrated (One-Click Cascading Purge)</p>
              <p><strong>Consent Capture Mode:</strong> Real-Time Camera Photo Modal</p>
              <p><strong>Audit Footprint Retention:</strong> Enabled across all modules</p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              style={{ marginTop: 24 }}
              onClick={handleExportBackup}
            >
              <Database size={16} />
              <span>Generate Full System Snapshot Backup</span>
            </button>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS TABLE */}
        {activeTab === 'audit' && (
          <div className="table-container">
            <div className="table-toolbar">
              <h3 style={{ fontSize: 16 }}>System Audit Logs & Security Footprints</h3>
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
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: 30 }}>No audit logs recorded yet.</td></tr>
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
        )}
      </div>
    </div>
  );
}
