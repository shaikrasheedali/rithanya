import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

export default function ContactPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          packageName: 'General Contact Inquiry',
          ...form
        })
      });
      setSent(true);
      addToast('Your inquiry has been sent to Rithanya Hospital.', 'success');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      addToast(err.message || 'Failed to send inquiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page" style={{ padding: '60px 0 80px' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Hospital Location & Helpdesk</span>
          <h1 className="section-title">Get in Touch with Our Clinical Team</h1>
          <p className="section-subtitle">
            Located conveniently on Wyra Road, Khammam. We are open for daily OPD consultations, routine diagnostic collection, and round-the-clock transfusion daycare support.
          </p>
        </div>

        <div className="grid-2" style={{ gap: 40, alignItems: 'start', marginBottom: 60 }}>
          {/* Contact Details Card */}
          <div>
            <div className="card card-responsive" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, marginBottom: 20 }}>Hospital Contact Details</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>Hospital Address</h4>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
                      Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana - 507001
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>Phone / Emergency Support</h4>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
                      +91 83285 81019 &nbsp;|&nbsp; +91 98480 11223
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>Email Communications</h4>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
                      info@rithanyahospital.com / dr.narayana5@gmail.com
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-50)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700 }}>Operating Hours</h4>
                    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 2 }}>
                      OPD Consultations: Mon–Sat: 11:00 AM – 5:00 PM<br />
                      Thalassemia Daycare Transfusions: 24/7 Monitored Support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="card card-responsive">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Send a Direct Clinical Message</h3>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 24 }}>
              Have questions regarding blood transfusion daycare beds, lab diagnostics, or doctor consultation? Leave a message below.
            </p>

            {sent ? (
              <div style={{ background: 'var(--green-bg)', padding: 24, borderRadius: 12, textAlign: 'center' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--green)', margin: '0 auto 10px' }} />
                <h4 style={{ color: 'var(--green)', fontSize: 16 }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
                  Our administrative coordinator will contact you shortly.
                </p>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSent(false)} style={{ marginTop: 16 }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+91 98480 12345"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiry Details</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Please specify your query..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  <Send size={16} />
                  <span>{loading ? 'Sending...' : 'Transmit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map view */}
        <div className="card" style={{ padding: 16, overflow: 'hidden' }}>
          <iframe
            title="Rithanya Hospital Khammam Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.537243916972!2d80.1492!3d17.2473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a34582f3a6773a9%3A0x2db4a169b56f8f5e!2sWyra%20Rd%2C%20Nehru%20Nagar%2C%20Khammam%2C%20Telangana%20507001!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
            width="100%"
            height="360"
            style={{ border: 0, borderRadius: 12 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
