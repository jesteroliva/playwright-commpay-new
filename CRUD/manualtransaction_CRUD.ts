 import { test, expect} from '@playwright/test';
 import { login } from '../auth/login';
 import type { Page, BrowserContext } from '@playwright/test';


export async function manualtransaction_CRUD({ page, context }: { page: Page; context: BrowserContext }) { 

await context.tracing.start({ screenshots: true, snapshots: true });
await login({ page });
await page.getByRole('link', { name: 'Manual Transactions' }).click();
const page2Promise = page.waitForEvent('popup');
const page2 = await page2Promise;
await page2.waitForLoadState('domcontentloaded');

await test.step('ADD MANUAL TRANSACTION', async () => {
await page2.getByRole('button', { name: 'New Manual Transaction' }).click();

await page2.getByRole('combobox', { name: 'Select transaction type...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select commission type...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select General Ledger...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select producer...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select agency...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select liability ID...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

//await page2.getByRole('combobox', { name: 'Select policy number...' }).click();
//try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('textbox', { name: 'Description *' }).fill('JESTER');
await page2.getByRole('textbox', { name: 'Amount *' }).fill('1');
await page2.getByRole('button', { name: 'Save Manual Transaction' }).click();
const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
await searchBox.fill('JESTER');
await searchBox.press('Enter');
await page2.getByRole('row').nth(1).click(); // First data row (skip header)
await test.step('Verify added manual transaction is visible', async () => {
await expect(page2.getByRole('row').nth(1)).toBeVisible(); //assert if ADD successful
});
});

//EDIT
await test.step('EDIT MANUAL TRANSACTION', async () => {
await page2.getByRole('button', { name: 'Edit' }).click(); 
await page2.getByRole('textbox', { name: 'Description *' }).fill('TEST12345');
await page2.waitForTimeout(4000);
await page2.getByRole('button', { name: 'Save Changes' }).click();
const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
await searchBox.fill('TEST12345');
await searchBox.press('Enter');
await test.step('Verify edited manual transaction is visible', async () => {
await expect(page2.getByRole('row').nth(1)).toBeVisible(); //assert if EDIT successful
});
});

await test.step('DELETE MANUAL TRANSACTION', async () => {
await page2.getByRole('row').nth(1).click();
await page2.getByRole('row').nth(1).click();

await page2.getByRole('button', { name: '' }).click();
await page2.getByRole('button', { name: 'Delete' }).click();
await page2.waitForTimeout(3000);
await test.step('Verify deleted manual transaction is not visible', async () => {
await expect(page2.getByRole('row').nth(2)).not.toBeVisible(); //assert if DELETE successful
});
});


await page2.close();
await page.close();

}