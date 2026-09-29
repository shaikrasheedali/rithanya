import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../utils/api';

const DEFAULT_PROFILE = {
  name: 'Rithanya Hospital (రితన్య హాస్పిటల్)',
  tagline: '24/7 Emergency Services • Rithanya Blood Bank 24 Hours Available • Aarogyasri Facility Available',
  phone: '8328581019',
  emergencyPhone: '8328581019',
  secondaryPhone: '9948713504',
  email: 'info@rithanyahospital.com',
  address: 'Nehru Road, Opposite Old L.I.C. Office, Khammam, Telangana - 507001',
  timings: 'OPD: Mon–Sat: 10:00 AM – 8:30 PM | Emergency & Blood Bank: 24 Hours Available',
  bloodThreshold: 10
};

const DEFAULT_SEO = {
  metaTitle: 'Rithanya Hospital (రితన్య హాస్పిటల్) | Nehru Road, Khammam | 24/7 Emergency & Blood Bank',
  metaDescription: 'Rithanya Hospital (రితన్య హాస్పిటల్), Nehru Road, Opposite Old L.I.C. Office, Khammam. Founded by Dr. D. Narayana Murthy & Dr. A. Lakshmi Deepa. 24/7 Emergency Services, 24 Hours Blood Bank, and Aarogyasri Facility for Sickle Cell Anemia & Thalassemia Children. Contact: 8328581019, 9948713504.',
  keywords: 'Rithanya Hospital, Khammam Hospital, Dr D Narayana Murthy, Dr A Lakshmi Deepa, Blood Bank, Emergency',
  favicon: '/favicon.ico',
  ogImage: '/Dr Narayana Murthy-Rithanya Hospital-Khammam.png',
  canonicalUrl: 'https://rithanyahospital.com',
  robots: 'index, follow'
};

const HospitalSettingsContext = createContext({
  profile: DEFAULT_PROFILE,
  seo: DEFAULT_SEO,
  cleanPhone: '8328581019',
  formattedPhone: '+91 83285 81019',
  telHref: 'tel:+918328581019',
  whatsappHref: 'https://wa.me/918328581019?text=Hello%20Rithanya%20Hospital,%20I%20would%20like%20to%20inquire%20about%20your%20services',
  refreshSettings: async () => {}
});

export function HospitalSettingsProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [seo, setSeo] = useState(DEFAULT_SEO);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiRequest('/settings');
      if (res.data) {
        if (res.data.hospital_profile) {
          setProfile((prev) => ({ ...prev, ...res.data.hospital_profile }));
        }
        if (res.data.seo_settings) {
          setSeo((prev) => ({ ...prev, ...res.data.seo_settings }));
        }
      }
    } catch (err) {
      // Graceful fallback to verified defaults
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listen for cross-component settings updates
    const handleUpdate = () => {
      fetchSettings();
    };
    window.addEventListener('hospital-settings-updated', handleUpdate);
    return () => window.removeEventListener('hospital-settings-updated', handleUpdate);
  }, [fetchSettings]);

  // Derive phone numbers
  const rawPhone = profile.emergencyPhone || profile.phone || '8328581019';
  const cleanPhone = String(rawPhone).replace(/\D/g, '').replace(/^91/, '') || '8328581019';
  const formattedPhone = cleanPhone.length === 10
    ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
    : `+91 ${cleanPhone}`;

  const telHref = `tel:+91${cleanPhone}`;
  const whatsappHref = `https://wa.me/91${cleanPhone}?text=Hello%20Rithanya%20Hospital,%20I%20would%20like%20to%20inquire%20about%20your%20services`;

  return (
    <HospitalSettingsContext.Provider
      value={{
        profile,
        seo,
        cleanPhone,
        formattedPhone,
        telHref,
        whatsappHref,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </HospitalSettingsContext.Provider>
  );
}

export function useHospitalSettings() {
  return useContext(HospitalSettingsContext);
}

export default HospitalSettingsContext;
