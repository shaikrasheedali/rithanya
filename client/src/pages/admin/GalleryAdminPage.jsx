import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';

export default function GalleryAdminPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Facility',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
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
        imageUrl: item.imageUrl,
        caption: item.caption || ''
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        category: 'Facility',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
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
        addToast('Gallery item updated', 'success');
      } else {
        await apiRequest('/gallery', { method: 'POST', body: JSON.stringify(formData) });
        addToast('Photo added to gallery', 'success');
      }
      setIsOpen(false);
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
      addToast('Photo removed', 'success');
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Photo Gallery & Facility Showcase"
        subtitle="Manage Hospital Images, Diagnostics & Transfusion Daycare Photos"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Gallery Photo</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Caption</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: 90 }}>
                    <div style={{ width: 70, height: 46, borderRadius: 8, overflow: 'hidden' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td><strong>{item.title}</strong></td>
                  <td><span className="badge badge-red">{item.category}</span></td>
                  <td>{item.caption || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(item)}>
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Gallery Item' : 'Add Photo to Gallery'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Photo Title *</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Facility">Facility</option>
                <option value="Daycare">Daycare</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Specialists">Specialists</option>
                <option value="Patient Care">Patient Care</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input
                type="url"
                className="form-control"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Caption / Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Photo'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
