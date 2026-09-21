import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Phone,
  ArrowLeft,
  Share2,
  Tag,
  Package,
  Sparkles,
  Play
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await apiRequest(`/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Rithanya Hospital Medical Product',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  const addToCart = () => {
    if (!product) return;
    try {
      const saved = localStorage.getItem('rh_cart');
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((item) => item.id === product.id);
      let updated;
      if (existing) {
        updated = cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...cart, { ...product, quantity }];
      }
      localStorage.setItem('rh_cart', JSON.stringify(updated));
      setAdded(true);
      addToast(`Added ${quantity} × "${product.name}" to cart!`, 'success');
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
      addToast('Unable to update cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-soft)', fontSize: 16 }}>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>Product Not Found</h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: 15 }}>
          The requested health monitoring kit or clinical product could not be located.
        </p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Products Store</span>
        </Link>
      </div>
    );
  }

  // Parse features if string
  const featuresList = Array.isArray(product.features)
    ? product.features
    : typeof product.features === 'string'
    ? JSON.parse(product.features || '[]')
    : [];

  return (
    <div className="product-detail-page" style={{ padding: '40px 0 100px', background: 'var(--canvas)' }}>
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            <ArrowLeft size={16} />
            <span>Back to Hospital Pharmacy Store</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 20 }}
            >
              <Share2 size={14} />
              <span>Share Product</span>
            </button>
            <Link to="/products" className="btn btn-primary btn-sm" style={{ borderRadius: 20 }}>
              <ShoppingCart size={14} />
              <span>View Cart</span>
            </Link>
          </div>
        </div>

        {/* Product Hero Banner */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1.5px solid var(--line)',
            padding: 'clamp(24px, 4vw, 44px)',
            marginBottom: 40,
            boxShadow: '0 12px 36px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 460px) 1fr',
            gap: 'clamp(24px, 4vw, 48px)',
            alignItems: 'center'
          }}
          className="product-hero-banner"
        >
          {/* Media Presentation (Image or Video) */}
          <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', background: '#faf9fa', border: '1px solid var(--line)' }}>
            {product.videoUrl ? (
              <div style={{ position: 'relative', paddingBottom: '75%', height: 0, overflow: 'hidden' }}>
                <iframe
                  src={product.videoUrl.replace('watch?v=', 'embed/')}
                  title={product.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <img
                  src={product.image || '/image.png'}
                  alt={product.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            {product.tag && (
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  background: 'var(--red-700)',
                  color: '#fff',
                  padding: '5px 12px',
                  borderRadius: 14,
                  fontSize: 11.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {product.tag}
              </div>
            )}

            {product.discountText && (
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: 'var(--green)',
                  color: '#fff',
                  padding: '5px 12px',
                  borderRadius: 14,
                  fontSize: 11.5,
                  fontWeight: 800
                }}
              >
                {product.discountText}
              </div>
            )}
          </div>

          {/* Product Purchasing Box */}
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-700)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>
              {product.category || 'Hospital Pharmacy'}
            </span>

            <h1 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', color: 'var(--ink)', marginBottom: 12, lineHeight: 1.25 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 20 }}>
              {product.summary}
            </p>

            {/* Price Box */}
            <div
              style={{
                background: 'var(--canvas)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'baseline',
                gap: 12
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--red-900)' }}>
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: 16, color: 'var(--ink-soft)', textDecoration: 'line-through' }}>
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', background: 'rgba(20, 130, 95, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                  Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            {/* Features Preview */}
            {featuresList.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)', marginBottom: 10, fontWeight: 700 }}>
                  Key Clinical Features
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                  {featuresList.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink)' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1.5px solid var(--line)', borderRadius: 14, padding: '4px 8px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', display: 'flex' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 800, fontSize: 16, minWidth: 28, textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', display: 'flex' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={addToCart}
                style={{ padding: '12px 28px', fontSize: 15, borderRadius: 14 }}
              >
                <ShoppingCart size={18} />
                <span>{added ? 'Added to Cart ✓' : `Add to Cart — ${formatCurrency(product.price * quantity)}`}</span>
              </button>

              <Link to="/products" className="btn btn-secondary" style={{ padding: '12px 20px', borderRadius: 14 }}>
                View Cart & Order
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="product-detail-grid">
          {/* Main Rich Content */}
          <div className="product-content-main">
            {product.content ? (
              <div className="card" style={{ padding: 'clamp(20px, 3vw, 36px)', marginBottom: 30, borderRadius: 20 }}>
                <div
                  className="product-rich-content ql-editor"
                  dangerouslySetInnerHTML={{ __html: product.content }}
                />
              </div>
            ) : (
              <div className="card" style={{ padding: 'clamp(20px, 3vw, 36px)', marginBottom: 30, borderRadius: 20 }}>
                <h3 style={{ fontSize: 20, marginBottom: 12 }}>Product Clinical Overview</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink)' }}>{product.summary}</p>
              </div>
            )}

            {/* Quality & Certified Medical Standards */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1.5px solid #bbf7d0',
                borderRadius: 20,
                padding: 'clamp(20px, 3vw, 32px)',
                marginTop: 20
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <ShieldCheck size={26} style={{ color: 'var(--emerald-700)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ fontSize: 18, color: 'var(--emerald-900)', marginBottom: 6 }}>
                    Verified by Rithanya Hospital Medical Board
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--emerald-800)', lineHeight: 1.6, margin: 0 }}>
                    Every diagnostic monitor, lancet drum, and nutritional therapy package is inspected and approved by our clinical department to ensure strict medical-grade calibration and patient safety.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Delivery & Contact */}
          <div className="product-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Pharmacy Dispatch Card */}
            <div className="card" style={{ padding: 24, borderRadius: 20 }}>
              <h4 style={{ fontSize: 16, marginBottom: 14, color: 'var(--ink)' }}>Hospital Pharmacy Dispatch</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Truck size={18} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span><strong>Free Delivery:</strong> Anywhere across Khammam within 24 hours.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />
                  <span><strong>Payment:</strong> Cash on Delivery / UPI upon inspection.</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Phone size={18} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
                  <span><strong>Pharmacy Desk:</strong> 8328581019 / 9948713504</span>
                </div>
              </div>
            </div>

            {/* Direct Consultation Notice */}
            <div className="card" style={{ padding: 22, borderRadius: 20, background: '#fcfbfb' }}>
              <h4 style={{ fontSize: 15, marginBottom: 10, color: 'var(--ink)' }}>Need Medical Advice?</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>
                If you have questions about which device or nutritional supplement is right for your condition, consult directly with our physicians.
              </p>
              <Link to="/doctors" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                Consult Specialist Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
