import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Clock, Stethoscope, Sparkles } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function TreatmentsAdminPage() {
  const { addToast } = useToast();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Daycare Hematology',
    department: 'General Medicine & Diabetology',
    doctorName: 'Dr. Narayana Murthy, MD',
    duration: '3 - 4 Hours',
    indications: '',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    videoUrl: '',
    proceduresText: '',
    status: 'published'
  });

  const fetchTreatments = async () => {
    try {
      const res = await apiRequest('/treatments?all=true');
      setTreatments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        department: item.department || 'General Medicine & Diabetology',
        doctorName: item.doctorName || 'Dr. Narayana Murthy, MD',
        duration: item.duration || '45 - 90 mins',
        indications: item.indications || '',
        summary: item.summary,
        content: item.content,
        coverImage: item.coverImage,
        videoUrl: item.videoUrl || '',
        proceduresText: Array.isArray(item.procedures) ? item.procedures.join('\n') : '',
        status: item.status
      });
    } else {
      setEditItem(null);
      setFormData({
        title: '',
        category: 'Daycare Hematology',
        department: 'General Medicine & Diabetology',
        doctorName: 'Dr. Narayana Murthy, MD',
        duration: '3 - 4 Hours',
        indications: '',
        summary: '',
        content: '',
        coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
        videoUrl: '',
        proceduresText: '',
        status: 'published'
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const procedures = formData.proceduresText
      ? formData.proceduresText.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const { proceduresText: _omitted, ...cleanFormData } = formData;
    const payload = {
      ...cleanFormData,
      procedures
    };

    try {
      if (editItem) {
        await apiRequest(`/treatments/${editItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        addToast('Treatment procedure updated successfully', 'success');
      } else {
        await apiRequest('/treatments', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        addToast('New treatment protocol created successfully', 'success');
      }
      setIsOpen(false);
      fetchTreatments();
    } catch (err) {
      addToast(err.message || 'Failed to save treatment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete treatment "${title}"?`)) return;
    try {
      await apiRequest(`/treatments/${id}`, { method: 'DELETE' });
      addToast('Treatment deleted successfully', 'success');
      fetchTreatments();
    } catch (err) {
      addToast(err.message || 'Failed to delete treatment', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Treatments & Clinical Protocols"
        subtitle="Manage hospital treatments, daycare transfusion procedures, and individual detailed pages"
        actions={
          <button type="button" className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={16} />
            <span>Add New Treatment</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Treatment Title & Department</th>
                <th>Category</th>
                <th>Attending Doctor</th>
                <th>Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => (
                <tr key={t.id}>
                  <td style={{ width: 70 }}>
                    <img
                      src={getSafeImageUrl(t.coverImage)}
                      alt={t.title}
                      style={{ width: 54, height: 40, objectFit: 'cover', borderRadius: 8 }}
                      onError={(e) => onImageError(e)}
                    />
                  </td>
                  <td>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{t.title}</strong>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t.department}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{t.category}</span>
                  </td>
                  <td>{t.doctorName}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5 }}>
                      <Clock size={13} style={{ color: 'var(--ink-soft)' }} />
                      <span>{t.duration}</span>
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${t.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <Link
                        to={`/treatments/${t.slug}`}
                        target="_blank"
                        className="btn btn-sm btn-secondary"
                        title="View Public Page"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleOpenModal(t)}
                        title="Edit Treatment"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        style={{ color: 'var(--red-600)' }}
                        onClick={() => handleDelete(t.id, t.title)}
                        title="Delete Treatment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Create / Edit Treatment */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Treatment Protocol' : 'Create New Treatment Protocol'}
          size="xl"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Treatment Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Thalassemia Daycare Transfusion"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Category *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Daycare Hematology, Endocrinology"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attending Specialist / Doctor</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.doctorName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, doctorName: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 3 - 4 Hours or 45 mins"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publish Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <ImageUploadField
              label="Treatment Cover Image"
              value={formData.coverImage}
              onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
              required
              helperText="Uploads to /assets/uploads and automatically registers in Media Library"
            />

            <div className="form-group">
              <label className="form-label">Optional Video URL / Embed</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. /assets/1.mp4 or video stream URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Indications & Eligibility</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Severe chronic hemolytic anemia, Hb < 9 g/dL"
                value={formData.indications}
                onChange={(e) => setFormData((prev) => ({ ...prev, indications: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary Brief *</label>
              <textarea
                className="form-control"
                rows="2"
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Key Procedures & Safety Protocols (1 per line)</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Saline triple pre-crossmatching&#10;Micro-aggregate leukodepletion blood filtration&#10;Continuous SpO2 and hemodynamic monitoring"
                value={formData.proceduresText}
                onChange={(e) => setFormData((prev) => ({ ...prev, proceduresText: e.target.value }))}
              />
            </div>

            <RichTextEditor
              label="Detailed Treatment Content & Clinical Guidelines"
              value={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Describe procedure steps, clinical mechanisms, safety audits, patient prep instructions..."
              minHeight={320}
              required
              helperText="Rich WYSIWYG Editor supports direct image uploads, headings, checklists, and medical tables"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save & Publish Treatment'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
