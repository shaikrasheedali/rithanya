import React from 'react';

export default function TermsPage() {
  return (
    <div className="terms-page" style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <span className="badge badge-red" style={{ marginBottom: 12 }}>Hospital Governance</span>
        <h1 style={{ fontSize: 36, marginBottom: 20 }}>Terms of Clinical Service</h1>

        <div className="card" style={{ padding: 36, lineHeight: 1.8, fontSize: 14.5, color: '#333' }}>
          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>1. Outpatient Consultations</h3>
          <p style={{ marginBottom: 20 }}>
            OPD tokens and online bookings are prioritized according to scheduled time slots and emergency clinical triages. Consultation records remain part of the patient's longitudinal EMR profile.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>2. Day-Care Transfusion Centre Guidelines</h3>
          <p style={{ marginBottom: 20 }}>
            Blood units issued at Rithanya Hospital undergo pre-transfusion ABO and Rh(D) cross-matching. Patients must bring previous transfusion logs and recent complete blood counts when reporting for transfusion appointments.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>3. Diagnostic Accuracy & Re-tests</h3>
          <p style={{ marginBottom: 20 }}>
            All laboratory tests are conducted using internal calibrated quality controls. Routine fasting guidelines must be observed for accurate metabolic evaluations.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>4. Emergency Care</h3>
          <p>
            For acute life-threatening situations, emergency staff are available 24/7. Walk-in emergencies are accommodated without appointment delays.
          </p>
        </div>
      </div>
    </div>
  );
}
