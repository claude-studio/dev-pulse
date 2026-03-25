import { expect, test } from '@playwright/test';

test.describe('Interactions — 호버 및 애니메이션', () => {
  test('티커 애니메이션 CSS 존재 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ticker = page.locator('.ticker-animate').first();
    const animation = await ticker.evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toContain('ticker');
  });

  test('카드 hover 배경색 CSS 규칙 존재 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tailwind가 hover:bg-[#161616] 클래스를 생성했는지 CSS에서 확인
    const hasHoverRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules ?? []);
          for (const rule of rules) {
            if (rule.cssText && rule.cssText.includes('#161616')) {
              return true;
            }
          }
        } catch {
          // cross-origin sheets
        }
      }
      return false;
    });
    expect(hasHoverRule).toBe(true);
  });

  test('card-accent::after 컬러 바 CSS 규칙 존재 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasAfterRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules ?? []);
          for (const rule of rules) {
            if (
              rule.cssText &&
              rule.cssText.includes('card-accent') &&
              rule.cssText.includes('after')
            ) {
              return true;
            }
          }
        } catch {
          // cross-origin sheets
        }
      }
      return false;
    });
    expect(hasAfterRule).toBe(true);
  });

  test('노이즈 텍스처 body::before CSS 존재 확인', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hasNoise = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules ?? []);
          for (const rule of rules) {
            if (rule.cssText && rule.cssText.includes('fractalNoise')) {
              return true;
            }
          }
        } catch {
          // cross-origin sheets
        }
      }
      return false;
    });
    expect(hasNoise).toBe(true);
  });
});
