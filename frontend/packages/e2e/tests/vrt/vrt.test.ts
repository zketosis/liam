import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const screenshot = async (page: Page, targetPage: TargetPage) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  // To display Cookie Consent
  await page.route('**/*', (route) => {
    const headers = {
      ...route.request().headers(),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
    }
    route.continue({ headers })
  })
  await page.goto(targetPage.path)
  await waitForPageReady(page)
  await expect(page).toHaveScreenshot({ fullPage: true })
}

interface TargetPage {
  name: string
  path: string
}

const targetPages: TargetPage[] = [
  {
    name: 'top',
    path: '/',
  },
]

for (const targetPage of targetPages) {
  test(targetPage.name, async ({ page }) => {
    await screenshot(page, targetPage)
  })
}

const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await page.evaluate(() => document.fonts.ready)
}
