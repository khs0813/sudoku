import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = 'https://sudokuday.co.kr';
const koPages = [
  {
    path: '/',
    file: 'index.html',
    title: '무료 스도쿠 게임 - 오늘의 스도쿠 | 스도쿠데이',
    description: '회원가입 없이 바로 즐기는 무료 9×9 스도쿠 게임입니다. 오늘의 퍼즐과 초급·중급·고급 문제, 메모·힌트·되돌리기·자동 이어하기를 지원합니다.'
  },
  {
    path: '/easy/',
    file: 'easy/index.html',
    title: '초급 스도쿠 무료 게임 | 스도쿠데이',
    description: '초보자도 부담 없이 시작할 수 있는 무료 초급 9×9 스도쿠입니다. 메모·힌트·되돌리기·자동 이어하기를 지원하며 새 퍼즐을 계속 풀 수 있습니다.'
  },
  {
    path: '/medium/',
    file: 'medium/index.html',
    title: '중급 스도쿠 무료 게임 | 스도쿠데이',
    description: '중급 스도쿠를 회원가입 없이 무료로 바로 풀어보세요. 후보 메모·힌트·되돌리기·자동 이어하기를 지원하며 완료 후 새 퍼즐을 계속 시작할 수 있습니다.'
  },
  {
    path: '/hard/',
    file: 'hard/index.html',
    title: '고급 스도쿠 무료 게임 | 스도쿠데이',
    description: '고급 스도쿠를 무료로 바로 풀어보세요. 후보 비교와 논리 풀이가 필요한 9×9 퍼즐로 메모·힌트·되돌리기·자동 이어하기를 지원합니다.'
  },
  {
    path: '/guide/rules/',
    file: 'guide/rules/index.html',
    title: '스도쿠 규칙과 게임 방법 | 스도쿠데이',
    description: '스도쿠의 가로줄·세로줄·3×3 구역 규칙과 메모·힌트 사용법, 퍼즐 완료 조건을 초보자도 이해하기 쉽게 설명합니다.'
  },
  {
    path: '/guide/strategy/',
    file: 'guide/strategy/index.html',
    title: '스도쿠 푸는 법과 초보 풀이 전략 | 스도쿠데이',
    description: '스도쿠를 잘 푸는 순서를 단일 후보, 숨은 단일 후보, 후보 메모와 잠긴 후보 예시를 통해 단계별로 설명합니다.'
  },
  {
    path: '/about/',
    file: 'about/index.html',
    title: '서비스 소개 | 스도쿠데이',
    description: '스도쿠데이의 무료 스도쿠 게임 구성, 브라우저 저장 방식, 오늘의 퍼즐과 난이도별 연습 모드 운영 원칙을 안내합니다.'
  },
  {
    path: '/privacy/',
    file: 'privacy/index.html',
    title: '개인정보 안내 | 스도쿠데이',
    description: '스도쿠데이에서 사용하는 브라우저 저장 데이터, 선택형 분석 도구, 광고 서비스, 결과 공유 기능의 개인정보 처리 방식을 안내합니다.'
  },
  {
    path: '/contact/',
    file: 'contact/index.html',
    title: '광고문의 | 스도쿠데이',
    description: '스도쿠데이 광고 문의, 배너 집행 및 제휴 관련 연락처 정보를 안내합니다.'
  }
].map((page) => ({ ...page, locale: 'ko', htmlLang: 'ko', ogLocale: 'ko_KR', manifest: '/manifest.webmanifest', rss: `${site}/rss.xml` }));

