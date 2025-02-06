import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const screenshot = async (page: Page, targetPage: TargetPage) => {
  await page.goto(targetPage.path)
  await expect(page).toHaveScreenshot({ fullPage: true, timeout: 10 * 1000 })
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
