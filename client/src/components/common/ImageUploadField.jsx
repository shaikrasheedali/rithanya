import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from './Toast';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function ImageUploadField({ label, value, onChange, required = false, helperText }) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    // Validate size (under 10MB)
    if (file.size > 10 * 1024 * 1024) {
      addToast('File size must be under 10MB', 'error');
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

      if (res.data?.url) {
        onChange(res.data.url);
        addToast('Image uploaded successfully to server uploads directory!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="form-group image-upload-field">
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label} {required && <strong style={{ color: 'var(--red-600)' }}>*</strong>}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-soft)',
            fontSize: 11,
            cursor: 'pointer',
            textDecoration: 'underline',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <LinkIcon size={11} />
          <span>{showUrlInput ? 'Switch to Upload' : 'Paste URL instead'}</span>
        </button>
      </label>

      {/* Manual URL Input Option */}
      {showUrlInput ? (
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="https://example.com/image.jpg or /assets/uploads/image.jpg"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
        </div>
      ) : (
        <div>
          {value ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 14px',
                background: 'var(--canvas)',
                border: '1.5px solid var(--line)',
                borderRadius: 12
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#e8e5e7',
                  flexShrink: 0,
                  border: '1px solid var(--line)'
                }}
              >
                <img
                  src={getSafeImageUrl(value)}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => onImageError(e)}
                />
              </div>

              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={value}
                >
                  {value}
                </span>
                <span style={{ fontSize: 11, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                  <Check size={12} /> Ready in storage
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: 12 }}>
                  <Upload size={13} />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#d32f2f', padding: '6px 8px' }}
                  onClick={handleClear}
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
                background: 'var(--canvas)',
                border: '2px dashed var(--line)',
                borderRadius: 12,
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)',
                textAlign: 'center'
              }}
              className="image-upload-dropzone"
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--red-50)',
                  color: 'var(--red-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8
                }}
              >
                {uploading ? (
                  <div className="spinner" style={{ width: 20, height: 20, border: '2px solid var(--red-200)', borderTopColor: 'var(--red-700)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <Upload size={20} />
                )}
              </div>

              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                {uploading ? 'Uploading to server uploads directory...' : 'Click to Upload Image'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>
                Saves directly to /assets/uploads (PNG, JPG, WebP, SVG up to 10MB)
              </span>

              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      )}

      {helperText && <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{helperText}</p>}
    </div>
  );
}
