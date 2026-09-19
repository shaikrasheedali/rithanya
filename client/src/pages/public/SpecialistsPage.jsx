import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Phone, Award } from 'lucide-react';
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSpecialists();
  }, []);

  return (
    <div className="specialists-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Medical Team</span>
          <h1 className="section-title">Specialist Physicians & Consultants</h1>
          <p className="section-subtitle">
            Experienced clinical practitioners committed to transparent patient communication and holistic long-term disease management.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Loading specialists...</div>
        ) : (
          <div className="grid-2">
            {specialists.map((doc) => (
              <div key={doc.id} className="card" style={{ display: 'flex', gap: 24, padding: 24 }}>
                <div style={{ width: 140, height: 160, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={doc.image} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span className="badge badge-red" style={{ alignSelf: 'flex-start', marginBottom: 8 }}>{doc.department}</span>
                  <h3 style={{ fontSize: 20, marginBottom: 4 }}>{doc.name}</h3>
                  <p style={{ color: 'var(--red-700)', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{doc.designation}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 12 }}>{doc.qualifications}</p>
                  <p style={{ fontSize: 13, color: 'var(--ink)', marginBottom: 16, lineHeight: 1.6 }}>{doc.bio}</p>

                  <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} style={{ color: 'var(--red-700)' }} />
                      <span>{doc.opdTimings}</span>
                    </div>

                    <Link to="/contact#appointment" className="btn btn-primary btn-sm">
                      <Calendar size={14} />
                      <span>Book Appointment</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
