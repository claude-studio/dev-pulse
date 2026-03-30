---
name: update-newsletter
description: |
  dev-pulse 프로젝트의 newsletter.json을 최신 기술 릴리즈로 자동 갱신하는 스킬.
  GitHub API와 RSS 피드에서 새 릴리즈를 감지하고, Claude가 직접 한국어로 요약하여
  newsletter.json을 업데이트한 후 git commit/push한다.

  트리거 문구 (다음 중 하나 이상 포함 시):
  - "/update-newsletter"
  - "뉴스레터 업데이트", "뉴스레터 갱신", "newsletter 업데이트"
  - "새 릴리즈 확인해줘", "릴리즈 업데이트해줘"
  - scheduled remote agent 실행 시

  IMPORTANT: 이 스킬은 반드시 `/Users/genie/Desktop/jb/dev-pulse` 프로젝트 컨텍스트에서 실행한다.

user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(curl *)
  - Bash(git *)
  - Bash(date *)
---

# update-newsletter 스킬

dev-pulse의 `src/shared/data/newsletter.json`을 GitHub API + RSS 피드 기반으로 자동 갱신한다.
**절대 규칙: `src/shared/types/news.ts`와 `src/` 하위 UI 코드는 수정하지 않는다. 오직 `newsletter.json`만 수정.**

---

## 소스 레지스트리 (Source Registry)

새 소스 추가/제거는 이 목록만 수정하면 된다. 추가 방법은 `update-newsletter-README.md` 참조.

```
[섹션: Claude Code / AI]
1. anthropics/claude-code   | category: tool    | tag: TOOL    | priority: 10
2. vercel/next.js           | category: release | tag: RELEASE | priority: 8

[섹션: Frontend]
3. microsoft/TypeScript     | category: release | tag: RELEASE | priority: 7
4. vitejs/vite              | category: release | tag: TOOL    | priority: 6
5. tailwindlabs/tailwindcss | category: release | tag: RELEASE | priority: 5
6. facebook/react           | category: release | tag: RELEASE | priority: 5  (* security 키워드 감지 시 자동 변환)
7. Vercel Changelog (RSS)   | category: infra   | tag: INFRA   | priority: 3  (type: "vercel")
```

---

## 실행 흐름

### Step 1 — 기존 데이터 로드

`src/shared/data/newsletter.json`을 읽어 기존 항목 버전 맵을 구성한다.

```
existingVersions = {
  "anthropics/claude-code": "v2.1.81",   // NewsItem.version
  "vercel/next.js": "16.2",
  "microsoft/TypeScript": "TS 6.0.2",
  "vitejs/vite": "Vite 8.0",
  "tailwindlabs/tailwindcss": "v4.2.2",
  "facebook/react": "v19.2.4",
  "vercel-changelog": "2026-03-23"        // VercelNewsItem.date
}
```

`src/shared/types/news.ts`도 읽어 스키마를 확인한다.

---

### Step 2 — 최신 릴리즈 수집 (Bash+curl 필수, WebFetch 금지)

**GitHub API는 반드시 Bash 도구로 curl을 직접 실행한다. WebFetch는 원격 환경에서 403을 반환하므로 절대 사용하지 않는다.**

`GH_TOKEN`은 Remote Trigger 메시지에서 제공된다. (보안상 이 파일에 직접 기재하지 않음)

```bash
# GH_TOKEN은 트리거 메시지의 Step 0에서 설정됨

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/anthropics/claude-code/releases/latest

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/vercel/next.js/releases/latest

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/microsoft/TypeScript/releases/latest

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/vitejs/vite/releases/latest

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/tailwindlabs/tailwindcss/releases/latest

curl -s -H "User-Agent: dev-pulse-bot" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token $GH_TOKEN" \
     https://api.github.com/repos/facebook/react/releases/latest
```

각 응답에서 추출: `tag_name`, `body`(릴리즈 노트), `published_at`, `html_url`

**RSS 피드** (curl 사용):

```bash
curl -s https://vercel.com/atom   # 최신 3개 항목 title, description 추출
```

---

### Step 3 — 변경 감지 & 중복 방지 ★ 핵심 규칙

이미 요약된 항목은 절대 다시 요약하지 않는다.

```
for each source:
  newVersion = fetched tag_name (또는 date for vercel)
  oldVersion = existingVersions[source]

  if newVersion == oldVersion:
    → 해당 소스 스킵. 기존 NewsItem 그대로 유지.
    → bullets, link, bgNum, ticker 등 일체 수정 금지.
  else:
    → 새 릴리즈 발견. 요약 대상에 추가.

if 모든 소스가 변경 없음:
  → "업데이트 없음: 모든 소스가 최신 상태입니다." 출력 후 종료.
  → git commit 하지 않는다.
```

---

### Step 4 — 요약 생성 (새 릴리즈만)

릴리즈 노트 마크다운을 분석해 한국어 bullet points를 작성한다.

**bullet 생성 규칙:**

