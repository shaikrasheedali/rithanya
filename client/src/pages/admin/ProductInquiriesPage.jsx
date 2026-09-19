import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Trash2, Phone, Mail } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

export default function ProductInquiriesPage() {
  const { addToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const res = await apiRequest('/inquiries');
      setInquiries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiRequest(`/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      addToast(`Inquiry marked as ${status}`, 'success');
      fetchInquiries();
    } catch (err) {
      addToast(err.message || 'Failed to update', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await apiRequest(`/inquiries/${id}`, { method: 'DELETE' });
      addToast('Inquiry removed', 'success');
      fetchInquiries();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Package & Healthcare Inquiries"
        subtitle="Patient Leads, Diagnostic Inquiries & Follow-up Workflows"
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient / Inquirer</th>
                <th>Package Inquired</th>
                <th>Phone & Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>Loading inquiries...</td></tr>
              ) : inquiries.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>No customer inquiries received yet.</td></tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>{formatDate(inq.createdAt)}</td>
                    <td><strong>{inq.name}</strong></td>
                    <td><span className="badge badge-blue">{inq.packageName}</span></td>
                    <td>
                      <div><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{inq.phone}</div>
                      {inq.email && <small style={{ color: 'var(--ink-soft)' }}><Mail size={12} style={{ display: 'inline', marginRight: 4 }} />{inq.email}</small>}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 12 }}>{inq.message || '—'}</td>
                    <td>
                      <span className={`status-pill ${inq.status}`}>{inq.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {inq.status === 'new' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUpdateStatus(inq.id, 'contacted')}
                          >
                            Mark Contacted
                          </button>
                        )}
                        {inq.status !== 'converted' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateStatus(inq.id, 'converted')}
                          >
                            Converted
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#d32f2f' }}
                          onClick={() => handleDelete(inq.id)}
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
      </div>
    </div>
  );
}
