import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Users, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="about-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">About Our Institution</span>
          <h1 className="section-title">Compassionate Medicine, Driven by Clinical Experience</h1>
          <p className="section-subtitle">
            Rithanya Hospital was founded with a singular purpose: to bring dignified, top-tier diabetology and specialized daycare transfusion facilities to the patients of Khammam and neighboring districts.
          </p>
        </div>

        {/* Lead Physician Profile */}
        <div className="card card-responsive" style={{ marginBottom: 'clamp(32px, 6vw, 60px)', border: '1px solid var(--red-100)' }}>
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="hero-main-img" style={{ aspectRatio: '1/1', maxHeight: 420 }}>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=85"
                alt="Dr. Narayana Murthy M.D."
              />
            </div>

            <div>
              <span className="badge badge-red" style={{ marginBottom: 12 }}>Medical Director & Chief Physician</span>
              <h2 style={{ fontSize: 'clamp(24px, 4.5vw, 32px)', marginBottom: 8 }}>Dr. Narayana Murthy, M.D.</h2>
              <p style={{ color: 'var(--red-700)', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                Senior Consultant Physician & Diabetic Specialist
              </p>

              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 16 }}>
                With over two decades of dedicated medical practice across internal medicine and advanced diabetology, Dr. Narayana Murthy has pioneered patient-centered treatment pathways that emphasize preventive lifestyle modification, continuous blood glucose tracking, and proactive cardio-renal protection.
              </p>

              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 24 }}>
                Recognizing the critical shortage of dedicated, peaceful transfusion spaces for young children and adolescents battling Beta Thalassemia Major and Sickle Cell Disease in Khammam, Dr. Murthy established Rithanya’s specialized Daycare Transfusion Centre.
              </p>

              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: 20 }}>
                <div style={{ flex: '1 1 90px' }}>
                  <h4 style={{ color: 'var(--red-700)', fontSize: 20 }}>MBBS, MD</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>General Medicine</p>
                </div>
                <div style={{ flex: '1 1 90px' }}>
                  <h4 style={{ color: 'var(--red-700)', fontSize: 20 }}>22+ Yrs</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Clinical Practice</p>
                </div>
                <div style={{ flex: '1 1 90px' }}>
                  <h4 style={{ color: 'var(--red-700)', fontSize: 20 }}>Khammam</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Telangana Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid-3" style={{ marginBottom: 60 }}>
          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Heart size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>Our Patient Mission</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
              To deliver attentive, evidence-based physician consultations where symptoms are thoroughly investigated without unnecessary commercial polypharmacy.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>Clinical Standards</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
              Strict adherence to international transfusion safety, leukodepletion filtering, standardized biochemical reagents, and calibrated diagnostic profiling.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-bg)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 10 }}>Data Protection & Ethics</h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
              Full compliance with the Indian Government's DPDP Act 2023. Patient records, digital camera consent signatures, and right to data erasure are protected with statutory rigor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
