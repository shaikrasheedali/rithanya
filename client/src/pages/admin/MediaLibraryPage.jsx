import React, { useState, useEffect } from 'react';
import { Upload, Copy, Trash2, Check, Image as ImageIcon, RefreshCw, ExternalLink } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function MediaLibraryPage() {
  const { addToast } = useToast();
  const [uploaded, setUploaded] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/media');
      setUploaded(res.data?.uploaded || res.assets || []);
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

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image (JPG, PNG, WebP, SVG)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await apiRequest('/media/upload', {
        method: 'POST',
        body: formData
      });
      addToast('Image uploaded successfully to /assets/uploads!', 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Direct image path copied to clipboard!', 'info');
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this uploaded asset from server storage?')) return;
    try {
      await apiRequest(`/media/${id}`, { method: 'DELETE' });
      addToast('Asset removed from uploads directory', 'success');
      fetchMedia();
    } catch (err) {
      addToast(err.message || 'Failed to delete asset', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Hospital Media Asset Library"
        subtitle="Uploaded Images & Clinical Photography in /assets/uploads"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchMedia}
              disabled={loading}
              title="Refresh files"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>

            <label className="btn btn-primary btn-sm" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
              <Upload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload New Image'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        }
      />

      <div className="admin-content">
        <div className="card" style={{ marginBottom: 24, padding: 18, background: 'var(--canvas)', border: '1.5px dashed var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--red-950)' }}>Server Storage: client/public/assets/uploads</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                All images uploaded through services, blogs, specialists, and packages are permanently stored here and immediately accessible across the hospital platform.
              </p>
            </div>
            <div className="badge badge-red" style={{ fontSize: 13, padding: '6px 14px' }}>
              {uploaded.length} Uploaded Assets
            </div>
          </div>
        </div>

        {/* Uploaded Assets Grid */}
        {loading ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--ink-soft)' }}>
            Loading uploaded hospital media...
          </div>
        ) : uploaded.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--ink-soft)' }}>
            <ImageIcon size={42} style={{ color: 'var(--muted)', margin: '0 auto 12px', display: 'block' }} />
            <h4 style={{ fontSize: 16, marginBottom: 6, color: 'var(--ink)' }}>No files uploaded yet</h4>
            <p style={{ fontSize: 13, marginBottom: 18 }}>
              Click "Upload New Image" above or upload images directly while editing clinical services, articles, and doctor profiles.
            </p>
          </div>
        ) : (
          <div className="grid-4">
            {uploaded.map((asset) => (
              <div key={asset.id} className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column' }}>
                <div
                  className="card-image-wrap"
                  style={{
                    aspectRatio: '16/10',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#f0ecee',
                    border: '1px solid var(--line)',
                    position: 'relative'
                  }}
                >
                  <img
                    src={asset.url}
                    alt={asset.originalName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x190?text=Uploaded+File';
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 6,
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    {formatFileSize(asset.size)}
                  </span>
                </div>

                <div style={{ marginTop: 10, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--ink)'
                      }}
                      title={asset.originalName}
                    >
                      {asset.originalName}
                    </p>
                    <small style={{ fontSize: 11, color: 'var(--ink-soft)', display: 'block', marginTop: 2 }}>
                      {asset.url}
                    </small>
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ flexGrow: 1, padding: '6px 10px', fontSize: 12 }}
                      onClick={() => copyToClipboard(asset.url)}
                      title="Copy public image path"
                    >
                      {copiedUrl === asset.url ? <Check size={12} style={{ color: 'var(--green)' }} /> : <Copy size={12} />}
                      <span>{copiedUrl === asset.url ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 8px' }}
                      title="Open full resolution in new tab"
                    >
                      <ExternalLink size={12} />
                    </a>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#d32f2f', padding: '6px 8px' }}
                      onClick={() => handleDelete(asset.id)}
                      title="Delete from server storage"
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
  );
}
