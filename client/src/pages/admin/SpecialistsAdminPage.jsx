import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';

export default function SpecialistsAdminPage() {
  const { addToast } = useToast();
  const [specialists, setSpecialists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    qualifications: '',
    opdTimings: 'Mon - Sat: 11:00 AM - 5:00 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85',
    bio: ''
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
        name: item.name,
        designation: item.designation,
        department: item.department,
        qualifications: item.qualifications,
        opdTimings: item.opdTimings,
        image: item.image,
        bio: item.bio
      });
    } else {
      setEditItem(null);
      setFormData({
        name: '',
        designation: '',
        department: '',
        qualifications: '',
        opdTimings: 'Mon - Sat: 11:00 AM - 5:00 PM',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85',
        bio: ''
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
        addToast('Doctor profile updated', 'success');
      } else {
        await apiRequest('/specialists', { method: 'POST', body: JSON.stringify(formData) });
        addToast('Doctor profile added', 'success');
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
    if (!window.confirm('Delete this specialist?')) return;
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
        title="Specialist Doctors & Clinical Consultants"
        subtitle="Manage Physician Credentials, Specializations & OPD Timings"
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
                <th>Doctor Name</th>
                <th>Designation & Department</th>
                <th>Qualifications</th>
                <th>OPD Timings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ width: 60 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden' }}>
                      <img src={doc.image} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td><strong>{doc.name}</strong></td>
                  <td>
                    {doc.designation}
                    <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{doc.department}</small>
                  </td>
                  <td>{doc.qualifications}</td>
                  <td>{doc.opdTimings}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openModal(doc)}>
                        <Edit2 size={13} />
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#d32f2f' }} onClick={() => handleDelete(doc.id)}>
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
          title={editItem ? 'Edit Doctor Profile' : 'Add New Specialist'}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Chief Physician & Diabetologist"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. General Medicine & Diabetology"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. MBBS, MD (General Medicine)"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">OPD Timings</label>
              <input
                type="text"
                className="form-control"
                value={formData.opdTimings}
                onChange={(e) => setFormData({ ...formData, opdTimings: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Photo Image URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Clinical Biography</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
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
