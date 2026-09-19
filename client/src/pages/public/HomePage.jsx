import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Heart,
  Droplet,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Phone,
  ArrowRight,
  Clock,
  MapPin,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function HomePage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick appointment booking state
  const [booking, setBooking] = useState({
    patientName: '',
    phone: '',
    preferredDate: '',
    specialty: 'General Medicine & Diabetology',
    reason: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [servicesRes, specialistsRes] = await Promise.all([
          apiRequest('/services'),
          apiRequest('/specialists')
        ]);
        setServices(servicesRes.data || []);
        setSpecialists(specialistsRes.data || []);
      } catch (err) {
        console.error('Home data error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!booking.patientName || !booking.phone || !booking.preferredDate) {
      addToast('Please fill in Name, Phone, and Preferred Date', 'error');
      return;
    }
    setBookingLoading(true);
    try {
      const res = await apiRequest('/appointments/book', {
        method: 'POST',
        body: JSON.stringify(booking)
      });
      setBookingSuccess(res.data);
      addToast('Appointment booked successfully! Our coordinator will call you to confirm.', 'success');
      setBooking({
        patientName: '',
        phone: '',
        preferredDate: '',
        specialty: 'General Medicine & Diabetology',
        reason: ''
      });
    } catch (err) {
      addToast(err.message || 'Failed to book appointment', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Premier Daycare Transfusion & Diabetology Centre</span>
              </div>

              <h1 className="hero-title">
                Compassionate Healthcare with <span>Clinical Precision</span>.
              </h1>

              <p className="hero-subtitle">
                Under the clinical leadership of <strong>Dr. Narayana Murthy M.D.</strong>, Rithanya Hospital delivers specialized longitudinal diabetes management and Khammam's dedicated day-care transfusion centre for Thalassemia and Sickle-Cell warriors.
              </p>

              <div className="hero-ctas">
                <a href="#appointment-section" className="btn btn-primary btn-lg">
                  <Calendar size={18} />
                  <span>Book Consultation</span>
                </a>
                <Link to="/services" className="btn btn-secondary btn-lg">
                  <span>Explore Specialties</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <h3>22+</h3>
                  <p>Years Clinical Experience</p>
                </div>
                <div className="stat-item">
                  <h3>8,500+</h3>
                  <p>Diabetic Patients Managed</p>
                </div>
                <div className="stat-item">
                  <h3>100%</h3>
                  <p>Leukodepleted Blood Safety</p>
                </div>
              </div>
            </div>

            <div className="hero-card-stack">
              <div className="hero-main-img">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85"
                  alt="Rithanya Hospital Modern Clinical Facility"
                />
              </div>
              <div className="hero-float-card">
                <div className="hero-float-icon">
                  <Droplet size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Thalassemia Daycare</h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>24/7 Monitored Blood Reserves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAYCARE TRANSFUSION CENTRE SPECIAL BANNER */}
      <section className="container" style={{ margin: '40px auto' }}>
        <div className="daycare-highlight-banner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
            <Droplet size={16} />
            <span>Dedicated Daycare Transfusion Centre</span>
          </div>

          <h2>Thalassemia & Sickle-Cell Care Without Hospital Stress</h2>
          <p>
            Transfusions should never feel like a daunting hospital stay. Our peaceful day-care transfusion beds are equipped with certified leukodepletion micro-aggregate filtration, saline pre-crossmatching, and ongoing pediatric and iron-chelation monitoring.
          </p>

          <div className="daycare-features-grid">
            <div className="daycare-feature-item">
              <h4>Triple Cross-Match Safety</h4>
              <p>Rigorous ABO, Rh(D) typing and saline compatibility screening prior to every unit issuance.</p>
            </div>
            <div className="daycare-feature-item">
              <h4>Leukodepletion Micro-Filters</h4>
              <p>Modern micro-filtration prevents febrile non-hemolytic transfusion reactions (FNHTR) in regular recipients.</p>
            </div>
            <div className="daycare-feature-item">
              <h4>Serum Ferritin & Chelation</h4>
              <p>Longitudinal iron tracking with customized oral chelation dosages to protect heart and hepatic organs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLINICAL SERVICES SHOWCASE */}
      <section className="container" style={{ padding: '60px 24px' }}>
        <div className="section-head">
          <span className="section-tag">Our Specialties</span>
          <h2 className="section-title">Comprehensive Medical Services</h2>
          <p className="section-subtitle">
            From emergency fever diagnoses and specialized endocrinology to pediatric wellness, our clinical protocols prioritize patient comfort and long-term vitality.
          </p>
        </div>

        <div className="grid-3">
          {services.slice(0, 6).map((service) => (
            <div key={service.id} className="service-card">
              <div className="card-image-wrap">
                <img src={service.coverImage} alt={service.title} />
              </div>
              <div className="service-card-body">
                <span className="service-category">{service.category}</span>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.summary}</p>
                <Link to={`/services/${service.slug}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/services" className="btn btn-secondary btn-lg">
            <span>View All Medical Departments</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 4. DOCTORS & CLINICAL SPECIALISTS */}
      <section style={{ background: '#fff', padding: '80px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Leadership</span>
            <h2 className="section-title">Experienced Healthcare Specialists</h2>
            <p className="section-subtitle">
              Meet Dr. Narayana Murthy M.D. and visiting specialists dedicated to transparent medicine and patient education.
            </p>
          </div>

          <div className="grid-2">
            {specialists.map((doc) => (
              <div key={doc.id} className="specialist-card" style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '40%', minHeight: 220, position: 'relative' }}>
                  <img
                    src={doc.image}
                    alt={doc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="specialist-card-body" style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="specialist-dept">{doc.department}</span>
                  <h3 className="specialist-name">{doc.name}</h3>
                  <p className="specialist-qual">{doc.qualifications}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 14, lineHeight: 1.6 }}>
                    {doc.bio}
                  </p>
                  <div className="specialist-timings">
                    <Clock size={14} style={{ color: 'var(--red-700)' }} />
                    <span>{doc.opdTimings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. QUICK APPOINTMENT BOOKING SECTION */}
      <section id="appointment-section" className="container" style={{ padding: '80px 24px' }}>
        <div className="card" style={{ maxWidth: 840, margin: '0 auto', padding: '40px', border: '1.5px solid var(--red-100)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span className="badge badge-red" style={{ marginBottom: 10 }}>Direct OPD Booking</span>
            <h2 style={{ fontSize: 28 }}>Schedule Your Consultation</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginTop: 6 }}>
              Choose your preferred date and department. Walk-ins are also welcome from 11:00 AM to 5:00 PM.
            </p>
          </div>

          {bookingSuccess ? (
            <div style={{ background: 'var(--green-bg)', padding: '24px', borderRadius: 14, textAlign: 'center', border: '1px solid #c2e8d9' }}>
              <CheckCircle size={48} style={{ color: 'var(--green)', margin: '0 auto 12px' }} />
              <h3 style={{ color: 'var(--green)', fontSize: 20, marginBottom: 8 }}>Appointment Booked Successfully!</h3>
              <p style={{ fontSize: 14, color: 'var(--ink)', marginBottom: 16 }}>
                Your appointment tracking code is: <strong style={{ fontSize: 18, color: 'var(--red-700)' }}>{bookingSuccess.apptCode}</strong>
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
                Our patient care coordinator will call <strong>{bookingSuccess.phone}</strong> to confirm your exact token time.
              </p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setBookingSuccess(null)}>
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Patient Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Ramesh Kumar"
                    value={booking.patientName}
                    onChange={(e) => setBooking({ ...booking, patientName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="e.g. +91 98480 12345"
                    value={booking.phone}
                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={booking.preferredDate}
                    onChange={(e) => setBooking({ ...booking, preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Specialty / Doctor</label>
                  <select
                    className="form-control"
                    value={booking.specialty}
                    onChange={(e) => setBooking({ ...booking, specialty: e.target.value })}
                  >
                    <option value="General Medicine & Diabetology">Dr. Narayana Murthy (Diabetology / Medicine)</option>
                    <option value="Thalassemia & Daycare Transfusion">Thalassemia Transfusion Daycare</option>
                    <option value="Diagnostics & Laboratory Services">Diagnostics & Comprehensive Blood Profiling</option>
                    <option value="Pediatric Care">Pediatric Clinical Consultation</option>
                    <option value="Senior Citizen Health Check">Senior Citizen Preventive Checkup</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Symptoms or Reason for Visit (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Briefly describe what you would like to consult the physician for..."
                  value={booking.reason}
                  onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 8 }}
                disabled={bookingLoading}
              >
                <Calendar size={18} />
                <span>{bookingLoading ? 'Registering Booking...' : 'Confirm Appointment Request'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
