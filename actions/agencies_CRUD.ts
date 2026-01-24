import { test, expect} from '@playwright/test';
import { login } from '../auth/creds';
import type { Page, BrowserContext } from '@playwright/test';



export async function agencies_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
 const AgencyName =  `test_Jester${Date.now()}`
  await context.tracing.start({ screenshots: true, snapshots: true });
  await console.log('Step1: login')
  await login({ page });
  const page2Promise = page.waitForEvent('popup');
  await console.log('Clicking agencies')
  await page.getByRole('link', { name: 'Agencies', exact: true }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState('domcontentloaded');
  await console.log('New agency')
  await page2.getByRole('button', { name: 'New Agency' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill(AgencyName);
  await page2.getByRole('button', { name: 'Submit' }).click();
  await console.log('Add success')
  await expect(page2.getByRole('cell', { name: AgencyName })).toBeVisible();
  await page2.getByRole('cell', { name: AgencyName }).click();
  await page2.getByRole('button', { name: 'Edit' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill('TEST QA AGENCY 123');
  await page2.getByRole('button', { name: 'Update' }).click();
  await expect(page2.getByRole('cell', { name: 'TEST QA AGENCY 123' })).toBeVisible();
  await page2.getByRole('cell', { name: 'TEST QA AGENCY 123' }).click();
  await page2.getByRole('cell', { name: 'TEST QA AGENCY 123' }).click();
  //await page2.getByRole('button').nth(4).click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await expect(page2.getByRole('cell', { name: 'TEST QA AGENCY 123'})).not.toBeVisible();
  await context.tracing.stop({ path: 'traceAgencies.zip' });
  await page.close();
}
