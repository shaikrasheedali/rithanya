import React, { useState, useEffect } from 'react';
import { Plus, Search, Stethoscope, Trash2, Calendar, User } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function ClinicalLogsPage() {
  const { addToast } = useToast();
  const [readings, setReadings] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    timeSlot: 'Morning',
    bloodSugarFasting: '',
    bloodSugarPP: '',
    hba1c: '',
    bpSystolic: '',
    bpDiastolic: '',
    haemoglobin: '',
    ferritin: '',
    spo2: '99',
    temperature: '98.4',
    pulse: '76',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [readingsRes, patientsRes] = await Promise.all([
        apiRequest('/clinical'),
        apiRequest('/patients')
      ]);
      setReadings(readingsRes.data || []);
      setPatients(patientsRes.data || []);
      if (patientsRes.data && patientsRes.data.length > 0 && !formData.patientId) {
        setFormData((prev) => ({ ...prev, patientId: patientsRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      addToast('Please select a patient', 'error');
      return;
    }
    setSaving(true);
    try {
      await apiRequest('/clinical', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      addToast('Clinical vital readings saved successfully!', 'success');
      setIsOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to save reading', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this clinical reading record?')) return;
    try {
      await apiRequest(`/clinical/${id}`, { method: 'DELETE' });
      addToast('Clinical reading removed', 'success');
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to delete reading', 'error');
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Universal Clinical Vitals & Lab Logger"
        subtitle="Record, Track and Review Blood Sugar, HbA1c, Ferritin & Organ Parameters"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} />
            <span>Log Patient Vitals</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>Clinical Vitals Logbook</h3>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Total Records: <strong>{readings.length}</strong>
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Fasting / PP Glucose</th>
                <th>HbA1c</th>
                <th>Blood Pressure</th>
                <th>Haemoglobin</th>
                <th>Serum Ferritin</th>
                <th>SpO2 / Pulse</th>
                <th>Recorded By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" style={{ textAlign: 'center', padding: 40 }}>Loading clinical logs...</td></tr>
              ) : readings.length === 0 ? (
                <tr><td colSpan="10" style={{ textAlign: 'center', padding: 40 }}>No clinical records recorded yet.</td></tr>
              ) : (
                readings.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.patient?.name}</strong>
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{r.patient?.patientCode}</small>
                    </td>
                    <td>
                      {formatDate(r.date)}
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{r.time} ({r.timeSlot})</small>
                    </td>
                    <td>
                      {r.bloodSugarFasting ? `F: ${r.bloodSugarFasting}` : ''}{' '}
                      {r.bloodSugarPP ? `| PP: ${r.bloodSugarPP}` : ''}
                      {!r.bloodSugarFasting && !r.bloodSugarPP ? '—' : ' mg/dL'}
                    </td>
                    <td>{r.hba1c ? <strong>{r.hba1c}%</strong> : '—'}</td>
                    <td>{r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : '—'}</td>
                    <td>{r.haemoglobin ? `${r.haemoglobin} g/dL` : '—'}</td>
                    <td>{r.ferritin ? `${r.ferritin} ng/mL` : '—'}</td>
                    <td>{r.spo2 ? `${r.spo2}%` : '—'} / {r.pulse ? `${r.pulse} bpm` : '—'}</td>
                    <td>{r.recordedBy}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#d32f2f' }}
                        onClick={() => handleDelete(r.id)}
                        title="Delete reading"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* LOG VITALS MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Record Universal Clinical Vitals"
          size="lg"
        >
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Select Patient *</label>
              <select
                className="form-control"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} - {p.condition} - {p.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-control"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 98"
                  value={formData.bloodSugarFasting}
                  onChange={(e) => setFormData({ ...formData, bloodSugarFasting: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postprandial (PP) Glucose</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 142"
                  value={formData.bloodSugarPP}
                  onChange={(e) => setFormData({ ...formData, bloodSugarPP: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 6.8"
                  value={formData.hba1c}
                  onChange={(e) => setFormData({ ...formData, hba1c: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BP Systolic</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 120"
                  value={formData.bpSystolic}
                  onChange={(e) => setFormData({ ...formData, bpSystolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BP Diastolic</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 80"
                  value={formData.bpDiastolic}
                  onChange={(e) => setFormData({ ...formData, bpDiastolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Haemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 9.2"
                  value={formData.haemoglobin}
                  onChange={(e) => setFormData({ ...formData, haemoglobin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Serum Ferritin (ng/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 1380"
                  value={formData.ferritin}
                  onChange={(e) => setFormData({ ...formData, ferritin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SpO2 (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pulse (bpm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.pulse}
                  onChange={(e) => setFormData({ ...formData, pulse: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Notes</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Prescription modifications, transfusion notes, dietary directives..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Recording...' : 'Record Clinical Vitals'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
