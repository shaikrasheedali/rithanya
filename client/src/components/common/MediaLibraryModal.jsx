import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Video, Check, X, FolderOpen, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import { apiRequest } from '../../utils/api';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  multiSelect = false,
  title = 'Select Media from Library',
  filterType = 'ALL' // 'ALL' | 'IMAGE' | 'VIDEO'
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState(filterType);
  const [selectedUrls, setSelectedUrls] = useState([]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/media/assets');
      const list = res.data?.uploaded || res.assets || [];
      setAssets(list);
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrls([]);
      setSearch('');
      setActiveType(filterType);
      fetchAssets();
    }
  }, [isOpen, filterType]);

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filtered = assets.filter((item) => {
    const isVideo = item.mimeType?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(item.filename);
    const isImage = item.mimeType?.startsWith('image/') || /\.(jpeg|jpg|png|webp|svg|gif)$/i.test(item.filename);

    const matchesType =
      activeType === 'ALL' ||
      (activeType === 'IMAGE' && isImage) ||
      (activeType === 'VIDEO' && isVideo);

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.originalName?.toLowerCase().includes(q) ||
      item.filename?.toLowerCase().includes(q) ||
      item.url?.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  const handleCardClick = (item) => {
    const isVideo = item.mimeType?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(item.filename);
    const assetObj = {
      url: item.url,
      type: isVideo ? 'VIDEO' : 'IMAGE',
      originalName: item.originalName || item.filename,
      size: item.size
    };

    if (multiSelect) {
      setSelectedUrls((prev) => {
        const exists = prev.some((a) => a.url === item.url);
        if (exists) {
          return prev.filter((a) => a.url !== item.url);
        } else {
          return [...prev, assetObj];
        }
      });
    } else {
      onSelect(assetObj);
      onClose();
    }
  };

  const handleConfirmMulti = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Top Controls: Search, Filter Tabs, Refresh */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: 34, height: 38 }}
              placeholder="Search uploaded assets by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'inline-flex', background: 'var(--canvas-warm, #f1f5f9)', padding: 3, borderRadius: 20, gap: 2 }}>
            <button
              type="button"
              className={`btn btn-sm ${activeType === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 16 }}
              onClick={() => setActiveType('ALL')}
            >
              All Assets
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeType === 'IMAGE' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 16 }}
              onClick={() => setActiveType('IMAGE')}
            >
              Images
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeType === 'VIDEO' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 12px', fontSize: 12, borderRadius: 16 }}
              onClick={() => setActiveType('VIDEO')}
            >
              Videos
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchAssets}
            disabled={loading}
            title="Refresh assets library"
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
          </button>
        </div>

        {/* Media Grid */}
        <div
          style={{
            maxHeight: '55vh',
            overflowY: 'auto',
            padding: 4,
            borderRadius: 10,
            background: 'var(--canvas)',
            border: '1px solid var(--line)'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--ink-soft)' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: 0, fontSize: 13 }}>Loading media library assets...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--ink-soft)' }}>
              <FolderOpen size={36} style={{ color: 'var(--ink-soft)', marginBottom: 8 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>No media assets found</p>
              <p style={{ margin: '4px 0 0', fontSize: 12 }}>
                {search ? 'Try another search query or clear filter.' : 'Upload assets to populate this library.'}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 12,
                padding: 8
              }}
            >
              {filtered.map((item) => {
                const isVideo = item.mimeType?.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(item.filename);
                const isSelected = selectedUrls.some((a) => a.url === item.url);

                return (
                  <div
                    key={item.id || item.filename}
                    onClick={() => handleCardClick(item)}
                    style={{
                      position: 'relative',
                      borderRadius: 10,
                      overflow: 'hidden',
                      border: isSelected
                        ? '2.5px solid var(--red-600)'
                        : '1.5px solid var(--line)',
                      background: 'var(--card-bg, #fff)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 0 3px rgba(220, 38, 38, 0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    title={`${item.originalName || item.filename} (${formatSize(item.size)})`}
                  >
                    {/* Media Thumbnail Container */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1/1',
                        background: '#0f172a',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isVideo ? (
                        <div style={{ textAlign: 'center', color: '#fff' }}>
                          <Video size={28} style={{ color: '#818cf8', marginBottom: 2 }} />
                          <span style={{ display: 'block', fontSize: 10, fontWeight: 700 }}>VIDEO</span>
                        </div>
                      ) : (
                        <img
                          src={getSafeImageUrl(item.url)}
                          alt={item.originalName || item.filename}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => onImageError(e)}
                        />
                      )}

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            background: 'var(--red-600)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                            zIndex: 3
                          }}
                        >
                          <Check size={14} />
                        </div>
                      )}

                      {/* Type Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 5,
                          left: 5,
                          fontSize: 9.5,
                          fontWeight: 700,
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          padding: '1px 5px',
                          borderRadius: 4
                        }}
                      >
                        {isVideo ? 'VIDEO' : 'IMAGE'}
                      </span>
                    </div>

                    {/* Metadata Footer */}
                    <div style={{ padding: '6px 8px', fontSize: 11 }}>
                      <span
                        style={{
                          display: 'block',
                          fontWeight: 600,
                          color: 'var(--ink)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.originalName || item.filename}
                      </span>
                      <span style={{ color: 'var(--ink-soft)', fontSize: 10 }}>
                        {formatSize(item.size)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
            Showing {filtered.length} of {assets.length} items in media library
          </span>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            {multiSelect && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmMulti}
                disabled={selectedUrls.length === 0}
              >
                Insert Selected ({selectedUrls.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