const enPages = [
  {
    path: '/en/',
    file: 'en/index.html',
    title: 'Free Sudoku Online - Daily Sudoku Puzzle | SudokuDay',
    description: 'Play free 9x9 Sudoku online with no sign-up. Start a daily puzzle or play unlimited easy, medium, and hard games with notes, hints, undo, and auto-save.'
  },
  {
    path: '/en/easy/',
    file: 'en/easy/index.html',
    title: 'Easy Sudoku Online - Free Beginner Puzzle | SudokuDay',
    description: 'Play easy Sudoku online for free. Beginner-friendly 9x9 puzzles include notes, hints, undo, auto-save, and a new puzzle button after each solve.'
  },
  {
    path: '/en/medium/',
    file: 'en/medium/index.html',
    title: 'Medium Sudoku Online - Free 9x9 Puzzle | SudokuDay',
    description: 'Play medium Sudoku online for free, no account required. Practice candidate notes, hidden singles, locked candidates, hints, undo, and browser auto-save.'
  },
  {
    path: '/en/hard/',
    file: 'en/hard/index.html',
    title: 'Hard Sudoku Online - Free Advanced Puzzle | SudokuDay',
    description: 'Play hard Sudoku online for free. Solve challenging 9x9 puzzles with candidate notes, hints, undo, auto-save, and logical solving practice.'
  },
  {
    path: '/en/guide/rules/',
    file: 'en/guide/rules/index.html',
    title: 'Sudoku Rules - How to Play Sudoku | SudokuDay',
    description: 'Learn the basic Sudoku rules for rows, columns, and 3x3 boxes, plus how notes, hints, undo, and puzzle completion work in the online game.'
  },
  {
    path: '/en/guide/strategy/',
    file: 'en/guide/strategy/index.html',
    title: 'How to Solve Sudoku - Beginner Strategy Guide | SudokuDay',
    description: 'Learn how to solve Sudoku step by step with single candidates, hidden singles, candidate notes, locked candidates, and beginner-friendly examples.'
  },
  {
    path: '/en/about/',
    file: 'en/about/index.html',
    title: 'About | SudokuDay',
    description: 'Learn how SudokuDay provides free online Sudoku puzzles, browser-based progress storage, daily challenges, and difficulty-based practice modes.'
  },
  {
    path: '/en/privacy/',
    file: 'en/privacy/index.html',
    title: 'Privacy | SudokuDay',
    description: 'Learn how SudokuDay handles browser storage, optional analytics, ads, and sharing for the free online Sudoku game.'
  },
  {
    path: '/en/contact/',
    file: 'en/contact/index.html',
    title: 'Advertising | SudokuDay',
    description: 'Advertising inquiries and contact information for SudokuDay.'
  }
].map((page) => ({ ...page, locale: 'en', htmlLang: 'en', ogLocale: 'en_US', manifest: '/en/manifest.webmanifest', rss: `${site}/en/rss.xml` }));

const pages = [...koPages, ...enPages];

const count = (html, pattern) => [...html.matchAll(pattern)].length;
const get = (html, pattern, label) => {
  const match = html.match(pattern);
  assert.ok(match, `${label}: missing`);
  return match[1];
};
const canonicalFor = (path) => new URL(path, site).href;
const basePathFor = (path) => path.startsWith('/en/') ? path.slice(3) || '/' : path;
const localizedPath = (basePath, locale) => locale === 'en' ? (basePath === '/' ? '/en/' : `/en${basePath}`) : basePath;

for (const page of pages) {
  const html = await readFile(new URL(`../dist/${page.file}`, import.meta.url), 'utf8');
  const canonical = canonicalFor(page.path);
  const basePath = basePathFor(page.path);
  const koCanonical = canonicalFor(localizedPath(basePath, 'ko'));
  const enCanonical = canonicalFor(localizedPath(basePath, 'en'));
  const label = page.path;

  assert.equal(count(html, /<title>/g), 1, `${label}: title count`);
  assert.equal(count(html, /<meta name="description"/g), 1, `${label}: description count`);
  assert.equal(count(html, /<link rel="canonical"/g), 1, `${label}: canonical count`);
  assert.equal(count(html, /<link rel="alternate" hreflang=/g), 3, `${label}: hreflang count`);
  assert.equal(count(html, /<meta property="og:title"/g), 1, `${label}: og:title count`);
  assert.equal(count(html, /<meta property="og:description"/g), 1, `${label}: og:description count`);
  assert.equal(count(html, /<meta property="og:url"/g), 1, `${label}: og:url count`);
  assert.equal(count(html, /<meta property="og:image"/g), 1, `${label}: og:image count`);
  assert.equal(count(html, /<h1\b/g), 1, `${label}: h1 count`);
  assert.equal(html.includes('noindex'), false, `${label}: normal pages must be indexable`);

  const htmlLang = get(html, /<html lang="([^"]+)"/, `${label}: html lang`);
  const title = get(html, /<title>([^<]+)<\/title>/, `${label}: title`);
  const description = get(html, /<meta name="description" content="([^"]+)"/, `${label}: description`);
  const pageCanonical = get(html, /<link rel="canonical" href="([^"]+)"/, `${label}: canonical`);
  const manifest = get(html, /<link rel="manifest" href="([^"]+)"/, `${label}: manifest`);
  const rss = get(html, /<link rel="alternate" type="application\/rss\+xml" title="[^"]+" href="([^"]+)"/, `${label}: rss`);
  const ogLocale = get(html, /<meta property="og:locale" content="([^"]+)"/, `${label}: og:locale`);
  const ogTitle = get(html, /<meta property="og:title" content="([^"]+)"/, `${label}: og:title`);
  const ogDescription = get(html, /<meta property="og:description" content="([^"]+)"/, `${label}: og:description`);
  const ogUrl = get(html, /<meta property="og:url" content="([^"]+)"/, `${label}: og:url`);
  const ogImage = get(html, /<meta property="og:image" content="([^"]+)"/, `${label}: og:image`);
  const twitterTitle = get(html, /<meta name="twitter:title" content="([^"]+)"/, `${label}: twitter:title`);
  const twitterDescription = get(html, /<meta name="twitter:description" content="([^"]+)"/, `${label}: twitter:description`);
  const twitterImage = get(html, /<meta name="twitter:image" content="([^"]+)"/, `${label}: twitter:image`);

  assert.equal(htmlLang, page.htmlLang, `${label}: html lang`);
  assert.equal(title, page.title, `${label}: approved title`);
  assert.equal(description, page.description, `${label}: approved description`);
  assert.equal(pageCanonical, canonical, `${label}: canonical URL`);
  assert.equal(manifest, page.manifest, `${label}: localized manifest`);
  assert.equal(rss, page.rss, `${label}: localized RSS`);
  assert.equal(ogLocale, page.ogLocale, `${label}: og:locale`);
  assert.ok(html.includes(`<link rel="alternate" hreflang="ko-KR" href="${koCanonical}">`), `${label}: ko-KR alternate`);
  assert.ok(html.includes(`<link rel="alternate" hreflang="en" href="${enCanonical}">`), `${label}: en alternate`);
  assert.ok(html.includes(`<link rel="alternate" hreflang="x-default" href="${enCanonical}">`), `${label}: x-default alternate`);
  assert.equal(ogTitle, title, `${label}: og:title should match title`);
  assert.equal(ogDescription, description, `${label}: og:description should match description`);
  assert.equal(ogUrl, pageCanonical, `${label}: og:url should match canonical`);
  assert.equal(twitterTitle, title, `${label}: twitter:title should match title`);
  assert.equal(twitterDescription, description, `${label}: twitter:description should match description`);
  assert.equal(twitterImage, ogImage, `${label}: twitter:image should match og:image`);
  assert.ok(ogImage.startsWith(`${site}/`), `${label}: og:image must be absolute on canonical host`);
}

