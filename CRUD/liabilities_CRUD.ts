 import { test, expect} from '@playwright/test';
 import { login } from '../auth/login';
 import type { Page, BrowserContext } from '@playwright/test';
 
 
 export async function liabilities_CRUD({ page, context }: { page: Page; context: BrowserContext }) { 
  await context.tracing.start({ screenshots: true, snapshots: true });
  const LiabilityName =  `test_LiabilityQA${Date.now()}`
  await login({ page });  
  await page.waitForTimeout(5000);
  await page.locator('span').filter({ hasText: 'Liabilities' }).first().click();
  await page.getByRole('link', { name: 'Liabilities', exact: true }).waitFor({ state: 'visible' });
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Liabilities', exact: true }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState('domcontentloaded');

  await test.step('ADD LIABILITY', async () => {
  await page2.getByRole('button', { name: 'New Liability' }).click();
  
  await page2.getByRole('combobox', { name: 'Select agency...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select producer...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select carrier...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

  await page2.getByRole('combobox', { name: 'Select commission type...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select duration segment...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select business type...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select rate basis...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

  await page2.getByRole('combobox', { name: 'Select rate type...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('combobox', { name: 'Select writing agent...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
    

  await page2.getByRole('textbox', { name: 'Effective Date' }).click();
  await page2.getByLabel('February 4,').nth(1).click();

  await page2.getByRole('textbox', { name: 'Paid To Date' }).click();
   await page2.getByLabel('February 4,').first().click();

  await page2.getByRole('textbox', { name: 'Vesting Date' }).click();
  await page2.getByLabel('February 9,').nth(2).click();

  await page2.getByRole('textbox', { name: 'App Number' }).fill('123456');
  await page2.getByRole('textbox', { name: 'Insured Name', exact: true }).fill(LiabilityName);
  await page2.getByRole('textbox', { name: 'Split Percent' }).fill('30');
  await page2.getByRole('textbox', { name: 'Policy Number', exact: true }).fill(Date.now().toString());
  await page2.getByRole('textbox', { name: 'Issue Age' }).fill('23');
  await page2.getByRole('spinbutton', { name: 'Rate' }).fill('1');
  await page2.getByRole('spinbutton', { name: 'From Policy Duration' }).fill('1');
  await page2.getByRole('spinbutton', { name: 'To Policy Duration' }).fill('2');
  await page2.getByRole('textbox', { name: 'Vesting Years' }).fill('3');
  await page2.getByRole('textbox', { name: 'Group Name' }).fill('test');
  await page2.getByRole('textbox', { name: 'Origination Type' }).fill('test');
  await page2.getByRole('button', { name: 'Submit' }).click();
  const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
  await searchBox.fill(LiabilityName);
  await searchBox.press('Enter');
  await test.step('Verify added liability is visible', async () => {
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
  });
});

  await test.step('DELETE LIABILITY', async () => {
  await page2.getByRole('row').nth(1).getByRole('cell').first().click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await test.step('Verify deleted liability is not visible', async () => {
  await expect(page2.getByRole('row').nth(2)).not.toBeVisible();
  });
});

  await context.tracing.stop({ path: 'traceLiabilities.zip' });
  await page.close();
  await page2.close();
 }