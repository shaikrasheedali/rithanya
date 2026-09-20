import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Camera, ArrowRight, ShieldCheck, UserCheck, BedDouble } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import CameraConsentModal from '../../components/dpdp/CameraConsentModal';
import { getBloodGroupBadgeClass } from '../../utils/formatters';

export default function PatientsPage() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Convert to In-Patient Modal
  const [convertTarget, setConvertTarget] = useState(null);
  const [convertData, setConvertData] = useState({
    ward: 'Daycare Transfusion Ward',
    bed: 'Bed-01',
    attendingDoctor: 'Dr. Narayana Murthy, MD',
    diagnosis: ''
  });
  const [converting, setConverting] = useState(false);

  // Register Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '',
    condition: 'Beta Thalassemia Major',
    allergies: 'None reported',
    status: 'outpatient'
  });
  const [submitting, setSubmitting] = useState(false);

  // Camera Consent Modal for newly registered patient
  const [consentModalPatient, setConsentModalPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (bloodGroupFilter) params.append('bloodGroup', bloodGroupFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await apiRequest(`/patients?${params.toString()}`);
      setPatients(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, bloodGroupFilter, statusFilter]);

  // Check URL query action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsRegisterOpen(true);
    }
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone) {
      addToast('Name, Age, and Phone are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      addToast(`Patient ${res.data.name} (${res.data.patientCode}) registered successfully!`, 'success');
      setIsRegisterOpen(false);
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '',
        condition: 'Beta Thalassemia Major',
        allergies: 'None reported',
        status: 'outpatient'
      });
      fetchPatients();

      // Offer immediate DPDP camera consent photo click
      setConsentModalPatient(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to register patient', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openConvertModal = (patient) => {
    setConvertTarget(patient);
    setConvertData({
      ward: 'Daycare Transfusion Ward',
      bed: `Bed-${Math.floor(Math.random() * 10) + 1}`,
      attendingDoctor: 'Dr. Narayana Murthy, MD',
      diagnosis: patient.condition || 'Admitted for Daycare Observation & Treatment'
    });
  };

  const handleConvertToInpatient = async (e) => {
    e.preventDefault();
    if (!convertTarget) return;
    setConverting(true);
    try {
      const res = await apiRequest(`/patients/${convertTarget.id}/convert-to-inpatient`, {
        method: 'POST',
        body: JSON.stringify(convertData)
      });
      addToast(res.message || `Patient ${convertTarget.name} converted to In-Patient!`, 'success');
      setConvertTarget(null);
      fetchPatients();
    } catch (err) {
      addToast(err.message || 'Failed to convert to In-Patient', 'error');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Electronic Medical Records (EMR) Patients"
        subtitle="Comprehensive Patient Profiles, Longitudinal Records & DPDP Consent"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsRegisterOpen(true)}
          >
            <Plus size={16} />
            <span>Register New Patient</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 260 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, code, phone..."
                  style={{ paddingLeft: 36 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="form-control"
                style={{ width: 140 }}
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
              >
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                className="form-control"
                style={{ width: 140 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="admitted">Admitted (Daycare)</option>
                <option value="outpatient">Outpatient</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Showing <strong>{patients.length}</strong> patient records
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Code</th>
                <th>Full Name</th>
                <th>Age / Gender</th>
                <th>Blood Group</th>
                <th>Primary Condition</th>
                <th>Phone</th>
                <th>Status</th>
                <th>DPDP Consent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 40 }}>
                    Loading EMR patient records...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 40 }}>
                    No patient records found.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: 'var(--red-700)' }}>{p.patientCode}</strong>
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>{p.age} yrs / {p.gender}</td>
                    <td>
                      <span className={`badge ${getBloodGroupBadgeClass(p.bloodGroup)}`}>
                        {p.bloodGroup}
                      </span>
                    </td>
                    <td>{p.condition}</td>
                    <td>{p.phone}</td>
                    <td>
                      <span className={`status-pill ${p.status}`}>{p.status}</span>
                    </td>
                    <td>
                      {p.consentPhotoBlob ? (
                        <span
                          className="badge badge-green"
                          title="Verified camera photo consent recorded in database"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setConsentModalPatient(p)}
                        >
                          <ShieldCheck size={12} /> Consent OK
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => setConsentModalPatient(p)}
                        >
                          <Camera size={12} /> Click Photo
                        </button>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {p.status !== 'admitted' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '4px 8px', fontSize: 12 }}
                            onClick={() => openConvertModal(p)}
                            title="Convert Out-Patient to In-Patient Admission"
                          >
                            <BedDouble size={13} />
                            <span>Admit IP</span>
                          </button>
                        )}
                        <Link to={`/admin/patients/${p.id}`} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: 12 }}>
                          <span>Profile</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* REGISTER PATIENT MODAL */}
        <Modal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          title="Register New EMR Patient"
          size="lg"
        >
          <form onSubmit={handleRegister}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. S. Venkateswarlu"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="e.g. +91 98480 11223"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 28"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-control"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="outpatient">Outpatient</option>
                  <option value="admitted">Admitted to Daycare</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Condition / Diagnosis</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Beta Thalassemia Major, Type 2 Diabetes"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reported Allergies</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Penicillin allergy, None reported"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRegisterOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Complete Patient Registration'}
              </button>
            </div>
          </form>
        </Modal>

        {/* CONVERT TO INPATIENT MODAL */}
        <Modal
          isOpen={!!convertTarget}
          onClose={() => setConvertTarget(null)}
          title={`Admit Out-Patient as In-Patient: ${convertTarget?.name} (${convertTarget?.patientCode})`}
        >
          {convertTarget && (
            <form onSubmit={handleConvertToInpatient}>
              <div
                style={{
                  padding: '12px 14px',
                  background: 'var(--canvas-warm, #f8f9fa)',
                  borderRadius: 8,
                  marginBottom: 16
                }}
              >
                <div style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span>
                    <strong>Patient:</strong> {convertTarget.name} ({convertTarget.age} yrs)
                  </span>
                  <span className={`badge ${getBloodGroupBadgeClass(convertTarget.bloodGroup)}`}>
                    {convertTarget.bloodGroup}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  Condition: {convertTarget.condition || 'General'} · Phone: {convertTarget.phone}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ward / Department *</label>
                <select
                  className="form-control"
                  value={convertData.ward}
                  onChange={(e) => setConvertData({ ...convertData, ward: e.target.value })}
                  required
                >
                  <option value="Daycare Transfusion Ward">Daycare Transfusion Ward (Main)</option>
                  <option value="Pediatric Daycare Ward">Pediatric Daycare Ward</option>
                  <option value="Diabetic Care & Observation Suite">Diabetic Care & Observation Suite</option>
                  <option value="High Dependency Unit (HDU)">High Dependency Unit (HDU)</option>
                  <option value="General Medical Inpatient Ward">General Medical Inpatient Ward</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bed Number / Bay *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bed-04, Bay-B"
                  value={convertData.bed}
                  onChange={(e) => setConvertData({ ...convertData, bed: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attending Doctor *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Narayana Murthy, MD"
                  value={convertData.attendingDoctor}
                  onChange={(e) => setConvertData({ ...convertData, attendingDoctor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admission Diagnosis / Protocol *</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Acute anemia requiring packed red blood cell transfusion"
                  value={convertData.diagnosis}
                  onChange={(e) => setConvertData({ ...convertData, diagnosis: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setConvertTarget(null)}
                  disabled={converting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={converting}>
                  {converting ? 'Admitting...' : 'Confirm Admission'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* DPDP CAMERA CONSENT CAPTURE MODAL */}
        <CameraConsentModal
          isOpen={!!consentModalPatient}
          patient={consentModalPatient}
          onClose={() => setConsentModalPatient(null)}
          onConsentRecorded={() => fetchPatients()}
        />
      </div>
    </div>
  );
}
