import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Video,
  Youtube,
  Instagram,
  Facebook,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Link as LinkIcon,
  FolderOpen
} from 'lucide-react';
import AdminTopbar from '../../components/layout/AdminTopbar';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import ImageUploadField from '../../components/common/ImageUploadField';
import MediaLibraryModal from '../../components/common/MediaLibraryModal';
import { parseEmbedSource, parseGalleryItemMedia } from '../../utils/mediaEmbed';
import { getSafeImageUrl, onImageError } from '../../utils/imageUtils';

export default function GalleryAdminPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTarget, setPreviewTarget] = useState(null);
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);

  // Form State
  const [sourceMode, setSourceMode] = useState('UPLOAD'); // 'UPLOAD' or 'EMBED'
  const [formData, setFormData] = useState({
    title: '',
    category: 'Facility',
    mediaType: 'IMAGE',
    imageUrl: '',
    embedUrl: '',
    caption: ''
  });

  // Multiple media assets for UPLOAD mode
  const [assetList, setAssetList] = useState([]); // [{ url, type: 'IMAGE'|'VIDEO' }]
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [manualAssetUrl, setManualAssetUrl] = useState('');
  const [manualAssetType, setManualAssetType] = useState('IMAGE');
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Live Carousel Preview index inside modal
  const [modalSlideIdx, setModalSlideIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await apiRequest('/gallery');
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openModal = (item = null) => {
    setModalSlideIdx(0);
    setManualAssetUrl('');
    setShowManualUrl(false);

    if (item) {
      setEditItem(item);
      const parsed = parseGalleryItemMedia(item);

      if (parsed.type === 'CAROUSEL' || (parsed.assets && parsed.assets.length > 0 && !item.embedUrl?.includes('<iframe') && !item.embedUrl?.includes('youtube') && !item.embedUrl?.includes('instagram') && !item.embedUrl?.includes('facebook'))) {
        setSourceMode('UPLOAD');
        setAssetList(parsed.assets || [{ url: item.imageUrl, type: item.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE' }]);
      } else if (item.embedUrl && (item.embedUrl.includes('<iframe') || item.embedUrl.includes('youtube') || item.embedUrl.includes('instagram') || item.embedUrl.includes('facebook') || item.embedUrl.startsWith('http'))) {
        setSourceMode('EMBED');
        setAssetList([]);
      } else {
        setSourceMode('UPLOAD');
        setAssetList(item.imageUrl ? [{ url: item.imageUrl, type: item.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE' }] : []);
      }

      setFormData({
        title: item.title,
        category: item.category,
        mediaType: item.mediaType || 'IMAGE',
        imageUrl: item.imageUrl || '',
        embedUrl: item.embedUrl || '',
        caption: item.caption || ''
      });
    } else {
      setEditItem(null);
      setSourceMode('UPLOAD');
      setAssetList([]);
      setFormData({
        title: '',
        category: 'Facility',
        mediaType: 'IMAGE',
        imageUrl: '',
        embedUrl: '',
        caption: ''
      });
    }
    setIsOpen(true);
  };

  // Upload asset file (image or video)
  const handleAssetFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingAsset(true);
    let addedCount = 0;

    for (const file of files) {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|mkv)$/i.test(file.name);
      const isImg = file.type.startsWith('image/') || /\.(jpeg|jpg|png|webp|svg|gif)$/i.test(file.name);

      if (!isImg && !isVideo) {
        addToast(`Skipped ${file.name}: only images and videos are supported`, 'error');
        continue;
      }

      const form = new FormData();
      form.append('file', file);

      try {
        const res = await apiRequest('/media/upload', {
          method: 'POST',
          body: form
        });
        const url = res.data?.url || res.url;
        if (url) {
          setAssetList((prev) => [...prev, { url, type: isVideo ? 'VIDEO' : 'IMAGE' }]);
          addedCount++;
        }
      } catch (err) {
        addToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    setUploadingAsset(false);
    if (addedCount > 0) {
      addToast(`Added ${addedCount} media asset${addedCount > 1 ? 's' : ''} to item`, 'success');
    }
  };

  const handleAddManualAsset = () => {
    if (!manualAssetUrl.trim()) return;
    setAssetList((prev) => [...prev, { url: manualAssetUrl.trim(), type: manualAssetType }]);
    setManualAssetUrl('');
    setShowManualUrl(false);
  };

  const handleRemoveAsset = (idx) => {
    setAssetList((prev) => prev.filter((_, i) => i !== idx));
    if (modalSlideIdx >= assetList.length - 1 && modalSlideIdx > 0) {
      setModalSlideIdx(modalSlideIdx - 1);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('Please enter a title for the gallery item', 'error');
      return;
    }

    let payload = { ...formData };

    if (sourceMode === 'UPLOAD') {
      if (assetList.length === 0) {
        addToast('Please upload or add at least one image or video', 'error');
        return;
      }

      if (assetList.length === 1) {
        const single = assetList[0];
        payload.imageUrl = single.url;
        payload.mediaType = single.type;
        // Save carousel JSON to preserve structure if edited later
        payload.embedUrl = JSON.stringify({ type: 'CAROUSEL', assets: assetList });
      } else {
        // Multi-asset carousel
        const firstImg = assetList.find((a) => a.type === 'IMAGE');
        payload.imageUrl = firstImg ? firstImg.url : assetList[0].url;
        payload.mediaType = 'CAROUSEL';
        payload.embedUrl = JSON.stringify({ type: 'CAROUSEL', assets: assetList });
      }
    } else {
      // Social or iframe embed
      if (!formData.embedUrl.trim()) {
        addToast('Please paste an iframe embed code or social media URL', 'error');
        return;
      }

      const parsed = parseEmbedSource(formData.embedUrl, formData.mediaType);
      payload.mediaType = parsed.mediaType || 'YOUTUBE';
      payload.embedUrl = formData.embedUrl.trim();
      if (!payload.imageUrl) {
        payload.imageUrl = '/assets/images/defaults/hospital-tour.webp';
      }
    }

    setSubmitting(true);
    try {
      if (editItem) {
        await apiRequest(`/gallery/${editItem.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        addToast('Gallery item updated successfully', 'success');
      } else {
        await apiRequest('/gallery', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Gallery item created successfully', 'success');
      }
      setIsOpen(false);
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to save gallery item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await apiRequest(`/gallery/${id}`, { method: 'DELETE' });
      addToast('Gallery item removed', 'success');
      fetchGallery();
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error');
    }
  };

  const getMediaBadge = (item) => {
    const parsed = parseGalleryItemMedia(item);
    if (parsed.type === 'CAROUSEL') {
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--red-50, #fee2e2)',
            color: 'var(--red-800, #991b1b)',
            fontSize: 11,
            fontWeight: 700
          }}
        >
          <Layers size={13} />
          <span>Carousel ({parsed.count} items)</span>
        </span>
      );
    }
    if (parsed.type === 'VIDEO') {
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--canvas-warm, #f3f4f6)',
            fontSize: 11
          }}
        >
          <Video size={13} style={{ color: '#8b5cf6' }} />
          <span>Single Video</span>
        </span>
      );
    }
    if (parsed.type === 'EMBED') {
      const type = item.mediaType || 'YOUTUBE';
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--canvas-warm, #f3f4f6)',
            fontSize: 11
          }}
        >
          {type === 'YOUTUBE' && <Youtube size={13} style={{ color: '#ef4444' }} />}
          {type === 'INSTAGRAM' && <Instagram size={13} style={{ color: '#ec4899' }} />}
          {type === 'FACEBOOK' && <Facebook size={13} style={{ color: '#3b82f6' }} />}
          <span>{type} Embed</span>
        </span>
      );
    }
    return (
      <span
        className="badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: 'var(--canvas-warm, #f3f4f6)',
          fontSize: 11
        }}
      >
        <ImageIcon size={13} style={{ color: 'var(--ink-soft)' }} />
        <span>Single Image</span>
      </span>
    );
  };

  const parsedModalEmbed = parseEmbedSource(formData.embedUrl, formData.mediaType);

  return (
    <div className="admin-page">
      <AdminTopbar
        title="Gallery CMS"
        subtitle="Manage Single Photos/Videos, Multi-Asset Carousels & Social iframe Embeds"
        actions={
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
            <Plus size={16} />
            <span>Add Gallery Item</span>
          </button>
        }
      />

      <div className="admin-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Format & Assets</th>
                <th>Category</th>
                <th>Content / Embed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                    No gallery items found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const parsed = parseGalleryItemMedia(item);
                  return (
                    <tr key={item.id}>
                      <td style={{ width: 90 }}>
                        <div style={{ width: 70, height: 46, borderRadius: 8, overflow: 'hidden', background: '#000' }}>
                          <img
                            src={getSafeImageUrl(item.imageUrl)}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => onImageError(e)}
                          />
                        </div>
                      </td>
                      <td>
                        <strong>{item.title}</strong>
                      </td>
                      <td>{getMediaBadge(item)}</td>
                      <td>
                        <span className="badge badge-red">{item.category}</span>
                      </td>
                      <td style={{ maxWidth: 260, fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 8px', fontSize: 11 }}
                            onClick={() => {
                              setPreviewTarget(item);
                              setPreviewOpen(true);
                            }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>
                          <span
                            style={{
                              fontSize: 11,
                              color: 'var(--ink-soft)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 160
                            }}
                          >
                            {parsed.type === 'CAROUSEL'
                              ? `${parsed.count} items in carousel`
                              : item.embedUrl?.startsWith('<iframe')
                              ? 'Direct iframe snippet'
                              : item.caption || item.embedUrl || 'Single asset'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => openModal(item)}
                            title="Edit Gallery Item"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#d32f2f' }}
                            onClick={() => handleDelete(item.id)}
                            title="Delete Gallery Item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* CREATE / EDIT MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          size="lg"
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Item Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Daycare Transfusion Ward Tour or Thalassemia Awareness Video"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Facility">Facility Tour</option>
                  <option value="Daycare">Transfusion Daycare</option>
                  <option value="Diagnostics">Laboratory & Diagnostics</option>
                  <option value="Specialists">Specialists & OPD</option>
                  <option value="Patient Care">Patient Care & Community</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Media Source Mode</label>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${sourceMode === 'UPLOAD' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setSourceMode('UPLOAD')}
                  >
                    <Upload size={14} />
                    <span>Upload Media (Files)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${sourceMode === 'EMBED' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setSourceMode('EMBED')}
                  >
                    <Youtube size={14} />
                    <span>Social / iframe Embed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MODE 1: UPLOAD MEDIA FILES (SINGLE CONTAINER OR MULTI-ASSET CAROUSEL) */}
            {sourceMode === 'UPLOAD' && (
              <div
                style={{
                  padding: 16,
                  background: 'var(--canvas-warm, #f8fafc)',
                  borderRadius: 12,
                  border: '1.5px solid var(--line)',
                  marginBottom: 18
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <label className="form-label" style={{ marginBottom: 2 }}>
                      Uploaded Media Assets ({assetList.length})
                    </label>
                    <small style={{ color: 'var(--ink-soft)', display: 'block' }}>
                      {assetList.length === 0
                        ? 'Upload 1 or more images/videos. 1 asset renders as a single container; 2+ assets render as an interactive carousel.'
                        : assetList.length === 1
                        ? '1 asset added — will render as a single container.'
                        : `✨ ${assetList.length} assets added — will automatically render as an interactive Carousel!`}
                    </small>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setLibraryModalOpen(true)}
                      title="Select from already uploaded media assets"
                    >
                      <FolderOpen size={14} style={{ color: 'var(--red-600)' }} />
                      <span>Choose from Library</span>
                    </button>

                    <label
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: uploadingAsset ? 'not-allowed' : 'pointer' }}
                    >
                      <Upload size={14} />
                      <span>{uploadingAsset ? 'Uploading...' : '+ Upload Files'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        onChange={handleAssetFileUpload}
                        disabled={uploadingAsset}
                      />
                    </label>

                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      title="Add media by URL"
                    >
                      <LinkIcon size={14} />
                      <span>Add URL</span>
                    </button>
                  </div>
                </div>

                {/* Optional manual URL adder */}
                {showManualUrl && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      padding: 10,
                      background: 'var(--canvas)',
                      borderRadius: 8,
                      border: '1px solid var(--line)',
                      marginBottom: 12
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      style={{ flex: 1 }}
                      placeholder="Paste image or direct video URL (e.g. /assets/uploads/... or https://...)"
                      value={manualAssetUrl}
                      onChange={(e) => setManualAssetUrl(e.target.value)}
                    />
                    <select
                      className="form-control"
                      style={{ width: 110 }}
                      value={manualAssetType}
                      onChange={(e) => setManualAssetType(e.target.value)}
                    >
                      <option value="IMAGE">Image</option>
                      <option value="VIDEO">Video</option>
                    </select>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleAddManualAsset}>
                      Add
                    </button>
                  </div>
                )}

                {/* Asset Items List */}
                {assetList.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '30px 16px',
                      border: '2px dashed var(--line)',
                      borderRadius: 10,
                      background: 'var(--canvas)'
                    }}
                  >
                    <Upload size={28} style={{ color: 'var(--ink-soft)', marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--ink)' }}>
                      No media uploaded yet for this gallery item.
                    </p>
                    <p style={{ margin: '4px 0 10px', fontSize: 11, color: 'var(--ink-soft)' }}>
                      Upload images/videos from your computer, choose from library, or paste direct URLs.
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setLibraryModalOpen(true)}
                    >
                      <FolderOpen size={13} style={{ color: 'var(--red-600)' }} />
                      <span>Choose from Media Library</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Thumbnails grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                        gap: 10,
                        marginBottom: 14
                      }}
                    >
                      {assetList.map((asset, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            borderRadius: 8,
                            overflow: 'hidden',
                            border:
                              modalSlideIdx === idx && assetList.length > 1
                                ? '2px solid var(--red-600)'
                                : '1px solid var(--line)',
                            background: '#000',
                            aspectRatio: '16/10',
                            cursor: 'pointer'
                          }}
                          onClick={() => setModalSlideIdx(idx)}
                        >
                          {asset.type === 'VIDEO' ? (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#1e293b'
                              }}
                            >
                              <Video size={22} style={{ color: '#fff' }} />
                            </div>
                          ) : (
                            <img
                              src={getSafeImageUrl(asset.url)}
                              alt={`Asset ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => onImageError(e)}
                            />
                          )}

                          <span
                            style={{
                              position: 'absolute',
                              bottom: 4,
                              left: 4,
                              fontSize: 10,
                              background: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '1px 5px',
                              borderRadius: 4
                            }}
                          >
                            #{idx + 1} {asset.type === 'VIDEO' ? 'VID' : 'IMG'}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAsset(idx);
                            }}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'rgba(220, 38, 38, 0.85)',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            title="Remove asset"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Live Carousel / Single Container Preview */}
                    <div
                      style={{
                        padding: 12,
                        background: 'var(--canvas)',
                        borderRadius: 10,
                        border: '1px solid var(--line)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-900)' }}>
                          {assetList.length > 1 ? `✓ Live Carousel Preview (Slide ${modalSlideIdx + 1} of ${assetList.length}):` : '✓ Single Container Preview:'}
                        </span>
                      </div>

                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          maxHeight: 280,
                          aspectRatio: '16/10',
                          borderRadius: 8,
                          overflow: 'hidden',
                          background: '#000',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {assetList[modalSlideIdx]?.type === 'VIDEO' ? (
                          <video
                            controls
                            src={assetList[modalSlideIdx]?.url}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        ) : (
                          <img
                            src={getSafeImageUrl(assetList[modalSlideIdx]?.url)}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => onImageError(e)}
                          />
                        )}

                        {/* Prev / Next controls if carousel */}
                        {assetList.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setModalSlideIdx((prev) => (prev > 0 ? prev - 1 : assetList.length - 1))
                              }
                              style={{
                                position: 'absolute',
                                left: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setModalSlideIdx((prev) => (prev < assetList.length - 1 ? prev + 1 : 0))
                              }
                              style={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: SOCIAL / IFRAME EMBED */}
            {sourceMode === 'EMBED' && (
              <div className="form-group">
                <label className="form-label">Direct iframe Embed Code or Media URL *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder='Paste direct iframe embed code (e.g. <iframe src="..." ...></iframe>), Instagram embed snippet (<blockquote ...>), or video URL...'
                  value={formData.embedUrl}
                  onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })}
                  required={sourceMode === 'EMBED'}
                />
                <small style={{ color: 'var(--ink-soft)', display: 'block', marginTop: 4 }}>
                  Supports YouTube standard/shorts iframes, Instagram reel/post embed snippets, and Facebook video plugins.
                </small>

                {/* Live Preview Inside Modal */}
                {parsedModalEmbed.src && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      background: 'var(--canvas)',
                      borderRadius: 10,
                      border: '1px solid var(--line)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-900)' }}>
                        ✓ Live Responsive Preview ({parsedModalEmbed.aspectRatio} format):
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: parsedModalEmbed.isVertical ? 340 : '100%',
                        aspectRatio: parsedModalEmbed.aspectRatio,
                        maxHeight: 380,
                        margin: '0 auto',
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: '#000'
                      }}
                    >
                      <iframe
                        src={parsedModalEmbed.src}
                        title="Live Embed Preview"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 14 }}>
                  <ImageUploadField
                    label="Cover Image / Video Poster (Optional for embed)"
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    helperText="Displayed as the card preview image before user opens the embed"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Caption / Clinical Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Optional description displayed in modal lightbox"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Gallery Item'}
              </button>
            </div>
          </form>
        </Modal>

        {/* ADMIN PREVIEW MODAL */}
        <Modal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={previewTarget?.title || 'Gallery Item Preview'}
          size="lg"
        >
          {previewTarget && (() => {
            const parsed = parseGalleryItemMedia(previewTarget);
            return (
              <div style={{ textAlign: 'center' }}>
                {parsed.type === 'CAROUSEL' ? (
                  <AdminCarouselViewer assets={parsed.assets} />
                ) : parsed.type === 'EMBED' ? (
                  <div
                    style={{
                      width: '100%',
                      maxWidth: parsed.embed.isVertical ? 420 : 800,
                      aspectRatio: parsed.embed.aspectRatio,
                      maxHeight: '75vh',
                      margin: '0 auto',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000'
                    }}
                  >
                    <iframe
                      src={parsed.embed.src}
                      title={previewTarget.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : parsed.type === 'VIDEO' ? (
                  <div
                    style={{
                      width: '100%',
                      maxHeight: '75vh',
                      aspectRatio: '16/9',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000',
                      margin: '0 auto'
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
                  <div
                    style={{
                      width: '100%',
                      maxHeight: '75vh',
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#000',
                      margin: '0 auto'
                    }}
                  >
                    <img
                      src={getSafeImageUrl(parsed.url)}
                      alt={previewTarget.title}
                      style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain' }}
                      onError={(e) => onImageError(e)}
                    />
                  </div>
                )}

                {previewTarget.caption && (
                  <p style={{ marginTop: 14, color: 'var(--ink)', fontSize: 13 }}>
                    {previewTarget.caption}
                  </p>
                )}
              </div>
            );
          })()}
        </Modal>

        {/* MEDIA LIBRARY PICKER MODAL */}
        <MediaLibraryModal
          isOpen={libraryModalOpen}
          onClose={() => setLibraryModalOpen(false)}
          multiSelect={true}
          title="Select Media Assets for Gallery Item"
          onSelect={(selected) => {
            const itemsToAdd = Array.isArray(selected) ? selected : [selected];
            setAssetList((prev) => [...prev, ...itemsToAdd.map((a) => ({ url: a.url, type: a.type || 'IMAGE' }))]);
            addToast(`Added ${itemsToAdd.length} asset${itemsToAdd.length > 1 ? 's' : ''} from library`, 'success');
          }}
        />
      </div>
    </div>
  );
}

// Mini preview helper component for Admin Carousel
function AdminCarouselViewer({ assets }) {
  const [current, setCurrent] = useState(0);
  if (!assets || assets.length === 0) return null;

  const asset = assets[current];

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          aspectRatio: '16/10',
          maxHeight: '70vh',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#000',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {asset.type === 'VIDEO' ? (
          <video controls autoPlay src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <img
            src={getSafeImageUrl(asset.url)}
            alt={`Slide ${current + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => onImageError(e)}
          />
        )}

        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : assets.length - 1))}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={() => setCurrent((prev) => (prev < assets.length - 1 ? prev + 1 : 0))}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={20} />
        </button>

        <span
          style={{
            position: 'absolute',
            bottom: 12,
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: 16,
            fontSize: 12
          }}
        >
          {current + 1} / {assets.length}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12 }}>
        {assets.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: current === i ? 'var(--red-600)' : 'var(--line)',
              border: 'none',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}
