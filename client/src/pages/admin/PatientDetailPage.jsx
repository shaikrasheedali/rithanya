import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Droplet,
  BedDouble,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDate, formatDateTime, getBloodGroupBadgeClass } from '../../utils/formatters';
import CameraConsentModal from '../../components/dpdp/CameraConsentModal';
import Modal from '../../components/common/Modal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isPurgeOpen, setIsPurgeOpen] = useState(false);
  const [purgeReason, setPurgeReason] = useState('Patient exercised Right to be Forgotten under DPDP Act 2023');
  const [purging, setPurging] = useState(false);

  // Add Vitals Modal State
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [vitalsData, setVitalsData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '11:30 AM',
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
  const [savingVitals, setSavingVitals] = useState(false);

  const fetchPatient = async () => {
    try {
      const res = await apiRequest(`/patients/${id}`);
      setPatient(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  // Execute DPDP Right to Erasure
  const handlePurgeData = async () => {
    setPurging(true);
    try {
      await apiRequest(`/patients/${patient.id}/purge`, {
        method: 'DELETE',
        body: JSON.stringify({ reason: purgeReason })
      });
      addToast(`Patient ${patient.name} (${patient.patientCode}) permanently purged under DPDP Act.`, 'success');
      navigate('/admin/patients');
    } catch (err) {
      addToast(err.message || 'Failed to purge patient data', 'error');
      setPurging(false);
    }
  };

  // Add Vitals
  const handleAddVitals = async (e) => {
    e.preventDefault();
    setSavingVitals(true);
    try {
      await apiRequest('/clinical', {
        method: 'POST',
        body: JSON.stringify({
          patientId: patient.id,
          ...vitalsData
        })
      });
      addToast('Clinical vitals recorded successfully', 'success');
      setIsVitalsOpen(false);
      fetchPatient();
    } catch (err) {
      addToast(err.message || 'Failed to record vitals', 'error');
    } finally {
      setSavingVitals(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading EMR Profile...</div>;
  }

  if (!patient) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2>Patient Not Found or Erased</h2>
        <Link to="/admin/patients" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Patients
        </Link>
      </div>
    );
  }

  // Prepare chart data for Blood Sugar & HbA1c
  const readings = patient.clinicalReadings || [];
  const chartLabels = readings.map((r) => formatDate(r.date));
  const fastingData = readings.map((r) => r.bloodSugarFasting || null);
  const ppData = readings.map((r) => r.bloodSugarPP || null);
  const hba1cData = readings.map((r) => r.hba1c || null);
  const hbData = readings.map((r) => r.haemoglobin || null);

  const bloodSugarChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Fasting Glucose (mg/dL)',
        data: fastingData,
        borderColor: '#396bc5',
        backgroundColor: 'rgba(57, 107, 197, 0.1)',
        tension: 0.3
      },
      {
        label: 'Postprandial Glucose (mg/dL)',
        data: ppData,
        borderColor: '#c51d36',
        backgroundColor: 'rgba(197, 29, 54, 0.1)',
        tension: 0.3
      }
    ]
  };

  const hematologyChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Haemoglobin (g/dL)',
        data: hbData,
        borderColor: '#14825f',
        backgroundColor: 'rgba(20, 130, 95, 0.1)',
        tension: 0.3
      },
      {
        label: 'HbA1c (%)',
        data: hba1cData,
        borderColor: '#c27319',
        backgroundColor: 'rgba(194, 115, 25, 0.1)',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title={`Patient EMR: ${patient.name} (${patient.patientCode})`}
        subtitle="Longitudinal Health Tracking, Transfusions & Consent Profile"
        actions={
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsVitalsOpen(true)}
            >
              <Plus size={14} />
              <span>Log Vitals</span>
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setIsPurgeOpen(true)}
              title="Irreversibly erase all patient data under DPDP Act"
            >
              <Trash2 size={14} />
              <span>Right to Erasure (Purge)</span>
            </button>
          </div>
        }
      />

      <div className="admin-content">
        <Link to="/admin/patients" className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }}>
          <ArrowLeft size={14} />
          <span>Back to Patients EMR</span>
        </Link>

        {/* PATIENT PROFILE HEADER CARD */}
        <div className="patient-profile-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 26 }}>{patient.name}</h2>
              <span className={`badge ${getBloodGroupBadgeClass(patient.bloodGroup)}`}>
                {patient.bloodGroup}
              </span>
              <span className={`status-pill ${patient.status}`}>{patient.status}</span>
            </div>

            <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
              <strong>Patient Code:</strong> {patient.patientCode} &nbsp;|&nbsp;
              <strong>Age:</strong> {patient.age} yrs &nbsp;|&nbsp;
              <strong>Gender:</strong> {patient.gender} &nbsp;|&nbsp;
              <strong>Phone:</strong> {patient.phone}
            </p>

            <div style={{ marginTop: 10, fontSize: 13.5 }}>
              <span style={{ color: 'var(--red-700)', fontWeight: 700 }}>Condition:</span> {patient.condition} &nbsp;•&nbsp;
              <span style={{ color: 'var(--ink-soft)' }}>Allergies: {patient.allergies}</span>
            </div>
          </div>

          {/* DPDP DIGITAL CONSENT PHOTO SIGNATURE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'var(--canvas)',
              padding: 16,
              borderRadius: 16,
              border: '1px solid var(--line)',
              minWidth: 200
            }}
          >
            {patient.consentPhotoBlob ? (
              <>
                <div style={{ width: 110, height: 90, borderRadius: 10, overflow: 'hidden', border: '2px solid var(--green)', marginBottom: 8 }}>
                  <img src={patient.consentPhotoBlob} alt="Consent Signature" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="badge badge-green" style={{ fontSize: 11, marginBottom: 6 }}>
                  <ShieldCheck size={12} /> DPDP Consent Verified
                </span>
                <small style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
                  Captured: {formatDate(patient.consentCapturedAt)}
                </small>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 8, fontSize: 11, padding: '4px 8px' }}
                  onClick={() => setIsConsentOpen(true)}
                >
                  <Camera size={12} /> Re-Take Photo
                </button>
              </>
            ) : (
              <>
                <ShieldAlert size={32} style={{ color: 'var(--amber)', marginBottom: 8 }} />
                <span className="badge badge-amber" style={{ fontSize: 11, marginBottom: 8 }}>
                  Consent Missing
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsConsentOpen(true)}
                >
                  <Camera size={14} /> Capture Consent Photo
                </button>
              </>
            )}
          </div>
        </div>

        {/* LONGITUDINAL CHARTS */}
        <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Longitudinal Blood Glucose Trends</h3>
              <span className="badge badge-blue">Fasting vs PP</span>
            </div>
            {readings.length > 0 ? (
              <div style={{ height: 260 }}>
                <Line
                  data={bloodSugarChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                No readings recorded for blood sugar chart yet.
              </div>
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Haemoglobin & Glycated Trajectory</h3>
              <span className="badge badge-green">Hb & HbA1c</span>
            </div>
            {readings.length > 0 ? (
              <div style={{ height: 260 }}>
                <Line
                  data={hematologyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' } }
                  }}
                />
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
                No readings recorded for hematology chart yet.
              </div>
            )}
          </div>
        </div>

        {/* ADMISSIONS & CLINICAL READINGS TABLES */}
        <div className="table-container" style={{ marginBottom: 28 }}>
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>Clinical Vitals History</h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsVitalsOpen(true)}
            >
              <Plus size={14} />
              <span>Record New Vitals</span>
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Fasting (mg/dL)</th>
                <th>PP (mg/dL)</th>
                <th>HbA1c</th>
                <th>Blood Pressure</th>
                <th>Hb (g/dL)</th>
                <th>Ferritin (ng/mL)</th>
                <th>SpO2 / Temp</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {readings.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 30 }}>
                    No vitals recorded yet for this patient.
                  </td>
                </tr>
              ) : (
                readings.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{formatDate(r.date)}</strong>
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>{r.time} ({r.timeSlot})</small>
                    </td>
                    <td>{r.bloodSugarFasting || '—'}</td>
                    <td>{r.bloodSugarPP || '—'}</td>
                    <td>{r.hba1c ? `${r.hba1c}%` : '—'}</td>
                    <td>{r.bpSystolic && r.bpDiastolic ? `${r.bpSystolic}/${r.bpDiastolic}` : '—'}</td>
                    <td>{r.haemoglobin ? `${r.haemoglobin} g/dL` : '—'}</td>
                    <td>{r.ferritin ? `${r.ferritin}` : '—'}</td>
                    <td>{r.spo2 ? `${r.spo2}%` : '—'} / {r.temperature ? `${r.temperature}°F` : '—'}</td>
                    <td style={{ maxWidth: 220, fontSize: 12 }}>{r.notes || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DAYCARE ADMISSIONS TABLE */}
        <div className="table-container">
          <div className="table-toolbar">
            <h3 style={{ fontSize: 16 }}>Daycare & Inpatient Admissions</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Admission Code</th>
                <th>Ward & Bed</th>
                <th>Admitted On</th>
                <th>Discharged On</th>
                <th>Status</th>
                <th>Attending Doctor</th>
                <th>Diagnosis & Summary</th>
              </tr>
            </thead>
            <tbody>
              {(patient.admissions || []).length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 30 }}>
                    No prior admission records.
                  </td>
                </tr>
              ) : (
                patient.admissions.map((adm) => (
                  <tr key={adm.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{adm.admissionCode}</strong></td>
                    <td>{adm.ward} ({adm.bed})</td>
                    <td>{formatDateTime(adm.admittedOn)}</td>
                    <td>{adm.dischargedOn ? formatDateTime(adm.dischargedOn) : 'Currently Inpatient'}</td>
                    <td><span className={`status-pill ${adm.status}`}>{adm.status}</span></td>
                    <td>{adm.attendingDoctor}</td>
                    <td style={{ maxWidth: 260, fontSize: 12 }}>
                      <strong>{adm.diagnosis}</strong>
                      {adm.dischargeSummary && <p style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{adm.dischargeSummary}</p>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DPDP CAMERA CONSENT MODAL */}
        <CameraConsentModal
          isOpen={isConsentOpen}
          patient={patient}
          onClose={() => setIsConsentOpen(false)}
          onConsentRecorded={() => fetchPatient()}
        />

        {/* ADD VITALS MODAL */}
        <Modal
          isOpen={isVitalsOpen}
          onClose={() => setIsVitalsOpen(false)}
          title={`Log Clinical Vitals: ${patient.name}`}
          size="lg"
        >
          <form onSubmit={handleAddVitals}>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={vitalsData.date}
                  onChange={(e) => setVitalsData({ ...vitalsData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={vitalsData.time}
                  onChange={(e) => setVitalsData({ ...vitalsData, time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-control"
                  value={vitalsData.timeSlot}
                  onChange={(e) => setVitalsData({ ...vitalsData, timeSlot: e.target.value })}
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
                  placeholder="e.g. 95"
                  value={vitalsData.bloodSugarFasting}
                  onChange={(e) => setVitalsData({ ...vitalsData, bloodSugarFasting: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postprandial (PP) Glucose</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 140"
                  value={vitalsData.bloodSugarPP}
                  onChange={(e) => setVitalsData({ ...vitalsData, bloodSugarPP: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">HbA1c (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 6.5"
                  value={vitalsData.hba1c}
                  onChange={(e) => setVitalsData({ ...vitalsData, hba1c: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BP Systolic (mmHg)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 120"
                  value={vitalsData.bpSystolic}
                  onChange={(e) => setVitalsData({ ...vitalsData, bpSystolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 80"
                  value={vitalsData.bpDiastolic}
                  onChange={(e) => setVitalsData({ ...vitalsData, bpDiastolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Haemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 8.5"
                  value={vitalsData.haemoglobin}
                  onChange={(e) => setVitalsData({ ...vitalsData, haemoglobin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Serum Ferritin (ng/mL)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="e.g. 1350"
                  value={vitalsData.ferritin}
                  onChange={(e) => setVitalsData({ ...vitalsData, ferritin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SpO2 (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={vitalsData.spo2}
                  onChange={(e) => setVitalsData({ ...vitalsData, spo2: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pulse (bpm)</label>
                <input
                  type="number"
                  className="form-control"
                  value={vitalsData.pulse}
                  onChange={(e) => setVitalsData({ ...vitalsData, pulse: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Notes & Observations</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Transfusion observations, chelation dosage, physician advice..."
                value={vitalsData.notes}
                onChange={(e) => setVitalsData({ ...vitalsData, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsVitalsOpen(false)}
                disabled={savingVitals}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingVitals}
              >
                {savingVitals ? 'Saving Vitals...' : 'Save Clinical Record'}
              </button>
            </div>
          </form>
        </Modal>

        {/* DPDP RIGHT TO ERASURE PURGE CONFIRMATION MODAL */}
        <Modal
          isOpen={isPurgeOpen}
          onClose={() => setIsPurgeOpen(false)}
          title="DPDP Act: Permanently Purge Patient Data"
        >
          <div>
            <div style={{ background: '#ffebee', padding: 18, borderRadius: 12, marginBottom: 20, border: '1px solid #ffcdd2' }}>
              <AlertTriangle size={32} style={{ color: '#d32f2f', marginBottom: 8 }} />
              <h4 style={{ color: '#b71c1c', fontSize: 16 }}>Irreversible Statutory Purge</h4>
              <p style={{ fontSize: 13, color: '#b71c1c', marginTop: 4, lineHeight: 1.5 }}>
                Under Section 12 of the DPDP Act 2023, this action will immediately and permanently delete:
              </p>
              <ul style={{ fontSize: 12.5, color: '#b71c1c', paddingLeft: 20, marginTop: 6, lineHeight: 1.6 }}>
                <li>Patient EMR Record: <strong>{patient.name} ({patient.patientCode})</strong></li>
                <li>All {readings.length} clinical vital records & longitudinal glucose logs</li>
                <li>All {patient.admissions?.length || 0} daycare admission records</li>
                <li>Digital camera photo consent signature and unlinking of all blood inventory logs</li>
              </ul>
            </div>

            <div className="form-group">
              <label className="form-label">Administrative Reason for Erasure</label>
              <input
                type="text"
                className="form-control"
                value={purgeReason}
                onChange={(e) => setPurgeReason(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsPurgeOpen(false)}
                disabled={purging}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handlePurgeData}
                disabled={purging}
              >
                {purging ? 'Purging All Records...' : 'Confirm Permanent Erasure'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
