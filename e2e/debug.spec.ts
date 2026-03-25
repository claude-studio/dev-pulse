import { test } from '@playwright/test';

test('hero 카드 내부 요소 높이 합산', async ({ page }) => {
  // 레퍼런스 분석
  await page.goto('/devpulse-report.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const refInfo = await page.evaluate(() => {
    const hero = document.querySelector('.card-hero') as HTMLElement;
    const children = Array.from(hero?.children ?? []);
    return {
      heroHeight: hero?.getBoundingClientRect().height,
      paddingTop: getComputedStyle(hero).paddingTop,
      paddingBottom: getComputedStyle(hero).paddingBottom,
      children: children.map((c) => ({
        tag: c.tagName,
        classes: (c as HTMLElement).className.substring(0, 50),
        height: (c as HTMLElement).getBoundingClientRect().height,
        marginBottom: getComputedStyle(c as HTMLElement).marginBottom,
      })),
    };
  });

  // React 분석
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const reactInfo = await page.evaluate(() => {
    const hero = document.querySelector('.row-span-2') as HTMLElement;
    const children = Array.from(hero?.children ?? []);
    return {
      heroHeight: hero?.getBoundingClientRect().height,
      paddingTop: getComputedStyle(hero).paddingTop,
      paddingBottom: getComputedStyle(hero).paddingBottom,
      children: children.map((c) => ({
        tag: c.tagName,
        classes: (c as HTMLElement).className.substring(0, 60),
        height: (c as HTMLElement).getBoundingClientRect().height,
        marginBottom: getComputedStyle(c as HTMLElement).marginBottom,
      })),
    };
  });

  console.log('=== Reference hero children ===');
  console.log(JSON.stringify(refInfo, null, 2));
  console.log('=== React hero children ===');
  console.log(JSON.stringify(reactInfo, null, 2));
});
