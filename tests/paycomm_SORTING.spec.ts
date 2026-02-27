import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import { login } from '../auth/login';
import { expandToHundredRows, checkTableSortingDynamic,sampleAtLeastFive } from '../SORTING/sorting_helper';

const webRoutes = [

  '/clients/phs/advances',
  '/clients/phs/garnishments',
  '/clients/phs/agencies',
  '/clients/phs/liabilities',
  '/clients/phs/liabilities/assign-liability'

];
test.setTimeout(12000000);
test.beforeAll(async ({ browser }) => {
test.setTimeout(1200000);

  const storage = 'commpay-session.json';
  if (!fs.existsSync(storage)) {
    const page = await browser.newPage();
    await login({ page });
    await page.context().storageState({ path: storage });
    await page.close();
  }
});




// ------------------- Test -------------------
test.describe('Sorting checks', () => {
  for (const route of webRoutes) {
    test(`SORT ${route}`, async ({ browser }) => {
      const storage = 'commpay-session.json';
      const context = await browser.newContext({
        storageState: storage,
        baseURL: process.env.BASE_URL ?? 'https://commpay-dev.commtpa.com',
      });
      const page = await context.newPage();

      await page.goto(route);

      // --- Inject dynamic table sorting check here ---
      await checkTableSortingDynamic(page);
      
      await context.close();
    });
  }
});
