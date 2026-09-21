import React, { useState } from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContactButtons() {
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const phoneHref = 'tel:+918328581019';
  const whatsappHref =
    'https://wa.me/918328581019?text=Hello%20Rithanya%20Hospital,%20I%20would%20like%20to%20inquire%20about%20your%20services';

  return (
    <div
      className="floating-contact-container"
      aria-label="Quick Emergency & WhatsApp Contact Options"
    >
      {/* WhatsApp Button */}
      <div className="floating-btn-wrap">
        <span
          className={`floating-tooltip ${hoveredBtn === 'whatsapp' ? 'tooltip-visible' : ''}`}
          aria-hidden="true"
        >
          Chat on WhatsApp
        </span>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn-whatsapp"
          aria-label="Chat with Rithanya Hospital on WhatsApp (8328581019)"
          onMouseEnter={() => setHoveredBtn('whatsapp')}
          onMouseLeave={() => setHoveredBtn(null)}
          onFocus={() => setHoveredBtn('whatsapp')}
          onBlur={() => setHoveredBtn(null)}
        >
          {/* Official WhatsApp SVG Logo */}
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="currentColor"
            style={{ display: 'block' }}
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.55 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.183 8.183 0 0 1-5.83 2.41c-1.47 0-2.92-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.25-8.25zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43l-.47-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.28 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
          </svg>
          <span className="floating-btn-pulse pulse-whatsapp" />
        </a>
      </div>

      {/* Phone Call Button */}
      <div className="floating-btn-wrap">
        <span
          className={`floating-tooltip ${hoveredBtn === 'phone' ? 'tooltip-visible' : ''}`}
          aria-hidden="true"
        >
          Call 24/7: 8328581019
        </span>
        <a
          href={phoneHref}
          className="floating-btn floating-btn-phone"
          aria-label="Call Rithanya Hospital 24/7 Helpline at 8328581019"
          onMouseEnter={() => setHoveredBtn('phone')}
          onMouseLeave={() => setHoveredBtn(null)}
          onFocus={() => setHoveredBtn('phone')}
          onBlur={() => setHoveredBtn(null)}
        >
          <Phone size={22} />
          <span className="floating-btn-pulse pulse-phone" />
        </a>
      </div>
    </div>
  );
}
