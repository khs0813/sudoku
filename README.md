# 스도쿠데이

일일 퍼즐과 초급·중급·고급 연습 모드를 제공하는 모바일 우선 정적 스도쿠 게임입니다.

## 주요 기능

- 초급 20개, 중급 20개, 고급 20개
- 60개 퍼즐 모두 단일 해답 검증
- 날짜별 일일 난이도와 퍼즐 선택
- 숫자 패드와 데스크톱 키보드
- 후보 숫자 메모
- 오답 표시
- 힌트와 되돌리기
- 타이머, 일시정지, 실수 수
- 자동 저장과 이어하기
- 완료 기록·연속 참여·공유
- 규칙 및 풀이 전략 SEO 페이지
- PWA 설치 및 오프라인 재접속

## 실행

```bash
npm ci
npm run dev
npm run build
```

## Render

프로젝트의 `render.yaml`을 Blueprint로 적용합니다.

```text
Build Command: npm ci && npm run build
Publish Directory: ./dist
```

커스텀 도메인 사용 시:

```env
SITE_URL=https://sudokuday.co.kr
```

## 퍼즐 데이터

`public/data/sudoku.json`은 난이도별 배열을 가집니다.

```json
{
  "id": "easy-01",
  "puzzle": "0을 빈칸으로 사용하는 81자리 문자열",
  "solution": "1부터 9로 구성된 81자리 해답"
}
```

새 퍼즐을 추가할 때 반드시 확인할 항목:

- ID 중복 없음
- 문자열 길이 81
- 단서가 해답과 일치
- 모든 행·열·3×3 박스가 유효
- 해답이 정확히 하나

## 저장 방식

진행 상태와 통계는 `pocket-sudoku:` 접두사의 `localStorage` 키에 저장됩니다. 서버 저장과 기기 간 동기화는 제공하지 않습니다.
