import { createAdFitConfig } from './adfit-config.mjs';

export const siteConfig = {
  name: "스도쿠데이",
  shortName: "스도쿠데이",
  tagline: "매일 한 판 무료 스도쿠",
  description: "초급부터 고급까지 매일 새 퍼즐을 제공하는 무료 스도쿠 게임입니다. 메모, 힌트, 이어하기, 연속 기록을 지원합니다.",
  themeColor: "#0d8b72",
  fallbackUrl: "https://sudokuday.co.kr",
  mark: "9",
  genre: "Puzzle game",
  nav: [["오늘 퍼즐", "/"], ["초급", "/easy/"], ["중급", "/medium/"], ["고급", "/hard/"], ["게임 방법", "/guide/rules/"]]
} as const;

export const adFitConfig = createAdFitConfig(process.env);
