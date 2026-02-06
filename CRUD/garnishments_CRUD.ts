import { test, expect} from '@playwright/test';
import { login } from '../auth/login';
import type { Page, BrowserContext } from '@playwright/test';


export async function garnishments_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
await context.tracing.start({ screenshots: true, snapshots: true });
const GarnishmentName =  `test_Garnishment${Date.now()}`
await login({ page });
  await page.waitForTimeout(5000);
  await page.locator('span').filter({ hasText: 'Garnishments' }).first().click();
  await page.getByRole('link', { name: 'Garnishments', exact: true }).waitFor({ state: 'visible' });
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Garnishments', exact: true }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState('domcontentloaded');

  await test.step('ADD GARNISHMENT', async () => {
    await page2.getByRole('button', { name: 'New Garnishment' }).click();
    
    
    await page2.getByRole('textbox', { name: 'Rollover Amount' }).fill('100');
    await page2.getByRole('textbox', { name: 'Routing Code' }).fill('123');
    await page2.getByRole('textbox', { name: 'Garnish Total' }).fill('123');
    await page2.getByRole('textbox', { name: 'Tax ID' }).fill('100');
    await page2.getByRole('textbox', { name: 'Garnish Recipient' }).fill(GarnishmentName);
    await page2.getByRole('textbox', { name: 'Garnish Percent' }).fill('3');
    await page2.getByRole('textbox', { name: 'Garnish Order' }).fill('1');
   
    await page2.getByRole('combobox', { name: 'Select payment mode...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select account type...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select state...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select garnish period...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select garnish type...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select producer...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

    await page2.getByRole('combobox', { name: 'Select garnish rollover...' }).click();
    try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
    
  
    await page2.getByRole('button', { name: 'Submit' }).click();

    const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
    await searchBox.fill(GarnishmentName);
    await searchBox.press('Enter');
    await test.step('Verify added garnishment is visible', async () => {
    await expect(page2.getByRole('row').nth(1)).toBeVisible();
  });
});

   await test.step('EDIT GARNISHMENT', async () => {
   await page2.waitForTimeout(2000);
   await expect(page2.getByRole('cell', { name: GarnishmentName })).toBeVisible();
   await page2.getByRole('cell').first().click();
   await page2.getByRole('button', { name: 'Edit' }).click();
   await page2.getByRole('textbox', { name: 'Garnish Recipient' }).fill('TEST3456');
   await page2.getByRole('textbox', { name: 'GL Vendor ID' }).fill('123');
   await page2.getByRole('button', { name: 'Save Changes' }).click();
   await page2.getByRole('tab', { name: 'General' }).click();
   const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
   await searchBox.fill('TEST3456');
   await searchBox.press('Enter');
   await test.step('Verify edited garnishment is visible', async () => {
   await expect(page2.getByRole('row').nth(1)).toBeVisible();
   });
   });

   
   await test.step('DELETE GARNISHMENT', async () => {
   await page2.getByRole('cell').first().click();
   await page2.getByRole('button', { name: '' }).click();
   await page2.getByRole('button', { name: 'Delete' }).click();
   await test.step('Verify deleted garnishment is not visible', async () => {
   await expect(page2.getByRole('row').nth(2)).not.toBeVisible();
   });
   });

   await context.tracing.stop({ path: 'traceGarnishments.zip' });
   await page.close();
   await page2.close();
   
}