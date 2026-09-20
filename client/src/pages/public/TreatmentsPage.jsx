import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Clock, Stethoscope, CheckCircle2, Droplet, Sparkles, Activity } from 'lucide-react';
import { apiRequest } from '../../utils/api';

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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 28
            }}
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                className="treatment-card"
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1.5px solid var(--line)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Media Container */}
                <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden', background: '#000' }}>
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(169, 17, 41, 0.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 14,
                      fontSize: 11.5,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}
                  >
                    {item.category}
                  </div>

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
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                  >
                    <Clock size={13} />
                    <span>{item.duration || '45-90 mins'}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '22px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--red-700)', fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
                    <Stethoscope size={14} />
                    <span>{item.doctorName || 'Dr. Narayana Murthy, MD'}</span>
                  </div>

                  <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16, flexGrow: 1 }}>
                    {item.summary}
                  </p>

                  {/* Procedures Bullets */}
                  {Array.isArray(item.procedures) && item.procedures.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginBottom: 18 }}>
                      <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-soft)', letterSpacing: 0.5, marginBottom: 8 }}>
                        Key Procedures & Safety:
                      </p>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {item.procedures.slice(0, 3).map((proc, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--ink)' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                            <span>{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Footer */}
                  <Link
                    to={`/treatments/${item.slug}`}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderRadius: 12,
                      padding: '10px 18px',
                      fontSize: 13.5,
                      fontWeight: 700
                    }}
                  >
                    <span>View Treatment Details</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
