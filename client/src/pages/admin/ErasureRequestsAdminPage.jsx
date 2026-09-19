import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, UserCheck, Trash2 } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate, formatDateTime } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function ErasureRequestsAdminPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Approve & Purge confirmation modal
  const [approveTarget, setApproveTarget] = useState(null);
  const [adminNotes, setAdminNotes] = useState('Verified patient identity and approved statutory erasure under DPDP Act 2023.');
  const [processing, setProcessing] = useState(false);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('Statutory clinical retention requirement under Medical Council guidelines.');

  const fetchRequests = async () => {
    try {
      const res = await apiRequest('/erasure/requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveAndPurge = async () => {
    if (!approveTarget) return;
    setProcessing(true);
    try {
      const res = await apiRequest(`/erasure/requests/${approveTarget.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ notes: adminNotes })
      });
      addToast(res.message || 'Erasure executed successfully!', 'success');
      setApproveTarget(null);
      fetchRequests();
    } catch (err) {
      addToast(err.message || 'Failed to execute erasure', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setProcessing(true);
    try {
      await apiRequest(`/erasure/requests/${rejectTarget.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ notes: rejectNotes })
      });
      addToast('Erasure request rejected with formal justification', 'info');
      setRejectTarget(null);
      fetchRequests();
    } catch (err) {
      addToast(err.message || 'Failed to reject request', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="DPDP Act 2023: Right to Erasure Requests"
        subtitle="Patient Data Deletion Requests, Statutory DPO Audits & Cascading Purges"
      />

      <div className="admin-content">
        <div style={{ background: 'var(--red-50)', padding: 18, borderRadius: 14, marginBottom: 24, border: '1px solid var(--line)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <ShieldAlert size={28} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'var(--red-900)', fontSize: 15 }}>DPDP Statutory Compliance Dashboard</h4>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
              Patients have submitted formal requests under Section 12 to erase their clinical records and camera consent signatures. Review, verify identity, and execute permanent cascading purges as required by law.
            </p>
          </div>
        </div>

        <div className="table-container">
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>Pending & Processed Erasure Requests</h3>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Total: <strong>{requests.length}</strong> request(s)
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Requested Date</th>
                <th>Patient Name</th>
                <th>Phone Number</th>
                <th>ID Last 4 / Code</th>
                <th>Reason for Request</th>
                <th>Status</th>
                <th>Processed By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading erasure requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>No DPDP erasure requests on file.</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.requestedAt)}</td>
                    <td><strong>{r.patientName}</strong></td>
                    <td>{r.phone}</td>
                    <td>
                      {r.patientCode && <strong style={{ color: 'var(--red-700)' }}>{r.patientCode}</strong>}
                      {r.identifierLast4 && <small style={{ display: 'block', color: 'var(--ink-soft)' }}>ID: ••••{r.identifierLast4}</small>}
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 12 }}>{r.reason}</td>
                    <td>
                      <span className={`status-pill ${r.status === 'completed' ? 'discharged' : r.status === 'rejected' ? 'pending' : 'admitted'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {r.processedBy ? (
                        <>
                          <strong>{r.processedBy}</strong>
                          <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{formatDate(r.processedAt)}</small>
                        </>
                      ) : '—'}
                    </td>
                    <td>
                      {r.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => setApproveTarget(r)}
                            title="Approve and permanently purge all patient data"
                          >
                            <Trash2 size={13} />
                            <span>Approve & Purge</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setRejectTarget(r)}
                            title="Reject request with justification"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{r.notes || 'Processed'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* APPROVE & PURGE CONFIRMATION MODAL */}
        <Modal
          isOpen={!!approveTarget}
          onClose={() => setApproveTarget(null)}
          title="Approve & Execute DPDP Data Erasure"
        >
          {approveTarget && (
            <div>
              <div style={{ background: '#ffebee', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid #ffcdd2' }}>
                <AlertTriangle size={28} style={{ color: '#d32f2f', marginBottom: 8 }} />
                <h4 style={{ color: '#b71c1c', fontSize: 15 }}>Confirm Permanent Data Deletion</h4>
                <p style={{ fontSize: 13, color: '#b71c1c', marginTop: 4, lineHeight: 1.5 }}>
                  This will locate and cascade delete all records matching <strong>{approveTarget.patientName}</strong> (Phone: {approveTarget.phone}), including vitals, daycare admissions, appointments, and camera photo consent signatures.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">DPO Audit Verification Notes</label>
                <input
                  type="text"
                  className="form-control"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setApproveTarget(null)} disabled={processing}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleApproveAndPurge} disabled={processing}>
                  {processing ? 'Executing Purge...' : 'Confirm Cascading Purge (DPDP)'}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* REJECT MODAL */}
        <Modal
          isOpen={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
          title="Reject Data Erasure Request"
        >
          {rejectTarget && (
            <div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
                Under the DPDP Act, legitimate clinical, medico-legal, or statutory reasons must be documented if an erasure request is refused.
              </p>

              <div className="form-group">
                <label className="form-label">Statutory Refusal Justification</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rejectNotes}
                  onChange={(e) => setRejectNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setRejectTarget(null)} disabled={processing}>
                  Cancel
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleReject} disabled={processing}>
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
