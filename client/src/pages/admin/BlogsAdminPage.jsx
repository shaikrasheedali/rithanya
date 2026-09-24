import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function BlogsAdminPage() {
  const { addToast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Endocrinology',
    author: 'Dr. Narayana Murthy, MD',
    readTime: '4 min read',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
    tags: 'Diabetes, Thalassemia, Lifestyle'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await apiRequest('/blogs');
      setBlogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : 'Healthcare'
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        category: 'Endocrinology',
        author: 'Dr. Narayana Murthy, MD',
        readTime: '4 min read',
        summary: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85',
        tags: 'Diabetes, Thalassemia, Lifestyle'
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = { ...formData, tags: tagsArray };

      if (editItem) {
        await apiRequest(`/blogs/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('Health article updated', 'success');
      } else {
        await apiRequest('/blogs', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Health article published', 'success');
      }
      setIsOpen(false);
      fetchBlogs();
    } catch (err) {
      addToast(err.message || 'Failed to save', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await apiRequest(`/blogs/${id}`, { method: 'DELETE' });
      addToast('Article removed', 'success');
      fetchBlogs();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Health Articles & Clinical Blogs"
        subtitle="Educational Guidance for Patients & Medical Updates"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>New Health Article</span>
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
                <th>Read Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td style={{ width: 80 }}>
                    <div style={{ width: 60, height: 40, borderRadius: 8, overflow: 'hidden' }}>
                      <img
                        src={getSafeImageUrl(b.coverImage)}
                        alt={b.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => onImageError(e)}
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{b.title}</strong>
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>/{b.slug}</small>
                  </td>
                  <td><span className="badge badge-red">{b.category}</span></td>
                  <td>{b.author}</td>
                  <td>{b.readTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(b)}>
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(b.id)}>
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
          title={editItem ? 'Edit Health Article' : 'Compose New Health Article'}
          size="xl"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Article Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <ImageUploadField
              label="Article Cover Image"
              value={formData.coverImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              required
              helperText="Uploads directly to /assets/uploads and synchronizes with the Media Assets library"
            />

            <div className="form-group">
              <label className="form-label">Summary Brief *</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                required
              />
            </div>

            <RichTextEditor
              label="Article Content"
              value={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Compose comprehensive medical article with rich headings, images, lists, formatting, and tables..."
              minHeight={320}
              required
              helperText="Rich WYSIWYG Editor supports direct image uploads, styling, lists, code blocks, alignments, and typography"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
