import { expect, test } from '@playwright/test';

test.describe('Visual Regression — React vs Reference HTML', () => {
  test('전체 페이지 — React 앱이 레퍼런스 HTML과 일치', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // 폰트 로드 대기
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('full-page-react.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('전체 페이지 — 레퍼런스 HTML 스크린샷 (베이스라인)', async ({ page }) => {
    await page.goto('/devpulse-report.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('full-page-reference.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('헤더 섹션 비교', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-react.png', { animations: 'disabled' });
  });

  test('티커 섹션 비교', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const ticker = page.locator('.bg-accent').first();
    await expect(ticker).toHaveScreenshot('ticker-react.png', { animations: 'disabled' });
  });

  test('푸터 섹션 비교', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot('footer-react.png', { animations: 'disabled' });
  });
});
