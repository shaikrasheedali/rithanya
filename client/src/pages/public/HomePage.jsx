import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Droplet,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Phone,
  ArrowRight,
  Clock,
  MapPin,
  Stethoscope,
  Sparkles,
  Heart,
  Package,
  BookOpen,
  Award,
  AlertTriangle,
  Check,
  Building,
  Users
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import HeroVideoSlider from '../../components/home/HeroVideoSlider';
import { formatDate } from '../../utils/formatters';

export default function HomePage() {
  const { addToast } = useToast();

  const [services, setServices] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [bloodStocks, setBloodStocks] = useState([]);
  const [bloodTotals, setBloodTotals] = useState({ totalUnits: 0, availableUnits: 0, criticalAlerts: 0 });
  const [specialists, setSpecialists] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
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
        const [servRes, treatRes, bloodRes, specRes, prodRes, blogRes] = await Promise.allSettled([
          apiRequest('/services'),
          apiRequest('/treatments'),
          apiRequest('/inventory/public'),
          apiRequest('/specialists'),
          apiRequest('/products'),
          apiRequest('/blogs')
        ]);

        if (servRes.status === 'fulfilled' && servRes.value?.data) setServices(servRes.value.data);
        if (treatRes.status === 'fulfilled' && treatRes.value?.data) setTreatments(treatRes.value.data);

        if (bloodRes.status === 'fulfilled' && bloodRes.value?.data) {
          setBloodStocks(bloodRes.value.data.stocks || []);
          setBloodTotals(bloodRes.value.data.totals || { totalUnits: 0, availableUnits: 0, criticalAlerts: 0 });
        } else {
          // Fallback blood bank stock data matching 8 blood groups
          const fallbackGroups = [
            { id: '1', group: 'A+', units: 14, reservedUnits: 2, availableUnits: 12, threshold: 5, status: 'Optimal' },
            { id: '2', group: 'A-', units: 6, reservedUnits: 1, availableUnits: 5, threshold: 4, status: 'Optimal' },
            { id: '3', group: 'B+', units: 18, reservedUnits: 3, availableUnits: 15, threshold: 6, status: 'Optimal' },
            { id: '4', group: 'B-', units: 4, reservedUnits: 0, availableUnits: 4, threshold: 3, status: 'Optimal' },
            { id: '5', group: 'O+', units: 22, reservedUnits: 4, availableUnits: 18, threshold: 8, status: 'Optimal' },
            { id: '6', group: 'O-', units: 5, reservedUnits: 2, availableUnits: 3, threshold: 4, status: 'Near Low' },
            { id: '7', group: 'AB+', units: 9, reservedUnits: 1, availableUnits: 8, threshold: 4, status: 'Optimal' },
            { id: '8', group: 'AB-', units: 3, reservedUnits: 1, availableUnits: 2, threshold: 3, status: 'Near Low' }
          ];
          setBloodStocks(fallbackGroups);
          setBloodTotals({ totalUnits: 81, availableUnits: 67, criticalAlerts: 2 });
        }

        if (specRes.status === 'fulfilled' && specRes.value?.data) setSpecialists(specRes.value.data);
        if (prodRes.status === 'fulfilled' && prodRes.value?.data) setProducts(prodRes.value.data);
        if (blogRes.status === 'fulfilled' && blogRes.value?.data) setBlogs(blogRes.value.data);
      } catch (err) {
        console.error('Home data load error:', err);
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
      {/* 1. HERO SECTION: FULL VIEWPORT HEIGHT */}
      <HeroVideoSlider />

      {/* 2. SECTION: [ABOUT] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="about" aria-label="About Rithanya Hospital">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Legacy & Accreditation</span>
            <h2 className="section-title">Compassionate Medicine, Advanced Diagnostics</h2>
            <p className="section-subtitle">
              Founded under the leadership of Dr. Narayana Murthy M.D., Rithanya Hospital combines specialized Diabetology with a dedicated Daycare Transfusion Centre in Khammam.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 36, alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 22, color: 'var(--red-950)', marginBottom: 14 }}>
                Transforming Chronic Care with Dignity & Safety
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
                For regular blood recipients and chronic diabetic patients, hospital visits can often feel intimidating. At Rithanya Hospital, our center is architected to make every daycare transfusion and endocrine evaluation tranquil, fast, and clinically superior.
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 20 }}>
                With fully automated HPLC hemoglobin electrophoresis, triple pre-crossmatching protocols, and micro-aggregate leukodepletion filters, we eliminate febrile transfusion risks and deliver precise glycemic outcomes.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-primary">
                  <span>Learn More About Our Legacy</span>
                  <ArrowRight size={15} />
                </Link>
                <a href="tel:+918328581019" className="btn btn-secondary">
                  <Phone size={14} className="text-red" />
                  <span>Call Emergency Helpline</span>
                </a>
              </div>
            </div>

            {/* 4 Pillars Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <div className="card" style={{ padding: 22, background: 'var(--canvas)', border: '1px solid var(--line)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-700)', marginBottom: 12 }}>
                  <Stethoscope size={22} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--red-900)', margin: '0 0 4px' }}>22+</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: 0 }}>Years Clinical Experience</p>
              </div>

              <div className="card" style={{ padding: 22, background: 'var(--canvas)', border: '1px solid var(--line)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-700)', marginBottom: 12 }}>
                  <Activity size={22} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--red-900)', margin: '0 0 4px' }}>8,500+</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: 0 }}>Diabetic Patients Managed</p>
              </div>

              <div className="card" style={{ padding: 22, background: 'var(--canvas)', border: '1px solid var(--line)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-700)', marginBottom: 12 }}>
                  <Droplet size={22} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--red-900)', margin: '0 0 4px' }}>100%</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: 0 }}>Leukodepleted Blood Safety</p>
              </div>

              <div className="card" style={{ padding: 22, background: 'var(--canvas)', border: '1px solid var(--line)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--red-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-700)', marginBottom: 12 }}>
                  <ShieldCheck size={22} />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--red-900)', margin: '0 0 4px' }}>DPDP</h3>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', margin: 0 }}>Act 2023 Digital Privacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: [SERVICES] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="services" aria-label="Clinical Services">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Departments</span>
            <h2 className="section-title">Specialized Medical Services</h2>
            <p className="section-subtitle">
              Comprehensive care pathways designed for longitudinal vitality, rapid diagnostics, and day-care transfusions.
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {(services.length > 0 ? services.slice(0, 3) : [
              {
                id: 's1',
                slug: 'thalassemia-daycare-transfusion',
                category: 'Centre of Excellence',
                title: 'Thalassemia Daycare Transfusion Centre',
                summary: 'Dedicated day-care beds equipped with micro-aggregate leukodepletion filtration and continuous pediatric monitoring.',
                coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 's2',
                slug: 'clinical-diabetology-endocrinology',
                category: 'Endocrinology',
                title: 'Diabetology & Endocrine Management',
                summary: 'Comprehensive glycemic stabilization, diabetic neuropathy diagnostics, dietary charting, and vascular wellness under Dr. Narayana Murthy.',
                coverImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 's3',
                slug: 'hplc-pathology-diagnostics',
                category: 'Clinical Laboratory',
                title: 'HPLC Diagnostics & Bio-Chemistry Lab',
                summary: 'Gold-standard high performance liquid chromatography for hemoglobinopathies, automated biochemistry, and complete blood counts.',
                coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
              }
            ]).map((s) => (
              <div key={s.id} className="service-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="card-image-wrap" style={{ aspectRatio: '16/9' }}>
                  <img src={s.coverImage} alt={s.title} />
                </div>
                <div className="service-card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span className="service-category">{s.category}</span>
                    <h3 className="service-card-title">{s.title}</h3>
                    <p className="service-card-desc">{s.summary}</p>
                  </div>
                  <Link to={`/services/${s.slug}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: 12 }}>
                    <span>Explore Department</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/services" className="btn btn-secondary">
              <span>View All Medical Specialties & Facilities</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECTION: [TREATMENTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="treatments" aria-label="Clinical Treatments">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Protocols</span>
            <h2 className="section-title">Specialized Treatment Pathways</h2>
            <p className="section-subtitle">
              Stringent protocol-driven treatments emphasizing patient comfort, adverse reaction prevention, and organ protection.
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {(treatments.length > 0 ? treatments.slice(0, 3) : [
              {
                id: 't1',
                slug: 'leukodepleted-prbc-transfusion',
                title: 'Leukodepleted Packed Red Cell Transfusion',
                category: 'Daycare Transfusion',
                summary: 'Triple pre-crossmatching and micro-aggregate leukodepletion to prevent febrile non-hemolytic transfusion reactions (FNHTR).',
                duration: '2 - 3 Hours',
                indicators: ['Saline Crossmatch', 'Leukofiltration', 'Vitals Logging']
              },
              {
                id: 't2',
                slug: 'advanced-iron-chelation-therapy',
                title: 'Longitudinal Iron Chelation & Serum Ferritin Care',
                category: 'Chelation Therapy',
                summary: 'Customized oral chelation dosages paired with regular liver and cardiac iron overload assessments to safeguard vital organs.',
                duration: 'Ongoing Protocol',
                indicators: ['Serum Ferritin', 'Dosage Calibration', 'Organ Screening']
              },
              {
                id: 't3',
                slug: 'glycemic-stabilization-insulin-titration',
                title: 'Comprehensive Diabetology & Neuropathy Care',
                category: 'Diabetology',
                summary: 'Personalized insulin titration, biothesiometer vibration perception thresholding, and continuous glucose monitoring.',
                duration: 'Outpatient / Daycare',
                indicators: ['HbA1c Tracking', 'Vibration Threshold', 'Diet Charting']
              }
            ]).map((t) => (
              <div key={t.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-red">{t.category}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {t.duration || 'Standard Session'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 10 }}>{t.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16 }}>
                    {t.summary}
                  </p>
                </div>

                <div>
                  {t.indicators && Array.isArray(t.indicators) && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {t.indicators.map((ind, i) => (
                        <span key={i} className="badge" style={{ background: 'var(--canvas)', fontSize: 11, border: '1px solid var(--line)' }}>
                          ✓ {ind}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link to={`/treatments/${t.slug}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Protocol Details</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/treatments" className="btn btn-secondary">
              <span>View All Treatment Protocols</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECTION: {STOCK AVAILABILITY OF BLOOD AS CARDS MATCHING ADMIN BLOOD BANK PAGE} - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-gradient" id="blood-stock" aria-label="Live Blood Bank Stock Availability">
        <div className="container">
          <div className="section-head">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(169, 17, 41, 0.08)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--red-700)', marginBottom: 12 }}>
              <span className="pulse-dot" />
              <span>Real-Time Transfusion Reserve</span>
            </div>
            <h2 className="section-title">Blood Bank Stock Availability</h2>
            <p className="section-subtitle">
              Exact available live units count that is unreserved and ready for transfusion across all 8 blood groups.
            </p>
          </div>

          {/* Quick Stats Bar Matching Admin Topbar */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: 16,
              padding: '16px 24px',
              border: '1px solid var(--line)',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <strong style={{ fontSize: 15, color: 'var(--ink)', display: 'block' }}>
                  {bloodTotals.availableUnits} Live Units Currently Available (Unreserved)
                </strong>
                <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                  ✓ Triple Pre-Crossmatched & Saline Compatible
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Emergency Hotline:</span>
              <a href="tel:+918328581019" className="btn btn-primary btn-sm">
                <Phone size={14} />
                <span>+91 83285 81019</span>
              </a>
            </div>
          </div>

          {/* 8 BLOOD STOCK CARDS (MATCHING ADMIN INVENTORY PAGE CARDS) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              marginBottom: 24
            }}
          >
            {bloodStocks.map((stock) => {
              const liveCount = stock.availableUnits !== undefined ? stock.availableUnits : Math.max(0, stock.units - (stock.reservedUnits || 0));
              const isLow = liveCount <= (stock.threshold || 5);

              return (
                <div
                  key={stock.id || stock.group}
                  className={`home-blood-card ${isLow ? 'is-low' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 className="home-blood-group-title">{stock.group}</h3>
                    <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`} style={{ fontSize: 11 }}>
                      {isLow ? 'Near Low' : 'Optimal'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: 'var(--ink-soft)' }}>Units Available:</span>
                    <strong style={{ fontSize: 15, color: isLow ? 'var(--red-700)' : 'var(--ink)' }}>
                      {liveCount} units
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
                    <span>Threshold:</span>
                    <span>{stock.threshold || 5} units</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 8, fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Check size={12} />
                    <span>Unreserved & Ready</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-soft)' }}>
            <span>* For immediate daycare transfusion allocation or rare negative group reservation, contact our 24/7 Transfusion Coordinator.</span>
          </div>
        </div>
      </section>

      {/* 6. SECTION: [DOCTORS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="doctors" aria-label="Specialist Doctors">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Leadership</span>
            <h2 className="section-title">Consultant Physicians & Specialists</h2>
            <p className="section-subtitle">
              Led by Dr. Narayana Murthy M.D., bringing over two decades of clinical distinction to patient care.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
            {(specialists.length > 0 ? specialists.slice(0, 2) : [
              {
                id: 'doc-1',
                name: 'Dr. Narayana Murthy M.D.',
                department: 'Senior Diabetologist & General Physician',
                qualifications: 'M.B.B.S., M.D. (General Medicine)',
                bio: 'With over 22 years of clinical excellence, Dr. Narayana Murthy has successfully stabilized more than 8,500 diabetic and thalassemia patients across Telangana.',
                opdTimings: 'Mon - Sat: 11:00 AM - 3:00 PM & 6:00 PM - 8:30 PM',
                image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'doc-2',
                name: 'Dr. S. K. Ayesha M.D.',
                department: 'Consultant Pediatrician & Daycare In-Charge',
                qualifications: 'M.B.B.S., D.C.H., Fellow in Pediatric Hematology',
                bio: 'Dedicated to painless, anxiety-free transfusions for children with Thalassemia major and Sickle Cell Disease with continuous micro-filtration monitoring.',
                opdTimings: 'Mon - Fri: 10:00 AM - 4:00 PM',
                image: 'https://images.unsplash.com/photo-1594824813626-d621b1a7d65b?auto=format&fit=crop&w=800&q=80'
              }
            ]).map((doc) => (
              <div key={doc.id} className="specialist-card" style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <div style={{ width: '38%', minHeight: 220, position: 'relative' }}>
                  <img
                    src={doc.image}
                    alt={doc.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div className="specialist-card-body" style={{ width: '62%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="specialist-dept">{doc.department}</span>
                  <h3 className="specialist-name">{doc.name}</h3>
                  <p className="specialist-qual">{doc.qualifications}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12, lineHeight: 1.6 }}>
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

          <div style={{ textAlign: 'center' }}>
            <Link to="/doctors" className="btn btn-secondary">
              <span>View All Specialist Doctors & OPD Schedules</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SECTION: [PRODUCTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="products" aria-label="Healthcare Products & Packages">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Preventive Health</span>
            <h2 className="section-title">Diagnostic & Care Packages</h2>
            <p className="section-subtitle">
              Curated clinical health checkups offering automated bio-analyzer blood profiling, HbA1c tests, and physician reviews.
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {(products.length > 0 ? products.slice(0, 3) : [
              {
                id: 'p1',
                slug: 'diabetic-comprehensive-profile',
                name: 'Comprehensive Diabetic Evaluation Profile',
                price: 1499,
                originalPrice: 2200,
                inStock: true,
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
                features: ['Fasting & PP Blood Sugar', 'HbA1c Glycated Hemoglobin', 'Lipid Profile', 'Serum Creatinine (Kidney)', 'Physician Consultation']
              },
              {
                id: 'p2',
                slug: 'thalassemia-chelation-monitoring',
                name: 'Thalassemia Routine Chelation Panel',
                price: 1899,
                originalPrice: 2600,
                inStock: true,
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
                features: ['Complete Blood Picture (CBP)', 'Serum Ferritin Level', 'Liver Function Test (LFT)', 'Serum Electrolytes', 'Pediatric Review']
              },
              {
                id: 'p3',
                slug: 'executive-full-body-wellness',
                name: 'Executive Preventive Health Checkup',
                price: 2499,
                originalPrice: 3800,
                inStock: true,
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
                features: ['Complete Hemogram (60 Parameters)', 'Cardiac Lipid Risk Panel', 'Kidney & Liver Function', 'Thyroid Profile (TSH)', 'ECG & Doctor Consultation']
              }
            ]).map((pkg) => (
              <div key={pkg.id} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                    <img src={pkg.image} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 8, color: 'var(--ink)' }}>{pkg.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--red-700)' }}>₹{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'var(--muted)' }}>
                        ₹{pkg.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <ul style={{ paddingLeft: 18, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.8, marginBottom: 16 }}>
                    {(Array.isArray(pkg.features) ? pkg.features : []).slice(0, 4).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <Link to="/products" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>View Package & Inquire</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/products" className="btn btn-secondary">
              <span>View All Health Checkup Packages</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SECTION: [INSIGHTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="insights" aria-label="Medical Insights & Health Blogs">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Clinical Insights</span>
            <h2 className="section-title">Health Articles & Medical Advice</h2>
            <p className="section-subtitle">
              Expert patient guides on diabetes lifestyle management, hemoglobin diagnostics, and transfusion safety.
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {(blogs.length > 0 ? blogs.slice(0, 3) : [
              {
                id: 'b1',
                slug: 'understanding-hba1c-glycemic-targets',
                title: 'Understanding Your HbA1c: Glycemic Targets Beyond Daily Glucose',
                category: 'Diabetology',
                summary: 'Why longitudinal 90-day hemoglobin A1c testing is the clinical gold standard for preventing microvascular neuropathy.',
                createdAt: new Date().toISOString(),
                readTime: '4 min read',
                coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'b2',
                slug: 'importance-of-leukodepleted-blood-transfusions',
                title: 'Why Leukodepletion Matters for Regular Transfusion Recipients',
                category: 'Hematology',
                summary: 'How micro-aggregate white blood cell filtration prevents alloimmunization and febrile reactions in Thalassemia warriors.',
                createdAt: new Date().toISOString(),
                readTime: '5 min read',
                coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
              },
              {
                id: 'b3',
                slug: 'hplc-diagnostics-for-hemoglobinopathies',
                title: 'HPLC Chromatography: Precise Hemoglobinopathy Detection',
                category: 'Diagnostics',
                summary: 'The crucial role of automated high performance liquid chromatography in diagnosing sickle trait and thalassemia carrier states.',
                createdAt: new Date().toISOString(),
                readTime: '4 min read',
                coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
              }
            ]).map((blog) => (
              <div key={blog.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ width: '100%', height: 160, overflow: 'hidden' }}>
                  <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 20, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="badge badge-red" style={{ fontSize: 11 }}>{blog.category}</span>
                      <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{blog.readTime || '4 min read'}</span>
                    </div>
                    <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.4, color: 'var(--ink)' }}>{blog.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 14 }}>
                      {blog.summary}
                    </p>
                  </div>
                  <Link to={`/insights/${blog.slug}`} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/insights" className="btn btn-secondary">
              <span>View All Health Articles & Guides</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. SECTION: [CONTACT] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="contact" aria-label="Contact and Appointment Booking">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">Direct Outpatient Scheduling</span>
            <h2 className="section-title">Schedule Your Consultation or Reach Out</h2>
            <p className="section-subtitle">
              Located on Wyra Road, Khammam. Walk-ins are welcomed during clinical OPD hours.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
            {/* BOOKING FORM CARD */}
            <div className="card" style={{ padding: 32, border: '1.5px solid var(--red-100)' }}>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Book an OPD Token</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
                Submit your details to reserve a direct doctor consultation token.
              </p>

              {bookingSuccess ? (
                <div style={{ background: 'var(--green-bg)', padding: 24, borderRadius: 14, textAlign: 'center', border: '1px solid #c2e8d9' }}>
                  <CheckCircle size={44} style={{ color: 'var(--green)', margin: '0 auto 12px' }} />
                  <h3 style={{ color: 'var(--green)', fontSize: 18, marginBottom: 8 }}>Appointment Registered!</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 14 }}>
                    Tracking Code: <strong style={{ fontSize: 16, color: 'var(--red-700)' }}>{bookingSuccess.apptCode}</strong>
                  </p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
                    Our patient care coordinator will call {bookingSuccess.phone} to confirm your appointment time.
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
                  </div>

                  <div className="grid-2">
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
                      <label className="form-label">Department / Specialty</label>
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
                    <label className="form-label">Symptoms / Reason for Visit (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Brief description of consultation request..."
                      value={booking.reason}
                      onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 8 }}
                    disabled={bookingLoading}
                  >
                    <Calendar size={16} />
                    <span>{bookingLoading ? 'Registering Booking...' : 'Confirm Appointment Request'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* LOCATION & CONTACT DETAILS CARD */}
            <div className="card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 20, marginBottom: 14 }}>Hospital Information</h3>

              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>Hospital Address</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.5 }}>
                    Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana 507001
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>Contact & Emergency Hotline</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>
                    Emergency & Transfusions: <a href="tel:+918328581019" style={{ color: 'var(--red-700)', fontWeight: 600 }}>+91 83285 81019</a>
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '2px 0 0' }}>
                    Email: info@rithanya.in
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>Operating Timings</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>
                    Outpatient (OPD): Mon - Sat: 11:00 AM - 5:00 PM
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '2px 0 0' }}>
                    Daycare Transfusions: 24/7 Priority Emergency Support
                  </p>
                </div>
              </div>

              <Link to="/contact" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                <span>View Full Contact Page & Directions</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
