import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import { login } from '../auth/login';

const webRoutes = [

  '/clients/phs/advances',
  '/clients/phs/garnishments',
  '/clients/phs/agencies',
  '/clients/phs/liabilities',
  '/clients/phs/liabilities/assign-liability'

];
test.setTimeout(12000000);
// Ensure auth file exists; if not, run the login flow and save it
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

const getFirstLine = (text: string) => text.split('\n')[0].trim();

const parseNumeric = (text: string): number | null => {
  const num = text ? parseFloat(getFirstLine(text).replace(/[^0-9.-]/g, '')) : NaN;
  return isNaN(num) ? null : num;
};

const isNumericColumn = (values: string[]) => {
  const nonEmpty = values.filter(v => v.trim());
  return nonEmpty.length > 0 && 
    nonEmpty.filter(v => /^-?\d+\.?\d*$/.test(getFirstLine(v).replace(/,/g, ''))).length / nonEmpty.length > 0.8;
};

const validateSortOrder = (values: string[], direction: 'asc' | 'desc', isNumeric: boolean): string | null => {
  for (let i = 0; i < values.length - 1; i++) {
    const [curr, next] = [getFirstLine(values[i]), getFirstLine(values[i + 1])];
    if (!curr || !next) continue;
    
    const valid = isNumeric 
      ? (() => { const [a, b] = [parseNumeric(values[i]), parseNumeric(values[i + 1])]; return a !== null && b !== null && (direction === 'asc' ? a <= b : a >= b); })()
      : direction === 'asc' ? curr.localeCompare(next) <= 0 : curr.localeCompare(next) >= 0;
    
    if (!valid) return `Pair violation at index ${i}: "${curr}" → "${next}" (expected ${direction})`;
  }
  return null;
};

async function checkTableSortingDynamic(page: Page) {
  const tables = await page.$$('table:visible');
  if (!tables.length) return;

  for (const table of tables) {
    const headers = await table.$$('th');
    
    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      if (!(await h.isVisible()) || !(await h.isEnabled())) continue;

      const columnName = await h.innerText().catch(() => '');
      if (!(await h.evaluate(el => {
        const s = window.getComputedStyle(el);
        return s.cursor === 'pointer' && s.pointerEvents !== 'none' && !el.hasAttribute('disabled');
      }))) {
        console.log(`⏭️  Skipping column ${i + 1} (${columnName || 'unnamed'}) - not clickable`);
        continue;
      }

      console.log(`\n🔍 Testing column: "${columnName || `Column ${i + 1}`}"`);

      if (!(await h.getAttribute('aria-sort'))) {
        console.log(`⚡ No aria-sort, initializing`);
        await h.click();
        await page.waitForTimeout(800);
      }

      for (let clickCount = 0; clickCount < 2; clickCount++) {
        const errors: { status: number; url: string }[] = [];
        const onResponse = (res: any) => res.status() >= 400 && errors.push({ status: res.status(), url: res.url() });
        
        page.on('response', onResponse);
        await h.click();
        await page.waitForTimeout(800);
        page.off('response', onResponse);
        
        expect.soft(errors).toEqual([]);

        const ariaSort = await h.getAttribute('aria-sort');
        const direction: 'asc' | 'desc' = ariaSort === 'ascending' ? 'asc' : ariaSort === 'descending' ? 'desc' : (clickCount === 0 ? 'asc' : 'desc');
        const values = await table.$$eval(`tbody tr td:nth-child(${i + 1})`, tds => tds.map(td => td.textContent?.trim() || ''));
        const isNumeric = isNumericColumn(values);
        const violation = validateSortOrder(values, direction, isNumeric);
        
        console.log(`${isNumeric ? '🔢' : '📊'} ${columnName} [${direction}] ${isNumeric ? 'NUMERIC' : 'TEXT'} - Sample: ${values.slice(0, 5).map(v => getFirstLine(v)).join(', ')}${violation ? '\n❌ ' + violation : ''}`);
        if (!ariaSort) console.log(`⚠️  No aria-sort, assumed ${direction}`);
        
        expect.soft(violation, `Column "${columnName}" [${direction}] sort order`).toBeNull();
      }

      console.log(`✅ Column "${columnName}" sorted OK`);
    }
  }
}



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
