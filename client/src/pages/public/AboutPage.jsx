import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Award,
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Droplet,
  Stethoscope,
  Activity,
  Phone,
  Calendar,
  Building,
  Check
} from 'lucide-react';
import useDynamicTranslation from '../../utils/dynamicTranslator';

export default function AboutPage() {
  const { t, loc } = useDynamicTranslation();

  return (
    <div className="about-page" style={{ padding: '50px 0 90px' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-head" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-tag">{t('aboutPage.tag', 'Rithanya Hospital • Advanced Clinical Care')}</span>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 4.5vw, 44px)' }}>
            {t('aboutPage.title', 'Excellence in Clinical Medicine, Guided by Human Compassion')}
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 840, margin: '0 auto', fontSize: 16 }}>
            {t('aboutPage.sub', 'Rithanya Hospital was established on Nehru Road, Khammam, to bring advanced, ethical internal medicine, specialized Diabetology, and a life-sustaining 24/7 Daycare Transfusion Centre to the community.')}
          </p>
        </div>

        {/* ==========================================================================
            1. ABOUT SECTION (Institutional Overview & Founding Leadership)
            ========================================================================== */}
        <section style={{ marginBottom: 70 }} aria-label="About Rithanya Hospital">
          <div
            className="card card-responsive"
            style={{
              padding: 'clamp(24px, 4vw, 44px)',
              border: '1.5px solid var(--line)',
              borderRadius: 24,
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)',
              background: '#ffffff',
              marginBottom: 40
            }}
          >
            <div className="grid-2" style={{ alignItems: 'center', gap: 36 }}>
              <div>
                <span className="badge badge-red" style={{ marginBottom: 12 }}>
                  {t('aboutPage.foundationBadge', 'Our Foundation & Legacy')}
                </span>
                <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', marginBottom: 16, color: 'var(--ink)' }}>
                  {t('aboutPage.foundationTitle', 'A Trusted Healing Haven in the Heart of Khammam')}
                </h2>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
                  {t('aboutPage.foundationP1', 'Located opposite the Old L.I.C. Office on Nehru Road, Rithanya Hospital combines modern diagnostic capabilities with a warm, patient-first clinical environment. Driven by a deep commitment to affordable and transparent healthcare, the hospital has grown into a vital clinical anchor for Khammam and surrounding rural and semi-urban communities.')}
                </p>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>
                  {t('aboutPage.foundationP2', 'Our specialized Daycare Transfusion Unit was specifically established to address the acute challenges faced by children and families battling Beta Thalassemia Major and Sickle Cell Anemia. With complete Aarogyasri cashless coverage and an in-house 24/7 blood bank, young warriors receive scheduled, infection-controlled transfusions with absolute safety and peace of mind.')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  <div style={{ padding: '12px 16px', background: 'var(--canvas)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <h4 style={{ color: 'var(--red-700)', fontSize: 20, margin: 0, fontWeight: 800 }}>24/7</h4>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '4px 0 0', fontWeight: 600 }}>
                      {t('aboutPage.stat1Label', 'Emergency & Blood Bank')}
                    </p>
                  </div>
                  <div style={{ padding: '12px 16px', background: 'var(--canvas)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <h4 style={{ color: 'var(--red-700)', fontSize: 20, margin: 0, fontWeight: 800 }}>Aarogyasri</h4>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '4px 0 0', fontWeight: 600 }}>
                      {t('aboutPage.stat2Label', 'Thalassemia & Sickle Cell')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospital Storefront Presentation */}
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', background: '#0e0b0c', boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)' }}>
                <img
                  src="/image.png"
                  alt="Rithanya Hospital Khammam Storefront Entrance"
                  style={{ width: '100%', height: '100%', maxHeight: 380, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', padding: '16px 20px', color: '#fff' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{loc('Nehru Road Campus • Khammam')}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: '2px 0 0' }}>{loc('Diabetology, Daycare Transfusion & 24/7 Diagnostics')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Founding Leadership Showcase */}
          <div style={{ marginTop: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span className="section-tag">{t('aboutPage.leadershipTag', 'Institutional Leadership')}</span>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)' }}>
                {t('aboutPage.leadershipTitle', 'Our Founding Visionaries')}
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', maxWidth: 640, margin: '4px auto 0' }}>
                {t('aboutPage.leadershipSub', 'Dedicated senior clinical practitioners directing every medical and ethical protocol at Rithanya Hospital.')}
              </p>
            </div>

            <div className="grid-2" style={{ gap: 24 }}>
              {/* Founder: Dr. D. Narayana Murthy */}
              <div
                className="card"
                style={{
                  padding: 24,
                  border: '1.5px solid var(--line)',
                  borderRadius: 20,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  background: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div
                  style={{
                    width: 130,
                    height: 150,
                    borderRadius: 16,
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#f6f2f4',
                    border: '1px solid var(--line)'
                  }}
                >
                  <img
                    src="/Dr Narayana Murthy-Rithanya Hospital-Khammam.png"
                    alt="Dr. D. Narayana Murthy"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
                  />
                </div>
                <div>
                  <span className="badge badge-red" style={{ marginBottom: 6, fontSize: 11 }}>
                    {t('aboutPage.drNarayanaRole', 'Founder & Chief Physician')}
                  </span>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '0 0 4px' }}>
                    {loc('Dr. D. Narayana Murthy')}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--red-700)', fontWeight: 700, margin: '0 0 8px' }}>
                    డా॥ డి. నారాయణమూర్తి (Reg. 81187)
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
                    {loc('MD (General Physician SVIMS) • Ex. Senior Resident (SVIMS) • Ex. Resident (JIPMER) • Fellowship in Clinical Endocrinology & Diabetes RCP (London) • Fellowship in Diabetes & Renal Management RCP (London)')}
                  </p>
                  <Link to="/doctors/dr-d-narayana-murthy" className="btn btn-outline btn-sm" style={{ padding: '4px 12px', fontSize: 12 }}>
                    <span>{t('aboutPage.viewDocProfile', 'View Doctor Profile')}</span>
                  </Link>
                </div>
              </div>

              {/* Co-Founder: Dr. A. Lakshmi Deepa */}
              <div
                className="card"
                style={{
                  padding: 24,
                  border: '1.5px solid var(--line)',
                  borderRadius: 20,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'center',
                  background: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
                }}
              >
                <div
                  style={{
                    width: 130,
                    height: 150,
                    borderRadius: 16,
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#f6f2f4',
                    border: '1px solid var(--line)'
                  }}
                >
                  <img
                    src="/Dr A Laxmi Dipa-Rithanya Hospital-Khammam.png"
                    alt="Dr. A. Lakshmi Deepa"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }}
                  />
                </div>
                <div>
                  <span className="badge badge-red" style={{ marginBottom: 6, fontSize: 11 }}>
                    {t('aboutPage.drDeepaRole', 'Co-Founder & Consultant')}
                  </span>
                  <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '0 0 4px' }}>
                    {loc('Dr. A. Lakshmi Deepa')}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--red-700)', fontWeight: 700, margin: '0 0 8px' }}>
                    డా॥ ఎ. లక్ష్మీదీప (Reg. 19422)
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
                    {loc("M.B.B.S. • Gynecologist & Women's Health Specialist (స్త్రీల వైద్య నిపుణులు) • Focused on comprehensive maternal care, adolescent wellness, and endocrine health.")}
                  </p>
                  <Link to="/doctors/dr-a-lakshmi-deepa" className="btn btn-outline btn-sm" style={{ padding: '4px 12px', fontSize: 12 }}>
                    <span>{t('aboutPage.viewDocProfile', 'View Doctor Profile')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. VISION AND MISSION SECTION
            ========================================================================== */}
        <section style={{ marginBottom: 70 }} aria-label="Vision and Mission">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="section-tag">{t('aboutPage.visionMissionTag', 'Guiding Light')}</span>
            <h2 className="section-title">{t('aboutPage.visionMissionTitle', 'Our Vision & Mission')}</h2>
            <p className="section-subtitle" style={{ maxWidth: 740, margin: '0 auto' }}>
              {t('aboutPage.visionMissionSub', 'Setting benchmark standards for compassionate outpatient care, advanced diabetology, and dedicated hemoglobinopathy transfusion support.')}
            </p>
          </div>

          <div className="grid-2" style={{ gap: 28, marginBottom: 28 }}>
            {/* Vision Card */}
            <div
              className="card"
              style={{
                padding: '36px 32px',
                borderRadius: 22,
                border: '1.5px solid var(--red-100)',
                background: 'linear-gradient(135deg, #ffffff 0%, #fffbfc 100%)',
                boxShadow: '0 12px 32px rgba(169, 17, 41, 0.05)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--red-50)',
                  color: 'var(--red-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                {t('aboutPage.visionTitle', 'Our Institutional Vision')}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 16 }}>
                {t('aboutPage.visionP', 'To stand as Telangana’s foremost center of clinical trust, where chronic conditions like Diabetes and Thalassemia are managed with scientific rigor, empathetic continuity, and complete patient dignity, ensuring that no patient is denied life-saving treatment due to geographical or financial constraints.')}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span>{loc('Lifelong vascular and organ protection for every diabetic individual')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span>{loc('Elimination of transfusion complications through 100% leukodepletion')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span>{loc('A peaceful, child-friendly healing atmosphere in Khammam')}</span>
                </li>
              </ul>
            </div>

            {/* Mission Card */}
            <div
              className="card"
              style={{
                padding: '36px 32px',
                borderRadius: 22,
                border: '1.5px solid var(--line)',
                background: 'linear-gradient(135deg, #ffffff 0%, #fdfcfd 100%)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(0, 75, 154, 0.08)',
                  color: 'var(--blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20
                }}
              >
                <Heart size={26} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                {t('aboutPage.missionTitle', 'Our Active Mission')}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 16 }}>
                {t('aboutPage.missionP', 'To provide accessible, evidence-guided physician care where patients receive thorough investigations, clear communication, and personalized therapeutic regimens without commercial over-investigation or irrational polypharmacy.')}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span>{loc('Deliver 24/7 Emergency and Blood Bank services with speed and precision')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span>{loc('Administer free Aarogyasri daycare transfusions for thalassemia children')}</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                  <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span>{loc("Support women's health and family wellness through specialized care")}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. OUR VALUES AND ETHICS SECTION
            ========================================================================== */}
        <section aria-label="Our Values and Ethics">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: 36 }}>
            <span className="section-tag">{t('aboutPage.valuesTag', 'Moral Foundations')}</span>
            <h2 className="section-title">{t('aboutPage.valuesTitle', 'Our Values & Ethics')}</h2>
            <p className="section-subtitle" style={{ maxWidth: 740, margin: '0 auto' }}>
              {t('aboutPage.valuesSub', 'The uncompromised clinical, ethical, and digital standards that define every interaction at Rithanya Hospital.')}
            </p>
          </div>

          <div className="grid-3" style={{ gap: 24, marginBottom: 40 }}>
            <div className="card" style={{ padding: 28, borderRadius: 18, border: '1px solid var(--line)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Stethoscope size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: 'var(--ink)' }}>
                {t('aboutPage.ethicalPrescribing', 'Ethical Prescribing')}
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {t('aboutPage.ethicalPrescribingDesc', 'We strictly oppose irrational polypharmacy. Every medicine, laboratory test, and procedure prescribed is clinically justified and clearly explained to the patient.')}
              </p>
            </div>

            <div className="card" style={{ padding: 28, borderRadius: 18, border: '1px solid var(--line)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Droplet size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: 'var(--ink)' }}>
                {t('aboutPage.bloodSafety', 'Zero-Compromise Blood Safety')}
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {t('aboutPage.bloodSafetyDesc', 'Triple pre-transfusion crossmatching, calibrated donor screening, and bedside leukodepletion micro-filters guarantee supreme safety against transfusion reactions and HLA alloimmunization.')}
              </p>
            </div>

            <div className="card" style={{ padding: 28, borderRadius: 18, border: '1px solid var(--line)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--blue-bg)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: 'var(--ink)' }}>
                {t('aboutPage.digitalTrust', 'DPDP Act 2023 Digital Trust')}
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {t('aboutPage.digitalTrustDesc', 'Full statutory compliance with the Digital Personal Data Protection Act 2023. Patient records, live camera consent photos, and right to data erasure are protected with institutional rigor.')}
              </p>
            </div>
          </div>

          {/* Quick Contact Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--red-900), var(--red-950))',
              borderRadius: 24,
              padding: 'clamp(28px, 5vw, 44px)',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 20px 48px rgba(169, 17, 41, 0.25)'
            }}
          >
            <h3 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: 800, marginBottom: 12 }}>
              {t('aboutPage.visitTitle', 'Visit Rithanya Hospital in Khammam')}
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.88)', maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 }}>
              {t('aboutPage.visitAddress', 'Nehru Road, Opposite Old L.I.C. Office, Khammam, Telangana 507001')}
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact#appointment" className="btn btn-primary" style={{ background: '#fff', color: 'var(--red-900)' }}>
                <Calendar size={16} />
                <span>{t('aboutPage.bookAppointmentBtn', 'Book Doctor Appointment')}</span>
              </Link>
              <a href="tel:+918328581019" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                <Phone size={16} />
                <span>+91 83285 81019</span>
              </a>
              <a href="tel:+919948713504" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                <Phone size={16} />
                <span>+91 99487 13504</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
