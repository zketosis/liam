# e2e

This package is for running end-to-end (E2E) tests, using Playwright to automatically test different parts of our application.

## Script

```bash
pnpm test:e2e
```


When running VRT for the first time, first make a screenshot of the comparison source.

For example:

```bash
URL=http://localhost:5173 pnpm playwright test tests/vrt --update-snapshots
```

## operation process

This E2E test is also run on GitHub Action.  
If you intentionally changed the UI and the VRT test fails on GitHub Action, you can download the image from the “Upload test results” URL in Action's log.

![upload test results](https://github.com/user-attachments/assets/631dc80c-1a34-43a7-bca8-ef833edddd51)

Then, if ``top-actual.png`` is as you intended, rename the file ``top-1-chromium-linux.png`` and place it in the following folder and push it again.

```
frontend/packages/e2e/tests/vrt/vrt.test.ts-snapshots/
```

And make sure the test passes.
