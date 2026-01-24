import { test, expect, Page } from '@playwright/test';
import { login } from '../auth/creds';
import { agencies_CRUD } from '../actions/agencies_CRUD';

test.setTimeout(1200000);



//AGENCIES MODULE!!!!!!!!!
test('PAYCOMM - AGENCIES', async ({ page, context }) => {
 await agencies_CRUD({ page, context });
});


  //GARNISHMENTS MODULE!!!!!!!!!
  test('PAYCOMM CRUD - GARNISHMENTS', async ({ page, context }) => {
    const GarnishmentName =  `test_Garnishment${Date.now()}`
    await login({ page });
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto('https://commpay-dev.commtpa.com/clients/lion/garnishments');  
    await page.getByRole('button', { name: 'New Garnishment' }).click();
    await page.getByRole('combobox', { name: 'Select producer...' }).click();
    await page.getByRole('option', { name: 'ACCESS CARE, INC' }).click();
    await page.getByRole('combobox', { name: 'Select garnish rollover...' }).click();
    await page.getByRole('option', { name: 'ROLLOVER TO NEXT PERIOD' }).click();
    await page.getByRole('textbox', { name: 'Rollover Amount' }).click();
    await page.getByRole('textbox', { name: 'Rollover Amount' }).fill('100');
    await page.getByRole('textbox', { name: 'Routing Code' }).click();
    await page.getByRole('textbox', { name: 'Routing Code' }).fill('123');
    await page.getByRole('combobox', { name: 'Select garnish period...' }).click();
    await page.getByRole('option', { name: 'WEEKLY' }).click();
    await page.getByRole('combobox', { name: 'Select garnish type...' }).click();
    await page.getByRole('option', { name: 'IRS TAX LIEN' }).click();
    await page.getByRole('textbox', { name: 'Garnish Total' }).click();
    await page.getByRole('textbox', { name: 'Garnish Total' }).fill('123');
    await page.getByRole('textbox', { name: 'Tax ID' }).click();
    await page.getByRole('textbox', { name: 'Tax ID' }).fill('100');
    await page.getByRole('textbox', { name: 'Garnish Recipient' }).click();
    await page.getByRole('textbox', { name: 'Garnish Recipient' }).fill(GarnishmentName);
    await page.getByRole('textbox', { name: 'Garnish Percent' }).click();
    await page.getByRole('textbox', { name: 'Garnish Percent' }).fill('3');
    await page.getByRole('combobox', { name: 'Select payment mode...' }).click();
    await page.getByRole('option', { name: 'CHECK' }).click();
    await page.getByRole('textbox', { name: 'Garnish Order' }).click();
    await page.getByRole('textbox', { name: 'Garnish Order' }).fill('1');
    await page.getByRole('combobox', { name: 'Select account type...' }).click();
    await page.getByRole('option', { name: 'CHECKING' }).click();
    await page.getByRole('combobox', { name: 'Select state...' }).click();
    await page.getByRole('option', { name: 'AK' }).click();
    await page.getByRole('button', { name: 'Submit' }).click();
   //edit
   await page.getByRole('searchbox', { name: 'Search here...' }).click();
   await page.getByRole('searchbox', { name: 'Search here...' }).fill(GarnishmentName);
   await page.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
    await expect(page.getByRole('cell', { name: GarnishmentName })).toBeVisible();
   await page.getByRole('cell').first().click();
   await page.getByRole('button', { name: 'Edit' }).click();
   await page.getByRole('textbox', { name: 'Garnish Recipient' }).fill('TEST3456');
   await page.getByRole('textbox', { name: 'GL Vendor ID' }).click();
   await page.getByRole('textbox', { name: 'GL Vendor ID' }).fill('123');
   await page.getByRole('button', { name: 'Save Changes' }).click();
   await page.getByRole('tab', { name: 'General' }).click();
   await page.getByRole('searchbox', { name: 'Search here...' }).click();
   await page.getByRole('searchbox', { name: 'Search here...' }).fill('TEST3456');
   await page.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
   await page.getByRole('cell').first().click();
   await page.getByRole('button', { name: '' }).click();
   await page.getByRole('button', { name: 'Delete' }).click();
   //assertion - ADD
   //edit
   //assertion - edit
   //delete
   //assertion - delete 
   await context.tracing.stop({ path: 'traceGarnishments.zip' });
   await page.close();

});

