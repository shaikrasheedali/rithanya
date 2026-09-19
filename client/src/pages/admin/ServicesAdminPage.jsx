import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import RichTextEditor from '../../components/common/RichTextEditor';

export default function ServicesAdminPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Clinical Specialty',
    author: 'Dr. Narayana Murthy, MD',
    readTime: '5 min overview',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85',
    status: 'published'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await apiRequest('/services');
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        author: item.author,
        readTime: item.readTime,
        summary: item.summary,
        content: item.content,
        coverImage: item.coverImage,
        status: item.status
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        category: 'Clinical Specialty',
        author: 'Dr. Narayana Murthy, MD',
        readTime: '5 min overview',
        summary: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=85',
        status: 'published'
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await apiRequest(`/services/${editItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        addToast('Service specialty updated!', 'success');
      } else {
        await apiRequest('/services', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        addToast('New clinical specialty published!', 'success');
      }
      setIsOpen(false);
      fetchServices();
    } catch (err) {
      addToast(err.message || 'Failed to save service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' });
      addToast('Service deleted', 'success');
      fetchServices();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Clinical Services CMS"
        subtitle="Manage Medical Specialties, Rich Text Protocols & Diagnostic Guidelines"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add New Specialty</span>
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
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td style={{ width: 80 }}>
                    <div style={{ width: 60, height: 40, borderRadius: 8, overflow: 'hidden' }}>
                      <img src={s.coverImage} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td>
                    <strong>{s.title}</strong>
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>/{s.slug}</small>
                  </td>
                  <td><span className="badge badge-red">{s.category}</span></td>
                  <td>{s.author}</td>
                  <td>
                    <span className={`badge ${s.status === 'published' ? 'badge-green' : 'badge-amber'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(s)}>
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(s.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CMS MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Specialty' : 'Add New Clinical Specialty'}
          size="lg"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Specialty Title *</label>
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
                <input
                  type="text"
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author / Attending Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Read Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                />
              </div>
            </div>

            <ImageUploadField
              label="Cover Image"
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              required
              helperText="Uploads to /assets/uploads and automatically registers in Media Library"
            />

            <div className="form-group">
              <label className="form-label">Summary Brief *</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>

            <RichTextEditor
              label="HTML / Rich Clinical Content"
              value={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Detail medical procedures, diagnostic protocols, patient guidelines, and equipment specs..."
              minHeight={300}
              required
              helperText="Rich WYSIWYG Editor supports medical formatting, direct image uploads, links, lists, and tables"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
