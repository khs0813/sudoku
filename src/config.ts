export const siteConfig = {
  name: "포켓 스도쿠",
  shortName: "스도쿠",
  tagline: "손안의 매일 스도쿠",
  description: "초급부터 고급까지 매일 새 퍼즐을 제공하는 무료 모바일 스도쿠입니다. 메모, 힌트, 이어하기, 연속 기록을 지원합니다.",
  themeColor: "#0d8b72",
  fallbackUrl: "https://pocket-sudoku.onrender.com",
  mark: "9",
  genre: "Puzzle game",
  nav: [["오늘 퍼즐", "/"], ["초급", "/easy/"], ["중급", "/medium/"], ["고급", "/hard/"], ["게임 방법", "/guide/rules/"]]
} as const;

type AdFitDeviceConfig = {
  unit: string;
  width: number;
  height: number;
};

type AdFitPlacementConfig = {
  desktop: AdFitDeviceConfig;
  mobile: AdFitDeviceConfig;
};

const readEnv = (key: string, fallback = '') => {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value.trim() : fallback;
};

const readBooleanEnv = (key: string, fallback = false) => {
  const value = readEnv(key);
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const readNumberEnv = (key: string, fallback: number) => {
  const value = Number.parseInt(readEnv(key), 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const parseHosts = (value: string) => value
  .split(',')
  .map((host) => host.trim().replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase())
  .filter(Boolean);

const readAdUnit = (key: string) => {
  const value = readEnv(key);
  return /^DAN-[A-Za-z0-9_-]+$/.test(value) ? value : '';
};

const adFitUnit = (
  unitKey: string,
  widthKey: string,
  heightKey: string,
  fallbackWidth: number,
  fallbackHeight: number
): AdFitDeviceConfig => ({
  unit: readAdUnit(unitKey),
  width: readNumberEnv(widthKey, fallbackWidth),
  height: readNumberEnv(heightKey, fallbackHeight)
});

export const adFitConfig: {
  enabled: boolean;
  allowedHosts: string[];
  mobileMaxWidth: number;
  placements: {
    game: AdFitPlacementConfig;
    guide: AdFitPlacementConfig;
  };
} = {
  enabled: readBooleanEnv('ADFIT_ENABLED', false),
  allowedHosts: parseHosts(readEnv('ADFIT_ALLOWED_HOSTS', 'sudoku-pelu.onrender.com')),
  mobileMaxWidth: readNumberEnv('ADFIT_MOBILE_MAX_WIDTH', 767),
  placements: {
    game: {
      desktop: adFitUnit('ADFIT_GAME_DESKTOP_UNIT', 'ADFIT_GAME_DESKTOP_WIDTH', 'ADFIT_GAME_DESKTOP_HEIGHT', 300, 250),
      mobile: adFitUnit('ADFIT_GAME_MOBILE_UNIT', 'ADFIT_GAME_MOBILE_WIDTH', 'ADFIT_GAME_MOBILE_HEIGHT', 320, 100)
    },
    guide: {
      desktop: adFitUnit('ADFIT_GUIDE_DESKTOP_UNIT', 'ADFIT_GUIDE_DESKTOP_WIDTH', 'ADFIT_GUIDE_DESKTOP_HEIGHT', 300, 250),
      mobile: adFitUnit('ADFIT_GUIDE_MOBILE_UNIT', 'ADFIT_GUIDE_MOBILE_WIDTH', 'ADFIT_GUIDE_MOBILE_HEIGHT', 320, 100)
    }
  }
};
