import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import { useToast } from '../../components/common/Toast';
import Modal from '../../components/common/Modal';

export default function ProductsPage() {
  const { addToast } = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Modal State
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await apiRequest('/products');
        setPackages(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleOpenInquiry = (pkg) => {
    setSelectedPackage(pkg);
    setInquiryForm({ name: '', phone: '', email: '', message: `I am interested in booking the ${pkg.name}.` });
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          ...inquiryForm
        })
      });
      addToast('Thank you! Your package inquiry was registered. Our team will contact you shortly.', 'success');
      setSelectedPackage(null);
    } catch (err) {
      addToast(err.message || 'Failed to submit inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="products-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Preventive Medicine & Packages</span>
          <h1 className="section-title">Diagnostic & Wellness Packages</h1>
          <p className="section-subtitle">
            Curated clinical evaluation panels designed for comprehensive chronic disease monitoring, senior health, and daycare transfusion follow-ups.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Loading packages...</div>
        ) : (
          <div className="grid-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`package-card ${pkg.tag ? 'highlight' : ''}`}>
                <div className="card-image-wrap" style={{ aspectRatio: '16/9' }}>
                  <img src={pkg.image} alt={pkg.name} />
                </div>
                <div className="package-body">
                  {pkg.tag && (
                    <span className="badge badge-red" style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
                      <Tag size={12} /> {pkg.tag}
                    </span>
                  )}
                  <h3 style={{ fontSize: 20, marginBottom: 8 }}>{pkg.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 16 }}>{pkg.summary}</p>

                  <div className="package-price">
                    {formatCurrency(pkg.price)}
                    {pkg.originalPrice && <small>{formatCurrency(pkg.originalPrice)}</small>}
                  </div>

                  <ul className="package-features">
                    {(pkg.features || []).map((feat, idx) => (
                      <li key={idx}>
                        <Check size={16} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 'auto' }}
                    onClick={() => handleOpenInquiry(pkg)}
                  >
                    <span>Inquire / Book Package</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiry Modal */}
        <Modal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          title={`Inquire About: ${selectedPackage?.name}`}
        >
          <form onSubmit={handleSubmitInquiry}>
            <div className="form-group">
              <label className="form-label">Your Full Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Anjali Sharma"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. +91 98480 54321"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Optional)</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. anjali@example.com"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Any Questions or Special Requests?</label>
              <textarea
                className="form-control"
                rows="3"
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedPackage(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Send Package Inquiry'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
