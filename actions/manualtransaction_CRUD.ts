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

//ADD
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

await page2.getByRole('combobox', { name: 'Select policy number...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('textbox', { name: 'Description *' }).fill('JESTER');
await page2.getByRole('textbox', { name: 'Amount *' }).fill('1');
await page2.getByRole('button', { name: 'Save Manual Transaction' }).click();
await page2.getByRole('searchbox', { name: 'Search here...' }).click();
await page2.getByRole('searchbox', { name: 'Search here...' }).fill('JESTER');
await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
await page2.getByRole('row').nth(1).click(); // First data row (skip header)
await expect(page2.getByRole('row').nth(1)).toBeVisible(); //assert if ADD successful


//EDIT
await page2.getByRole('button', { name: 'Edit' }).click(); 
await page2.getByRole('textbox', { name: 'Description *' }).click();
await page2.getByRole('textbox', { name: 'Description *' }).fill('TEST12345');
await page2.getByRole('button', { name: 'Save Changes' }).click();
await page2.getByRole('searchbox', { name: 'Search here...' }).click();
await page2.getByRole('searchbox', { name: 'Search here...' }).fill('TEST12345');
await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
await expect(page2.getByRole('row').nth(1)).toBeVisible(); //assert if EDIT successful


//DELETE
await page2.getByRole('row').nth(1).click();
await page2.getByRole('row').nth(1).click();

await page2.getByRole('button', { name: '' }).click();
await page2.getByRole('button', { name: 'Delete' }).click();
await page2.waitForTimeout(3000);
await expect(page2.getByRole('row').nth(2)).not.toBeVisible(); //assert if DELETE successful
await page2.close();
await page.close();

}