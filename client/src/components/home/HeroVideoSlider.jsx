import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import {
  Calendar,
  ArrowRight,
  Stethoscope,
  Activity,
  HeartPulse,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Droplet
} from 'lucide-react';
import useDynamicTranslation from '../../utils/dynamicTranslator';

// Register GSAP CustomEase plugin
gsap.registerPlugin(CustomEase);

try {
  CustomEase.create('shapeRevealSettle', 'M0,0 C0.10,0.16 0.26,0.115 0.34,0.115 C0.50,0.115 0.78,0.85 1,1');
  CustomEase.create('shapeRevealSnap', 'M0,0 C0.09,0.16 0.24,0.110 0.32,0.110 C0.46,0.110 0.74,0.88 1,1');
  CustomEase.create('shapeRevealDrift', 'M0,0 C0.12,0.18 0.28,0.130 0.38,0.130 C0.58,0.130 0.80,0.84 1,1');
} catch (e) {
  // Graceful fallback to power curves if CustomEase already created
}

// Inline SVG Masks (safe from CORS & file:// restrictions)
const _svg = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const MASKS = {
  circle: _svg('<svg width="281" height="281" viewBox="0 0 281 281" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.078125" width="280" height="280" rx="140" fill="#000"/></svg>'),
  flower: _svg('<svg width="282" height="281" viewBox="0 0 282 281" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z" fill="#000"/></svg>'),
  hexagon: _svg('<svg width="277" height="301" viewBox="0 0 277 301" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M108.103 8.24078C126.954 -2.64276 150.179 -2.64276 169.03 8.24078L246.169 52.7773C265.02 63.6609 276.633 83.7745 276.633 105.542V194.615C276.633 216.382 265.02 236.495 246.169 247.379L169.03 291.915C150.179 302.799 126.954 302.799 108.103 291.915L30.9635 247.379C12.1126 236.495 0.5 216.382 0.5 194.615V105.542C0.5 83.7745 12.1126 63.6609 30.9635 52.7773L108.103 8.24078Z" fill="#000"/></svg>'),
  square: _svg('<svg width="281" height="281" viewBox="0 0 281 281" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.078125" width="280" height="280" rx="60" fill="#000"/></svg>')
};

// Morph variants
const REVEAL_VARIANTS = [
  { ease: 'shapeRevealSettle', duration: 1.45, rotDur: 0.85, dir: -1 },
  { ease: 'shapeRevealSnap', duration: 1.40, rotDur: 0.70, dir: 1 },
  { ease: 'shapeRevealDrift', duration: 1.65, rotDur: 0.95, dir: -1 }
];

const SLIDES = [
  {
    id: 'slide-1',
    mask: 'circle',
    videoSrc: '/assets/1.mp4',
    poster: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85',
    badge: 'Centre of Excellence',
    icon: Droplet,
    heading: 'Thalassemia & Sickle Cell Warriors',
    subheading: "Khammam's dedicated Daycare Transfusion Centre providing leukodepleted packed red cell transfusions and advanced iron chelation therapy.",
    primaryCta: { label: 'Book appointment', href: '#appointment-section' },
    secondaryCta: { label: 'Daycare Services', href: '/services' }
  },
  {
    id: 'slide-2',
    mask: 'flower',
    videoSrc: '/assets/2.mp4',
    poster: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1600&q=85',
    badge: 'Senior Diabetologist',
    icon: Stethoscope,
    heading: 'Clinical Diabetology & Endocrine Care',
    subheading: 'Under Dr. Narayana Murthy M.D., delivering longitudinal glycemic management, diabetic neuropathy diagnostics, and vascular wellness.',
    primaryCta: { label: 'Consult Specialists', href: '/specialists' },
    secondaryCta: { label: 'Health Packages', href: '/products' }
  },
  {
    id: 'slide-3',
    mask: 'hexagon',
    videoSrc: '/assets/3.mp4',
    poster: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85',
    badge: 'Automated Laboratory',
    icon: Activity,
    heading: 'Precision Pathology & HPLC Diagnostics',
    subheading: 'Fully automated clinical laboratory featuring HPLC hemoglobin electrophoresis, automated biochemistry, and rapid-turnaround diagnostics.',
    primaryCta: { label: 'Explore Diagnostics', href: '/services' },
    secondaryCta: { label: 'View Facility', href: '/gallery' }
  },
  {
    id: 'slide-4',
    mask: 'square',
    videoSrc: '/assets/4.mp4',
    poster: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=85',
    badge: 'Patient Trust & Ethics',
    icon: ShieldCheck,
    heading: 'Compassionate Care with Digital Ethics',
    subheading: 'Multi-specialty emergency care with DPDP Act 2023 digital privacy, web camera consent, and patient-first medical integrity.',
    primaryCta: { label: 'Emergency & OPD', href: '#appointment-section' },
    secondaryCta: { label: 'About Hospital', href: '/about' }
  }
];

