import  {Page} from 'playwright';

export async function login({ page }: { page: Page }){
 const devsite = 'https://commpay-dev.commtpa.com/login';
 const stagingsite = 'https://commpay-staging.commtpa.com/login';
 const prodsite = 'https://commpay.commtpa.com/login';

  await page.goto(stagingsite);
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Logo Sign in with LTC Account' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('textbox', { name: 'Email' }).click();
  await page1.getByRole('textbox', { name: 'Email' }).fill(process.env.EMAIL!);
  await page1.getByRole('textbox', { name: 'Password' }).click();
  await page1.getByRole('textbox', { name: 'Password' }).fill(process.env.PASSWORD!);
  await page1.getByRole('button', { name: 'Log in' }).click();
  await page.goto(stagingsite);
  await page.getByRole('link', { name: 'Manage Lion Client' }).click();
}
