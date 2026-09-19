import React, { useState, useEffect } from 'react';
import { Image, X } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import Modal from '../../components/common/Modal';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await apiRequest('/gallery');
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  const categories = ['All', 'Facility', 'Daycare', 'Diagnostics', 'Specialists', 'Patient Care'];

  const filtered = items.filter((item) => category === 'All' || item.category === category);

  return (
    <div className="gallery-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Hospital Infrastructure</span>
          <h1 className="section-title">Facility & Clinical Tour</h1>
          <p className="section-subtitle">
            Take a visual tour of our sanitized day-care transfusion beds, clinical bio-analyzer laboratory, outpatient chambers, and patient support amenities.
          </p>
        </div>

        {/* Categories Bar */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Loading facility photos...</div>
        ) : (
          <div className="grid-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="card card-clickable"
                style={{ padding: 12 }}
                onClick={() => setActiveImage(item)}
              >
                {/* Fixed aspect ratio wrapper preventing awkward stretching or gaps */}
                <div className="gallery-image-wrap" style={{ aspectRatio: '16/10', borderRadius: 14 }}>
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div style={{ padding: '14px 8px 6px' }}>
                  <span className="badge badge-red" style={{ fontSize: 11, marginBottom: 6 }}>{item.category}</span>
                  <h4 style={{ fontSize: 16, marginBottom: 4 }}>{item.title}</h4>
                  {item.caption && <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <Modal
          isOpen={!!activeImage}
          onClose={() => setActiveImage(null)}
          title={activeImage?.title || 'Facility Photo'}
          size="lg"
        >
          {activeImage && (
            <div>
              <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              {activeImage.caption && (
                <p style={{ marginTop: 14, color: 'var(--ink)', fontSize: 14, lineHeight: 1.6 }}>
                  {activeImage.caption}
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
