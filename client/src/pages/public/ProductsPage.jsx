import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Check,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Package,
  Sparkles,
  Truck,
  Phone,
  MapPin,
  Mail,
  User
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';

export default function ProductsPage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Cart State (Persisted in localStorage for convenience)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('rh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Khammam',
    pincode: '507001',
    instructions: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem('rh_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await apiRequest('/products');
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotal = cartSubtotal; // Free delivery

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      addToast('Please fill in Name, Phone, and Delivery Address', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: checkoutForm.name,
        phone: checkoutForm.phone,
        email: checkoutForm.email,
        address: checkoutForm.address,
        city: checkoutForm.city,
        pincode: checkoutForm.pincode,
        message: checkoutForm.instructions,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: cartTotal,
        packageName: cart.length === 1 ? cart[0].name : `${cart[0].name} + ${cart.length - 1} more items`
      };

      const res = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setLastOrder(res.data || { orderCode: res.orderCode || 'ORD-NEW' });
      setCart([]);
      setCheckoutStep('success');
      addToast(`Order placed successfully! Order #${res.orderCode || 'CONFIRMED'}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="products-store-page" style={{ padding: '60px 0 100px' }}>
      <div className="container">
        {/* Header */}
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
            <span>Clinical Pharmacy & Healthcare Essentials</span>
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 14 }}>
            Healthcare Products & Home Monitoring Kits
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 740, margin: '0 auto', fontSize: 16, color: 'var(--ink-soft)' }}>
            Certified diagnostic monitors, nutritional support for thalassemia warriors, and diabetic foot care essentials recommended by <strong>Dr. Narayana Murthy M.D.</strong>
          </p>
        </div>

        {/* Toolbar & Category Pills */}
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

          {/* Cart Quick Toggle Button */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setIsCartOpen(true);
              if (checkoutStep === 'success') setCheckoutStep('cart');
            }}
            style={{ borderRadius: 9999, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 10 }}
          >
            <ShoppingCart size={17} />
            <span>View Cart ({cartCount})</span>
            {cartCount > 0 && (
              <span style={{ background: '#fff', color: 'var(--red-700)', borderRadius: 12, padding: '1px 8px', fontSize: 12, fontWeight: 800 }}>
                {formatCurrency(cartTotal)}
              </span>
            )}
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
            <p>Loading clinical products catalog...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28
            }}
          >
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((i) => i.id === p.id);

              return (
                <div
                  key={p.id}
                  className="product-card"
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1.5px solid var(--line)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Product Thumbnail */}
                  <div style={{ position: 'relative', width: '100%', height: 210, background: '#fcfbfa', overflow: 'hidden' }}>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {p.tag && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: 'var(--red-700)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 11.5,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}
                      >
                        {p.tag}
                      </div>
                    )}
                    {p.discountText && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'var(--green)',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 11.5,
                          fontWeight: 700
                        }}
                      >
                        {p.discountText}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                      {p.category}
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 8 }}>
                      {p.name}
                    </h3>

                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 16, flexGrow: 1 }}>
                      {p.summary}
                    </p>

                    {/* Features Preview */}
                    {Array.isArray(p.features) && p.features.length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                        {p.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--ink)' }}>
                            <CheckCircle2 size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Price & Add to Cart */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 16, marginTop: 'auto' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--red-900)' }}>
                            {formatCurrency(p.price)}
                          </span>
                          {p.originalPrice && (
                            <span style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'line-through' }}>
                              {formatCurrency(p.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--green)', fontWeight: 600 }}>In Stock — Express Delivery</span>
                      </div>

                      {inCartItem ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 20, padding: '3px 6px' }}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, -1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: 13, padding: '0 8px' }}>{inCartItem.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => addToCart(p)}
                          style={{ borderRadius: 12, padding: '8px 16px', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        >
                          <ShoppingCart size={15} />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust Badges Bar */}
        <div
          style={{
            marginTop: 60,
            background: 'var(--canvas)',
            border: '1.5px solid var(--line)',
            borderRadius: 20,
            padding: '28px 36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ShieldCheck size={28} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>100% Genuine Clinical Supplies</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '2px 0 0' }}>Sourced directly from certified medical manufacturers</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Truck size={28} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>Free Delivery Across Khammam</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '2px 0 0' }}>Doorstep delivery with cash on delivery available</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Phone size={28} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>Clinical Guidance Hotline</h4>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', margin: '2px 0 0' }}>Pharmacy team support at +91 83285 81019</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================================
         SLIDE-OUT CART & CHECKOUT SIDEBAR DRAWER (RIGHT SIDE)
         ========================================================================== */}
      {isCartOpen && (
        <div
          className="cart-drawer-backdrop"
          onClick={() => setIsCartOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 12, 14, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            className="cart-drawer-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 460,
              height: '100%',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
              animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#faf9fa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingCart size={20} style={{ color: 'var(--red-700)' }} />
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                  {checkoutStep === 'checkout' ? 'Checkout & Shipping' : checkoutStep === 'success' ? 'Order Confirmed' : `Your Cart (${cartCount})`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-soft)',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step 1: Cart Items */}
            {checkoutStep === 'cart' && (
              <>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
                      <Package size={48} style={{ color: 'var(--line)', marginBottom: 16 }} />
                      <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your cart is empty</p>
                      <p style={{ fontSize: 13, marginBottom: 20 }}>Browse our diagnostic monitors and health essentials to add items.</p>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setIsCartOpen(false)}
                        style={{ borderRadius: 20 }}
                      >
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            gap: 14,
                            padding: '12px 14px',
                            background: 'var(--canvas)',
                            border: '1px solid var(--line)',
                            borderRadius: 14,
                            alignItems: 'center'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', background: '#fff' }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.name}
                            </h4>
                            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--red-900)' }}>
                              {formatCurrency(item.price)}
                            </div>
                          </div>

                          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: '2px 4px' }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontSize: 12.5, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red-600)', padding: 4 }}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Summary & Proceed to Checkout */}
                {cart.length > 0 && (
                  <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', background: '#faf9fa' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, fontSize: 13.5 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
                        <span>Subtotal ({cartCount} items):</span>
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{formatCurrency(cartSubtotal)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
                        <span>Delivery Fee:</span>
                        <span style={{ fontWeight: 700, color: 'var(--green)' }}>FREE</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800, color: 'var(--red-900)', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                        <span>Total Amount:</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setCheckoutStep('checkout')}
                      style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', borderRadius: 14, fontSize: 15, fontWeight: 800 }}
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={17} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Checkout Form */}
            {checkoutStep === 'checkout' && (
              <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
                  <div style={{ background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Order Summary:</span>
                      <strong style={{ display: 'block', fontSize: 15, color: 'var(--red-900)' }}>
                        {cartCount} Items — {formatCurrency(cartTotal)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      style={{ background: 'none', border: 'none', color: 'var(--red-700)', fontSize: 12, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Edit Cart
                    </button>
                  </div>

                  <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)', letterSpacing: 0.5, marginBottom: 14 }}>
                    Delivery Details
                  </h4>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      required
                      style={{ fontSize: 13.5 }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>Phone Number (for Delivery Confirmation) *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98480 12345"
                      value={checkoutForm.phone}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      required
                      style={{ fontSize: 13.5 }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>Email Address (for Order Receipt)</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. ramesh@example.com"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      style={{ fontSize: 13.5 }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>Complete Delivery Address *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="House/Flat No, Landmark, Street / Colony..."
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      required
                      style={{ fontSize: 13.5 }}
                    />
                  </div>

                  <div className="grid-2" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 12 }}>City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                        style={{ fontSize: 13.5 }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: 12 }}>Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        value={checkoutForm.pincode}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                        style={{ fontSize: 13.5 }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="form-label" style={{ fontSize: 12 }}>Delivery Instructions / Doctor Prescription Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Call before delivery, deliver in morning"
                      value={checkoutForm.instructions}
                      onChange={(e) => setCheckoutForm({ ...checkoutForm, instructions: e.target.value })}
                      style={{ fontSize: 13.5 }}
                    />
                  </div>

                  <div style={{ background: 'var(--green-bg)', border: '1px solid rgba(20, 130, 95, 0.2)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                    <span>Payment Method: <strong>Cash on Delivery / UPI on Delivery</strong></span>
                  </div>
                </div>

                {/* Submit Order Action */}
                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', background: '#faf9fa', display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCheckoutStep('cart')}
                    style={{ borderRadius: 12, padding: '12px 18px' }}
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ flexGrow: 1, justifyContent: 'center', borderRadius: 12, padding: '12px 20px', fontWeight: 800, fontSize: 15 }}
                  >
                    {submitting ? 'Placing Order...' : `Confirm Order (${formatCurrency(cartTotal)})`}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {checkoutStep === 'success' && (
              <div style={{ padding: '40px 28px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Check size={36} />
                </div>

                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>
                  Order Placed Successfully!
                </h3>

                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 20, maxWidth: 360 }}>
                  Thank you, <strong>{checkoutForm.name}</strong>. Your order has been registered under reference:
                </p>

                <div
                  style={{
                    background: 'var(--red-50)',
                    border: '1.5px dashed var(--red-300)',
                    padding: '12px 24px',
                    borderRadius: 14,
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--red-900)',
                    letterSpacing: 1,
                    marginBottom: 24
                  }}
                >
                  {lastOrder?.orderCode || 'ORD-CONFIRMED'}
                </div>

                <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 28 }}>
                  Our hospital clinical delivery coordinator will call you at <strong>{checkoutForm.phone}</strong> shortly to confirm shipment dispatch.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  style={{ borderRadius: 12, padding: '12px 28px', fontWeight: 700 }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
