import React, { useState, useEffect } from 'react';
import { Plus, BedDouble, CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import { formatDateTime } from '../../utils/formatters';
import Modal from '../../components/common/Modal';

export default function AdmissionsPage() {
  const { addToast } = useToast();
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('admitted');

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    ward: 'Daycare Transfusion Ward',
    bed: 'Bed-01',
    attendingDoctor: 'Dr. Narayana Murthy, MD',
    diagnosis: 'Routine Daycare Transfusion for Beta Thalassemia Major'
  });
  const [submitting, setSubmitting] = useState(false);

  // Discharge modal state
  const [dischargeTarget, setDischargeTarget] = useState(null);
  const [dischargeSummary, setDischargeSummary] = useState('Transfusion completed uneventfully. Vitals stable. Advised home chelation.');
  const [discharging, setDischarging] = useState(false);

  const fetchData = async () => {
    try {
      const [admRes, patientsRes] = await Promise.all([
        apiRequest(`/admissions?status=${statusFilter}`),
        apiRequest('/patients')
      ]);
      setAdmissions(admRes.data || []);
      setPatients(patientsRes.data || []);
      if (patientsRes.data?.length > 0 && !formData.patientId) {
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
  }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.diagnosis) {
      addToast('Please select a patient and diagnosis', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/admissions', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      addToast('Patient admitted to Daycare Ward successfully!', 'success');
      setIsOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to admit patient', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async () => {
    if (!dischargeTarget) return;
    setDischarging(true);
    try {
      await apiRequest(`/admissions/${dischargeTarget.id}/discharge`, {
        method: 'PUT',
        body: JSON.stringify({ dischargeSummary })
      });
      addToast(`Patient discharged successfully.`, 'success');
      setDischargeTarget(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Failed to discharge patient', 'error');
    } finally {
      setDischarging(false);
    }
  };

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Daycare Transfusion & Inpatient Admissions"
        subtitle="Bed Allocations, Patient Intake & Clinical Discharge Summaries"
        actions={
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={16} />
            <span>Admit to Daycare</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'admitted' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('admitted')}
              >
                Active Inpatients ({admissions.filter((a) => a.status === 'admitted').length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'discharged' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter('discharged')}
              >
                Discharged History
              </button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Patient Name</th>
                <th>Ward & Bed</th>
                <th>Admitted On</th>
                <th>Discharged On</th>
                <th>Attending Doctor</th>
                <th>Diagnosis & Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading admissions...</td></tr>
              ) : admissions.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>No {statusFilter} records found.</td></tr>
              ) : (
                admissions.map((adm) => (
                  <tr key={adm.id}>
                    <td><strong style={{ color: 'var(--red-700)' }}>{adm.admissionCode}</strong></td>
                    <td>
                      <strong>{adm.patient?.name}</strong>
                      <small style={{ display: 'block', color: 'var(--ink-soft)' }}>
                        {adm.patient?.patientCode} · {adm.patient?.bloodGroup}
                      </small>
                    </td>
                    <td>{adm.ward} <span className="badge badge-red">{adm.bed}</span></td>
                    <td>{formatDateTime(adm.admittedOn)}</td>
                    <td>{adm.dischargedOn ? formatDateTime(adm.dischargedOn) : '— Active —'}</td>
                    <td>{adm.attendingDoctor}</td>
                    <td style={{ maxWidth: 240, fontSize: 12 }}>
                      <strong>{adm.diagnosis}</strong>
                      {adm.dischargeSummary && <p style={{ color: 'var(--ink-soft)', marginTop: 2 }}>{adm.dischargeSummary}</p>}
                    </td>
                    <td>
                      {adm.status === 'admitted' ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setDischargeTarget(adm)}
                        >
                          Discharge Patient
                        </button>
                      ) : (
                        <span className="badge badge-green">Discharged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ADMISSION MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Daycare Transfusion Bed Intake"
        >
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Select Registered Patient *</label>
              <select
                className="form-control"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} · {p.bloodGroup} · {p.condition})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Ward</label>
                <select
                  className="form-control"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                >
                  <option value="Daycare Transfusion Ward">Daycare Transfusion Ward</option>
                  <option value="Diabetic Observation Suite">Diabetic Observation Suite</option>
                  <option value="Pediatric Daycare Unit">Pediatric Daycare Unit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bed Allocation</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.bed}
                  onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                  placeholder="e.g. Bed-03"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Attending Doctor</label>
              <input
                type="text"
                className="form-control"
                value={formData.attendingDoctor}
                onChange={(e) => setFormData({ ...formData, attendingDoctor: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admission Diagnosis & Procedure Details *</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Admitting...' : 'Confirm Daycare Admission'}
              </button>
            </div>
          </form>
        </Modal>

        {/* DISCHARGE MODAL */}
        <Modal
          isOpen={!!dischargeTarget}
          onClose={() => setDischargeTarget(null)}
          title={`Discharge Patient: ${dischargeTarget?.patient?.name}`}
        >
          <div>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Complete the discharge summary and instructions for home care / oral iron chelation.
            </p>

            <div className="form-group">
              <label className="form-label">Discharge Summary & Medical Advice</label>
              <textarea
                className="form-control"
                rows="4"
                value={dischargeSummary}
                onChange={(e) => setDischargeSummary(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDischargeTarget(null)}
                disabled={discharging}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDischarge}
                disabled={discharging}
              >
                {discharging ? 'Discharging...' : 'Confirm Patient Discharge'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
