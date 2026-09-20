import React from 'react';
import { ShieldCheck, Lock, FileCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="privacy-page" style={{ padding: '60px 0 80px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <span className="badge badge-red" style={{ marginBottom: 12 }}>Compliance Notice</span>
        <h1 style={{ fontSize: 36, marginBottom: 20 }}>Privacy Policy & DPDP Act 2023 Notice</h1>

        <div className="card" style={{ padding: 36, lineHeight: 1.8, fontSize: 14.5, color: '#333' }}>
          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>1. Data Fiduciary Identity</h3>
          <p style={{ marginBottom: 20 }}>
            Rithanya Hospital & Diagnostics, located at Wyra Road, Khammam, Telangana, operates as a healthcare data fiduciary in compliance with the Digital Personal Data Protection Act (DPDP Act) 2023 of the Republic of India.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>2. Purpose of Clinical Data Collection</h3>
          <p style={{ marginBottom: 20 }}>
            Personal and health data (including patient names, ages, contact numbers, blood groups, diagnostic parameters, HbA1c logs, and digital camera consent signatures) are collected strictly for outpatient consultation, emergency differential diagnosis, and thalassemia day-care transfusion cross-matching.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>3. Digital Biometric Consent via Camera</h3>
          <p style={{ marginBottom: 20 }}>
            In alignment with Section 6 of the DPDP Act, verified digital consent is captured on-site via authorized staff devices through live camera photographs. This digital signature is stored securely in encrypted MySQL databases for audit integrity and patient identification.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>4. Right to Erasure ("Right to be Forgotten")</h3>
          <p style={{ marginBottom: 20 }}>
            Under Section 12 of the Act, any patient or their designated guardian may exercise their Right to Erasure. You can submit an erasure request at any time through our website footer link at <strong>/request-erasure</strong>.
          </p>

          <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>5. Data Protection Officer (DPO) Contact</h3>
          <p>
            For any inquiries, grievance redressals, or data queries, contact our Data Protection Officer at: <strong>dpo@rithanyahospital.com</strong> or call <strong>+91 83285 81019</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
