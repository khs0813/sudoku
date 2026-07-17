const DEFAULT_ALLOWED_HOST = 'sudokuday.co.kr';
const DEFAULT_DESKTOP_HERO_MIN_WIDTH = 1024;

const readEnv = (env, key) => {
  const value = env?.[key];
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  return '';
};

const readBooleanEnv = (env, key) => readEnv(env, key).toLowerCase() === 'true';

const readPositiveIntegerEnv = (env, key) => {
  const value = Number.parseInt(readEnv(env, key), 10);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const normalizeHost = (host) => host
  .trim()
  .replace(/^https?:\/\//i, '')
  .split('/')[0]
  .split(':')[0]
  .toLowerCase();

export const parseAllowedHosts = (value = DEFAULT_ALLOWED_HOST) => value
  .split(',')
  .map(normalizeHost)
  .filter((host) => host && host !== '*');

export const normalizeAdUnit = (value = '') => {
  const unit = value.trim();
  return unit && unit.startsWith('DAN-') ? unit : '';
};

const readFirstAdUnit = (env, keys) => {
  for (const key of keys) {
    const unit = normalizeAdUnit(readEnv(env, key));
    if (unit) return unit;
  }
  return '';
};

const adUnit = (id, width, height) => ({ id, width, height });

const readMobileVariant = (env) => {
  const value = readEnv(env, 'ADFIT_GAME_MOBILE_VARIANT').toLowerCase();
  return value === '320x50' ? '320x50' : '320x100';
};

const readDesktopHeroMinWidth = (env) => {
  const configured = readPositiveIntegerEnv(env, 'ADFIT_DESKTOP_HERO_MIN_WIDTH');
  if (configured) return configured;

  const legacyMobileMaxWidth = readPositiveIntegerEnv(env, 'ADFIT_MOBILE_MAX_WIDTH');
  if (legacyMobileMaxWidth) return legacyMobileMaxWidth + 1;

  return DEFAULT_DESKTOP_HERO_MIN_WIDTH;
};

const isPreviewBuild = (env) => (
  readBooleanEnv(env, 'IS_PULL_REQUEST')
  || readBooleanEnv(env, 'RENDER_PULL_REQUEST')
  || Boolean(readEnv(env, 'RENDER_PULL_REQUEST_ID') && !['false', '0'].includes(readEnv(env, 'RENDER_PULL_REQUEST_ID').toLowerCase()))
);

export const createAdFitConfig = (env = {}) => {
  const gameDesktop = adUnit(
    readFirstAdUnit(env, ['ADFIT_GAME_DESKTOP_UNIT']),
    300,
    250
  );
  const gameMobile320x100 = adUnit(
    readFirstAdUnit(env, ['ADFIT_GAME_MOBILE_UNIT', 'ADFIT_GAME_MOBILE_320X100_UNIT']),
    320,
    100
  );
  const gameMobile320x50 = adUnit(
    readFirstAdUnit(env, ['ADFIT_GAME_MOBILE_320X50_UNIT']),
    320,
    50
  );
  const guideDesktop = adUnit(
    readFirstAdUnit(env, ['ADFIT_GUIDE_DESKTOP_UNIT']),
    300,
    250
  );
  const guideMobile = adUnit(
    readFirstAdUnit(env, ['ADFIT_GUIDE_MOBILE_UNIT']),
    320,
    100
  );

  const requestedMobileVariant = readMobileVariant(env);
  const selectedGameMobile = requestedMobileVariant === '320x50' && gameMobile320x50.id
    ? gameMobile320x50
    : gameMobile320x100;

  return {
    enabled: readBooleanEnv(env, 'ADFIT_ENABLED') && !isPreviewBuild(env),
    allowedHosts: parseAllowedHosts(readEnv(env, 'ADFIT_ALLOWED_HOSTS') || DEFAULT_ALLOWED_HOST),
    desktopHeroMinWidth: readDesktopHeroMinWidth(env),
    mobileVariant: selectedGameMobile === gameMobile320x50 ? '320x50' : '320x100',
    units: {
      gameDesktop,
      gameMobile320x100,
      gameMobile320x50,
      guideDesktop,
      guideMobile
    },
    placements: {
      game: {
        desktop: gameDesktop,
        mobile: selectedGameMobile
      },
      guide: {
        desktop: guideDesktop,
        mobile: guideMobile
      }
    }
  };
};

export const createPlacementClientConfig = (config, placement) => {
  const units = config.placements[placement];
  return {
    enabled: config.enabled,
    allowedHosts: config.allowedHosts,
    desktopHeroMinWidth: config.desktopHeroMinWidth,
    mobileVariant: config.mobileVariant,
    placement,
    units: {
      desktop: units.desktop,
      mobile: units.mobile
    }
  };
};
