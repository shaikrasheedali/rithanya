import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function ProductsAdminPage() {
  const { addToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Diagnostic Kits & Monitoring',
    price: '',
    originalPrice: '',
    discountText: '',
    summary: '',
    features: 'Accurate Digital Sensors, Memory Storage, Clinical Grade Calibration',
    tag: 'Hospital Certified',
    image: '',
    videoUrl: '',
    content: ''
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
        name: item.name || '',
        slug: item.slug || '',
        category: item.category || 'Diagnostic Kits & Monitoring',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        discountText: item.discountText || '',
        summary: item.summary || '',
        features: Array.isArray(item.features) ? item.features.join(', ') : (item.features || ''),
        tag: item.tag || '',
        image: item.image || '',
        videoUrl: item.videoUrl || '',
        content: item.content || ''
      });
    } else {
      setEditItem(null);
      setFormData({
        name: '',
        slug: '',
        category: 'Diagnostic Kits & Monitoring',
        price: '',
        originalPrice: '',
        discountText: '',
        summary: '',
        features: 'Accurate Digital Sensors, Memory Storage, Clinical Grade Calibration',
        tag: 'Hospital Certified',
        image: '',
        videoUrl: '',
        content: ''
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const featuresArray = formData.features.split(',').map((f) => f.trim()).filter(Boolean);
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        features: featuresArray
      };

      if (editItem) {
        await apiRequest(`/products/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('Product package updated successfully', 'success');
      } else {
        await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) });
        addToast('New healthcare product published successfully', 'success');
      }
      setIsOpen(false);
      fetchPackages();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this health product?')) return;
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      addToast('Product removed', 'success');
      fetchPackages();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Healthcare Products & Clinical Pharmacy"
        subtitle="Manage Product Catalog, Pricing, WYSIWYG Content, Media Uploads & Order Inventory"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Healthcare Product</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name & Slug</th>
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
                    <div style={{ width: 60, height: 48, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', border: '1px solid var(--line)' }}>
                      <img
                        src={getSafeImageUrl(pkg.image)}
                        alt={pkg.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => onImageError(e)}
                      />
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
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link
                        to={`/products/${pkg.slug || pkg.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="View Live Public Product Page"
                      >
                        <ExternalLink size={13} />
                      </Link>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(pkg)} title="Edit Product">
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(pkg.id)} title="Delete Product">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CMS EDIT MODAL (XL size - 90% Viewport on Desktop) */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? `Edit Product: ${editItem.name}` : 'Create New Healthcare Product'}
          size="xl"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
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
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Product Price (INR) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Price (Before Discount)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Text (e.g. Save 20%)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.discountText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discountText: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Tag Badge (e.g. DIABETIC CARE / POPULAR)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Video Demonstration URL (Optional YouTube / Embed)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                />
              </div>
            </div>

            <ImageUploadField
              label="Product Showcase Image"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              helperText="Uploads to /assets/uploads and synchronizes with Media Assets"
            />

            <div className="form-group">
              <label className="form-label">Product Summary</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Short summary displayed on store grid cards..."
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Included Features / Specifications (comma separated)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. Fast 5-sec readings, 500 test memory, Pre/post meal markers..."
                value={formData.features}
                onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
              />
            </div>

            {/* WYSIWYG Quill Rich Text Editor */}
            <RichTextEditor
              label="Comprehensive Product Clinical Documentation & Usage Guide"
              value={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              placeholder="Compose detailed product description, indications, how to use step-by-step, clinical calibration details, and safety notes..."
              minHeight={300}
              helperText="Full rich formatting with headings, alignments, lists, images and videos. Changes reflect instantly on product detail page."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
