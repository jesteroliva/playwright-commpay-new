 import { test, expect} from '@playwright/test';
 import { login } from '../auth/login';
 import type { Page, BrowserContext } from '@playwright/test';


export async function beneficiary_CRUD({ page, context }: { page: Page; context: BrowserContext }) { 
const beneficiaryName =  `test_Jester${Date.now()}`
await context.tracing.start({ screenshots: true, snapshots: true });
await login({ page });
//await page.locator('span').filter({ hasText: 'Beneficiaries' }).first().click();
await page.getByRole('link', { name: 'Beneficiaries'}).click();
const page2Promise = page.waitForEvent('popup');
//await page.getByRole('link', { name: 'Beneficiaries', exact: true }).click();
const page2 = await page2Promise;
await page2.waitForLoadState('domcontentloaded');

await test.step('ADD BENEFICIARY', async () => {
await page2.getByRole('button', { name: 'New Beneficiary' }).click();

await page2.getByRole('spinbutton', { name: 'Benefit Percent' }).fill('1');
await page2.getByRole('textbox', { name: 'Beneficiary Name' }).fill(beneficiaryName);
await page2.getByRole('textbox', { name: 'From Date' }).fill('01/01/2026');
await page2.getByRole('textbox', { name: 'To Date' }).fill('01/01/2026');
await page2.getByRole('textbox', { name: 'Tax ID' }).fill('123456');
await page2.getByRole('textbox', { name: 'Street', exact: true }).fill('testt');
await page2.getByRole('textbox', { name: 'Street 2(Optional)' }).fill('testtest');
await page2.getByRole('textbox', { name: 'City' }).fill('test');
await page2.getByRole('textbox', { name: 'State' }).fill('test');
await page2.getByRole('textbox', { name: 'Country' }).fill('test');
await page2.getByRole('textbox', { name: 'Postal Code' }).fill('123');
await page2.getByRole('textbox', { name: 'Contact Email' }).fill('test@test.com');
await page2.getByRole('textbox', { name: 'Account Number' }).fill('12345');
await page2.getByRole('textbox', { name: 'Routing Code' }).fill('12345');

await page2.getByRole('combobox', { name: 'Select producer...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select payment mode...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }

await page2.getByRole('combobox', { name: 'Select account type...' }).click();
try { await page2.getByRole('option').first().click(); } catch { await page2.waitForTimeout(2000); }


await page2.getByRole('button', { name: 'Submit' }).click();
const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
await searchBox.fill(beneficiaryName);
await searchBox.press('Enter');
await test.step('Verify added beneficiary is visible', async () => {
await expect (page2.getByRole('row').nth(1)).toBeVisible();
});
});

  //EDIT BENEFICIARY
await test.step('EDIT BENEFICIARY', async () => {
await page2.getByRole('row').nth(1).click(); 
await page2.getByRole('button', { name: 'Edit' }).click();
await page2.getByRole('textbox', { name: 'Beneficiary Name' }).fill('test12345');
await page2.getByRole('button', { name: 'Save Changes' }).click();
const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });
await searchBox.fill('test12345');
await searchBox.press('Enter');
await test.step('Verify edited beneficiary is visible', async () => {
await expect(page2.getByRole('row').nth(1)).toBeVisible();
});
});

  //DELETE BENEFICIARY
await test.step('DELETE BENEFICIARY', async () => {
//await page2.getByRole('row').nth(1).click(); 
//await page2.getByRole('tab', { name: 'General' }).click();
await page2.getByRole('row').nth(1).click();
await page2.getByRole('button', { name: '' }).click();
await page2.getByRole('button', { name: 'Delete' }).click();
await test.step('Verify deleted beneficiary is not visible', async () => {
await expect(page2.getByRole('row').nth(2)).not.toBeVisible();
});
});

await context.tracing.stop({ path: 'traceBeneficiary.zip' });
await page.close();
await page2.close();
}