import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SpecialtiesMarquee() {
  const { t } = useTranslation();

  const heading = t('marquee.heading', 'Specialties & Conditions Treated:-');
  const specialHighlight = t(
    'marquee.specialHighlight',
    'Now, for the very first time in our Khammam, HbA2 test is available'
  );

  const rawConditions = t('marquee.conditions', { returnObjects: true });
  const conditions = Array.isArray(rawConditions) ? rawConditions : [
    'Blood Pressure (BP)',
    'Sugar (Diabetes)',
    'Headache',
    'Migraine',
    'Chest Pain',
    'Asthma',
    'Jaundice',
    'Stomach Burning / Acidity',
    'Anemia',
    'Burning Sensation in Urine',
    'Nerve Weakness',
    'Thyroid',
    'Tuberculosis (TB)',
    'Dengue',
    'Typhoid',
    'Malaria',
    'Viral Fevers',
    'Kidney Diseases',
    'Snake Bite',
    'Scorpion Sting',
    'Poisoning'
  ];

  // We render the item list twice in the track for a seamless infinite loop
  const renderItems = (prefixKey) => (
    <div className="specialties-ticker-group" key={prefixKey}>
      {/* Special Highlight Item with Yellow Glowing Pill */}
      <div className="specialties-ticker-item highlight-item" title="Diagnostic Breakthrough at Rithanya Hospital">
        <span className="ticker-pulse-dot" />
        <Sparkles size={15} className="ticker-sparkle-icon" />
        <span className="ticker-highlight-text">{specialHighlight}</span>
      </div>

      {conditions.map((item, idx) => (
        <div className="specialties-ticker-item" key={`${prefixKey}-${idx}`}>
          <span className="ticker-bullet" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="specialties-marquee-strip" aria-label="Specialties & Conditions Treated">
      <div className="specialties-marquee-inner">
        {/* Fixed Title Badge on the Left */}
        <div className="specialties-marquee-badge">
          <Activity size={16} className="badge-icon" />
          <span className="badge-title">{heading}</span>
        </div>

        {/* Continuous Scrolling Rail */}
        <div className="specialties-marquee-track-wrapper">
          <div className="specialties-marquee-track">
            {renderItems('set-1')}
            {renderItems('set-2')}
          </div>
        </div>
      </div>
    </div>
  );
}
