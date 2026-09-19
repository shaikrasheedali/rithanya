import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function StaffPage() {
  const { addToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'General Medicine',
    salary: '',
    shift: 'Day',
    phone: '',
    email: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await apiRequest('/staff');
      setStaffList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openModal = (item = null) => {
    if (item) {
      setEditItem(item);
      setFormData({
        name: item.name,
        designation: item.designation,
        department: item.department,
        salary: item.salary,
        shift: item.shift,
        phone: item.phone,
        email: item.email,
        status: item.status
      });
    } else {
      setEditItem(null);
      setFormData({
        name: '',
        designation: '',
        department: 'General Medicine',
        salary: '',
        shift: 'Day',
        phone: '',
        email: '',
        status: 'active'
      });
    }
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        await apiRequest(`/staff/${editItem.id}`, { method: 'PUT', body: JSON.stringify(formData) });
        addToast('Staff profile updated', 'success');
      } else {
        await apiRequest('/staff', { method: 'POST', body: JSON.stringify(formData) });
        addToast('New staff member added', 'success');
      }
      setIsOpen(false);
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to save staff', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff record?')) return;
    try {
      await apiRequest(`/staff/${id}`, { method: 'DELETE' });
      addToast('Staff member removed', 'success');
      fetchStaff();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Hospital Human Resources (HR) & Staff"
        subtitle="Doctors, Transfusion Nurses, Lab Technicians & Care Coordinators"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Staff Member</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Full Name</th>
                <th>Designation & Department</th>
                <th>Shift</th>
                <th>Contact</th>
                <th>Monthly Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading staff directory...</td></tr>
              ) : staffList.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>No staff records found.</td></tr>
              ) : (
                staffList.map((s) => (
                  <tr key={s.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{s.staffCode}</strong></td>
                    <td><strong>{s.name}</strong></td>
                    <td>
                      {s.designation}
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{s.department}</small>
                    </td>
                    <td><span className="badge badge-blue">{s.shift} Shift</span></td>
                    <td>
                      <div><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{s.phone}</div>
                      <small style={{ color: 'var(--ink-soft)' }}><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />{s.email}</small>
                    </td>
                    <td><strong>{formatCurrency(s.salary)}</strong></td>
                    <td><span className={`status-pill ${s.status}`}>{s.status}</span></td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Staff Profile' : 'Add Staff Member'}
          size="lg"
        >
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Designation *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Senior Transfusion Nurse"
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
                  placeholder="e.g. Daycare Transfusion"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Salary (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 38000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Shift</label>
                <select
                  className="form-control"
                  value={formData.shift}
                  onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                >
                  <option value="Day">Day Shift (9 AM - 5 PM)</option>
                  <option value="Morning">Morning Shift (7 AM - 3 PM)</option>
                  <option value="Night">Night Shift (9 PM - 7 AM)</option>
                  <option value="Rotational">Rotational</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={submitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Staff Profile'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
