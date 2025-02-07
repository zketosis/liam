import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const cookieButton = page.getByRole('button', {
    name: 'Accept All Cookies',
  })
  await cookieButton.click({ timeout: 1000, force: true }).catch(() => {})
})

test('Desktop toolbar should be visible', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Desktop toolbar' })
  await expect(toolbar).toBeVisible()
})

test('Zoom in button should increase zoom level', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Desktop toolbar' })
  const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

  const zoomLevelBefore = await zoomLevelText.textContent()

  const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
  await zoomInButton.click()

  const zoomLevelAfter = await zoomLevelText.textContent()
  expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
    Number.parseInt(zoomLevelAfter),
  )
})

test('Zoom out button should decrease zoom level', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Desktop toolbar' })
  const zoomLevelText = toolbar.locator('span[class*="zoomLevelText"]')

  const zoomLevelBefore = await zoomLevelText.textContent()

  const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
  await zoomOutButton.click()

  const zoomLevelAfter = await zoomLevelText.textContent()
  expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
    Number.parseInt(zoomLevelAfter),
  )
})
