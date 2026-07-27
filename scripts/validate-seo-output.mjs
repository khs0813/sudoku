import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = 'https://sudokuday.co.kr';
const pages = [
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
  }
];

const count = (html, pattern) => [...html.matchAll(pattern)].length;
const get = (html, pattern, label) => {
  const match = html.match(pattern);
  assert.ok(match, `${label}: missing`);
  return match[1];
};
const canonicalFor = (path) => new URL(path, site).href;

for (const page of pages) {
  const html = await readFile(new URL(`../dist/${page.file}`, import.meta.url), 'utf8');
  const canonical = canonicalFor(page.path);
  const label = page.path;

  assert.equal(count(html, /<title>/g), 1, `${label}: title count`);
  assert.equal(count(html, /<meta name="description"/g), 1, `${label}: description count`);
  assert.equal(count(html, /<link rel="canonical"/g), 1, `${label}: canonical count`);
  assert.equal(count(html, /<meta property="og:title"/g), 1, `${label}: og:title count`);
  assert.equal(count(html, /<meta property="og:description"/g), 1, `${label}: og:description count`);
  assert.equal(count(html, /<meta property="og:url"/g), 1, `${label}: og:url count`);
  assert.equal(count(html, /<meta property="og:image"/g), 1, `${label}: og:image count`);
  assert.equal(count(html, /<h1\b/g), 1, `${label}: h1 count`);
  assert.equal(html.includes('noindex'), false, `${label}: normal pages must be indexable`);

  const title = get(html, /<title>([^<]+)<\/title>/, `${label}: title`);
  const description = get(html, /<meta name="description" content="([^"]+)"/, `${label}: description`);
  const pageCanonical = get(html, /<link rel="canonical" href="([^"]+)"/, `${label}: canonical`);
  const ogTitle = get(html, /<meta property="og:title" content="([^"]+)"/, `${label}: og:title`);
  const ogDescription = get(html, /<meta property="og:description" content="([^"]+)"/, `${label}: og:description`);
  const ogUrl = get(html, /<meta property="og:url" content="([^"]+)"/, `${label}: og:url`);
  const ogImage = get(html, /<meta property="og:image" content="([^"]+)"/, `${label}: og:image`);
  const twitterTitle = get(html, /<meta name="twitter:title" content="([^"]+)"/, `${label}: twitter:title`);
  const twitterDescription = get(html, /<meta name="twitter:description" content="([^"]+)"/, `${label}: twitter:description`);
  const twitterImage = get(html, /<meta name="twitter:image" content="([^"]+)"/, `${label}: twitter:image`);

  assert.equal(title, page.title, `${label}: approved title`);
  assert.equal(description, page.description, `${label}: approved description`);
  assert.equal(pageCanonical, canonical, `${label}: canonical URL`);
  assert.equal(ogTitle, title, `${label}: og:title should match title`);
  assert.equal(ogDescription, description, `${label}: og:description should match description`);
  assert.equal(ogUrl, pageCanonical, `${label}: og:url should match canonical`);
  assert.equal(twitterTitle, title, `${label}: twitter:title should match title`);
  assert.equal(twitterDescription, description, `${label}: twitter:description should match description`);
  assert.equal(twitterImage, ogImage, `${label}: twitter:image should match og:image`);
  assert.ok(ogImage.startsWith(`${site}/`), `${label}: og:image must be absolute on canonical host`);
}

const manifest = JSON.parse(await readFile(new URL('../dist/manifest.webmanifest', import.meta.url), 'utf8'));
assert.equal(manifest.name, '스도쿠데이', 'manifest name');
assert.equal(manifest.short_name, '스도쿠데이', 'manifest short_name');
assert.equal(manifest.id, '/', 'manifest id');
assert.equal(manifest.start_url, '/', 'manifest start_url');
assert.equal(manifest.scope, '/', 'manifest scope');

const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
assert.match(robots, /^User-agent: \*\nAllow: \//, 'robots allow');
assert.ok(robots.includes(`${site}/sitemap.xml`), 'robots sitemap host');

const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
for (const page of pages) assert.ok(sitemap.includes(`<loc>${canonicalFor(page.path)}</loc>`), `sitemap includes ${page.path}`);

console.log(`Validated SEO metadata for ${pages.length} pages.`);
