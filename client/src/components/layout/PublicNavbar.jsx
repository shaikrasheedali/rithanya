import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Phone,
  ShieldCheck,
  Menu,
  X,
  Calendar,
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

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Stethoscope },
    { name: 'Treatments', path: '/treatments', icon: Activity },
    { name: 'Doctors', path: '/doctors', icon: Users },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Media Gallery', path: '/gallery', icon: Image },
    { name: 'Insights', path: '/insights', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  const checkIsActive = (path) => {
    if (location.pathname === path) return true;
    if (path === '/doctors' && location.pathname === '/specialists') return true;
    if (path === '/insights' && (location.pathname.startsWith('/blogs') || location.pathname.startsWith('/insights'))) return true;
    if (path === '/treatments' && location.pathname.startsWith('/treatments')) return true;
    if (path === '/gallery' && (location.pathname === '/facility-tour' || location.pathname === '/gallery')) return true;
    if (path === '/products' && (location.pathname === '/packages' || location.pathname === '/products')) return true;
    return false;
  };

  return (
    <>
      <header className={`floating-island-container ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="floating-island" aria-label="Main Navigation">
          {/* Brand Logo */}
          <Link to="/" className="island-brand" onClick={() => setMobileMenuOpen(false)}>
            <div className="island-brand-icon">
              <Activity size={20} />
            </div>
            <div className="island-brand-text">
              <span className="brand-title">Rithanya Hospital</span>
              <span className="brand-subtitle">Diabetology & Thalassemia Daycare</span>
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
            <a
              href="tel:+918328581019"
              className="island-btn island-btn-phone"
              title="24/7 Emergency Transfusion Hotline"
            >
              <Phone size={14} className="phone-icon" />
              <span className="phone-text">+91 83285 81019</span>
            </a>

            <Link
              to="/contact#appointment"
              className="island-btn island-btn-primary island-desktop-btn"
              title="Book an Outpatient Consultation"
            >
              <Calendar size={14} />
              <span>Book Appointment</span>
            </Link>

            <Link
              to="/admin/login"
              className="island-circle-login-btn island-desktop-btn"
              title="Staff Portal Login"
              aria-label="Staff Portal Login"
            >
              <ArrowRight size={15} />
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
            <div className="drawer-header">
              <span className="drawer-heading">Navigation Menu</span>
              <span className="drawer-sub">Select a department or service</span>
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
              <Link
                to="/contact#appointment"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={16} />
                <span>Book Appointment</span>
              </Link>

              <div className="drawer-actions-row">
                <a
                  href="tel:+918328581019"
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Phone size={14} className="text-red" />
                  <span>Call Emergency</span>
                </a>

                <Link
                  to="/admin/dashboard"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={14} />
                  <span>Staff Portal</span>
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
