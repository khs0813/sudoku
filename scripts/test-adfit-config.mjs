import assert from 'node:assert/strict';
import { createAdFitConfig, normalizeAdUnit, parseAllowedHosts } from '../src/adfit-config.mjs';

const baseEnv = {
  ADFIT_ALLOWED_HOSTS: ' https://sudokuday.co.kr, www.sudokuday.co.kr/path , * ',
  ADFIT_GAME_DESKTOP_UNIT: 'DAN-TEST-GAME-DESKTOP',
  ADFIT_GAME_MOBILE_UNIT: 'DAN-TEST-GAME-MOBILE-100',
  ADFIT_GUIDE_DESKTOP_UNIT: 'DAN-TEST-GUIDE-DESKTOP',
  ADFIT_GUIDE_MOBILE_UNIT: 'DAN-TEST-GUIDE-MOBILE'
};

assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'true' }).enabled, true);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'TRUE' }).enabled, true);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'false' }).enabled, false);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: '' }).enabled, false);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: '1' }).enabled, false);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'true', IS_PULL_REQUEST: 'true' }).enabled, false);

assert.deepEqual(parseAllowedHosts(baseEnv.ADFIT_ALLOWED_HOSTS), ['sudokuday.co.kr', 'www.sudokuday.co.kr']);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'true', ADFIT_DESKTOP_HERO_MIN_WIDTH: 'nope' }).desktopHeroMinWidth, 1024);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'true', ADFIT_DESKTOP_HERO_MIN_WIDTH: '1200' }).desktopHeroMinWidth, 1200);
assert.equal(createAdFitConfig({ ...baseEnv, ADFIT_ENABLED: 'true', ADFIT_MOBILE_MAX_WIDTH: '767' }).desktopHeroMinWidth, 768);

assert.equal(normalizeAdUnit(''), '');
assert.equal(normalizeAdUnit('NOT-DAN'), '');
assert.equal(normalizeAdUnit('DAN-TEST-ID'), 'DAN-TEST-ID');

const fallbackConfig = createAdFitConfig({
  ...baseEnv,
  ADFIT_ENABLED: 'true',
  ADFIT_GAME_MOBILE_VARIANT: '320x50',
  ADFIT_GAME_MOBILE_320X50_UNIT: ''
});
assert.equal(fallbackConfig.mobileVariant, '320x100');
assert.equal(fallbackConfig.placements.game.mobile.id, 'DAN-TEST-GAME-MOBILE-100');

const variantConfig = createAdFitConfig({
  ...baseEnv,
  ADFIT_ENABLED: 'true',
  ADFIT_GAME_MOBILE_VARIANT: '320x50',
  ADFIT_GAME_MOBILE_320X50_UNIT: 'DAN-TEST-GAME-MOBILE-50'
});
assert.equal(variantConfig.mobileVariant, '320x50');
assert.equal(variantConfig.placements.game.mobile.width, 320);
assert.equal(variantConfig.placements.game.mobile.height, 50);
