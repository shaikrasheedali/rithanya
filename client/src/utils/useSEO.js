import { useEffect, useCallback } from 'react';
import { apiRequest } from './api';

export function useDynamicSEO() {
  const applySEO = useCallback(async () => {
    try {
      const res = await apiRequest('/settings');
      const seo = res.data?.seo_settings;
      if (!seo) return;

      if (seo.metaTitle) {
        document.title = seo.metaTitle;
      }

      // Meta Description
      if (seo.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.metaDescription;
      }

      // Keywords
      if (seo.keywords) {
        let metaKw = document.querySelector('meta[name="keywords"]');
        if (!metaKw) {
          metaKw = document.createElement('meta');
          metaKw.name = 'keywords';
          document.head.appendChild(metaKw);
        }
        metaKw.content = seo.keywords;
      }

      // Favicon
      if (seo.favicon) {
        let linkIcon = document.querySelector("link[rel*='icon']");
        if (!linkIcon) {
          linkIcon = document.createElement('link');
          linkIcon.rel = 'icon';
          document.head.appendChild(linkIcon);
        }
        linkIcon.href = seo.favicon;
      }

      // Canonical URL
      if (seo.canonicalUrl) {
        let linkCanon = document.querySelector("link[rel='canonical']");
        if (!linkCanon) {
          linkCanon = document.createElement('link');
          linkCanon.rel = 'canonical';
          document.head.appendChild(linkCanon);
        }
        linkCanon.href = seo.canonicalUrl;
      }

      // Open Graph Tags
      const ogProps = [
        { prop: 'og:title', val: seo.metaTitle },
        { prop: 'og:description', val: seo.metaDescription },
        { prop: 'og:image', val: seo.ogImage },
        { prop: 'og:url', val: seo.canonicalUrl || 'https://rithanyahospital.com' },
        { prop: 'og:type', val: 'website' }
      ];

      for (const item of ogProps) {
        if (!item.val) continue;
        let el = document.querySelector(`meta[property="${item.prop}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', item.prop);
          document.head.appendChild(el);
        }
        el.content = item.val;
      }

      // Twitter Card Tags
      const twitterProps = [
        { name: 'twitter:card', val: 'summary_large_image' },
        { name: 'twitter:title', val: seo.metaTitle },
        { name: 'twitter:description', val: seo.metaDescription },
        { name: 'twitter:image', val: seo.ogImage }
      ];

      for (const item of twitterProps) {
        if (!item.val) continue;
        let el = document.querySelector(`meta[name="${item.name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.name = item.name;
          document.head.appendChild(el);
        }
        el.content = item.val;
      }
    } catch (e) {
      // Continue with defaults
    }
  }, []);

  useEffect(() => {
    applySEO();
    window.addEventListener('hospital-settings-updated', applySEO);
    return () => window.removeEventListener('hospital-settings-updated', applySEO);
  }, [applySEO]);
}
