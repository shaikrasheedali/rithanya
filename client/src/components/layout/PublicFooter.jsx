import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Phone, MapPin, Mail, Lock } from 'lucide-react';
import RithanyaLogo from '../common/RithanyaLogo';
import { useDynamicTranslation } from '../../utils/dynamicTranslator';

export default function PublicFooter() {
  const { t, loc } = useDynamicTranslation();

  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: About Hospital */}
          <div className="footer-col">
            <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: '#ffffff',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  overflow: 'hidden'
                }}
              >
                <RithanyaLogo size="100%" />
              </div>
              <div className="brand-text">
                <h1 style={{ color: '#fff', fontSize: 18, margin: 0 }}>{t('brand.name')}</h1>
                <span style={{ color: '#aaa', fontSize: 12 }}>{t('brand.subtitle')}</span>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.7, marginBottom: 16 }}>
              {t('footer.aboutText')}
            </p>
            <div className="footer-dpdp-badge">
              <ShieldCheck size={16} className="text-green" />
              <span>DPDP Act 2023 Compliant · Data Sovereignty Guaranteed</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h4>{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/services">{t('nav.services')}</Link></li>
              <li><Link to="/treatments">{t('nav.treatments')}</Link></li>
              <li><Link to="/doctors">{t('nav.doctors')}</Link></li>
              <li><Link to="/products">{t('nav.products')}</Link></li>
              <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
              <li><Link to="/insights">{t('nav.insights')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & DPDP Compliance */}
          <div className="footer-col">
            <h4>{loc('Patient Rights & Facilities')}</h4>
            <ul className="footer-links">
              <li style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>• {t('home.emergencyCardTitle')}</li>
              <li style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>• {t('home.bloodBankCardTitle')}</li>
              <li style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>• {t('home.aarogyasriCardTitle')}</li>
              <li style={{ marginTop: 8 }}><Link to="/privacy">{loc('Privacy Notice')}</Link></li>
              <li><Link to="/terms">{loc('Terms of Clinical Service')}</Link></li>
              <li>
                <Link to="/request-erasure" style={{ color: '#df3850', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={14} />
                  <span>{loc('Request Erasure (DPDP Act)')}</span>
                </Link>
              </li>
              <li><Link to="/admin/login">{t('nav.staffPortal')}</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="footer-col">
            <h4>{t('nav.contact')}</h4>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <MapPin size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>{t('brand.tagline')}</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <Phone size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>8328581019 / 9948713504</span>
              </li>
              <li style={{ display: 'flex', gap: 10, fontSize: 13, color: '#aaa' }}>
                <Mail size={18} style={{ color: '#df3850', flexShrink: 0 }} />
                <span>info@rithanyahospital.com / dr.narayana5@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}</p>
          <p>{t('brand.subtitle')} • Khammam</p>
        </div>
      </div>
    </footer>
  );
}
