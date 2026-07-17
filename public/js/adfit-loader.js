(() => {
  const SDK_SRC = 'https://t1.kakaocdn.net/kas/static/ba.min.js';

  if (window.__pocketSudokuAdFitLoaded) return;
  window.__pocketSudokuAdFitLoaded = true;

  const slots = [...document.querySelectorAll('[data-adfit-placement]')];
  if (!slots.length) return;

  const removeSlots = () => slots.forEach((slot) => slot.remove());
  const configEl = document.querySelector('script[type="application/json"][data-adfit-config]');
  if (!configEl?.textContent) {
    removeSlots();
    return;
  }

  let config;
  try {
    config = JSON.parse(configEl.textContent);
  } catch {
    removeSlots();
    return;
  }

  const allowedHosts = Array.isArray(config.allowedHosts) ? config.allowedHosts : [];
  const currentHost = window.location.hostname.toLowerCase();
  if (!config.enabled || !allowedHosts.includes(currentHost)) {
    removeSlots();
    return;
  }

  const mobileMaxWidth = Number.isFinite(Number(config.mobileMaxWidth)) ? Number(config.mobileMaxWidth) : 767;
  const device = window.matchMedia(`(max-width: ${mobileMaxWidth}px)`).matches ? 'mobile' : 'desktop';
  let hasAd = false;

  for (const slot of slots) {
    if (slot.dataset.adfitLoaded === 'true') continue;

    const placement = slot.dataset.adfitPlacement;
    const unit = config.units?.[placement]?.[device];
    if (!unit?.unit || !unit?.width || !unit?.height) {
      slot.remove();
      continue;
    }

    slot.dataset.adfitLoaded = 'true';
    slot.dataset.adfitDevice = device;
    slot.classList.add('adfit-slot--ready', `adfit-slot--${device}`);

    const frame = document.createElement('div');
    frame.className = 'adfit-frame';

    const ad = document.createElement('ins');
    ad.className = 'kakao_ad_area';
    ad.style.cssText = 'display:none;width:100%;';
    ad.setAttribute('data-ad-unit', unit.unit);
    ad.setAttribute('data-ad-width', String(unit.width));
    ad.setAttribute('data-ad-height', String(unit.height));

    frame.append(ad);
    slot.append(frame);
    hasAd = true;
  }

  if (!hasAd || document.querySelector(`script[src="${SDK_SRC}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = SDK_SRC;
  document.head.append(script);
})();
