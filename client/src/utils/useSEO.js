import { useEffect } from 'react';
import { apiRequest } from './api';

export function useDynamicSEO() {
  useEffect(() => {
    async function applySEO() {
      try {
        const res = await apiRequest('/settings');
        const seo = res.data?.seo_settings;
        if (!seo) return;

        if (seo.metaTitle) {
          document.title = seo.metaTitle;
        }

        if (seo.metaDescription) {
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = seo.metaDescription;
        }

        if (seo.keywords) {
          let metaKw = document.querySelector('meta[name="keywords"]');
          if (!metaKw) {
            metaKw = document.createElement('meta');
            metaKw.name = 'keywords';
            document.head.appendChild(metaKw);
          }
          metaKw.content = seo.keywords;
        }

        if (seo.favicon) {
          let linkIcon = document.querySelector("link[rel*='icon']");
          if (!linkIcon) {
            linkIcon = document.createElement('link');
            linkIcon.rel = 'icon';
            document.head.appendChild(linkIcon);
          }
          linkIcon.href = seo.favicon;
        }

        if (seo.ogImage) {
          let ogImg = document.querySelector('meta[property="og:image"]');
          if (!ogImg) {
            ogImg = document.createElement('meta');
            ogImg.setAttribute('property', 'og:image');
            document.head.appendChild(ogImg);
          }
          ogImg.content = seo.ogImage;
        }
      } catch (e) {
        // Silently continue with defaults
      }
    }

    applySEO();
  }, []);
}
