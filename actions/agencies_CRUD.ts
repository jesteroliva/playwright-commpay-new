import { test, expect} from '@playwright/test';
import { login } from '../auth/login';
import type { Page, BrowserContext } from '@playwright/test';



export async function agencies_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
 const AgencyName =  `test_Jester${Date.now()}`
  await context.tracing.start({ screenshots: true, snapshots: true });
  await login({ page });
  const page2Promise = page.waitForEvent('popup');
  await console.log('Clicking agencies')
  await page.getByRole('link', { name: 'Agencies', exact: true }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState('domcontentloaded');

  //add
  await page2.getByRole('button', { name: 'New Agency' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill(AgencyName);
  await page2.getByRole('button', { name: 'Submit' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill(AgencyName);
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await page2.getByRole('row').nth(1).click();
  await expect(page2.getByRole('row').nth(1)).toBeVisible();


  //edit
  await page2.getByRole('button', { name: 'Edit' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill('TEST QA AGENCY 123');
  await page2.getByRole('button', { name: 'Update' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill('TEST QA AGENCY 123');
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await expect(page2.getByRole('row').nth(1)).toBeVisible();

  //delete
  //await page2.getByRole('row').nth(1).click();
  await page2.getByRole('row').nth(1).click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).click();
  await page2.getByRole('searchbox', { name: 'Search here...' }).fill('TEST QA AGENCY 123');
  await page2.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
  await expect(page2.getByRole('row').nth(2)).not.toBeVisible();
  await context.tracing.stop({ path: 'traceAgencies.zip' });
  await page.close();
  await page2.close();
}
