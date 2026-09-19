import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';

export default function ProductsAdminPage() {
  const { addToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Metabolic & Endocrinology',
    price: '',
    originalPrice: '',
    discountText: '',
    summary: '',
    features: 'Blood Sugar Fasting, HbA1c, Complete Lipid Panel, Doctor Consultation',
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await apiRequest('/products');
      setPackages(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        price: item.price,
        originalPrice: item.originalPrice || '',
        discountText: item.discountText || '',
        summary: item.summary || '',
        features: Array.isArray(item.features) ? item.features.join(', ') : '',
        tag: item.tag || '',
        image: item.image || ''
      });
    } else {
      setEditItem(null);
      setFormData({
        name: '',
        category: 'Metabolic & Endocrinology',
        price: '',
        originalPrice: '',
        discountText: '',
        summary: '',
        features: 'Blood Sugar Fasting, HbA1c, Complete Lipid Panel, Doctor Consultation',
        tag: 'Popular',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=85'
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const featuresArray = formData.features.split(',').map((f) => f.trim()).filter(Boolean);
      const payload = { ...formData, features: featuresArray };

      if (editItem) {
        await apiRequest(`/products/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('Package updated', 'success');
      } else {
        await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) });
        addToast('New health package published', 'success');
      }
      setIsOpen(false);
      fetchPackages();
    } catch (err) {
      addToast(err.message || 'Failed to save package', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      addToast('Package removed', 'success');
      fetchPackages();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Diagnostic Packages & Healthcare Products"
        subtitle="Manage Pricing, Diagnostic Inclusions & Promotional Badges"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Package</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Package Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount / Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td style={{ width: 80 }}>
                    <div style={{ width: 60, height: 40, borderRadius: 8, overflow: 'hidden' }}>
                      <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td>
                    <strong>{pkg.name}</strong>
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>/{pkg.slug}</small>
                  </td>
                  <td>{pkg.category}</td>
                  <td>
                    <strong>{formatCurrency(pkg.price)}</strong>
                    {pkg.originalPrice && <small style={{ display: 'block', color: 'var(--muted)', textDecoration: 'line-through' }}>{formatCurrency(pkg.originalPrice)}</small>}
                  </td>
                  <td>
                    {pkg.tag && <span className="badge badge-red">{pkg.tag}</span>}
                    {pkg.discountText && <small style={{ display: 'block', color: 'var(--green)', fontWeight: 600 }}>{pkg.discountText}</small>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(pkg)}>
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(pkg.id)}>
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
          title={editItem ? 'Edit Health Package' : 'Create New Health Package'}
          size="lg"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label className="form-label">Package Price (INR) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price (Before Discount)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Discount Text (e.g. 40% OFF)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.discountText}
                  onChange={(e) => setFormData({ ...formData, discountText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tag Badge (e.g. Most Popular)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                />
              </div>
            </div>

            <ImageUploadField
              label="Package Banner / Cover Image"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              helperText="Uploads to /assets/uploads and synchronizes with Media Assets"
            />

            <div className="form-group">
              <label className="form-label">Summary</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Included Features / Tests (comma separated)</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
