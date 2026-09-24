import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useDynamicTranslation } from '../../utils/dynamicTranslator';

export default function ServicesPage() {
  const { t, locItems } = useDynamicTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await apiRequest('/services');
        setServices(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const localizedServices = locItems(services);
  const categories = ['All', ...new Set(localizedServices.map((s) => s.category).filter(Boolean))];

  const filtered = localizedServices.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.summary || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="services-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">{t('home.departmentsTag', 'Clinical Departments')}</span>
          <h1 className="section-title">{t('home.departmentsTitle', 'Comprehensive Healthcare Services')}</h1>
          <p className="section-subtitle">
            {t('home.departmentsSub', 'Specialized departments catering to internal medicine, chronic disease management, pediatric health, and transfusion daycare.')}
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
            marginBottom: 36
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? t('common.all', 'All') : cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: 280 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder={t('common.search', 'Search specialties...')}
              style={{ paddingLeft: 36 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Grid of services */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-soft)' }}>
            {t('common.loading', 'Loading clinical services...')}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 20 }}>
            {t('common.noResults', 'No services match your criteria.')}
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((service) => (
              <div key={service.id} className="service-card">
                <div className="card-image-wrap">
                  <img src={service.coverImage} alt={service.title} />
                </div>
                <div className="service-card-body">
                  <span className="service-category">{service.category}</span>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.summary}</p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="btn btn-outline btn-sm"
                    style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
                  >
                    <span>{t('home.viewOverview', 'Read Full Overview')}</span>
                    <ArrowRight size={14} />
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
