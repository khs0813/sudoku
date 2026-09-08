import { createAdFitConfig } from './adfit-config.mjs';

export type Locale = 'ko' | 'en';

export const locales = ['ko', 'en'] as const;

export const basePaths = [
  '/',
  '/easy/',
  '/medium/',
  '/hard/',
  '/guide/rules/',
  '/guide/strategy/',
  '/about/',
  '/privacy/',
  '/contact/'
] as const;

export type BasePath = (typeof basePaths)[number];

export const localizedPaths: Record<Locale, Record<BasePath, string>> = {
  ko: {
    '/': '/',
    '/easy/': '/easy/',
    '/medium/': '/medium/',
    '/hard/': '/hard/',
    '/guide/rules/': '/guide/rules/',
    '/guide/strategy/': '/guide/strategy/',
    '/about/': '/about/',
    '/privacy/': '/privacy/',
    '/contact/': '/contact/'
  },
  en: {
    '/': '/en/',
    '/easy/': '/en/easy/',
    '/medium/': '/en/medium/',
    '/hard/': '/en/hard/',
    '/guide/rules/': '/en/guide/rules/',
    '/guide/strategy/': '/en/guide/strategy/',
    '/about/': '/en/about/',
    '/privacy/': '/en/privacy/',
    '/contact/': '/en/contact/'
  }
};

export const normalizePathname = (pathname: string) => {
  const path = pathname.split(/[?#]/)[0] || '/';
  return path === '/' || path.endsWith('/') ? path : `${path}/`;
};

export const getBasePathFromPathname = (pathname: string): BasePath | undefined => {
  const normalized = normalizePathname(pathname);
  return basePaths.find((basePath) => locales.some((locale) => localizedPaths[locale][basePath] === normalized));
};

export const getLocalizedPath = (basePath: BasePath, locale: Locale) => localizedPaths[locale][basePath];

export const getLocaleFromPathname = (pathname: string): Locale => normalizePathname(pathname).startsWith('/en/') ? 'en' : 'ko';

export const siteLocales = {
  ko: {
    name: '스도쿠데이',
    shortName: '스도쿠데이',
    tagline: '매일 한 판 무료 스도쿠',
    description: '초급부터 고급까지 매일 새 퍼즐을 제공하는 무료 스도쿠 게임입니다. 메모, 힌트, 이어하기, 연속 기록을 지원합니다.',
    themeColor: '#0d8b72',
    fallbackUrl: 'https://sudokuday.co.kr',
    mark: '9',
    genre: 'Puzzle game',
    htmlLang: 'ko',
    language: 'ko-KR',
    hreflang: 'ko-KR',
    ogLocale: 'ko_KR',
    priceCurrency: 'KRW',
    contactEmail: 'webinquiry365@gmail.com',
    nav: [['오늘 퍼즐', '/'], ['초급', '/easy/'], ['중급', '/medium/'], ['고급', '/hard/'], ['게임 방법', '/guide/rules/'], ['광고문의', '/contact/']],
    labels: {
      homeAria: '스도쿠데이 홈',
      mainNav: '주요 메뉴',
      skipLink: '본문으로 건너뛰기',
      footerNav: '하단 메뉴',
      footerExtra: '회원가입과 서버 저장 없이 브라우저에서 바로 실행됩니다.',
      about: '서비스 소개',
      privacy: '개인정보 안내',
      contact: '광고문의',
      install: '홈 화면에 추가',
      footerBottom: '무료 개인용 웹 게임.',
      languageSwitch: 'English',
      languageSwitchAria: 'View this page in English',
      ad: '광고'
    }
  },
  en: {
    name: 'SudokuDay',
    shortName: 'SudokuDay',
    tagline: 'Free daily Sudoku',
    description: 'Play free online Sudoku puzzles from easy to hard, with notes, hints, undo, resume, and daily streak tracking.',
    themeColor: '#0d8b72',
    fallbackUrl: 'https://sudokuday.co.kr',
    mark: '9',
    genre: 'Puzzle game',
    htmlLang: 'en',
    language: 'en-US',
    hreflang: 'en',
    ogLocale: 'en_US',
    priceCurrency: 'USD',
    contactEmail: 'webinquiry365@gmail.com',
    nav: [['Daily Puzzle', '/en/'], ['Easy', '/en/easy/'], ['Medium', '/en/medium/'], ['Hard', '/en/hard/'], ['How to Play', '/en/guide/rules/'], ['Advertising', '/en/contact/']],
    labels: {
      homeAria: 'SudokuDay home',
      mainNav: 'Primary navigation',
      skipLink: 'Skip to main content',
      footerNav: 'Footer navigation',
      footerExtra: 'Runs in your browser without sign-up or server-side saves.',
      about: 'About',
      privacy: 'Privacy',
      contact: 'Advertising',
      install: 'Add to home screen',
      footerBottom: 'Free web Sudoku game for personal play.',
      languageSwitch: 'Korean',
      languageSwitchAria: 'View this page in Korean',
      ad: 'Advertisement'
    }
  }
} as const;

export const siteConfig = siteLocales.ko;

export const getSiteConfig = (locale: Locale = 'ko') => siteLocales[locale];

export const adFitConfig = createAdFitConfig(process.env);
