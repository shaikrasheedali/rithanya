import React, { useState, useEffect } from 'react';
import {
  Play,
  Image as ImageIcon,
  Youtube,
  Instagram,
  Facebook,
  Video,
  ExternalLink,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import Modal from '../../components/common/Modal';
import { parseGalleryItemMedia } from '../../utils/mediaEmbed';
import useDynamicTranslation from '../../utils/dynamicTranslator';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

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
    const parsed = parseGalleryItemMedia(item);

    const matchType =
      mediaFilter === 'ALL' ||
      (mediaFilter === 'PHOTOS' && (parsed.type === 'IMAGE' || (parsed.type === 'CAROUSEL' && !parsed.assets.some((a) => a.type === 'VIDEO')))) ||
      (mediaFilter === 'VIDEOS' && (parsed.type === 'VIDEO' || parsed.type === 'EMBED' || (parsed.type === 'CAROUSEL' && parsed.assets.some((a) => a.type === 'VIDEO'))));

    return matchCat && matchType;
  });

  return (
    <div className="gallery-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">{loc('Hospital Infrastructure & Facilities')}</span>
          <h1 className="section-title">{loc('Gallery')}</h1>
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
          <div style={{ textAlign: 'center', padding: 60 }}>{t('common.loading', loc('Loading hospital gallery items...'))}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--ink-soft)' }}>
            {loc('No media items found in this section.')}
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((item) => {
              const parsed = parseGalleryItemMedia(item);
              const isVideo = parsed.type === 'VIDEO' || parsed.type === 'EMBED';
              const isCarousel = parsed.type === 'CAROUSEL';

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
                    style={{ aspectRatio: '16/10', borderRadius: 14, position: 'relative', overflow: 'hidden', background: '#0f172a' }}
                  >
                    <img
                      src={getSafeImageUrl(item.imageUrl)}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => onImageError(e)}
                    />

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
                          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                          transition: 'transform 0.2s ease'
                        }}
                      >
                        <Play size={22} style={{ fill: '#fff', marginLeft: 2 }} />
                      </div>
                    )}

                    {/* Carousel Overlay Indicator */}
                    {isCarousel && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
                          left: 10,
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Layers size={13} />
                        <span>{parsed.count} {loc('Photos & Videos')}</span>
                      </div>
                    )}

                    {/* Media Type Icon Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.72)',
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
                      {isCarousel && <Layers size={12} style={{ color: '#f59e0b' }} />}
                      {!item.mediaType || item.mediaType === 'IMAGE' ? <ImageIcon size={12} /> : null}
                      <span>
                        {isCarousel
                          ? loc('Carousel')
                          : item.mediaType === 'VIDEO'
                          ? loc('Video')
                          : item.mediaType === 'YOUTUBE'
                          ? 'YouTube'
                          : item.mediaType === 'INSTAGRAM'
                          ? 'Instagram'
                          : item.mediaType === 'FACEBOOK'
                          ? 'Facebook'
                          : loc('Photo')}
                      </span>
                    </span>
                  </div>

                  <div style={{ padding: '14px 8px 6px' }}>
                    <span className="badge badge-red" style={{ fontSize: 11, marginBottom: 6 }}>
                      {loc(item.category)}
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

        {/* Lightbox / Media Player / Carousel Modal */}
        <Modal
          isOpen={!!activeItem}
          onClose={() => setActiveItem(null)}
          title={activeItem?.title || loc('Gallery')}
          size="lg"
        >
          {activeItem && (() => {
            const parsed = parseGalleryItemMedia(activeItem);

            return (
              <div>
                {/* 1. CAROUSEL (More than 1 asset) */}
                {parsed.type === 'CAROUSEL' ? (
                  <PublicCarouselViewer assets={parsed.assets} loc={loc} />
                ) : parsed.type === 'EMBED' ? (
                  /* 2. SOCIAL OR DIRECT IFRAME EMBED */
                  <div
                    style={{
                      width: '100%',
                      maxWidth: parsed.embed.isVertical ? 420 : '100%',
                      aspectRatio: parsed.embed.aspectRatio,
                      maxHeight: '76vh',
                      margin: '0 auto',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
                    }}
                  >
                    <iframe
                      src={parsed.embed.src}
                      title={activeItem.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : parsed.type === 'VIDEO' ? (
                  /* 3. SINGLE VIDEO CONTAINER */
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
                      src={parsed.url}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  /* 4. SINGLE IMAGE CONTAINER */
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
                      src={getSafeImageUrl(parsed.url)}
                      alt={activeItem.title}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => onImageError(e)}
                    />
                  </div>
                )}

                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span className="badge badge-red">{loc(activeItem.category)}</span>
                    {activeItem.embedUrl && !activeItem.embedUrl.startsWith('{') && (
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
            );
          })()}
        </Modal>
      </div>
    </div>
  );
}

// Interactive Fullscreen Carousel Viewer for Public Lightbox
function PublicCarouselViewer({ assets, loc }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!assets || assets.length === 0) return null;

  const currentAsset = assets[currentIndex];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : assets.length - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < assets.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 820,
          aspectRatio: '16/10',
          maxHeight: '76vh',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#000',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {currentAsset.type === 'VIDEO' ? (
          <video
            controls
            autoPlay
            src={currentAsset.url}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <img
            src={getSafeImageUrl(currentAsset.url)}
            alt={`Slide ${currentIndex + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => onImageError(e)}
          />
        )}

        {/* Prev / Next buttons */}
        <button
          type="button"
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
            zIndex: 10
          }}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
            zIndex: 10
          }}
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Counter Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            zIndex: 10
          }}
        >
          {currentIndex + 1} / {assets.length}
        </div>
      </div>

      {/* Slide dots / thumbnails */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        {assets.map((asset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            style={{
              width: currentIndex === i ? 24 : 10,
              height: 10,
              borderRadius: 5,
              background: currentIndex === i ? 'var(--red-600)' : 'var(--line)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
