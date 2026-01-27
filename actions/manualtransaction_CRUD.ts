 import { test, expect} from '@playwright/test';
 import { login } from '../auth/login';
 import type { Page, BrowserContext } from '@playwright/test';


export async function manualtransaction_CRUD({ page, context }: { page: Page; context: BrowserContext }) { 
//const beneficiaryName =  `test_Jester${Date.now()}`
await context.tracing.start({ screenshots: true, snapshots: true });
await login({ page });
await page.getByRole('link', { name: 'Manual Transactions' }).click();
const page2Promise = page.waitForEvent('popup');
await console.log('Clicking manual transactions');
const page2 = await page2Promise;
await page2.waitForLoadState('domcontentloaded');
  await page2.getByRole('button', { name: 'New Manual Transaction' }).click();
  await page2.getByRole('combobox', { name: 'Select transaction type...' }).click();
  await page2.getByRole('option', { name: 'COMMISSION' }).click();
  await page2.getByRole('combobox', { name: 'Select commission type...' }).click();
  await page2.getByText('LTC FIRST YEAR').click();
  await page2.getByRole('combobox', { name: 'Select liability ID...' }).click();
  await page2.getByRole('combobox', { name: 'Select liability ID...' }).click();
  await page2.getByRole('combobox', { name: 'Select General Ledger...' }).click();
  await page2.getByRole('option', { name: '-000' }).click();
  await page2.getByRole('combobox', { name: 'Select producer...' }).click();
  await page2.getByRole('option', { name: 'AGENCY SERVICES, INC' }).click();
  await page2.getByRole('combobox', { name: 'Select agency...' }).click();
  await page2.getByText('LION TRUST').click();
  await page2.getByRole('combobox', { name: 'Select liability ID...' }).click();
  await page2.getByRole('option', { name: '14124' }).click();
  await page2.getByRole('combobox', { name: 'Select policy number...' }).click();
  await page2.getByRole('option', { name: '076624453' }).click();
  await page2.getByRole('textbox', { name: 'Description *' }).fill('test');
  await page2.getByRole('textbox', { name: 'Amount *' }).fill('1');
  await page2.getByRole('button', { name: 'Save Manual Transaction' }).click();



  //EDIT
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill('QA');
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await page2.getByRole('cell', { name: 'AGENCY SERVICES, INC' }).click();
  await page2.getByRole('button', { name: 'Edit' }).click();
  await page2.waitForTimeout(7000);
  await page2.getByRole('textbox', { name: 'Description *' }).click();
  await page2.getByRole('textbox', { name: 'Description *' }).fill('TEST12345');
  await page2.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page2.getByRole('cell', { name: 'TEST12345' })).toBeVisible();

  //DELETE
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill('QA');
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await page2.getByRole('cell', { name: 'AGENCY SERVICES, INC' }).click();
  await page2.getByRole('cell', { name: 'AGENCY SERVICES, INC' }).click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await expect(page2.getByRole('cell', { name: 'TEST12345'})).not.toBeVisible();
  await page2.close();
  await page.close();

}