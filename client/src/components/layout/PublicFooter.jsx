import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartHandshake, Phone, MapPin, Mail, Lock } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: About Hospital */}
          <div className="footer-col">
            <div className="brand-logo" style={{ color: '#fff', marginBottom: 16 }}>
              <div className="brand-icon">
                <Activity size={24} />
              </div>
              <div className="brand-text">
                <h1 style={{ color: '#fff' }}>Rithanya Hospital</h1>
                <span style={{ color: '#aaa' }}>Compassionate Clinical Medicine</span>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.7, marginBottom: 16 }}>
              Comprehensive Diabetic Care & Thalassemia / Sickle-Cell Daycare Transfusion Centre in Khammam, spearheaded by senior consultant Dr. Narayana Murthy M.D.
            </p>
            <div className="footer-dpdp-badge">
              <ShieldCheck size={16} className="text-green" />
              <span>DPDP Act 2023 Compliant · Data Sovereignty Guaranteed</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/about">About Dr. Narayana Murthy</Link></li>
              <li><Link to="/services">Clinical Specialties</Link></li>
              <li><Link to="/specialists">Doctor OPD Timings</Link></li>
              <li><Link to="/products">Health Packages</Link></li>
              <li><Link to="/gallery">Hospital Facility Tour</Link></li>
              <li><Link to="/blogs">Health Library & News</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & DPDP Compliance */}
          <div className="footer-col">
            <h4>Patient Rights & DPDP</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Notice</Link></li>
              <li><Link to="/terms">Terms of Clinical Service</Link></li>
              <li>
                <Link to="/request-erasure" style={{ color: '#df3850', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={14} />
                  <span>Request Erasure (Right to be Forgotten)</span>
                </Link>
              </li>
              <li><Link to="/admin/login">Hospital Staff Login</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="footer-col">
            <h4>Contact & Emergency</h4>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <MapPin size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>Wyra Road, opposite Old LIC Office, Nehru Nagar, Khammam, Telangana 507001</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <Phone size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>+91 83285 81019 / +91 98480 11223</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <Mail size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>info@rithanya.in / dr.narayana5@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Rithanya Hospital & Diagnostics. All Rights Reserved.</p>
          <p>Care with precision · Thalassemia Daycare Support Centre</p>
        </div>
      </div>
    </footer>
  );
}
