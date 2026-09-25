import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Clock, Stethoscope, CheckCircle2, Droplet, Sparkles, Activity } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useDynamicTranslation } from '../../utils/dynamicTranslator';

const DEFAULT_TREATMENT_IMAGES = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
];

export default function TreatmentsPage() {
  const { t, loc, locItems } = useDynamicTranslation();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchTreatments() {
      try {
        const res = await apiRequest('/treatments');
        setTreatments(res.data || []);
      } catch (err) {
        console.error('Failed to load treatments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTreatments();
  }, []);

  const localizedTreatments = locItems(treatments);
  const categories = ['All', ...new Set(localizedTreatments.map((t) => t.category).filter(Boolean))];

  const filtered = localizedTreatments.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.department && item.department.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="treatments-page" style={{ padding: '60px 0 90px' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-head" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              background: 'var(--red-50)',
              color: 'var(--red-700)',
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 16
            }}
          >
            <Sparkles size={15} />
            <span>{t('home.treatmentsTag', 'Treatments & Conditions Managed')}</span>
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 14 }}>
            {t('home.treatmentsTitle', 'Treatments & Conditions Managed')}
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 780, margin: '0 auto', fontSize: 16, color: 'var(--ink-soft)' }}>
            {t('home.treatmentsSub', 'Under the clinical leadership of Dr. D. Narayana Murthy (MD SVIMS, Diabetologist) and Dr. A. Lakshmi Deepa (MBBS, Gynecologist), Rithanya Hospital provides structured, evidence-based care for 40 major medical conditions, emergency medicine, and chronic disease regulation.')}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 36,
            background: '#fff',
            padding: '16px 20px',
            borderRadius: 16,
            border: '1px solid var(--line)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)'
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 20, fontSize: 13, padding: '7px 16px' }}
              >
                {cat === 'All' ? t('common.all', 'All') : cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
            <Search
              size={17}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder={t('common.searchTreatments', 'Search clinical treatments...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 38, borderRadius: 20, fontSize: 13 }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
            <Activity size={32} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--red-700)', marginBottom: 12 }} />
            <p>{t('common.loading', 'Loading clinical treatment protocols...')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
            <p style={{ fontSize: 16 }}>{t('common.noResults', 'No treatments found matching your criteria.')}</p>
          </div>
        ) : (
          /* Treatments Grid */
          <div className="grid-3">
            {filtered.map((item, idx) => {
              const fallbackImg = DEFAULT_TREATMENT_IMAGES[idx % DEFAULT_TREATMENT_IMAGES.length];
              const imgSrc = item.coverImage && item.coverImage.trim() !== '' ? item.coverImage : fallbackImg;
              const treatmentUrl = `/treatments/${item.slug}`;

              return (
                <div key={item.id} className="service-card treatment-service-card">
                  {/* Media Image Wrap */}
                  <div className="card-image-wrap" style={{ position: 'relative' }}>
                    <Link to={treatmentUrl} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img
                        src={imgSrc}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImg;
                        }}
                      />
                    </Link>
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(169, 17, 41, 0.92)',
                        backdropFilter: 'blur(8px)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        zIndex: 2
                      }}
                    >
                      {item.category}
                    </div>

                    {item.status === 'draft' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'rgba(234, 179, 8, 0.95)',
                          backdropFilter: 'blur(8px)',
                          color: '#713f12',
                          padding: '4px 9px',
                          borderRadius: 10,
                          fontSize: 10.5,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          zIndex: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                        }}
                      >
                        {loc('Draft')}
                      </div>
                    )}

                    {item.duration && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          background: 'rgba(17, 12, 14, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 10,
                          fontSize: 11.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          zIndex: 2
                        }}
                      >
                        <Clock size={12} />
                        <span>{item.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Service Card Body */}
                  <div className="service-card-body">
                    <span className="service-category">{item.department || item.category}</span>
                    <h3 className="service-card-title">
                      <Link to={treatmentUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="service-card-desc">{item.summary}</p>

                    {/* Footer Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 'auto', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--red-700)', fontSize: 12, fontWeight: 600 }}>
                        <Stethoscope size={14} />
                        <span>{loc(item.doctorName ? item.doctorName.split('(')[0].trim() : 'Dr. Narayana Murthy')}</span>
                      </div>

                      <Link
                        to={treatmentUrl}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <span>{t('home.viewProtocol', loc('View Protocol'))}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
