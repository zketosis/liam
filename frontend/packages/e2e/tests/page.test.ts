import { expect, test } from '@playwright/test'

const erdWebUrl =
  process.env.ERD_WEB_URL ||
  'http://localhost:3001/erd/p/github.com/mastodon/mastodon/blob/main/db/schema.rb'
const cliUrl = process.env.CLI_URL || 'http://localhost:5173'

const urls = [erdWebUrl, cliUrl]

for (const url of urls) {
  test(`Page has title for ${url}`, async ({ page }) => {
    await page.goto(url)
    await expect(page).toHaveTitle(/Liam ERD/)
  })
}
