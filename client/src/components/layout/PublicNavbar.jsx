import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Phone,
  ShieldCheck,
  Menu,
  X,
  Home,
  Info,
  Stethoscope,
  Users,
  Package,
  Image,
  BookOpen,
  Mail,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import RithanyaLogo from '../common/RithanyaLogo';
import LanguagePicker from '../common/LanguagePicker';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Body scroll lock on mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/', icon: Home },
    { name: t('nav.about', 'About'), path: '/about', icon: Info },
    { name: t('nav.services', 'Services'), path: '/services', icon: Stethoscope },
    { name: t('nav.treatments', 'Treatments'), path: '/treatments', icon: Activity },
    { name: t('nav.doctors', 'Doctors'), path: '/doctors', icon: Users },
    { name: t('nav.products', 'Products'), path: '/products', icon: Package },
    { name: t('nav.gallery', 'Gallery'), path: '/gallery', icon: Image },
    { name: t('nav.insights', 'Insights'), path: '/insights', icon: BookOpen },
    { name: t('nav.contact', 'Contact'), path: '/contact', icon: Mail }
  ];

  const checkIsActive = (path) => {
    if (location.pathname === path) return true;
    if (path === '/doctors' && (location.pathname.startsWith('/doctors') || location.pathname.startsWith('/specialists'))) return true;
    if (path === '/insights' && (location.pathname.startsWith('/blogs') || location.pathname.startsWith('/insights'))) return true;
    if (path === '/treatments' && location.pathname.startsWith('/treatments')) return true;
    if (path === '/services' && location.pathname.startsWith('/services')) return true;
    if (path === '/gallery' && (location.pathname === '/facility-tour' || location.pathname === '/gallery')) return true;
    if (path === '/products' && (location.pathname.startsWith('/packages') || location.pathname.startsWith('/products'))) return true;
    return false;
  };

  return (
    <>
      <header className={`floating-island-container ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="floating-island" aria-label="Main Navigation">
          {/* Brand Logo */}
          <Link to="/" className="island-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="island-brand-icon">
              <RithanyaLogo size="100%" />
            </div>
            <div className="island-brand-text">
              <span className="brand-title">{t('hospital_name', 'Rithanya Hospital')}</span>
              <span className="brand-subtitle">{t('hospital_tagline', 'Diabetology & Thalassemia Daycare')}</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="island-nav-links">
            {navLinks.map((item) => {
              const isActive = checkIsActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`island-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action CTAs */}
          <div className="island-actions">
            {/* Language Picker Dropdown */}
            <LanguagePicker compact={true} />

            <a
              href="tel:+918328581019"
              className="island-btn island-btn-phone"
              title={t('nav.emergencyHotline', '24/7 Emergency Transfusion Hotline')}
            >
              <Phone size={14} className="phone-icon" />
              <span className="phone-text">+91 83285 81019</span>
            </a>

            <Link
              to="/admin/login"
              className="island-btn island-btn-staff island-desktop-btn"
              title="Staff Login"
              aria-label="Staff Login"
            >
              <ShieldCheck size={15} className="staff-icon" />
              <span className="staff-text">Staff Login</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              className="island-menu-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Floating Dropdown Card */}
        {mobileMenuOpen && (
          <div className="island-mobile-drawer">
            <div className="drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="drawer-heading">{t('nav.menuHeading', 'Navigation Menu')}</span>
                <span className="drawer-sub">{t('nav.menuSub', 'Select a department or clinical service')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LanguagePicker compact={false} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: 'var(--red-50)',
                    border: '1px solid var(--red-100)',
                    color: 'var(--red-700)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <ul className="drawer-links">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`drawer-link ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="drawer-link-left">
                        <Icon size={18} className="drawer-icon" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight size={16} className="drawer-arrow" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="drawer-actions">
              <div className="drawer-actions-row">
                <a
                  href="tel:+918328581019"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Phone size={14} className="text-red" />
                  <span>{t('nav.callEmergency', 'Call Emergency')}</span>
                </a>

                <Link
                  to="/admin/dashboard"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={14} />
                  <span>{t('nav.staffPortal', 'Staff Portal')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="island-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
