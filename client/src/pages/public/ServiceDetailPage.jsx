import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import ImageCarousel from '../../components/common/ImageCarousel';
import useDynamicTranslation from '../../utils/dynamicTranslator';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, loc, locItem } = useDynamicTranslation();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      try {
        const res = await apiRequest(`/services/${slug}`);
        setService(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [slug]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>{t('common.loading', 'Loading specialty details...')}</div>;
  }

  if (!service) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>{loc('Service Not Found')}</h2>
        <p style={{ marginTop: 10, color: 'var(--ink-soft)' }}>{loc('The requested clinical specialty could not be located.')}</p>
        <Link to="/services" className="btn btn-primary" style={{ marginTop: 20 }}>{loc('Back to Services')}</Link>
      </div>
    );
  }

  const currentService = locItem(service);
  const allImages = [currentService.coverImage, ...(currentService.galleryImages || [])].filter(Boolean);

  return (
    <div className="service-detail-page" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <Link to="/services" className="btn btn-secondary btn-sm" style={{ marginBottom: 24 }}>
          <ArrowLeft size={16} />
          <span>{loc('Back to All Specialties')}</span>
        </Link>

        <div className="service-detail-grid">
          {/* Main content */}
          <div>
            <span className="badge badge-red" style={{ marginBottom: 12 }}>{currentService.category}</span>
            <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 36px)', marginBottom: 16 }}>{currentService.title}</h1>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--ink-soft)', fontSize: 13, marginBottom: 24 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={15} style={{ color: 'var(--red-700)' }} />
                {loc(currentService.author)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} style={{ color: 'var(--red-700)' }} />
                {loc(currentService.readTime)}
              </span>
            </div>

            {/* Image Carousel */}
            <div style={{ marginBottom: 32 }}>
              <ImageCarousel images={allImages} alt={currentService.title} />
            </div>

            {/* Rich text Quill rendered content */}
            <div
              className="article-content-body"
              style={{ lineHeight: 1.8, fontSize: 15, color: '#333' }}
              dangerouslySetInnerHTML={{ __html: currentService.content }}
            />
          </div>

          {/* Sidebar Action card */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div className="card card-responsive" style={{ border: '1.5px solid var(--red-100)' }}>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>{loc('Consult a Specialist')}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 20 }}>
                {loc('Outpatient evaluations with Dr. Narayana Murthy are available Mon - Sat (11:00 AM to 5:00 PM).')}
              </p>

              <div style={{ background: 'var(--red-50)', padding: 16, borderRadius: 12, marginBottom: 24, fontSize: 13 }}>
                <p style={{ marginBottom: 6 }}><strong>{t('common.consultationHours', 'OPD Timings')}:</strong> Mon–Sat: 11:00 AM – 5:00 PM</p>
                <p style={{ marginBottom: 6 }}><strong>{loc('Daycare Transfusions')}:</strong> {loc('24/7 Monitored Support')}</p>
                <p><strong>{loc('Emergency')}:</strong> +91 83285 81019</p>
              </div>

              <Link to="/contact#appointment" className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>
                <Calendar size={16} />
                <span>{loc('Book Appointment')}</span>
              </Link>

              <a href="tel:+918328581019" className="btn btn-secondary" style={{ width: '100%' }}>
                <span>{loc('Call Emergency Reception')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