const AUTO_ADVANCE_SECONDS = 6;

export default function HeroVideoSlider() {
  const { loc } = useDynamicTranslation();
  const [current, setCurrent] = useState(0);
  const [loadingMap, setLoadingMap] = useState({ 0: false, 1: true, 2: true, 3: true });
  const [loadedVideos, setLoadedVideos] = useState({ 0: true });

  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const videoRefs = useRef([]);
  const fillRefs = useRef([]);
  const fillTweenRef = useRef(null);
  const shapeTweenRef = useRef(null);
  const animatingRef = useRef(false);
  const currentIdxRef = useRef(0);
  const lastVariantRef = useRef(-1);

  // Pick random non-repeating reveal variant
  const pickVariant = () => {
    let idx = Math.floor(Math.random() * REVEAL_VARIANTS.length);
    if (idx === lastVariantRef.current) {
      idx = (idx + 1) % REVEAL_VARIANTS.length;
    }
    lastVariantRef.current = idx;
    return REVEAL_VARIANTS[idx];
  };

  // Stop current fill animation
  const killFill = useCallback(() => {
    if (fillTweenRef.current) {
      fillTweenRef.current.kill();
      fillTweenRef.current = null;
    }
  }, []);

  // Animate progress bar fill
  const startFill = useCallback((idx) => {
    killFill();
    const fillEl = fillRefs.current[idx];
    if (!fillEl) return;

    // Reset other fills
    fillRefs.current.forEach((el, i) => {
      if (el && i !== idx) gsap.set(el, { width: '0%' });
    });

    fillTweenRef.current = gsap.fromTo(
      fillEl,
      { width: '0%' },
      {
        width: '100%',
        duration: AUTO_ADVANCE_SECONDS,
        ease: 'none',
        onComplete: () => {
          const nextIdx = (currentIdxRef.current + 1) % SLIDES.length;
          goTo(nextIdx);
        }
      }
    );
  }, [killFill]);

  // Transition to specific slide
  const goTo = useCallback((nextIdx) => {
    if (nextIdx === currentIdxRef.current || !slideRefs.current.length) return;

    // Handle ongoing animation: snap immediately
    if (animatingRef.current) {
      killFill();
      if (shapeTweenRef.current) {
        shapeTweenRef.current.kill();
        shapeTweenRef.current = null;
      }
      const activeEl = slideRefs.current[currentIdxRef.current];
      if (activeEl) {
        gsap.set(activeEl, { maskSize: '400%', webkitMaskSize: '400%', clearProps: 'rotate' });
        const container = activeEl.querySelector('.hero-slide__container');
        if (container) gsap.set(container, { clearProps: 'rotate' });
      }
      animatingRef.current = false;
    }

    animatingRef.current = true;
    killFill();

    const prevIdx = currentIdxRef.current;
    currentIdxRef.current = nextIdx;
    setCurrent(nextIdx);

    // Ensure video src is loaded
    setLoadedVideos((prev) => ({ ...prev, [nextIdx]: true }));

    const nextVid = videoRefs.current[nextIdx];
    if (nextVid) {
      nextVid.currentTime = 0;
      nextVid.play().catch(() => {});
    }

    // Sync Z-indices
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const container = slide.querySelector('.hero-slide__container');
      if (container) gsap.set(container, { clearProps: 'transform' });

      if (i === nextIdx) {
        gsap.set(slide, { zIndex: 3, maskSize: '0%', webkitMaskSize: '0%', rotate: 0 });
      } else if (i === prevIdx) {
        gsap.set(slide, { zIndex: 2, maskSize: '400%', webkitMaskSize: '400%', rotate: 0 });
      } else {
        gsap.set(slide, { zIndex: 1, maskSize: '400%', webkitMaskSize: '400%', rotate: 0 });
      }
    });

    startFill(nextIdx);

    const inEl = slideRefs.current[nextIdx];
    if (!inEl) {
      animatingRef.current = false;
      return;
    }

    const container = inEl.querySelector('.hero-slide__container');
    const variant = pickVariant();
    const maskKey = inEl.dataset.mask || 'circle';
    const maskUri = MASKS[maskKey] || MASKS.circle;

    gsap.set(inEl, { maskImage: maskUri, webkitMaskImage: maskUri });

    // Simultaneous counter-rotation and mask-expansion
    shapeTweenRef.current = gsap.timeline({
      onComplete() {
        if (inEl && container) {
          gsap.set([inEl, container], { clearProps: 'rotate' });
        }
        animatingRef.current = false;
        shapeTweenRef.current = null;
      }
    })
      .to(container, { rotate: -180 * variant.dir, duration: variant.rotDur, ease: 'power2.out' })
      .to(inEl, { rotate: 180 * variant.dir, duration: variant.rotDur, ease: 'power2.out' }, '<')
      .to(
        inEl,
        {
          maskSize: '400%',
          webkitMaskSize: '400%',
          duration: variant.duration,
          ease: variant.ease || 'power2.out'
        },
        '<'
      );
  }, [killFill, startFill]);

  // Initial setup on mount
  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const maskKey = slide.dataset.mask || 'circle';
      const maskUri = MASKS[maskKey] || MASKS.circle;

      gsap.set(slide, {
        maskImage: maskUri,
        webkitMaskImage: maskUri,
        maskSize: '400%',
        webkitMaskSize: '400%',
        maskPosition: 'center',
        webkitMaskPosition: 'center',
        maskRepeat: 'no-repeat',
        webkitMaskRepeat: 'no-repeat',
        zIndex: i === 0 ? 3 : 1,
        rotate: 0,
        opacity: 1
      });

      const container = slide.querySelector('.hero-slide__container');
      if (container) gsap.set(container, { rotate: 0 });
    });

    startFill(0);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goTo((currentIdxRef.current + 1) % SLIDES.length);
      if (e.key === 'ArrowLeft') goTo((currentIdxRef.current - 1 + SLIDES.length) % SLIDES.length);
    };

    window.addEventListener('keydown', handleKeyDown);

    // Progressive background pre-buffering of next slides
    const preloadTimer = setTimeout(() => {
      setLoadedVideos({ 0: true, 1: true, 2: true, 3: true });
    }, 1500);

    return () => {
      killFill();
      clearTimeout(preloadTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (shapeTweenRef.current) shapeTweenRef.current.kill();
    };
  }, [goTo, killFill, startFill]);

  const handleVideoReady = (index) => {
    setLoadingMap((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <section className="featured-hero hospital-hero-slider" ref={containerRef} aria-label="Rithanya Hospital Featured Medical Care">
      {SLIDES.map((slide, index) => {
        const Icon = slide.icon;
        const isPreloaded = loadedVideos[index] || index === 0;

        return (
          <div
            key={slide.id}
            className={`featured-hero__mask ${index === 0 ? 'is-active' : ''}`}
            data-mask={slide.mask}
            data-index={index}
            ref={(el) => (slideRefs.current[index] = el)}
          >
            <div className="featured-hero__container hero-slide__container">
              {/* VIDEO LAYER WITH OPTIMIZED STREAMING */}
              <div className="featured-hero__video">
                {/* Fallback Poster Preview */}
                <img
                  src={slide.poster}
                  alt={slide.heading}
                  className="featured-hero__poster"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Range-Requested Streaming HTML5 Video */}
                {isPreloaded && (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={slide.videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? 'auto' : 'metadata'}
                    disablePictureInPicture
                    disableRemotePlayback
                    onCanPlay={() => handleVideoReady(index)}
                    onPlaying={() => handleVideoReady(index)}
                  />
                )}

                {/* Medical Heartbeat Wave Loading Skeleton */}
                {loadingMap[index] && (
                  <div className="hero-video-loader">
                    <div className="hero-loader-pulse">
                      <HeartPulse size={28} className="hero-pulse-icon" />
                      <svg className="ecg-wave" viewBox="0 0 100 24" fill="none">
                        <path
                          d="M0 12 H30 L36 3 L44 21 L50 7 L56 16 L62 12 H100"
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Connecting Clinical Feed...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* HOSPITAL CRIMSON GRADIENT OVERLAYS */}
              <div className="featured-hero__gradient featured-hero__gradient--hospital" />

              {/* TEXT CONTENT CONTAINER */}
              <div className="featured-hero__text-container">
                <div className="featured-hero__animation__text-container">
                  <div className="hero-slide-badge">
                    <Icon size={14} />
                    <span>{loc(slide.badge)}</span>
                  </div>

                  <h1 className="featured-hero__heading hospital-hero__heading">
                    {loc(slide.heading)}
                  </h1>

                  <p className="featured-hero__subheading hospital-hero__subheading">
                    {loc(slide.subheading)}
                  </p>

                  <div className="hero-slide-actions">
                    {slide.primaryCta.href.startsWith('#') ? (
                      <a href={slide.primaryCta.href} className="featured-hero__cta hospital-hero__cta-primary">
                        <Calendar size={18} />
                        <span>{loc(slide.primaryCta.label)}</span>
                      </a>
                    ) : (
                      <Link to={slide.primaryCta.href} className="featured-hero__cta hospital-hero__cta-primary">
                        <Calendar size={18} />
                        <span>{loc(slide.primaryCta.label)}</span>
                      </Link>
                    )}

                    <Link to={slide.secondaryCta.href} className="hospital-hero__cta-secondary">
                      <span>{loc(slide.secondaryCta.label)}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* LUXURIOUS 5-LAYER FROSTED GLASS BLUR OVERLAY */}
      <div aria-hidden="true" className="featured-hero__blur">
        <span className="featured-hero__blur-layer featured-hero__blur-layer--1" />
        <span className="featured-hero__blur-layer featured-hero__blur-layer--2" />
        <span className="featured-hero__blur-layer featured-hero__blur-layer--3" />
        <span className="featured-hero__blur-layer featured-hero__blur-layer--4" />
        <span className="featured-hero__blur-layer featured-hero__blur-layer--5" />
      </div>

      {/* DYNAMIC PROGRESS CONTROLS */}
      <div className="featured-hero__controls" role="group" aria-label="Hospital Care Highlights Navigation">
        <button
          className="featured-hero__button featured-hero__button--prev"
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="featured-hero__progress-container" role="tablist">
          {SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <div
                key={`dot-${slide.id}`}
                className="featured-hero__progress"
                data-active={isActive ? 'true' : 'false'}
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(index)}
                title={`Go to ${slide.heading}`}
              >
                <div className="featured-hero__progress-background" />
                <div
                  className="featured-hero__progress-fill"
                  ref={(el) => (fillRefs.current[index] = el)}
                />
              </div>
            );
          })}
        </div>

        <button
          className="featured-hero__button featured-hero__button--next"
          onClick={() => goTo((current + 1) % SLIDES.length)}
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
