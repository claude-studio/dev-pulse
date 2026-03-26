# update-newsletter 스킬 가이드

dev-pulse 프로젝트의 `src/shared/data/newsletter.json`을 자동 갱신하는 스킬.
이 문서는 향후 Claude 세션이 소스 추가/수정을 독립적으로 수행할 수 있도록 상세하게 작성되어 있다.

---

## 개요

| 항목          | 내용                                                 |
| ------------- | ---------------------------------------------------- |
| 실행 방법     | `/update-newsletter` 또는 scheduled cron             |
| 실행 주기     | 2시간 간격 (`0 */2 * * *`)                           |
| 출력 파일     | `src/shared/data/newsletter.json`                    |
| 수정 금지     | `src/shared/types/news.ts`, `src/` 하위 모든 UI 코드 |
| 데이터 스키마 | `src/shared/types/news.ts` 참조                      |

---

## 소스 레지스트리 구조

스킬이 추적하는 각 소스는 다음 속성으로 정의된다:

```
{
  source:    GitHub owner/repo 슬러그 또는 고유 ID
  fetchURL:  GitHub API 또는 RSS URL
  fetchType: "github-release" | "rss"
  category:  NewsItem category 값
  tag:       카드에 표시될 대문자 레이블
  section:   "ai" | "frontend"  (어느 섹션에 속하는지)
  priority:  숫자 (높을수록 hero/tall 등 상위 variant)
  outputType: "news" | "vercel"  (VercelNewsItem이면 "vercel")
}
```

### 현재 등록된 소스 목록

| source                     | fetchType      | section  | priority |
| -------------------------- | -------------- | -------- | -------- |
| `anthropics/claude-code`   | github-release | ai       | 10       |
| `vercel/next.js`           | github-release | ai       | 8        |
| `microsoft/TypeScript`     | github-release | frontend | 7        |
| `vitejs/vite`              | github-release | frontend | 6        |
| `tailwindlabs/tailwindcss` | github-release | frontend | 5        |
| `facebook/react`           | github-release | frontend | 5        |
| `vercel-changelog`         | rss            | frontend | 3        |

---

## 새 기술스택 소스 추가 방법

### 1단계 — 소스 유형 결정

**GitHub 릴리즈가 있는 저장소**인 경우:

- fetchType: `"github-release"`
- fetchURL: `https://api.github.com/repos/{owner}/{repo}/releases/latest`
- 릴리즈 노트(body)에서 bullets 추출

**블로그/RSS 피드**인 경우:

- fetchType: `"rss"`
- fetchURL: RSS/Atom URL
- 최신 포스트에서 요약 추출
- Vercel Changelog처럼 복수 항목이면 outputType: `"vercel"` 사용

### 2단계 — 속성값 결정

**category** 선택 가이드:

- `"tool"` — 개발 도구 (CLI, IDE 확장, 빌드 도구)
- `"release"` — 프레임워크/라이브러리 릴리즈
- `"infra"` — 인프라/플랫폼 (Vercel, AWS, Cloudflare 등)
- `"ai"` — AI 도구/모델
- `"security"` — 보안 패치 (스킬이 자동 감지도 함)

**tag** 선택 가이드:

- `"TOOL"` — CLI, 개발 도구
- `"RELEASE"` — 버전 릴리즈
- `"INFRA"` — 인프라
- `"SECURITY"` — 보안 패치

**section** 선택 가이드:

- `"ai"` — AI/Claude Code 관련 (🤖 Claude Code / AI 섹션)
- `"frontend"` — 프론트엔드 생태계 (⚛️ Frontend 섹션)

**priority** 결정 기준:

- `9-10` — 매우 중요, hero/tall 배치 (Claude Code 수준)
- `6-8` — 주요 프레임워크 (Next.js, TypeScript 수준)
- `3-5` — 서브 툴/라이브러리
- `1-2` — 참고용 소스

### 3단계 — SKILL.md 소스 레지스트리 수정

`SKILL.md`의 소스 레지스트리 섹션에 새 항목을 추가한다:

```
[섹션: Frontend]
...
8. denoland/deno | category: release | tag: RELEASE | priority: 4
```

그리고 Step 2 (데이터 수집) 섹션에 해당 API URL을 추가한다:

