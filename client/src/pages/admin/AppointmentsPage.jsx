import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Printer, Eye, Search } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function AppointmentsPage() {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Receipt Modal State
  const [receiptTarget, setReceiptTarget] = useState(null);

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await apiRequest(`/appointments?${params.toString()}`);
      setAppointments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      addToast(`Appointment status changed to ${status}`, 'success');
      fetchAppointments();
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Appointments & OPD Token Management"
        subtitle="Review Public Bookings, Confirm Tokens & Print Official Receipts"
      />

      <div className="admin-content">
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: 260 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search patient, phone, code..."
                  style={{ paddingLeft: 36 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: 160 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Total: <strong>{appointments.length}</strong> appointments
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Appt Code</th>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Preferred Date</th>
                <th>Time Slot</th>
                <th>Department / Specialty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>No appointments found.</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{apt.apptCode}</strong></td>
                    <td>
                      <strong>{apt.patientName}</strong>
                      {apt.age && <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{apt.age} yrs / {apt.gender}</small>}
                    </td>
                    <td>{apt.phone}</td>
                    <td>{formatDate(apt.preferredDate)}</td>
                    <td>{apt.preferredTimeSlot}</td>
                    <td>{apt.specialty}</td>
                    <td><span className={`status-pill ${apt.status}`}>{apt.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setReceiptTarget(apt)}
                          title="Print Receipt"
                        >
                          <Printer size={13} />
                        </button>
                        {apt.status === 'pending' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--green)' }}
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#d32f2f' }}
                            onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PRINTABLE RECEIPT MODAL */}
        <Modal
          isOpen={!!receiptTarget}
          onClose={() => setReceiptTarget(null)}
          title={`Appointment Receipt: ${receiptTarget?.apptCode}`}
        >
          {receiptTarget && (
            <div>
              <div
                style={{
                  border: '2px dashed var(--line)',
                  padding: 24,
                  borderRadius: 14,
                  background: 'var(--canvas)',
                  marginBottom: 20
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
                  <h3 style={{ fontSize: 18, color: 'var(--red-900)' }}>RITHANYA HOSPITAL & DIAGNOSTICS</h3>
                  <p style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                    Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana 507001
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Phone: +91 83285 81019</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <span><strong>Receipt / Token:</strong> {receiptTarget.apptCode}</span>
                  <span><strong>Date:</strong> {formatDate(receiptTarget.preferredDate)}</span>
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                  <p><strong>Patient Name:</strong> {receiptTarget.patientName}</p>
                  <p><strong>Phone:</strong> {receiptTarget.phone}</p>
                  <p><strong>Specialty:</strong> {receiptTarget.specialty}</p>
                  <p><strong>Attending Doctor:</strong> {receiptTarget.doctorName}</p>
                  <p><strong>Time Slot:</strong> {receiptTarget.preferredTimeSlot}</p>
                  <p><strong>Status:</strong> <span className={`status-pill ${receiptTarget.status}`}>{receiptTarget.status}</span></p>
                </div>

                {receiptTarget.reason && (
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 8 }}>
                    <strong>Clinical Note:</strong> {receiptTarget.reason}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setReceiptTarget(null)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
