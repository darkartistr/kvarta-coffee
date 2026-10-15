import { UtmParams } from '../types/coffee';

export function getUtmParameters(): UtmParams {
  if (typeof window === 'undefined') {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};

  const source = urlParams.get('utm_source');
  const medium = urlParams.get('utm_medium');
  const campaign = urlParams.get('utm_campaign');
  const content = urlParams.get('utm_content');
  const term = urlParams.get('utm_term');

  if (source) utm.utm_source = source;
  if (medium) utm.utm_medium = medium;
  if (campaign) utm.utm_campaign = campaign;
  if (content) utm.utm_content = content;
  if (term) utm.utm_term = term;

  if (document.referrer) {
    utm.referrer = document.referrer;
  }

  // Also check sessionStorage to preserve UTMs across internal in-page navigation if any
  try {
    const savedUtm = sessionStorage.getItem('kvarta_utm_tags');
    if (savedUtm) {
      const parsed = JSON.parse(savedUtm);
      return { ...parsed, ...utm };
    } else if (Object.keys(utm).length > 0) {
      sessionStorage.setItem('kvarta_utm_tags', JSON.stringify(utm));
    }
  } catch {
    // ignore local storage errors
  }

  return utm;
}
