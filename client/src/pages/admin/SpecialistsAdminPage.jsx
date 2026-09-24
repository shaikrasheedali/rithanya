import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UserCheck, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import RichTextEditor from '../../components/common/RichTextEditor';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function SpecialistsAdminPage() {
  const { addToast } = useToast();
  const [specialists, setSpecialists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    designation: '',
    department: '',
    qualifications: '',
    experience: '',
    registrationNumber: '',
    opdTimings: 'Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM',
    image: '',
    bio: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSpecialists = async () => {
    try {
      const res = await apiRequest('/specialists');
      setSpecialists(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name || '',
        slug: item.slug || '',
        designation: item.designation || '',
        department: item.department || '',
        qualifications: item.qualifications || '',
        experience: item.experience || '',
        registrationNumber: item.registrationNumber || '',
        opdTimings: item.opdTimings || 'Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM',
        image: item.image || '',
        bio: item.bio || '',
        content: item.content || ''
      });
    } else {
      setEditItem(null);
      setFormData({
        name: '',
        slug: '',
        designation: '',
        department: '',
        qualifications: '',
        experience: '',
        registrationNumber: '',
        opdTimings: 'Morning: 10:00 AM – 02:00 PM | Evening: 06:00 PM – 09:00 PM',
        image: '',
        bio: '',
        content: ''
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await apiRequest(`/specialists/${editItem.id}`, { method: 'PUT', body: JSON.stringify(formData) });
        addToast('Doctor profile updated successfully', 'success');
      } else {
        await apiRequest('/specialists', { method: 'POST', body: JSON.stringify(formData) });
        addToast('Doctor profile added successfully', 'success');
      }
      setIsOpen(false);
      fetchSpecialists();
    } catch (err) {
      addToast(err.message || 'Failed to save specialist', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this specialist profile?')) return;
    try {
      await apiRequest(`/specialists/${id}`, { method: 'DELETE' });
      addToast('Specialist removed', 'success');
      fetchSpecialists();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Specialist Doctors & Medical Faculty"
        subtitle="Manage Physician Credentials, Registration Numbers, Rich Clinical Profiles & OPD Schedules"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Specialist Doctor</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Doctor Name & Reg. No.</th>
                <th>Designation & Dept</th>
                <th>Qualifications</th>
                <th>OPD Timings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ width: 64 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#f5f5f5', border: '1px solid var(--line)' }}>
                      <img
                        src={getSafeImageUrl(doc.image)}
                        alt={doc.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => onImageError(e)}
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{doc.name}</strong>
                    {doc.registrationNumber && (
                      <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11 }}>
                        <UserCheck size={11} />
                        Reg: {doc.registrationNumber}
                      </span>
                    )}
                  </td>
                  <td>
                    {doc.designation}
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{doc.department}</small>
                  </td>
                  <td style={{ maxWidth: 280, fontSize: 12.5 }}>
                    <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {doc.qualifications}
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{doc.opdTimings}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link
                        to={`/doctors/${doc.slug || doc.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        title="View Live Public Profile"
                      >
                        <ExternalLink size={13} />
                      </Link>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(doc)} title="Edit Profile">
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(doc.id)} title="Delete Profile">
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
          title={editItem ? `Edit Doctor Profile: ${editItem.name}` : 'Add New Specialist Doctor'}
          size="xl"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Doctor Name (Bilingual supported) *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. D. Narayana Murthy (డా. డి. నారాయణ మూర్తి)"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug (e.g. dr-narayana-murthy)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="dr-narayana-murthy"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Senior Consultant Physician & Diabetologist"
                  value={formData.designation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="General Medicine & Diabetology"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 81187"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Clinical Experience</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 18+ Years"
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">OPD Timings</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.opdTimings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, opdTimings: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Complete Medical Qualifications & Fellowships</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. M.D. (SVIMS), PG Dip in Diabetology (Boston), Fellow in Diabetology (Royal College of Physicians, London)..."
                value={formData.qualifications}
                onChange={(e) => setFormData((prev) => ({ ...prev, qualifications: e.target.value }))}
              />
            </div>

            <ImageUploadField
              label="Doctor High-Res Portrait Photo"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              helperText="Recommended: Clean white or transparent background portrait"
            />

            <div className="form-group">
              <label className="form-label">Short Clinical Summary / Bio</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief summary displayed on listings and card previews..."
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            {/* WYSIWYG Quill Rich Text Editor */}
            <RichTextEditor
              label="Comprehensive Doctor Profile & Clinical Details"
              value={formData.content}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              placeholder="Compose detailed clinical background, specializations, procedural expertise, awards, and patient consultation guidelines..."
              minHeight={320}
              helperText="Full rich formatting with headings, alignments, lists, images and videos. Changes reflect instantly on doctor detail page."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Doctor Profile'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