```
- `https://api.github.com/repos/denoland/deno/releases/latest`
```

### 4단계 — 예시

**Bun 런타임 추가 예시:**

```
source: oven-sh/bun
fetchURL: https://api.github.com/repos/oven-sh/bun/releases/latest
fetchType: github-release
category: tool
tag: TOOL
section: frontend
priority: 6
outputType: news
```

SKILL.md 소스 레지스트리에 추가:

```
8. oven-sh/bun | category: tool | tag: TOOL | priority: 6
```

**Deno Deploy 블로그 RSS 추가 예시:**

```
source: deno-blog
fetchURL: https://deno.com/feed
fetchType: rss
category: infra
tag: INFRA
section: frontend
priority: 3
outputType: news
```

---

## 소스 제거 방법

1. `SKILL.md` 소스 레지스트리에서 해당 줄 삭제
2. Step 2의 fetchURL 목록에서 해당 URL 삭제
3. 기존 `newsletter.json`에 이미 포함된 항목은 다음 실행 때 자동으로 제외됨 (기존 데이터는 유지)

---

## 섹션 구조 수정 방법

현재 2개 섹션:

1. `🤖 Claude Code / AI` — priority 8-10 소스
2. `⚛️ Frontend` — priority 1-7 소스

**새 섹션 추가 시:**

- SKILL.md Step 5 (sections 구성) 섹션 수정
- section 속성을 새 섹션 ID로 설정
- label과 emoji 결정

---

## 중복 방지 메커니즘

스킬은 기존 `newsletter.json`을 읽어 각 소스의 `version` 값을 캐시한다.
**같은 버전이 이미 있으면 재요약하지 않고 기존 항목을 그대로 유지한다.**

```
existingVersions 맵 구성:
  - NewsItem: source → version 값
  - VercelNewsItem: "vercel-changelog" → date 값

비교:
  GitHub API tag_name == existingVersions[source] → 스킵
  tag_name != existingVersions[source] → 새 릴리즈, 요약 진행
```

---

## Variant (카드 크기) 할당 규칙

```
섹션 1 (ai):
  1번째 항목 (priority 최고) → hero  (가장 큰 카드)
  2번째 항목               → tall

섹션 2 (frontend):
  1-2번째 항목             → wide
  나머지                   → third
  VercelNewsItem           → 항상 third
```

---

## 데이터 스키마 요약

전체 타입 정의: `/Users/genie/Desktop/jb/dev-pulse/src/shared/types/news.ts`

```typescript
// 일반 뉴스 카드
interface NewsItem {
  id: string; // kebab-case 고유 ID (예: "claude-code-2181")
  category: 'tool' | 'release' | 'infra' | 'ai' | 'security';
  variant: 'hero' | 'tall' | 'wide' | 'sm' | 'third';
  tag: string; // 대문자 레이블 (예: "TOOL", "RELEASE")
  version?: string; // 표시용 버전 (예: "v2.1.81")
  title: string; // 공식 이름 (예: "Claude Code")
  date: string; // ISO 날짜 (예: "2026-03-20")
  source: string; // GitHub owner/repo
  bullets: string[]; // HTML 문자열, <strong> 태그 사용
  link: { url: string; label: string };
  bgNum?: string; // 배경 숫자 (버전 숫자 추출)
}

// Vercel 전용 카드 (여러 항목 나열)
interface VercelNewsItem {
  id: string;
  category: 'infra';
  variant: 'third';
  tag: string;
  title: string;
  date: string;
  type: 'vercel'; // 필수! NewsItem과 구분자
  items: { title: string; description: string }[];
  link: { url: string; label: string };
}

// 날짜별 섹션
interface DateSection {
  label: string; // 예: "🤖 Claude Code / AI"
  date: string; // 예: "2026.03.20" 또는 "2026.03.18 ~ 2026.03.23"
  news: (NewsItem | VercelNewsItem)[];
}

// 최상위 구조
interface NewsletterData {
  meta: {
    volume: string; // "VOL. 001 / ISSUE 01"
    topic: string; // "CLAUDE CODE + FRONTEND"
    date: string; // "2026.03.25 WED"
    sourceCount: number;
  };
  ticker: string[]; // 스크롤 텍스트 배열
  sections: DateSection[];
}
```

---

## 스케줄 설정

`schedule` 스킬로 등록:

- cron: `0 */2 * * *` (2시간 간격)
- 프롬프트: `/update-newsletter`
- 프로젝트: `/Users/genie/Desktop/jb/dev-pulse`

새 릴리즈가 없으면 변경 없이 종료 (빈 커밋 방지).
