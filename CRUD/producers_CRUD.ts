 import { test, expect} from '@playwright/test';
 import { login } from '../auth/login';
 import type { Page, BrowserContext } from '@playwright/test';


export async function producers_CRUD({ page, context }: { page: Page; context: BrowserContext }) { 
const producerName =  `test_Jester${Date.now()}`
await context.tracing.start({ screenshots: true, snapshots: true });
await login({ page });
await page.getByRole('link', { name: 'Producers', exact: true }).click();
const page2Promise = page.waitForEvent('popup');
const page2 = await page2Promise;
await page2.waitForLoadState('domcontentloaded');

await test.step('ADD PRODUCER', async () => {
  await page2.waitForTimeout(5000);
  await page2.getByRole('button', { name: 'New Producer' }).click();
  await page2.getByRole('textbox', { name: 'Alias' }).fill(producerName);
  await page2.getByRole('textbox', { name: 'Name' }).fill(producerName);
  await page2.getByRole('textbox', { name: 'Source Data' }).fill('test');
  await page2.getByRole('textbox', { name: 'Phone' }).fill('1234');
  await page2.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  await page2.getByRole('textbox', { name: 'Tax ID*' }).fill('123456789');
  await page2.getByRole('textbox', { name: 'Street', exact: true }).fill('test');
  await page2.getByRole('textbox', { name: 'Street 2 (Optional)' }).fill('test');
  await page2.getByRole('textbox', { name: 'City' }).fill('test');
  await page2.getByRole('textbox', { name: 'State' }).fill('test');
  await page2.getByRole('textbox', { name: 'Country' }).fill('test');
  await page2.getByRole('textbox', { name: 'Zip' }).fill('test');
  await page2.getByRole('textbox', { name: 'Debit Amount' }).fill('100');
  await page2.getByRole('textbox', { name: 'Routing Code' }).fill('1');
  await page2.getByRole('textbox', { name: 'Account Number' }).fill('1');



  await page2.getByRole('combobox', { name: 'Select payment mode...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

  await page2.getByRole('combobox', { name: 'Select account type...' }).click();
  try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }
  
  await page2.getByRole('button', { name: 'Submit' }).click();

  const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
  await searchBox.fill(producerName);
  await searchBox.press('Enter');
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
  await page2.getByRole('row').nth(1).click();
  await test.step('Verify added producer is visible', async () => {
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
});
});

  
  await test.step('EDIT PRODUCER', async () => {
  await page2.getByRole('button', { name: 'Edit', exact: true }).click();
  await page2.getByRole('textbox', { name: 'Name' }).fill('TEST3456');
  await page2.getByRole('button', { name: 'Save Changes' }).click();
  await page2.getByRole('tab', { name: 'General' }).click();
  const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
  await searchBox.fill('TEST3456');
  await searchBox.press('Enter');
  await test.step('Verify edited producer is visible', async () => {
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
  });
});

  await test.step('DELETE PRODUCER', async () => {
  await page2.getByRole('row').nth(1).click();
   await page2.getByRole('button', { name: '' }).click();
   await page2.getByRole('button', { name: 'Delete' }).click();
   await test.step('Verify deleted producer is not visible', async () => {
   await expect(page2.getByRole('row').nth(2)).not.toBeVisible();  
  });
});

   await context.tracing.stop({ path: 'traceProducers.zip' });
   await page.close();
   await page2.close();
}