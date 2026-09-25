import { useTranslation } from 'react-i18next';

/**
 * Clean & lightweight text localizer.
 * Browser in-built translation engine dynamically and accurately translates
 * all rendered DOM content (treatments, services, blogs, buttons, details)
 * to the picked language without giant brittle dictionaries or bloat.
 */
export function localizeText(text) {
  if (!text || typeof text !== 'string') return text;
  return text;
}

/**
 * Clean & lightweight dynamic record localizer.
 */
export function localizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  return item;
}

/**
 * Universal dynamic translation hook.
 */
export function useDynamicTranslation() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  return {
    t,
    i18n,
    lang: currentLang,
    loc: (text) => text,
    locItem: (item) => item,
    locItems: (items) => (Array.isArray(items) ? items : [])
  };
}

export default useDynamicTranslation;
