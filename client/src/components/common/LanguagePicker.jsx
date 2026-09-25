import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN', native: 'English' },
  { code: 'te', label: 'Telugu', short: 'తె', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', short: 'हि', native: 'हिन्दी' }
];

export default function LanguagePicker({ className = '', compact = false }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === (i18n.language || 'en')) || LANGUAGES[0];

  const triggerBrowserTranslation = (code) => {
    try {
      const domain = window.location.hostname;
      if (code === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${domain}; path=/;`;
      } else {
        const val = `/en/${code}`;
        document.cookie = `googtrans=${val}; path=/;`;
        document.cookie = `googtrans=${val}; domain=${domain}; path=/;`;
        document.cookie = `googtrans=${val}; domain=.${domain}; path=/;`;
      }

      const teCombo = document.querySelector('.goog-te-combo');
      if (teCombo) {
        teCombo.value = code;
        teCombo.dispatchEvent(new Event('change'));
      } else {
        setTimeout(() => {
          const combo = document.querySelector('.goog-te-combo');
          if (combo) {
            combo.value = code;
            combo.dispatchEvent(new Event('change'));
          }
        }, 500);
      }
    } catch (e) {
      console.error('Translation error:', e);
    }
  };

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem('rh_language', code);
    } catch (_) {}
    triggerBrowserTranslation(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('rh_language');
    if (saved && saved !== 'en') {
      setTimeout(() => triggerBrowserTranslation(saved), 300);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`lang-picker-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="lang-picker-btn"
        aria-label="Select Language / భాషను ఎంచుకోండి"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '6px 10px' : '7px 12px',
          background: 'var(--canvas)',
          border: '1px solid var(--line)',
          borderRadius: 9999,
          color: 'var(--ink)',
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <Globe size={14} style={{ color: 'var(--red-700)', flexShrink: 0 }} />
        <span>{compact ? currentLang.short : currentLang.native}</span>
        <ChevronDown
          size={12}
          style={{
            color: 'var(--ink-soft)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'none'
          }}
        />
      </button>

      {isOpen && (
        <div
          className="lang-picker-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#ffffff',
            border: '1px solid var(--line)',
            borderRadius: 14,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(169, 17, 41, 0.06)',
            padding: 6,
            minWidth: 140,
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: 8,
                  background: isSelected ? 'var(--red-50)' : 'transparent',
                  color: isSelected ? 'var(--red-700)' : 'var(--ink)',
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{lang.native}</span>
                {isSelected && <Check size={14} style={{ color: 'var(--red-700)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
