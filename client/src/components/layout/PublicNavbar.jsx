import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Phone, ShieldCheck, UserCheck, Menu, X, Calendar } from 'lucide-react';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Specialists', path: '/specialists' },
    { name: 'Health Packages', path: '/products' },
    { name: 'Facility Tour', path: '/gallery' },
    { name: 'Health Library', path: '/blogs' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="public-navbar">
      <div className="container public-navbar-inner">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <div className="brand-text">
            <h1>Rithanya Hospital</h1>
            <span>Diabetology & Thalassemia Daycare</span>
          </div>
        </Link>

        <ul className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : undefined }}>
          {navLinks.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a href="tel:+918328581019" className="btn btn-secondary btn-sm" title="Emergency Hotline">
            <Phone size={14} className="text-red" />
            <span>+91 83285 81019</span>
          </a>

          <Link to="/contact#appointment" className="btn btn-primary btn-sm">
            <Calendar size={14} />
            <span>Book OPD</span>
          </Link>

          <Link to="/admin/dashboard" className="btn btn-outline btn-sm" title="Staff & Administration Portal">
            <ShieldCheck size={14} />
            <span>Staff Portal</span>
          </Link>

          <button
            className="btn btn-secondary btn-sm mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
