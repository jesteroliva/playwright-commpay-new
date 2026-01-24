import { test, expect, Page } from '@playwright/test';
import { login } from '../auth/creds';
import { agencies_CRUD } from '../actions/agencies_CRUD';
import { garnishments_CRUD } from '../actions/garnishments_CRUD';
import { liabilities_CRUD } from '../actions/liabilities_CRUD';

test.setTimeout(1200000);



//AGENCIES MODULE!!!!!!!!!
test('PAYCOMM - AGENCIES', async ({ page, context }) => {
 await agencies_CRUD({ page, context });
});


  //GARNISHMENTS MODULE!!!!!!!!!
  test('PAYCOMM CRUD - GARNISHMENTS', async ({ page, context }) => {
   await garnishments_CRUD({ page, context });

});

test ('PAYCOMM CRUD - LIABILITIES', async ({ page, context }) => {
 await liabilities_CRUD({ page, context})
});
