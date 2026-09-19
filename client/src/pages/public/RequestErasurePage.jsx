import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, FileText, AlertTriangle } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function RequestErasurePage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    identifierLast4: '',
    patientCode: '',
    reason: '',
    confirmed: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.phone || !form.reason) {
      addToast('Please enter Patient Name, Phone Number, and Reason', 'error');
      return;
    }
    if (!form.confirmed) {
      addToast('Please check the confirmation box acknowledging permanent erasure.', 'error');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/erasure/request', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setSubmitted(true);
      addToast('Your Right to Erasure request was successfully submitted to our DPO.', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to submit erasure request', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-erasure-page" style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="section-head">
          <span className="section-tag" style={{ color: '#d32f2f' }}>
            <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            DPDP Act 2023 Compliance
          </span>
          <h1 className="section-title">Request Data Erasure ("Right to be Forgotten")</h1>
          <p className="section-subtitle">
            Under Section 12 of the Digital Personal Data Protection (DPDP) Act 2023 of the Government of India, patients and legal guardians have the fundamental right to request complete erasure of their personal healthcare records and digital consent signatures.
          </p>
        </div>

        {submitted ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--green-bg)', border: '1px solid #c3ecd9' }}>
            <CheckCircle2 size={54} style={{ color: 'var(--green)', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 24, color: 'var(--green)', marginBottom: 12 }}>Erasure Request Lodged Successfully</h2>
            <p style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.7, marginBottom: 20 }}>
              Your formal request to erase clinical data, longitudinal vital readings, and digital camera consent signatures for <strong>{form.patientName}</strong> has been transmitted to our Data Protection Officer (DPO) and Senior Clinical Administration.
            </p>
            <div style={{ background: '#fff', padding: 18, borderRadius: 12, textAlign: 'left', fontSize: 13, color: 'var(--ink-soft)' }}>
              <p><strong>Next Steps:</strong></p>
              <ul style={{ paddingLeft: 20, marginTop: 6, lineHeight: 1.6 }}>
                <li>Our clinical records officer will verify your identity via phone confirmation within 72 hours.</li>
                <li>Upon administrative approval, all diagnostic logs, admission summaries, and digital photos are permanently unlinked and cascaded from our database.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 40, border: '1px solid var(--line)' }}>
            <div style={{ background: 'var(--red-50)', padding: 16, borderRadius: 12, marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
              <AlertTriangle size={24} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: 'var(--red-900)', lineHeight: 1.5, margin: 0 }}>
                <strong>Important Notice:</strong> Once approved, data erasure is irreversible. All prior HbA1c histories, blood transfusion logs, and doctor evaluations will be permanently purged from Rithanya Hospital's systems.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Patient Full Name (as in hospital records) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rahul Varma"
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Registered Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +91 98481 22334"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Last 4 Digits of Aadhaar or National ID (Verification)</label>
                  <input
                    type="text"
                    maxLength="4"
                    className="form-control"
                    placeholder="e.g. 8421"
                    value={form.identifierLast4}
                    onChange={(e) => setForm({ ...form, identifierLast4: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hospital Patient Code (if known, e.g. RH-P24017)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. RH-P24017"
                    value={form.patientCode}
                    onChange={(e) => setForm({ ...form, patientCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Requesting Data Erasure *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Please state why you are requesting erasure (e.g. Relocated out of state, Revocation of consent for daycare records, Exercise of statutory DPDP rights)..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 16 }}>
                <input
                  type="checkbox"
                  id="confirm-erasure"
                  style={{ marginTop: 4, width: 16, height: 16 }}
                  checked={form.confirmed}
                  onChange={(e) => setForm({ ...form, confirmed: e.target.checked })}
                  required
                />
                <label htmlFor="confirm-erasure" style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  I confirm that I am the patient or authorized legal guardian, and I understand that submitting this request will permanently remove my medical records and digital photo consent signature from the hospital database upon verification.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-danger btn-lg"
                style={{ width: '100%', marginTop: 24 }}
                disabled={loading}
              >
                <ShieldAlert size={18} />
                <span>{loading ? 'Submitting Request...' : 'Submit Data Erasure Request (DPDP Act)'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