const manifestKo = JSON.parse(await readFile(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8'));
assert.equal(manifestKo.name, '스도쿠데이', 'Korean manifest name');
assert.equal(manifestKo.short_name, '스도쿠데이', 'Korean manifest short_name');
assert.equal(manifestKo.id, '/', 'Korean manifest id');
assert.equal(manifestKo.start_url, '/', 'Korean manifest start_url');
assert.equal(manifestKo.scope, '/', 'Korean manifest scope');
assert.equal(manifestKo.lang, 'ko-KR', 'Korean manifest lang');

const manifestEn = JSON.parse(await readFile(new URL('../dist/en/manifest.webmanifest', import.meta.url), 'utf8'));
assert.equal(manifestEn.name, 'SudokuDay', 'English manifest name');
assert.equal(manifestEn.short_name, 'SudokuDay', 'English manifest short_name');
assert.equal(manifestEn.id, '/en/', 'English manifest id');
assert.equal(manifestEn.start_url, '/en/', 'English manifest start_url');
assert.equal(manifestEn.scope, '/en/', 'English manifest scope');
assert.equal(manifestEn.lang, 'en-US', 'English manifest lang');

const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
assert.match(robots, /^User-agent: \*\nAllow: \//, 'robots allow');
assert.ok(robots.includes(`${site}/sitemap.xml`), 'robots sitemap host');

const rssKo = await readFile(new URL('../dist/rss.xml', import.meta.url), 'utf8');
assert.ok(rssKo.includes('<title>스도쿠데이</title>'), 'Korean RSS channel title');
assert.ok(rssKo.includes('<language>ko-KR</language>'), 'Korean RSS language');
assert.ok(rssKo.includes(`<link>${site}/</link>`), 'Korean RSS channel link');
assert.ok(rssKo.includes(`<link>${site}/easy/</link>`), 'Korean RSS item');
assert.equal(rssKo.includes(`${site}/en/`), false, 'Korean RSS excludes English URLs');

const rssEn = await readFile(new URL('../dist/en/rss.xml', import.meta.url), 'utf8');
assert.ok(rssEn.includes('<title>SudokuDay</title>'), 'English RSS channel title');
assert.ok(rssEn.includes('<language>en-US</language>'), 'English RSS language');
assert.ok(rssEn.includes(`<link>${site}/en/</link>`), 'English RSS channel link');
assert.ok(rssEn.includes(`<link>${site}/en/easy/</link>`), 'English RSS item');
assert.equal(rssEn.includes(`${site}/easy/</link>`), false, 'English RSS excludes Korean URLs');

const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
assert.ok(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), 'sitemap hreflang namespace');
for (const page of pages) {
  const basePath = basePathFor(page.path);
  assert.ok(sitemap.includes(`<loc>${canonicalFor(page.path)}</loc>`), `sitemap includes ${page.path}`);
  assert.ok(sitemap.includes(`hreflang="ko-KR" href="${canonicalFor(localizedPath(basePath, 'ko'))}"`), `sitemap ko alternate ${page.path}`);
  assert.ok(sitemap.includes(`hreflang="en" href="${canonicalFor(localizedPath(basePath, 'en'))}"`), `sitemap en alternate ${page.path}`);
  assert.ok(sitemap.includes(`hreflang="x-default" href="${canonicalFor(localizedPath(basePath, 'en'))}"`), `sitemap x-default alternate ${page.path}`);
}

console.log(`Validated SEO metadata for ${pages.length} localized pages.`);
