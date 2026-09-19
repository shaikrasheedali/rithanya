import React, { useState, useEffect } from 'react';
import { Upload, Copy, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function MediaLibraryPage() {
  const { addToast } = useToast();
  const [presets, setPresets] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const fetchMedia = async () => {
    try {
      const res = await apiRequest('/media');
      setPresets(res.data?.presets || []);
      setUploaded(res.data?.uploaded || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await apiRequest('/media/upload', {
        method: 'POST',
        body: formData
      });
      addToast('File uploaded successfully to media library!', 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Image URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this uploaded asset?')) return;
    try {
      await apiRequest(`/media/${id}`, { method: 'DELETE' });
      addToast('Asset deleted', 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Failed to delete asset', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Hospital Media Asset Library"
        subtitle="Manage High-Resolution Clinical Photography, Doctor Portraits & Static Assets"
        actions={
          <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload Media Asset'}</span>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        }
      />

      <div className="admin-content">
        {/* Presets Grid */}
        <div style={{ marginBottom: 36 }}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Curated Clinical Presets & Hospital Stock</h3>
          <div className="grid-3">
            {presets.map((item, idx) => (
              <div key={idx} className="card" style={{ padding: 12 }}>
                <div className="card-image-wrap" style={{ aspectRatio: '16/10', borderRadius: 10 }}>
                  <img src={item.url} alt={item.title} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 14 }}>{item.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyToClipboard(item.url)}
                    title="Copy URL"
                  >
                    {copiedUrl === item.url ? <Check size={13} style={{ color: 'var(--green)' }} /> : <Copy size={13} />}
                    <span>{copiedUrl === item.url ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Assets */}
        <div>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Locally Uploaded Assets ({uploaded.length})</h3>
          {uploaded.length === 0 ? (
            <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--ink-soft)' }}>
              No custom files uploaded yet. Click "Upload Media Asset" above to store local files.
            </div>
          ) : (
            <div className="grid-4">
              {uploaded.map((asset) => (
                <div key={asset.id} className="card" style={{ padding: 12 }}>
                  <div className="card-image-wrap" style={{ aspectRatio: '16/10', borderRadius: 10 }}>
                    <img src={asset.url} alt={asset.originalName} />
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {asset.originalName}
                    </p>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ flexGrow: 1 }}
                        onClick={() => copyToClipboard(asset.url)}
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#d32f2f' }}
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