- 한국어로 간결하게 작성 (한 줄 = 한 변경사항)
- 각 bullet에서 핵심 키워드/기능명을 `<strong>태그</strong>`로 감싼다
- variant별 bullet 수:
  - `hero` → 7개
  - `tall` → 8개
  - `wide` → 5개
  - `third` → 3개
- Breaking change는 `<strong>Breaking:</strong>` 접두사 사용
- Security 패치는 취약점 유형을 첫 번째 bullet에 명시

**Security 감지 (facebook/react):**
릴리즈 노트에 `security`, `CVE`, `vulnerability`, `DoS`, `hardening` 키워드가 있으면:

- `category: "security"`, `tag: "SECURITY"`로 변경

**ticker 텍스트 생성 (새 항목만):**

```
형식: "{대문자 이름} {버전} — {핵심 변경 한 문장}"
예시: "VITE 8.1.0 — ROLLDOWN 기본 번들러 전환"
```

**Vercel Changelog (VercelNewsItem):**
RSS 최신 3개 항목에서 `{ title, description }` 쌍 추출. bullets 대신 items[] 구조 사용.

---

### Step 5 — newsletter.json 조립

**meta 업데이트:**

```
기존 volume 문자열 파싱: "VOL. 001 / ISSUE 01"
  - 오늘 날짜와 lastRun 월 비교
  - 같은 달 → issue + 1
  - 다른 달 → volume + 1, issue = 1
  - 포맷: "VOL. 001 / ISSUE 02" (3자리 zero-padding)

date: 오늘 날짜 "YYYY.MM.DD DDD" 형식 (예: "2026.03.26 THU")
topic: "CLAUDE CODE + FRONTEND" (고정)
sourceCount: 전체 항목 수
```

**sections 구성:**

```
섹션 1: { label: "🤖 Claude Code / AI", date: 최신 항목 날짜 }
  - news: [claude-code(hero), next.js(tall)]

섹션 2: { label: "⚛️ Frontend", date: 날짜 범위 "YYYY.MM.DD ~ YYYY.MM.DD" }
  - news: [typescript(wide), vite(wide), tailwind(third), react(third), vercel-changelog(third)]
```

**Variant 할당 (섹션 1 기준):**

1. priority 최고 항목 → `hero`
2. 두 번째 항목 → `tall`
3. 섹션 2 첫 두 항목 → `wide`
4. 나머지 → `third`
5. VercelNewsItem → 항상 `third`

**bgNum (선택):**
버전 숫자 추출: `"v2.1.81"` → `"81"`, `"16.2"` → `"16"`, `"TS 6.0.2"` → `"6"`

**ticker 조립:**
기존 ticker 항목 + 새 항목을 합쳐 최신 순으로 정렬.

---

### Step 6 — 저장 & 커밋

```bash
# 1. newsletter.json 저장 (Write 도구)
# 파일: src/shared/data/newsletter.json (리포 루트 기준 상대 경로)
# 2-space indent, JSON 형식 유지

# 2. git 인증 설정 (원격 환경에서 필수)
git remote set-url origin https://$GH_TOKEN@github.com/claude-studio/dev-pulse.git
git config user.email "bot@dev-pulse.com"
git config user.name "dev-pulse-bot"

# 3. 변경 있을 때만 커밋 (git diff로 확인 후 진행)
git add src/shared/data/newsletter.json
git commit -m "chore: update newsletter $(date -u +%Y-%m-%d)"
git push origin main
```

완료 후 메시지:

```
✅ newsletter.json 갱신 완료
- 새 릴리즈: {소스 목록}
- VOL. XXX / ISSUE XX
- Vercel 자동 배포 트리거됨
```

---

## 데이터 스키마 참조

스키마 정의 파일: `src/shared/types/news.ts`

### NewsItem

```typescript
{
  id: string,           // kebab-case: "claude-code-2181"
  category: 'tool' | 'release' | 'infra' | 'ai' | 'security',
  variant: 'hero' | 'tall' | 'wide' | 'sm' | 'third',
  tag: string,          // 대문자: "TOOL", "RELEASE", "SECURITY", "INFRA"
  version?: string,     // 표시용: "v2.1.81", "16.2", "TS 6.0.2"
  title: string,        // 공식 이름: "Claude Code", "Next.js"
  date: string,         // ISO 8601: "2026-03-20"
  source: string,       // GitHub owner/repo: "anthropics/claude-code"
  bullets: string[],    // HTML. <strong>강조</strong> 포함
  link: { url: string, label: string },
  bgNum?: string        // 버전 숫자: "81", "16", "6"
}
```

### VercelNewsItem

```typescript
{
  id: "vercel-changelog",
  category: "infra",
  variant: "third",
  tag: "INFRA",
  title: "Vercel Changelog",
  date: string,       // "YYYY-MM-DD"
  type: "vercel",     // 필수! 이 필드로 구분
  items: [{ title: string, description: string }],  // 3개
  link: { url: "https://vercel.com/changelog", label: "vercel.com/changelog →" }
}
```
