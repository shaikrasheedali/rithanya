import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Eye, Search } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';

export default function AppointmentsPage() {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

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
        title="Appointments (OPD) & Token Management"
        subtitle="Review Public Bookings, Confirm Tokens & Coordinate Physician Schedules"
      />

      <div className="admin-content">
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flexGrow: 1 }}>
              <div style={{ position: 'relative', minWidth: 240 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 34 }}
                  placeholder="Search token code, patient name, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed / Token Issued</option>
                <option value="completed">Consultation Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Token Code</th>
                <th>Patient Details</th>
                <th>Preferred Date</th>
                <th>Time Slot</th>
                <th>Department / Specialty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30 }}>Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30 }}>No appointment records found.</td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <strong style={{ color: 'var(--red-700)', letterSpacing: '0.04em' }}>{apt.apptCode}</strong>
                    </td>
                    <td>
                      <strong>{apt.patientName}</strong>
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{apt.phone}</small>
                    </td>
                    <td>{formatDate(apt.preferredDate)}</td>
                    <td>{apt.preferredTimeSlot}</td>
                    <td>{apt.specialty}</td>
                    <td><span className={`status-pill ${apt.status}`}>{apt.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
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
      </div>
    </div>
  );
}
