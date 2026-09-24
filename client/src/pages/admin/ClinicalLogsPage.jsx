import React, { useState, useEffect } from 'react';
import { Plus, Search, Stethoscope, Trash2, Calendar, User } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate } from '../../utils/formatters';
import { validateClinicalVitals } from '../../utils/vitalsHelper';
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
    const validation = validateClinicalVitals(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast(firstError, 'error');
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
              {/* 1. Date */}
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              {/* 2. Time */}
              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10:00 AM"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>

              {/* 3. Time Slot */}
              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-control"
                  value={formData.timeSlot}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: e.target.value }))}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              {/* 4. Haemoglobin (g/dL) - FIRST IMMEDIATE VITAL AFTER SLOT */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--red-700)', fontWeight: 700 }}>
                  Haemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="25"
                  className="form-control"
                  placeholder="e.g. 9.2 (Ref: 11.5-17.5)"
                  value={formData.haemoglobin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, haemoglobin: e.target.value }))}
                />
              </div>

              {/* 5. SpO2 (%) - SECOND IMMEDIATE VITAL */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  className="form-control"
                  placeholder="e.g. 99 (Ref: 95-100)"
                  value={formData.spo2}
                  onChange={(e) => setFormData((prev) => ({ ...prev, spo2: e.target.value }))}
                />
              </div>

              {/* 6. Pulse (bpm) - THIRD IMMEDIATE VITAL */}
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Pulse (bpm)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  className="form-control"
                  placeholder="e.g. 76 (Ref: 60-100)"
                  value={formData.pulse}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pulse: e.target.value }))}
                />
              </div>

              {/* 7. Fasting Glucose (mg/dL) */}
              <div className="form-group">
                <label className="form-label">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="1000"
                  className="form-control"
                  placeholder="e.g. 98 (Ref: 70-100)"
                  value={formData.bloodSugarFasting}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bloodSugarFasting: e.target.value }))}
                />
              </div>

              {/* 8. Postprandial Glucose (mg/dL) */}
              <div className="form-group">
                <label className="form-label">Postprandial (PP) Glucose</label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="1000"
                  className="form-control"
                  placeholder="e.g. 142 (Ref: <140)"
                  value={formData.bloodSugarPP}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bloodSugarPP: e.target.value }))}
                />
              </div>

              {/* 9. HbA1c (%) */}
              <div className="form-group">
                <label className="form-label">HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="25"
                  className="form-control"
                  placeholder="e.g. 6.8 (Ref: 4.0-5.6)"
                  value={formData.hba1c}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hba1c: e.target.value }))}
                />
              </div>

              {/* 10. BP Systolic */}
              <div className="form-group">
                <label className="form-label">BP Systolic (mmHg)</label>
                <input
                  type="number"
                  min="40"
                  max="350"
                  className="form-control"
                  placeholder="e.g. 120"
                  value={formData.bpSystolic}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bpSystolic: e.target.value }))}
                />
              </div>

              {/* 11. BP Diastolic */}
              <div className="form-group">
                <label className="form-label">BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  min="20"
                  max="250"
                  className="form-control"
                  placeholder="e.g. 80"
                  value={formData.bpDiastolic}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bpDiastolic: e.target.value }))}
                />
              </div>

              {/* 12. Serum Ferritin */}
              <div className="form-group">
                <label className="form-label">Serum Ferritin (ng/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50000"
                  className="form-control"
                  placeholder="e.g. 1380 (Ref: 20-300)"
                  value={formData.ferritin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ferritin: e.target.value }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
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
