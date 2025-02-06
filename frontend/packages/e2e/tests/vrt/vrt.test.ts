import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const screenshot = async (page: Page, targetPage: TargetPage) => {
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
  await expect(page).toHaveScreenshot({ fullPage: true })
}

interface TargetPage {
  name: string
  path: string
}

const targetPage: TargetPage = {
  name: 'top',
  path: '/',
}

test(targetPage.name, async ({ page }) => {
  await screenshot(page, targetPage)
})