test ('PAYCOMM CRUD - LIABILITIES', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  const LiabilityName =  `test_LiabilityQA${Date.now()}`
  await login({ page });  
  await page.locator('span').filter({ hasText: 'Liabilities' }).first().click();
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Liabilities' }).click();
  const page2 = await page2Promise;
  await page2.waitForTimeout(5000);
  await page2.getByRole('button', { name: 'New Liability' }).click();
  await page2.getByRole('combobox', { name: 'Select agency...' }).click();
  await page2.getByRole('option', { name: 'MAA TEST' }).click();
  await page2.getByRole('combobox', { name: 'Select producer...' }).click();
  await page2.getByRole('option', { name: 'ACCESS CARE, INC' }).click();
  await page2.getByRole('combobox', { name: 'Select carrier...' }).click();
  await page2.getByRole('option', { name: 'ACCENDO', exact: true }).click();
  await page2.getByRole('textbox', { name: 'App Number' }).click();
  await page2.getByRole('textbox', { name: 'App Number' }).fill('123456');
  await page2.getByRole('textbox', { name: 'Insured Name', exact: true }).click();
  await page2.getByRole('textbox', { name: 'Insured Name', exact: true }).fill(LiabilityName);
  await page2.getByRole('textbox', { name: 'Split Percent' }).click();
  await page2.getByRole('textbox', { name: 'Split Percent' }).fill('30');
  await page2.getByRole('textbox', { name: 'Policy Number', exact: true }).click();
  await page2.getByRole('textbox', { name: 'Policy Number', exact: true }).fill(Date.now().toString());
  await page2.getByRole('textbox', { name: 'Effective Date' }).click();
  await page2.getByLabel('January 8,').nth(1).click();
 // await page2.getByRole('textbox', { name: 'Effective Date' }).fill('01/08/2026');
  await page2.getByRole('textbox', { name: 'Issue Age' }).click();
  await page2.getByRole('textbox', { name: 'Issue Age' }).fill('23');
  await page2.getByRole('combobox', { name: 'Select commission type...' }).click();
  await page2.getByRole('option', { name: 'OVERRIDE', exact: true }).click();
  await page2.getByRole('combobox', { name: 'Select duration segment...' }).click();
  await page2.getByRole('option', { name: 'YEAR' }).click();
  await page2.getByRole('combobox', { name: 'Select business type...' }).click();
  await page2.getByRole('option', { name: 'MED SUPP' }).click();
 // await page2.getByRole('searchbox', { name: 'Search' }).click();
  await page2.getByRole('combobox', { name: 'Select rate basis...' }).click();
  await page2.getByRole('option', { name: 'PREM' }).click();
  await page2.getByRole('textbox', { name: 'Paid To Date' }).click();
  await page2.getByLabel('January 6,').first().click();
 // await page2.getByRole('textbox', { name: 'Paid To Date' }).fill('01/06/2026');
  await page2.getByRole('combobox', { name: 'Select rate type...' }).click();
  await page2.getByRole('option', { name: '%' }).click();
  await page2.getByRole('spinbutton', { name: 'Rate' }).click();
  await page2.getByRole('spinbutton', { name: 'Rate' }).fill('1');
  await page2.getByRole('spinbutton', { name: 'From Policy Duration' }).click();
  await page2.getByRole('spinbutton', { name: 'From Policy Duration' }).click();
  await page2.getByRole('spinbutton', { name: 'From Policy Duration' }).click();
  await page2.getByRole('spinbutton', { name: 'From Policy Duration' }).fill('1');
  await page2.getByRole('spinbutton', { name: 'To Policy Duration' }).click();
  await page2.getByRole('spinbutton', { name: 'To Policy Duration' }).fill('2');
  await page2.getByRole('button', { name: 'Add Rate' }).click();
  await page2.getByRole('combobox', { name: 'Select writing agent...' }).click();
  await page2.getByRole('option', { name: 'ACCESS CARE, INC' }).click();
  await page2.getByRole('textbox', { name: 'Vesting Years' }).click();
  await page2.getByRole('textbox', { name: 'Vesting Years' }).fill('3');
  await page2.getByRole('textbox', { name: 'Vesting Date' }).click();
  await page2.getByLabel('January 14,').nth(2).click();
  //await page2.getByRole('textbox', { name: 'Vesting Date' }).fill('01/14/2026');
  await page2.getByRole('textbox', { name: 'Group Name' }).click();
  await page2.getByRole('textbox', { name: 'Group Name' }).fill('test');
  await page2.getByRole('textbox', { name: 'Origination Type' }).click();
  await page2.getByRole('textbox', { name: 'Origination Type' }).fill('test');
  await page2.getByRole('button', { name: 'Submit' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill(LiabilityName);
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await expect(page2.getByRole('cell', { name: LiabilityName })).toBeVisible();
  await page2.getByRole('cell', { name: 'MAA TEST' }).first().click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await expect(page2.getByRole('cell', { name: LiabilityName})).not.toBeVisible();
  await context.tracing.stop({ path: 'traceLiabilities.zip' });
  await page.close();
});
