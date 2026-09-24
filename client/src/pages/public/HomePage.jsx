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
import SpecialtiesMarquee from '../../components/common/SpecialtiesMarquee';
import { formatDate } from '../../utils/formatters';
import { useDynamicTranslation } from '../../utils/dynamicTranslator';

const DEFAULT_TREATMENT_IMAGES = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
];

export default function HomePage() {
  const { addToast } = useToast();
  const { t, loc, locItems } = useDynamicTranslation();

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
    let isMounted = true;
    async function loadHomeData() {
      setLoading(true);
      try {
        const [servRes, treatRes, bloodRes, specRes, prodRes, blogRes] = await Promise.allSettled([
          apiRequest('/services'),
          apiRequest('/treatments'),
          apiRequest('/inventory/public'),
          apiRequest('/specialists'),
          apiRequest('/products'),
          apiRequest('/blogs')
        ]);

        if (!isMounted) return;

        if (servRes.status === 'fulfilled' && servRes.value?.data) {
          setServices(Array.isArray(servRes.value.data) ? servRes.value.data : []);
        }
        if (treatRes.status === 'fulfilled' && treatRes.value?.data) {
          setTreatments(Array.isArray(treatRes.value.data) ? treatRes.value.data : []);
        }
        if (bloodRes.status === 'fulfilled' && bloodRes.value?.data) {
          setBloodStocks(Array.isArray(bloodRes.value.data.stocks) ? bloodRes.value.data.stocks : []);
          setBloodTotals(bloodRes.value.data.totals || { totalUnits: 0, availableUnits: 0, criticalAlerts: 0 });
        }
        if (specRes.status === 'fulfilled' && specRes.value?.data) {
          setSpecialists(Array.isArray(specRes.value.data) ? specRes.value.data : []);
        }
        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          setProducts(Array.isArray(prodRes.value.data) ? prodRes.value.data : []);
        }
        if (blogRes.status === 'fulfilled' && blogRes.value?.data) {
          setBlogs(Array.isArray(blogRes.value.data) ? blogRes.value.data : []);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
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

  const displayedServices = locItems(services);
  const displayedTreatments = locItems(treatments);
  const displayedSpecialists = locItems(specialists);
  const displayedProducts = locItems(products);
  const displayedBlogs = locItems(blogs);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION: FULL VIEWPORT HEIGHT */}
      <HeroVideoSlider />

      {/* SPECIALTIES & HBA2 ANNOUNCEMENT MARQUEE */}
      <SpecialtiesMarquee />

      {/* 2. SECTION: [ABOUT US / HOSPITAL ENTRANCE - 50/50 TWO-ASIDE SPLIT] */}
      <section className="home-viewport-section bg-white" id="about" aria-label="About Rithanya Hospital">
        <div className="container">
          <div className="home-about-split-grid">
            {/* Left Aside: Official Hospital Storefront Image */}
            <aside className="home-about-split-media" aria-label="Hospital Building Entrance">
              <div className="home-about-img-frame">
                <img
                  src="/image.png"
                  alt="Rithanya Hospital Khammam Front Entrance and 24/7 Diagnostic Center"
                  className="home-about-img"
                />
                <div className="home-about-badge">
                  <MapPin size={15} style={{ color: 'var(--red-400)', flexShrink: 0 }} />
                  <span>{t('brand.tagline')}</span>
                </div>
              </div>
            </aside>

            {/* Right Aside: Institutional Text Contents & Highlights */}
            <aside className="home-about-split-text" aria-label="Hospital Institutional Overview">
              <div style={{ marginBottom: 18 }}>
                <span className="section-tag" style={{ marginBottom: 10, display: 'inline-block' }}>
                  {t('home.aboutTag')}
                </span>
                <h2 className="section-title" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', marginBottom: 8, lineHeight: 1.25, textAlign: 'left' }}>
                  {t('home.aboutTitle')}
                </h2>
                <div style={{ color: 'var(--red-700)', fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>
                  {t('home.aboutSub')}
                </div>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
                  {t('home.aboutDesc')}
                </p>
              </div>

              {/* Highlights Feature Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>
                <div className="card" style={{ padding: '12px 16px', border: '1px solid var(--line)', background: 'var(--canvas)', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3 }}>
                    <Clock size={17} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>{t('home.emergencyCardTitle')}</h4>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.45 }}>
                    {t('home.emergencyCardDesc')}
                  </p>
                </div>

                <div className="card" style={{ padding: '12px 16px', border: '1px solid var(--line)', background: 'var(--canvas)', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3 }}>
                    <Droplet size={17} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>{t('home.bloodBankCardTitle')}</h4>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.45 }}>
                    {t('home.bloodBankCardDesc')}
                  </p>
                </div>

                <div className="card" style={{ padding: '12px 16px', border: '1px solid var(--line)', background: 'var(--canvas)', borderRadius: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 3 }}>
                    <ShieldCheck size={17} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                    <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: 0 }}>{t('home.aarogyasriCardTitle')}</h4>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.45 }}>
                    {t('home.aarogyasriCardDesc')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-primary btn-sm" style={{ padding: '9px 18px', fontSize: 13 }}>
                  <span>{t('home.aboutBtn')}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link to="/treatments" className="btn btn-secondary btn-sm" style={{ padding: '9px 18px', fontSize: 13 }}>
                  <span>{t('nav.treatments')}</span>
                </Link>
                <a href="tel:+918328581019" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', fontSize: 13 }}>
                  <Phone size={13} className="text-red" />
                  <span>Call 8328581019</span>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. SECTION: [SERVICES] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="services" aria-label="Clinical Services">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.servicesTag')}</span>
            <h2 className="section-title">{t('home.servicesTitle')}</h2>
            <p className="section-subtitle">
              {t('home.servicesSub')}
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 20, minHeight: 280, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--line)', borderRadius: 10, marginBottom: 16 }} />
                  <div style={{ width: '40%', height: 14, background: 'var(--line)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ width: '80%', height: 20, background: 'var(--line)', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ width: '100%', height: 14, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : displayedServices.length > 0 ? (
              displayedServices.slice(0, 6).map((s) => (
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
                      <span>{t('common.viewDetails')}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/services" className="btn btn-secondary">
              <span>{t('common.viewAll')} {t('nav.services')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECTION: [TREATMENTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="treatments" aria-label="Clinical Treatments">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.treatmentsTag')}</span>
            <h2 className="section-title">{t('home.treatmentsTitle')}</h2>
            <p className="section-subtitle">
              {t('home.treatmentsSub')}
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 24, minHeight: 260, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '30%', height: 16, background: 'var(--line)', borderRadius: 4, marginBottom: 16 }} />
                  <div style={{ width: '85%', height: 22, background: 'var(--line)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ width: '100%', height: 14, background: 'var(--line)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '60%', height: 14, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : displayedTreatments.length > 0 ? (
              displayedTreatments.slice(0, 6).map((tItem, idx) => {
                const indicators = Array.isArray(tItem.procedures) ? tItem.procedures : (Array.isArray(tItem.indicators) ? tItem.indicators : []);
                const fallbackImg = DEFAULT_TREATMENT_IMAGES[idx % DEFAULT_TREATMENT_IMAGES.length];
                const imgSrc = tItem.coverImage && tItem.coverImage.trim() !== '' ? tItem.coverImage : fallbackImg;
                return (
                  <div key={tItem.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 16 }}>
                    <div style={{ position: 'relative', width: '100%', height: 165, overflow: 'hidden', background: '#0b162c' }}>
                      <img
                        src={imgSrc}
                        alt={tItem.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImg;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: 10, left: 10 }}>
                        <span className="badge badge-red" style={{ fontSize: 11, background: 'rgba(169, 17, 41, 0.9)', color: '#fff' }}>
                          {tItem.category}
                        </span>
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        background: 'rgba(17, 12, 14, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 8,
                        fontSize: 11.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Clock size={11} />
                        <span>{tItem.duration || 'Standard Session'}</span>
                      </div>
                    </div>

                    <div style={{ padding: '20px 22px 22px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: 17, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.35 }}>{tItem.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
                          {tItem.summary}
                        </p>
                      </div>

                      <div>
                        {indicators.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                            {indicators.slice(0, 2).map((ind, i) => (
                              <span key={i} className="badge" style={{ background: 'var(--canvas)', fontSize: 11, border: '1px solid var(--line)' }}>
                                ✓ {typeof ind === 'string' ? ind : (ind.name || 'Protocol')}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link to={`/treatments/${tItem.slug}`} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                          <span>{t('common.viewDetails')}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/treatments" className="btn btn-secondary">
              <span>{t('common.viewAll')} {t('nav.treatments')}</span>
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
              <span>{t('bloodBank.tag', 'Real-Time Transfusion Reserve')}</span>
            </div>
            <h2 className="section-title">{t('bloodBank.title', 'Blood Bank Stock Availability')}</h2>
            <p className="section-subtitle">
              {t('bloodBank.sub', 'Exact available live units count that is unreserved and ready for transfusion across all 8 blood groups.')}
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
                  {bloodTotals.availableUnits} {t('bloodBank.unitsAvailableUnreserved', 'Live Units Currently Available (Unreserved)')}
                </strong>
                <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>
                  {t('bloodBank.preCrossmatched', '✓ Triple Pre-Crossmatched & Saline Compatible')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t('bloodBank.emergencyHotline', 'Emergency Hotline:')}</span>
              <a href="tel:+918328581019" className="btn btn-primary btn-sm">
                <Phone size={14} />
                <span>+91 83285 81019</span>
              </a>
            </div>
          </div>

          {/* 8 BLOOD STOCK CARDS (MATCHING ADMIN INVENTORY PAGE CARDS) */}
          <div className="home-blood-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="home-blood-card" style={{ padding: 20, minHeight: 140, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '40%', height: 28, background: 'var(--line)', borderRadius: 6, marginBottom: 12 }} />
                  <div style={{ width: '70%', height: 16, background: 'var(--line)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '50%', height: 14, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : bloodStocks.length > 0 ? (
              bloodStocks.map((stock) => {
                const liveCount = stock.availableUnits !== undefined ? stock.availableUnits : (stock.unreservedUnits !== undefined ? stock.unreservedUnits : Math.max(0, (stock.units || 0) - (stock.reservedUnits || 0)));
                const thresholdVal = stock.threshold || 5;
                const isLow = stock.isLow !== undefined ? stock.isLow : (liveCount <= thresholdVal);
                const statusLabel = isLow ? t('bloodBank.nearLow', 'Near Low') : t('bloodBank.optimal', 'Optimal');

                return (
                  <div
                    key={stock.id || stock.group}
                    className={`home-blood-card ${isLow ? 'is-low' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 className="home-blood-group-title">{stock.group}</h3>
                      <span className={`badge ${isLow ? 'badge-red' : 'badge-green'}`} style={{ fontSize: 11 }}>
                        {statusLabel}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: 'var(--ink-soft)' }}>{t('bloodBank.unitsAvailable', 'Units Available')}:</span>
                      <strong style={{ fontSize: 15, color: isLow ? 'var(--red-700)' : 'var(--ink)' }}>
                        {liveCount} {t('bloodBank.units', 'units')}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8 }}>
                      <span>{t('bloodBank.threshold', 'Threshold')}:</span>
                      <span>{thresholdVal} {t('bloodBank.units', 'units')}</span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 8, fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Check size={12} />
                      <span>{t('bloodBank.unreservedReady', 'Unreserved & Ready')}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('bloodBank.connecting', 'Blood bank stock units are synchronized live with hospital inventory. Connecting to registry...')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-soft)' }}>
            <span>{t('bloodBank.disclaimer', '* For immediate daycare transfusion allocation or rare negative group reservation, contact our 24/7 Transfusion Coordinator.')}</span>
          </div>
        </div>
      </section>

      {/* 6. SECTION: [DOCTORS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="doctors" aria-label="Specialist Doctors">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.doctorsTag')}</span>
            <h2 className="section-title">{t('home.doctorsTitle')}</h2>
            <p className="section-subtitle">
              {t('home.doctorsSub')}
            </p>
          </div>

          <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 24, minHeight: 240, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '40%', height: 16, background: 'var(--line)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ width: '70%', height: 22, background: 'var(--line)', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ width: '100%', height: 14, background: 'var(--line)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '60%', height: 14, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : displayedSpecialists.length > 0 ? (
              displayedSpecialists.slice(0, 4).map((doc) => (
                <div key={doc.id} className="specialist-card" style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                  <div style={{ width: '38%', minHeight: 220, position: 'relative' }}>
                    <img
                      src={doc.image || '/image.png'}
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
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/doctors" className="btn btn-secondary">
              <span>{t('common.viewAll')} {t('nav.doctors')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SECTION: [PRODUCTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="products" aria-label="Healthcare Products & Packages">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.productsTag')}</span>
            <h2 className="section-title">{t('home.productsTitle')}</h2>
            <p className="section-subtitle">
              {t('home.productsSub')}
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 22, minHeight: 280, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '100%', height: 150, background: 'var(--line)', borderRadius: 10, marginBottom: 14 }} />
                  <div style={{ width: '70%', height: 20, background: 'var(--line)', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ width: '40%', height: 18, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : displayedProducts.length > 0 ? (
              displayedProducts.slice(0, 6).map((pkg) => (
                <div key={pkg.id} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ width: '100%', height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                      <img src={pkg.image || '/image.png'} alt={pkg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      <span>{t('common.viewDetails')}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/products" className="btn btn-secondary">
              <span>{t('common.viewAll')} {t('nav.products')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SECTION: [INSIGHTS] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-white" id="insights" aria-label="Medical Insights & Health Blogs">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.blogsTag')}</span>
            <h2 className="section-title">{t('home.blogsTitle')}</h2>
            <p className="section-subtitle">
              {t('home.blogsSub')}
            </p>
          </div>

          <div className="grid-3" style={{ marginBottom: 28 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 20, minHeight: 280, opacity: 0.6, animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ width: '100%', height: 150, background: 'var(--line)', borderRadius: 10, marginBottom: 14 }} />
                  <div style={{ width: '35%', height: 14, background: 'var(--line)', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ width: '80%', height: 20, background: 'var(--line)', borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ width: '100%', height: 14, background: 'var(--line)', borderRadius: 4 }} />
                </div>
              ))
            ) : displayedBlogs.length > 0 ? (
              displayedBlogs.slice(0, 6).map((blog) => (
                <div key={blog.id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ width: '100%', height: 160, overflow: 'hidden' }}>
                    <img src={blog.coverImage || '/image.png'} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                      <span>{t('common.readMore')}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '36px 0', color: 'var(--ink-soft)' }}>
                <p>{t('common.loading')}</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/insights" className="btn btn-secondary">
              <span>{t('common.viewAll')} {t('nav.insights')}</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. SECTION: [CONTACT] - VIEWPORT HEIGHT MINUS NAVBAR */}
      <section className="home-viewport-section bg-soft" id="contact" aria-label="Contact and Appointment Booking">
        <div className="container">
          <div className="section-head">
            <span className="section-tag">{t('home.bookWidgetTag')}</span>
            <h2 className="section-title">{t('home.bookWidgetTitle')}</h2>
            <p className="section-subtitle">
              {t('home.bookWidgetSub')}
            </p>
          </div>

          <div className="grid-2" style={{ gap: 32, alignItems: 'start' }}>
            {/* BOOKING FORM CARD */}
            <div className="card card-responsive" style={{ border: '1.5px solid var(--red-100)' }}>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>{t('nav.bookAppointment')}</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20 }}>
                {t('home.bookWidgetSub')}
              </p>

              {bookingSuccess ? (
                <div style={{ background: 'var(--green-bg)', padding: 24, borderRadius: 14, textAlign: 'center', border: '1px solid #c2e8d9' }}>
                  <CheckCircle size={44} style={{ color: 'var(--green)', margin: '0 auto 12px' }} />
                  <h3 style={{ color: 'var(--green)', fontSize: 18, marginBottom: 8 }}>{t('home.bookingSuccessTitle')}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 14 }}>
                    Tracking Code: <strong style={{ fontSize: 16, color: 'var(--red-700)' }}>{bookingSuccess.apptCode}</strong>
                  </p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
                    {t('home.bookingSuccessMsg')}
                  </p>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setBookingSuccess(null)}>
                    {t('common.bookNow')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">{t('home.patientName')} *</label>
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
                      <label className="form-label">{t('home.phone')} *</label>
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
                      <label className="form-label">{t('home.preferredDate')} *</label>
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
                      <label className="form-label">{t('home.specialty')}</label>
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
                    <label className="form-label">{t('home.reason')} (Optional)</label>
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
                    <span>{bookingLoading ? 'Registering Booking...' : t('home.bookSubmit')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* LOCATION & CONTACT DETAILS CARD */}
            <div className="card card-responsive">
              <h3 style={{ fontSize: 20, marginBottom: 14 }}>{t('brand.name')}</h3>

              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>{t('footer.address')}</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.5 }}>
                    {t('brand.tagline')}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>{t('footer.emergencyContact')}</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>
                    Emergency & Transfusions: <a href="tel:+918328581019" style={{ color: 'var(--red-700)', fontWeight: 600 }}>+91 83285 81019</a>
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '2px 0 0' }}>
                    Email: info@rithanyahospital.com
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>{t('common.consultationHours')}</strong>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '4px 0 0' }}>
                    Outpatient (OPD): Mon - Sat: 11:00 AM - 5:00 PM
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: '2px 0 0' }}>
                    Daycare Transfusions: 24/7 Priority Emergency Support
                  </p>
                </div>
              </div>

              <Link to="/contact" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                <span>{t('common.viewDetails')} & Directions</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
