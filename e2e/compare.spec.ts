import { expect, test } from '@playwright/test';

test.describe('React vs Reference HTML 직접 픽셀 비교', () => {
  /**
   * 핵심 테스트: React 앱이 레퍼런스 HTML과 픽셀 수준에서 일치하는지 확인
   *
   * 베이스라인(react-vs-reference-desktop-darwin.png)은
   * 레퍼런스 HTML의 스크린샷으로 설정됨.
   * React 앱의 결과가 이 베이스라인과 2% 이내 차이여야 통과.
   */
  test('React 앱이 레퍼런스 HTML과 픽셀 일치', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // 베이스라인 = reference-full 스크린샷 (reference-full-darwin.png에서 복사됨)
    await expect(page).toHaveScreenshot('react-vs-reference.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('React 앱 전체 페이지 스냅샷', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('react-full.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('레퍼런스 HTML 전체 페이지 스냅샷', async ({ page }) => {
    await page.goto('/devpulse-report.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('reference-full.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('React와 레퍼런스 페이지 높이가 동일', async ({ page }) => {
    await page.goto('/devpulse-report.html');
    await page.waitForLoadState('networkidle');
    const refHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const reactHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    console.log(`Reference height: ${refHeight}px, React height: ${reactHeight}px`);
    console.log(`Difference: ${Math.abs(refHeight - reactHeight)}px`);

    const diffRatio = Math.abs(refHeight - reactHeight) / refHeight;
    expect(diffRatio).toBeLessThan(0.05);
  });
});
