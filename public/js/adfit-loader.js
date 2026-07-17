(() => {
  const SDK_SRC = 'https://t1.kakaocdn.net/kas/static/ba.min.js';

  if (window.__sudokuDayAdFitLoaded) return;
  window.__sudokuDayAdFitLoaded = true;

  const slots = [...document.querySelectorAll('[data-adfit-placement]')];
  if (!slots.length) return;

  const removeSlots = () => slots.forEach((slot) => slot.remove());
  const configEl = document.getElementById('adfit-config');
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

  const allowedHosts = Array.isArray(config.allowedHosts)
    ? config.allowedHosts.map((host) => String(host).trim().toLowerCase()).filter(Boolean)
    : [];
  const currentHost = window.location.hostname.toLowerCase();
  const blockedHost = currentHost === 'localhost'
    || currentHost === '127.0.0.1'
    || currentHost === '::1'
    || currentHost.endsWith('.localhost')
    || currentHost.endsWith('.onrender.com');

  if (!config.enabled || blockedHost || !allowedHosts.includes(currentHost)) {
    removeSlots();
    return;
  }

  const desktopHeroMinWidth = Number.isFinite(Number(config.desktopHeroMinWidth))
    ? Number(config.desktopHeroMinWidth)
    : 1024;
  const device = window.matchMedia(`(min-width: ${desktopHeroMinWidth}px)`).matches ? 'desktop' : 'mobile';
  let hasAd = false;
  let sdkAnchor = null;

  for (const slot of slots) {
    if (slot.dataset.adfitInitialized === 'true') continue;

    const placement = slot.dataset.adfitPlacement;
    const unit = config.placement === placement ? config.units?.[device] : null;
    const unitId = typeof unit?.id === 'string' ? unit.id.trim() : '';
    const width = Number(unit?.width);
    const height = Number(unit?.height);

    if (!unitId.startsWith('DAN-') || !Number.isFinite(width) || !Number.isFinite(height)) {
      slot.remove();
      continue;
    }

    slot.dataset.adfitInitialized = 'true';
    slot.dataset.adfitDevice = device;
    slot.dataset.adfitSize = `${width}x${height}`;
    slot.classList.add('adfit-slot--ready', `adfit-slot--${device}`);

    const frame = document.createElement('div');
    frame.className = 'adfit-frame';

    const ad = document.createElement('ins');
    ad.className = 'kakao_ad_area';
    ad.style.cssText = 'display:none;width:100%;';
    ad.setAttribute('data-ad-unit', unitId);
    ad.setAttribute('data-ad-width', String(width));
    ad.setAttribute('data-ad-height', String(height));

    frame.append(ad);
    slot.append(frame);
    sdkAnchor = sdkAnchor || ad;
    hasAd = true;
  }

  if (!hasAd || document.querySelector(`script[data-adfit-sdk], script[src="${SDK_SRC}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.type = 'text/javascript';
  script.charset = 'utf-8';
  script.src = SDK_SRC;
  script.dataset.adfitSdk = 'true';
  sdkAnchor?.after(script);
})();
