import { test, expect} from '@playwright/test';
import { login } from '../auth/login';
import type { Page, BrowserContext } from '@playwright/test';



export async function agencies_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
 const AgencyName =  `test_Jester${Date.now()}`
  await context.tracing.start({ screenshots: true, snapshots: true });
  await login({ page });
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Agencies', exact: true }).click();
  const page2 = await page2Promise;
  await page2.waitForLoadState('domcontentloaded');
  const searchBox = page2.getByRole('searchbox', { name: 'Search here...' });

  await test.step('ADD AGENCY', async () => {
  await page2.getByRole('button', { name: 'New Agency' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill(AgencyName);
  await page2.getByRole('button', { name: 'Submit' }).click();
  await searchBox.fill(AgencyName);
  await searchBox.press('Enter');
  await page2.getByRole('row').nth(1).click();

  await test.step('Verify added agency is visible', async () => {
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
});

});

  await test.step('EDIT AGENCY', async () => {
  await page2.getByRole('button', { name: 'Edit' }).click();
  await page2.getByRole('textbox', { name: 'Agency Name *' }).fill('TEST QA AGENCY 123');
  await page2.getByRole('button', { name: 'Update' }).click();
  await searchBox.fill('TEST QA AGENCY 123');
  await searchBox.press('Enter');

  await test.step('Verify edited agency is visible', async () => {
  await expect(page2.getByRole('row').nth(1)).toBeVisible();
  });
  });

  await test.step('DELETE AGENCY', async () => {
  await page2.getByRole('row').nth(1).click();
  await page2.getByRole('row').nth(1).click();
  await page2.getByRole('button', { name: '' }).click();
  await page2.getByRole('button', { name: 'Delete' }).click();
  await searchBox.fill('TEST QA AGENCY 123');
  await searchBox.press('Enter');
  await test.step('Verify deleted agency is not visible', async () => {
  await expect(page2.getByRole('row').nth(2)).not.toBeVisible();
  });
  });

  await context.tracing.stop({ path: 'traceAgencies.zip' });
  await page.close();
  await page2.close();
  
}
