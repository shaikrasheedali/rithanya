import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Clock, Stethoscope, CheckCircle2, Droplet, Sparkles, Activity } from 'lucide-react';
import { apiRequest } from '../../utils/api';

const DEFAULT_TREATMENT_IMAGES = [
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
];

export default function TreatmentsPage() {
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

  const categories = ['All', ...new Set(treatments.map((t) => t.category))];

  const filtered = treatments.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.summary.toLowerCase().includes(search.toLowerCase()) ||
      (t.department && t.department.toLowerCase().includes(search.toLowerCase()));
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
            <span>Clinical Treatments & Daycare Procedures</span>
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 14 }}>
            Evidence-Based Specialized Treatments
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 740, margin: '0 auto', fontSize: 16, color: 'var(--ink-soft)' }}>
            Under the guidance of <strong>Dr. Narayana Murthy M.D.</strong>, Rithanya Hospital offers comprehensive clinical protocols for Thalassemia daycare transfusions, longitudinal diabetology, HPLC diagnostics, and chronic care.
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
                {cat}
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
              placeholder="Search clinical treatments..."
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
            <p>Loading clinical treatment protocols...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
            <p style={{ fontSize: 16 }}>No treatments found matching your criteria.</p>
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
                        <span>{item.doctorName ? item.doctorName.split('(')[0].trim() : 'Dr. Narayana Murthy'}</span>
                      </div>

                      <Link
                        to={treatmentUrl}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <span>View Protocol</span>
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
