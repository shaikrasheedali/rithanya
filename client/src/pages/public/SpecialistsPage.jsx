import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Award, UserCheck, GraduationCap, Phone, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../../utils/api';

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpecialists() {
      try {
        const res = await apiRequest('/specialists');
        setSpecialists(res.data || []);
      } catch (err) {
        console.error('Failed to load specialists:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSpecialists();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="specialists-page" style={{ padding: '60px 0 100px', background: 'var(--canvas)' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 50, textAlign: 'center' }}>
          <span className="section-tag">Hospital Medical Faculty</span>
          <h1 className="section-title">Specialist Doctors & Lead Consultants</h1>
          <p className="section-subtitle" style={{ maxWidth: 760, margin: '0 auto' }}>
            Experienced clinical practitioners committed to compassionate patient communication, evidence-based therapies, and holistic long-term disease management at Rithanya Hospital, Khammam.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-soft)' }}>
            Loading doctor profiles...
          </div>
        ) : (
          <div className="specialists-block-list">
            {specialists.map((doc) => {
              const profileUrl = `/doctors/${doc.slug || doc.id}`;

              return (
                <div key={doc.id} className="specialist-block-card">
                  <div className="specialist-block-content">
                    {/* Media Column (Left) */}
                    <div className="specialist-block-media">
                      {doc.registrationNumber && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            padding: '6px 12px',
                            borderRadius: 20,
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: 'var(--red-700)',
                            border: '1px solid var(--red-200)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                          }}
                        >
                          <UserCheck size={13} />
                          <span>Regd: {doc.registrationNumber}</span>
                        </div>
                      )}

                      <Link to={profileUrl} style={{ display: 'block', width: '100%', height: '100%', textAlign: 'center' }}>
                        <img
                          src={doc.image || '/image.png'}
                          alt={doc.name}
                          loading="lazy"
                        />
                      </Link>
                    </div>

                    {/* Content Body (Right) */}
                    <div className="specialist-block-body">
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                          <span className="badge badge-red" style={{ fontSize: 12, padding: '5px 12px' }}>
                            {doc.department}
                          </span>
                          {doc.experience && (
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
                              {doc.experience} Clinical Experience
                            </span>
                          )}
                        </div>

                        <h2 style={{ fontSize: 'clamp(22px, 3.2vw, 32px)', marginBottom: 6, color: 'var(--ink)' }}>
                          <Link to={profileUrl} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {doc.name}
                          </Link>
                        </h2>

                        <p style={{ color: 'var(--red-700)', fontWeight: 700, fontSize: 'clamp(14px, 1.8vw, 16.5px)', marginBottom: 14 }}>
                          {doc.designation}
                        </p>

                        {/* Qualifications Box */}
                        <div
                          style={{
                            background: 'var(--canvas)',
                            border: '1px solid var(--line)',
                            borderRadius: 12,
                            padding: '12px 16px',
                            marginBottom: 16,
                            display: 'flex',
                            gap: 10,
                            alignItems: 'flex-start'
                          }}
                        >
                          <GraduationCap size={18} style={{ color: 'var(--red-700)', flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                              Qualifications & Fellowships
                            </span>
                            <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                              {doc.qualifications}
                            </p>
                          </div>
                        </div>

                        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {doc.bio}
                        </p>
                      </div>

                      {/* Schedule & Action Row */}
                      <div
                        style={{
                          borderTop: '1.5px solid var(--line)',
                          paddingTop: 18,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 16
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)' }}>
                          <Clock size={16} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                          <span><strong>Consultation Hours:</strong> {doc.opdTimings}</span>
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                          <Link to={profileUrl} className="btn btn-primary">
                            <span>View Full Profile & Credentials</span>
                            <ArrowRight size={16} />
                          </Link>

                          <Link to={`${profileUrl}#book-consultation`} className="btn btn-secondary">
                            <Calendar size={16} />
                            <span>Book Consultation</span>
                          </Link>

                          <a href="tel:8328581019" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                            <Phone size={14} />
                            <span>8328581019</span>
                          </a>
                        </div>
                      </div>
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
