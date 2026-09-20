import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image, Video, Youtube, Instagram, Facebook } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';

export default function GalleryAdminPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Facility',
    mediaType: 'IMAGE',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
    embedUrl: '',
    caption: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await apiRequest('/gallery');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        mediaType: item.mediaType || 'IMAGE',
        imageUrl: item.imageUrl,
        embedUrl: item.embedUrl || '',
        caption: item.caption || ''
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        category: 'Facility',
        mediaType: 'IMAGE',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
        embedUrl: '',
        caption: ''
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await apiRequest(`/gallery/${editItem.id}`, { method: 'PUT', body: JSON.stringify(formData) });
        addToast('Gallery item updated successfully', 'success');
      } else {
        await apiRequest('/gallery', { method: 'POST', body: JSON.stringify(formData) });
        addToast('Media item added to gallery', 'success');
      }
      setIsOpen(false);
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to save gallery item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
      addToast('Gallery item removed', 'success');
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'YOUTUBE':
        return <Youtube size={13} style={{ color: '#ef4444' }} />;
      case 'INSTAGRAM':
        return <Instagram size={13} style={{ color: '#ec4899' }} />;
      case 'FACEBOOK':
        return <Facebook size={13} style={{ color: '#3b82f6' }} />;
      case 'VIDEO':
        return <Video size={13} style={{ color: '#8b5cf6' }} />;
      default:
        return <Image size={13} style={{ color: 'var(--ink-soft)' }} />;
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Hospital Media Gallery CMS"
        subtitle="Manage Facility Photos, Clinical Tour Videos, YouTube & Instagram Social Embeds"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Media Item</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Media Type</th>
                <th>Category</th>
                <th>Embed / Caption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                    No media items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: 90 }}>
                      <div style={{ width: 70, height: 46, borderRadius: 8, overflow: 'hidden' }}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          background: 'var(--canvas-warm, #f3f4f6)',
                          fontSize: 11
                        }}
                      >
                        {getMediaIcon(item.mediaType)}
                        <span>{item.mediaType || 'IMAGE'}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-red">{item.category}</span>
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 12 }}>
                      {item.embedUrl ? (
                        <code style={{ fontSize: 11, color: 'var(--red-700)' }}>{item.embedUrl}</code>
                      ) : (
                        item.caption || '—'
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openModal(item)}
                          title="Edit Media Item"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#d32f2f' }}
                          onClick={() => handleDelete(item.id)}
                          title="Delete Media Item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Media Gallery Item' : 'Add Media Item to Gallery'}
          size="md"
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Daycare Transfusion Ward Tour or Thalassemia Awareness Video"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Media Type</label>
                <select
                  className="form-control"
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                >
                  <option value="IMAGE">Photograph (Static Image)</option>
                  <option value="YOUTUBE">YouTube Video Embed</option>
                  <option value="INSTAGRAM">Instagram Post / Reel Embed</option>
                  <option value="FACEBOOK">Facebook Video Embed</option>
                  <option value="VIDEO">Direct Video URL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Facility">Facility Tour</option>
                  <option value="Daycare">Transfusion Daycare</option>
                  <option value="Diagnostics">Laboratory & Diagnostics</option>
                  <option value="Specialists">Specialists & OPD</option>
                  <option value="Patient Care">Patient Care & Community</option>
                </select>
              </div>
            </div>

            {formData.mediaType !== 'IMAGE' && (
              <div className="form-group">
                <label className="form-label">Social Media Video / Embed URL *</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                  required={formData.mediaType !== 'IMAGE'}
                />
                <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                  Supports YouTube standard/shorts links, Instagram reel URLs, and Facebook video embeds.
                </small>
              </div>
            )}

            <ImageUploadField
              label={formData.mediaType === 'IMAGE' ? 'Gallery Photograph' : 'Cover Image / Video Poster'}
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              required
              helperText="Uploads to /assets/uploads and synchronizes with Media Assets"
            />

            <div className="form-group">
              <label className="form-label">Caption / Clinical Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Optional description displayed in modal lightbox"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Media Item'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
