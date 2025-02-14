import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Loading' })).toBeHidden()

  if (isMobile) {
    const openToolbarButton = page.getByRole('button', {
      name: 'Open toolbar',
    })
    await openToolbarButton.click()
  }
})

type ShowModeTest = {
  mode: string
  expectedColumns: string[]
}

const showModeTests: ShowModeTest[] = [
  {
    mode: 'Table Name',
    expectedColumns: [],
  },
  {
    mode: 'Key Only',
    expectedColumns: ['idbigserial', 'account_idbigint'],
  },
  {
    mode: 'All Fields',
    expectedColumns: [
      'idbigserial',
      'account_idbigint',
      'titlevarchar',
      'created_attimestamp',
      'updated_attimestamp',
      'replies_policyinteger',
      'exclusiveboolean',
    ],
  },
]
test('should be visible', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
  await expect(toolbar).toBeVisible()
})

test('zoom in button should increase zoom level', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
  const zoomLevelText = toolbar.getByLabel('Zoom level')

  const zoomLevelBefore = await zoomLevelText.textContent()

  const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })
  await zoomInButton.click()
  await expect(zoomLevelText).not.toHaveText(zoomLevelBefore)

  const zoomLevelAfter = await zoomLevelText.textContent()
  expect(Number.parseInt(zoomLevelBefore)).toBeLessThan(
    Number.parseInt(zoomLevelAfter),
  )
})

test('zoom out button should decrease zoom level', async ({ page }) => {
  const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
  const zoomLevelText = toolbar.getByLabel('Zoom level')

  const zoomLevelBefore = await zoomLevelText.textContent()

  const zoomOutButton = toolbar.getByRole('button', { name: 'Zoom out' })
  await zoomOutButton.click()
  await expect(zoomLevelText).not.toHaveText(zoomLevelBefore)

  const zoomLevelAfter = await zoomLevelText.textContent()
  expect(Number.parseInt(zoomLevelBefore)).toBeGreaterThan(
    Number.parseInt(zoomLevelAfter),
  )
})

test('fitview button should make the table nodes fit the viewport', async ({
  page,
}) => {
  const toolbar = page.getByRole('toolbar', { name: 'Toolbar' })
  const fitViewButton = toolbar.getByRole('button', { name: 'Zoom to Fit' })

  const tableNode = page.getByRole('button', {
    name: 'accounts table',
    exact: true,
  })
  await expect(tableNode).toBeInViewport()

  const zoomInButton = toolbar.getByRole('button', { name: 'Zoom in' })

  // Zoom in to ensure the table is out of viewport
  for (let i = 0; i < 10; i++) {
    await zoomInButton.click()
  }

  await expect(tableNode).not.toBeInViewport()

  await fitViewButton.click()

  await expect(tableNode).toBeInViewport()
})

test.describe('Show Mode', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    // TODO: Mobile test is flaky, so fix it later
    if (isMobile) test.skip()

    const showModeButton = page.getByRole('button', {
      name: 'Show mode',
    })
    await showModeButton.click()
  })

  for (const { mode, expectedColumns } of showModeTests) {
    test(`Show Mode: ${mode}`, async ({ page, isMobile }) => {
      const modeButtonRole = isMobile ? 'radio' : 'menuitemradio'
      const modeButton = page.getByRole(modeButtonRole, {
        name: mode,
      })
      await modeButton.click()

      const tableNode = page.getByRole('button', {
        name: 'lists table',
        exact: true,
      })

      const columns = tableNode.getByRole('listitem')
      await expect(columns).toHaveText(expectedColumns)
    })
  }
})
