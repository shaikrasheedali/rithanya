import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Droplet,
  Share2
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function TreatmentDetailPage() {
  const { slug } = useParams();
  const { addToast } = useToast();
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTreatment() {
      try {
        const res = await apiRequest(`/treatments/${slug}`);
        setTreatment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTreatment();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: treatment?.title || 'Rithanya Hospital Treatment',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Treatment link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-soft)' }}>Loading treatment clinical protocol...</p>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Treatment Not Found</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
          The requested clinical procedure or treatment could not be found.
        </p>
        <Link to="/treatments" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to All Treatments</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="treatment-detail-page" style={{ padding: '40px 0 100px' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <Link to="/treatments" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            <ArrowLeft size={16} />
            <span>Back to Treatments Catalog</span>
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 20 }}
          >
            <Share2 size={14} />
            <span>Share Protocol</span>
          </button>
        </div>

        {/* Hero Visual Banner (Image or Video) */}
        <div
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            height: 'clamp(280px, 45vw, 440px)',
            background: '#140f12',
            marginBottom: 36,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)'
          }}
        >
          {treatment.videoUrl ? (
            <video
              src={treatment.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={treatment.coverImage}
              alt={treatment.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(17, 12, 14, 0.2) 0%, rgba(82, 10, 24, 0.65) 75%, rgba(17, 12, 14, 0.92) 100%)'
            }}
          />

          {/* Text on Hero Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'clamp(20px, 4vw, 36px)',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
              <span
                style={{
                  background: 'var(--red-600)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}
              >
                {treatment.category}
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <Clock size={13} />
                <span>{treatment.duration || 'Standard Session'}</span>
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>
              {treatment.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255, 255, 255, 0.9)', fontSize: 14 }}>
              <Stethoscope size={16} />
              <span>Attending: <strong>{treatment.doctorName}</strong> — {treatment.department}</span>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="treatment-content-grid">
          {/* Main Article Content */}
          <div>
            {/* Clinical Indications Box */}
            {treatment.indications && (
              <div
                style={{
                  background: 'var(--red-50)',
                  border: '1.5px solid var(--red-200)',
                  borderRadius: 16,
                  padding: '18px 22px',
                  marginBottom: 30,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14
                }}
              >
                <AlertCircle size={22} style={{ color: 'var(--red-700)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--red-900)', letterSpacing: 0.5, marginBottom: 4 }}>
                    Clinical Indications & Eligibility
                  </h4>
                  <p style={{ fontSize: 14, color: 'var(--ink)', margin: 0, lineHeight: 1.5 }}>
                    {treatment.indications}
                  </p>
                </div>
              </div>
            )}

            {/* Procedures Checklist */}
            {Array.isArray(treatment.procedures) && treatment.procedures.length > 0 && (
              <div
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--line)',
                  borderRadius: 18,
                  padding: 'clamp(18px, 4vw, 28px)',
                  marginBottom: 36,
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)'
                }}
              >
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} style={{ color: 'var(--red-700)' }} />
                  <span>Clinical Procedures & Safety Protocol</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
                  {treatment.procedures.map((proc, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--ink)' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                      <span>{proc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rich Content Rendered from WYSIWYG */}
            <div
              className="treatment-rich-content"
              style={{
                background: '#fff',
                border: '1.5px solid var(--line)',
                borderRadius: 20,
                padding: 'clamp(20px, 4vw, 40px)',
                fontSize: 15.5,
                lineHeight: 1.75,
                color: 'var(--ink)'
              }}
              dangerouslySetInnerHTML={{ __html: treatment.content }}
            />
          </div>

          {/* Sticky Sidebar Booking Action Card */}
          <div style={{ position: 'sticky', top: 110, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                background: '#fff',
                border: '1.5px solid var(--line)',
                borderRadius: 20,
                padding: '28px',
                boxShadow: '0 10px 30px rgba(57, 18, 26, 0.06)'
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>
                Book This Treatment
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 20 }}>
                Consult directly with <strong>{treatment.doctorName}</strong> for customized pre-assessment and daycare bed reservation.
              </p>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Department:</span>
                  <span style={{ fontWeight: 600 }}>{treatment.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Typical Duration:</span>
                  <span style={{ fontWeight: 600 }}>{treatment.duration || '45 - 90 mins'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-soft)' }}>Safety Standard:</span>
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>Leukodepleted Blood Unit</span>
                </div>
              </div>

              <Link
                to={`/contact#appointment`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', borderRadius: 12, padding: '12px 20px', fontSize: 14.5, fontWeight: 700, marginBottom: 12 }}
              >
                <Calendar size={18} />
                <span>Book Appointment</span>
              </Link>

              <a
                href="tel:+918328581019"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', borderRadius: 12, padding: '11px 20px', fontSize: 13.5 }}
              >
                <Phone size={16} />
                <span>Call Emergency Line</span>
              </a>
            </div>

            {/* Accreditation Badge Card */}
            <div
              style={{
                background: 'var(--canvas)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <ShieldCheck size={26} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Clinical Safety Standard</h5>
                <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', margin: '2px 0 0' }}>Supervised by Dr. Narayana Murthy M.D. (Senior Diabetologist)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
