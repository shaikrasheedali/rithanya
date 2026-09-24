import React, { useState, useEffect } from 'react';
import { Play, Image as ImageIcon, Youtube, Instagram, Facebook, Video, ExternalLink } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import Modal from '../../components/common/Modal';
import { parseEmbedSource } from '../../utils/mediaEmbed';
import useDynamicTranslation from '../../utils/dynamicTranslator';

function getEmbedIframeUrl(mediaType, url) {
  if (!url) return null;
  const t = (mediaType || '').toUpperCase();
  if (t === 'YOUTUBE' || url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = null;
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('shorts/')) {
      videoId = url.split('shorts/')[1]?.split('?')[0];
    } else if (url.includes('embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  }
  if (t === 'INSTAGRAM' || url.includes('instagram.com')) {
    const clean = url.split('?')[0].replace(/\/$/, '');
    return `${clean}/embed`;
  }
  if (t === 'FACEBOOK' || url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return url;
}

export default function GalleryPage() {
  const { t, loc, locItems } = useDynamicTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [mediaFilter, setMediaFilter] = useState('ALL');
  const [activeItem, setActiveItem] = useState(null);

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

  const localizedItems = locItems(items);

  const filtered = localizedItems.filter((item) => {
    const matchCat = category === 'All' || item.category === category || item.category === loc(category);
    const itemType = (item.mediaType || 'IMAGE').toUpperCase();
    const matchType =
      mediaFilter === 'ALL' ||
      (mediaFilter === 'PHOTOS' && itemType === 'IMAGE') ||
      (mediaFilter === 'VIDEOS' && itemType !== 'IMAGE');
    return matchCat && matchType;
  });

  return (
    <div className="gallery-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">{loc('Hospital Infrastructure & Media')}</span>
          <h1 className="section-title">{loc('Hospital Media & Facility Gallery')}</h1>
          <p className="section-subtitle">
            {loc('Take a visual tour of our sanitized day-care transfusion beds, clinical bio-analyzer laboratory, outpatient chambers, and video insights from our medical consultants.')}
          </p>
        </div>

        {/* Media Type & Category Filters */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginBottom: 40
          }}
        >
          {/* Photos vs Videos toggle */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--canvas-warm, #f1f5f9)',
              padding: 4,
              borderRadius: 30,
              gap: 4
            }}
          >
            <button
              type="button"
              className={`btn btn-sm ${mediaFilter === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 24, padding: '6px 16px' }}
              onClick={() => setMediaFilter('ALL')}
            >
              {loc('All Media')}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mediaFilter === 'PHOTOS' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 24, padding: '6px 16px' }}
              onClick={() => setMediaFilter('PHOTOS')}
            >
              {loc('Facility Photos')}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mediaFilter === 'VIDEOS' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 24, padding: '6px 16px' }}
              onClick={() => setMediaFilter('VIDEOS')}
            >
              {loc('Videos & Social Media')}
            </button>
          </div>

          {/* Department Categories Bar */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${category === cat ? 'btn-secondary' : 'btn-outline'}`}
                style={{
                  borderRadius: 20,
                  fontSize: 12.5,
                  fontWeight: category === cat ? 700 : 500,
                  borderColor: category === cat ? 'var(--red-600)' : 'var(--line)'
                }}
                onClick={() => setCategory(cat)}
              >
                {loc(cat)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>{t('common.loading', 'Loading hospital media items...')}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-soft)' }}>
            {loc('No media items found in this section.')}
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((item) => {
              const isVideo = item.mediaType && item.mediaType !== 'IMAGE';
              return (
                <div
                  key={item.id}
                  className="card card-clickable"
                  style={{ padding: 12, position: 'relative' }}
                  onClick={() => setActiveItem(item)}
                >
                  {/* Aspect ratio wrapper */}
                  <div
                    className="gallery-image-wrap"
                    style={{ aspectRatio: '16/10', borderRadius: 14, position: 'relative', overflow: 'hidden' }}
                  >
                    <img src={item.imageUrl} alt={item.title} />

                    {/* Play Badge Overlay for Videos */}
                    {isVideo && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          background: 'rgba(223, 56, 80, 0.9)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <Play size={22} style={{ fill: '#fff', marginLeft: 2 }} />
                      </div>
                    )}

                    {/* Media Type Icon Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      {item.mediaType === 'YOUTUBE' && <Youtube size={12} style={{ color: '#ef4444' }} />}
                      {item.mediaType === 'INSTAGRAM' && <Instagram size={12} style={{ color: '#ec4899' }} />}
                      {item.mediaType === 'FACEBOOK' && <Facebook size={12} style={{ color: '#3b82f6' }} />}
                      {item.mediaType === 'VIDEO' && <Video size={12} style={{ color: '#8b5cf6' }} />}
                      {(!item.mediaType || item.mediaType === 'IMAGE') && <ImageIcon size={12} />}
                      <span>{item.mediaType || 'PHOTO'}</span>
                    </span>
                  </div>

                  <div style={{ padding: '14px 8px 6px' }}>
                    <span className="badge badge-red" style={{ fontSize: 11, marginBottom: 6 }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: 16, marginBottom: 4 }}>{item.title}</h4>
                    {item.caption && (
                      <p
                        style={{
                          fontSize: 12.5,
                          color: 'var(--ink-soft)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lightbox / Media Player Modal */}
        <Modal
          isOpen={!!activeItem}
          onClose={() => setActiveItem(null)}
          title={activeItem?.title || loc('Hospital Media')}
          size="lg"
        >
          {activeItem && (
            <div>
              {activeItem.embedUrl ? (() => {
                const embed = parseEmbedSource(activeItem.embedUrl, activeItem.mediaType);
                return (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: embed.isVertical ? 420 : '100%',
                      aspectRatio: embed.aspectRatio,
                      maxHeight: '76vh',
                      margin: '0 auto',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
                    }}
                  >
                    <iframe
                      src={embed.src}
                      title={activeItem.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                );
              })() : activeItem.mediaType === 'VIDEO' ? (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#000'
                  }}
                >
                  <video
                    controls
                    autoPlay
                    src={activeItem.imageUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#000'
                  }}
                >
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span className="badge badge-red">{activeItem.category}</span>
                  {activeItem.embedUrl && (
                    <a
                      href={activeItem.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 12 }}
                    >
                      <span>{loc('Open on Social Platform')}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {activeItem.caption && (
                  <p style={{ marginTop: 12, color: 'var(--ink)', fontSize: 14, lineHeight: 1.6 }}>
                    {activeItem.caption}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
