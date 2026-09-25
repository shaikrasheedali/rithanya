import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
  Share2,
  MapPin,
  HeartPulse,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import useDynamicTranslation from '../../utils/dynamicTranslator';

export default function SpecialistDetailPage() {
  const { slug } = useParams();
  const { addToast } = useToast();
  const { t, loc, locItem } = useDynamicTranslation();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);

  // Appointment Form State
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    phone: '',
    date: '',
    timeSlot: 'Morning (10:00 AM - 01:30 PM)',
    notes: ''
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadSpecialist() {
      try {
        const res = await apiRequest(`/specialists/${slug}`);
        setSpecialist(res.data);
      } catch (err) {
        console.error('Failed to load specialist:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSpecialist();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: specialist?.name || 'Rithanya Hospital Specialist Doctor',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Doctor profile link copied to clipboard!', 'success');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.patientName || !bookingForm.phone || !bookingForm.date) {
      addToast('Please fill in Patient Name, Mobile Number, and Preferred Date.', 'error');
      return;
    }
    setSubmittingBooking(true);
    try {
      await apiRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          patientName: bookingForm.patientName,
          phone: bookingForm.phone,
          preferredDate: bookingForm.date,
          preferredTime: bookingForm.timeSlot,
          notes: bookingForm.notes,
          doctorName: specialist?.name || 'Doctor',
          department: specialist?.department || 'General Medicine'
        })
      });
      setBookingSuccess(true);
      addToast('Appointment request submitted successfully! Our desk will call you shortly to confirm.', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Unable to submit appointment. Please call 8328581019.', 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-soft)', fontSize: 16 }}>{t('common.loading', 'Loading clinical records...')}</p>
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>{loc('Doctor Profile Not Found')}</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: 15 }}>
          {loc('The requested medical specialist or consultant could not be found.')}
        </p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>{loc('Back to All Specialists')}</span>
        </Link>
      </div>
    );
  }

  const currentDoctor = locItem(specialist);

  return (
    <div className="doctor-detail-page" style={{ padding: '40px 0 100px', background: 'var(--canvas)' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <Link to="/doctors" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            <ArrowLeft size={16} />
            <span>{loc('Back to Doctors Directory')}</span>
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 20 }}
          >
            <Share2 size={14} />
            <span>{loc('Share Doctor Profile')}</span>
          </button>
        </div>

        {/* Doctor Hero Showcase Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fdf5f6 100%)',
            borderRadius: 24,
            border: '1.5px solid var(--line)',
            padding: 'clamp(24px, 4vw, 44px)',
            marginBottom: 40,
            boxShadow: '0 12px 36px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 340px) 1fr',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center'
          }}
          className="doctor-hero-banner"
        >
          {/* Doctor Photo */}
          <div
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              background: '#fff',
              border: '1.5px solid var(--line)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              position: 'relative',
              textAlign: 'center',
              padding: '16px 16px 0'
            }}
          >
            <img
              src={currentDoctor.image || '/image.png'}
              alt={currentDoctor.name}
              style={{
                width: '100%',
                maxHeight: 380,
                objectFit: 'contain',
                objectPosition: 'bottom center',
                display: 'block'
              }}
            />
            {currentDoctor.registrationNumber && (
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--red-700)',
                  border: '1px solid var(--red-200)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <UserCheck size={12} />
                <span>{loc('Regd:')} {currentDoctor.registrationNumber}</span>
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <span className="badge badge-red" style={{ fontSize: 12, padding: '5px 12px' }}>
                {currentDoctor.department}
              </span>
              {currentDoctor.experience && (
                <span
                  style={{
                    background: 'var(--emerald-50)',
                    color: 'var(--emerald-800)',
                    border: '1px solid var(--emerald-200)',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '4px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <Award size={13} />
                  {loc(currentDoctor.experience)}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: 'var(--ink)', marginBottom: 8, lineHeight: 1.25 }}>
              {currentDoctor.name}
            </h1>

            <p style={{ color: 'var(--red-700)', fontWeight: 700, fontSize: 'clamp(14px, 2vw, 17px)', marginBottom: 16 }}>
              {currentDoctor.designation}
            </p>

            {/* Qualifications Box */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start'
              }}
            >
              <GraduationCap size={20} style={{ color: 'var(--red-700)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                  {loc('Medical Qualifications & Fellowships')}
                </span>
                <p style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  {currentDoctor.qualifications}
                </p>
              </div>
            </div>

            {/* OPD Timings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)', fontSize: 13.5, marginBottom: 24, flexWrap: 'wrap' }}>
              <Clock size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
              <span><strong>{t('common.consultationHours', 'OPD Timings')}:</strong> {currentDoctor.opdTimings || 'Monday – Saturday: 10:00 AM – 02:00 PM & 06:00 PM – 09:00 PM'}</span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#book-consultation" className="btn btn-primary">
                <Calendar size={16} />
                <span>{loc('Book OPD Consultation')}</span>
              </a>
              <a href="tel:8328581019" className="btn btn-secondary">
                <Phone size={16} />
                <span>{t('common.callUs', 'Call Us')}: 8328581019</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column Content Grid */}
        <div className="doctor-detail-grid">
          {/* Main Clinical Details */}
          <div className="doctor-content-main">
            {/* Bio Card */}
            <div className="card" style={{ padding: 'clamp(20px, 3vw, 36px)', marginBottom: 30, borderRadius: 20 }}>
              <h2 style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <HeartPulse size={22} style={{ color: 'var(--red-700)' }} />
                <span>{loc('Clinical Profile & Patient Care Philosophy')}</span>
              </h2>
              <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.75, margin: 0 }}>
                {currentDoctor.bio}
              </p>
            </div>

            {/* Rich Content Article (Quill formatted from CMS) */}
            {currentDoctor.content && (
              <div className="card" style={{ padding: 'clamp(20px, 3vw, 36px)', marginBottom: 30, borderRadius: 20 }}>
                <div
                  className="doctor-rich-content ql-editor"
                  dangerouslySetInnerHTML={{ __html: currentDoctor.content }}
                />
              </div>
            )}

            {/* Hospital Institutional Assurance Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1.5px solid #bbf7d0',
                borderRadius: 20,
                padding: 'clamp(20px, 3vw, 32px)',
                marginTop: 20
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <ShieldCheck size={26} style={{ color: 'var(--emerald-700)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 18, color: 'var(--emerald-900)', marginBottom: 6 }}>
                    {loc('Direct Consultant Supervision at Rithanya Hospital')}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--emerald-800)', lineHeight: 1.6, margin: 0 }}>
                    {loc('Every patient consultation is personally reviewed by our lead consultants. Backed by 24/7 in-house emergency support, digital diagnostic labs, and the Rithanya 24 Hours Blood Bank on Nehru nagar Road, Khammam.')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar: Consultation Booking & Institutional Info */}
          <div className="doctor-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Consultation Booking Card */}
            <div id="book-consultation" className="card" style={{ padding: 26, borderRadius: 20, border: '1.5px solid var(--red-200)', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Calendar size={20} style={{ color: 'var(--red-700)' }} />
                <h3 style={{ fontSize: 18, margin: 0 }}>{loc('Book Consultation')}</h3>
              </div>

              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                  <CheckCircle2 size={42} style={{ color: 'var(--emerald-600)', margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: 16, color: 'var(--ink)', marginBottom: 6 }}>{t('home.bookingSuccessTitle', 'Appointment Request Submitted!')}</h4>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 16 }}>
                    {t('home.bookingSuccessMsg', 'Our hospital coordinator will call you shortly to confirm your consultation schedule.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSuccess(false);
                      setBookingForm({ patientName: '', phone: '', date: '', timeSlot: 'Morning (10:00 AM - 01:30 PM)', notes: '' });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    {loc('Book Another Slot')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>{t('home.patientName', 'Patient Full Name')} *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={loc("e.g. Ramesh Kumar")}
                      value={bookingForm.patientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, patientName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>{t('home.phone', 'Mobile Number')} *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder={loc("10-digit mobile number")}
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>{t('home.preferredDate', 'Preferred Date')} *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={bookingForm.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>{loc('Preferred Timing')}</label>
                    <select
                      className="form-control"
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    >
                      <option value="Morning (10:00 AM - 01:30 PM)">{loc('Morning: 10:00 AM – 01:30 PM')}</option>
                      <option value="Evening (05:30 PM - 08:30 PM)">{loc('Evening: 05:30 PM – 08:30 PM')}</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>{t('home.reason', 'Symptoms / Medical Query (Optional)')}</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder={loc("e.g. High blood sugar readings, chronic headache...")}
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={submittingBooking}
                  >
                    {submittingBooking ? t('common.loading', 'Submitting...') : t('home.bookSubmit', 'Confirm Appointment Request')}
                  </button>
                </form>
              )}
            </div>

            {/* Hospital Contact & Facility Card */}
            <div className="card" style={{ padding: 22, borderRadius: 20, background: '#fcfbfb' }}>
              <h4 style={{ fontSize: 15, marginBottom: 12, color: 'var(--ink)' }}>{loc('Hospital Facilities & Contact')}</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, color: 'var(--ink-soft)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <MapPin size={16} style={{ color: 'var(--red-700)', flexShrink: 0, marginTop: 2 }} />
                  <span>{t('footer.address', 'Nehru nagar Road, Opp. Old L.I.C. Office, Khammam, Telangana 507001')}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Phone size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span>{loc('Phones')}: <strong>8328581019</strong> / <strong>9948713504</strong></span>
                </div>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 4 }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 600, color: 'var(--ink)' }}>{loc('24/7 In-House Facilities:')}</p>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, fontSize: 12.5 }}>
                    <li>{loc('24/7 Emergency Medical Response')}</li>
                    <li>{loc('Rithanya Blood Bank 24 Hours Available')}</li>
                    <li>{loc('Aarogyasri Facility for Sickle Cell Anemia & Thalassemia Children')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
