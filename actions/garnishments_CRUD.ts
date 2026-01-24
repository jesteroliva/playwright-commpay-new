import { test, expect} from '@playwright/test';
import { login } from '../auth/creds';
import type { Page, BrowserContext } from '@playwright/test';


export async function garnishments_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
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
}