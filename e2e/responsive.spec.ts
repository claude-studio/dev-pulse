import { expect, test } from '@playwright/test';

/**
 * 각 Playwright project의 뷰포트 기준으로 스냅샷을 찍는다.
 * - mobile  (375px)  → mobile-full.png
 * - tablet  (900px)  → tablet-full.png
 * - desktop (1400px) → desktop-full.png
 */

test('모바일(375px): 헤더 메타 숨김 + 전체 카드 1컬럼', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 375, '모바일 project에서만 실행');

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // 헤더 메타 숨김 확인
  const headerMeta = page.locator('header .font-mono').first();
  await expect(headerMeta).toBeHidden();

  await expect(page).toHaveScreenshot('mobile-full.png', {
    fullPage: true,
    animations: 'disabled',
  });
});

test('태블릿(900px): 헤더 유지 + 카드 2컬럼 그리드', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 900, '태블릿 project에서만 실행');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // 헤더 메타 표시 확인
  const headerMeta = page.locator('header .font-mono').first();
  await expect(headerMeta).toBeVisible();

  await expect(page).toHaveScreenshot('tablet-full.png', {
    fullPage: true,
    animations: 'disabled',
  });
});

test('데스크톱(1400px): 전체 12컬럼 그리드 레이아웃', async ({ page }) => {
  test.skip(page.viewportSize()?.width !== 1400, '데스크톱 project에서만 실행');

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // 헤더 메타 표시 확인
  const headerMeta = page.locator('header .font-mono').first();
  await expect(headerMeta).toBeVisible();

  await expect(page).toHaveScreenshot('desktop-full.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
