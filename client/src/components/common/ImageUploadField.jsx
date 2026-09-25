import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, FolderOpen } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from './Toast';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';
import MediaLibraryModal from './MediaLibraryModal';

export default function ImageUploadField({ label, value, onChange, required = false, helperText }) {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

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

      const uploadedUrl = res.data?.url || res.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        if (res.isDuplicate) {
          addToast('Identical asset already exists in storage and was reused!', 'info');
        } else {
          addToast('Image uploaded successfully to server uploads directory!', 'success');
        }
      } else {
        throw new Error('Upload succeeded but no image URL was returned by server');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="form-label" style={{ margin: 0 }}>
          {label} {required && <strong style={{ color: 'var(--red-600)' }}>*</strong>}
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setLibraryOpen(true)}
            style={{
              padding: '3px 8px',
              fontSize: 11.5,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
            title="Browse existing uploaded media assets"
          >
            <FolderOpen size={12} style={{ color: 'var(--red-600)' }} />
            <span>Browse Library</span>
          </button>

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
              gap: 3
            }}
          >
            <LinkIcon size={11} />
            <span>{showUrlInput ? 'Upload' : 'Paste URL'}</span>
          </button>
        </div>
      </div>

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
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 9px', fontSize: 12 }}
                  onClick={() => setLibraryOpen(true)}
                  title="Select a different image from media library"
                >
                  <FolderOpen size={13} />
                  <span>Library</span>
                </button>

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
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 16px',
                background: 'var(--canvas)',
                border: '2px dashed var(--line)',
                borderRadius: 12,
                textAlign: 'center',
                gap: 10
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
                  justifyContent: 'center'
                }}
              >
                {uploading ? (
                  <div className="spinner" style={{ width: 20, height: 20, border: '2px solid var(--red-200)', borderTopColor: 'var(--red-700)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <Upload size={20} />
                )}
              </div>

              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', display: 'block' }}>
                  {uploading ? 'Uploading to server uploads directory...' : 'Upload Image or Choose from Library'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2, display: 'block' }}>
                  PNG, JPG, WebP, SVG up to 10MB
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <label
                  className="btn btn-primary btn-sm"
                  style={{ cursor: uploading ? 'not-allowed' : 'pointer', fontSize: 12 }}
                >
                  <Upload size={13} />
                  <span>Upload File</span>
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
                  style={{ fontSize: 12 }}
                  onClick={() => setLibraryOpen(true)}
                >
                  <FolderOpen size={13} style={{ color: 'var(--red-600)' }} />
                  <span>Media Library</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {helperText && <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>{helperText}</p>}

      {/* Media Library Selector Modal */}
      <MediaLibraryModal
        isOpen={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        filterType="IMAGE"
        title="Select Image from Media Assets Library"
        onSelect={(asset) => {
          onChange(asset.url);
          addToast(`Selected "${asset.originalName || 'asset'}" from Media Library`, 'success');
        }}
      />
    </div>
  );
}
