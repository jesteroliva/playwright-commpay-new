import { test, expect, Page } from '@playwright/test';
import { login } from '../auth/login';
import { agencies_CRUD } from '../actions/agencies_CRUD';
import { garnishments_CRUD } from '../actions/garnishments_CRUD';
import { liabilities_CRUD } from '../actions/liabilities_CRUD';
import { beneficiary_CRUD } from '../actions/beneficiary_CRUD';
import { manualtransaction_CRUD } from '../actions/manualtransaction_CRUD';

test.setTimeout(1200000);



//AGENCIES MODULE!!!!!!!!!
test('PAYCOMM - AGENCIES', async ({ page, context }) => {
 await agencies_CRUD({ page, context });
});


  //GARNISHMENTS MODULE!!!!!!!!!
  test('PAYCOMM CRUD - GARNISHMENTS', async ({ page, context }) => {
   await garnishments_CRUD({ page, context });

});

test('PAYCOMM CRUD - LIABILITIES', async ({ page, context }) => {
 await liabilities_CRUD({ page, context})
});

test ('PAYCOMM CRUD - BENEFICIARY', async ({ page, context }) => {
 await beneficiary_CRUD({ page, context})
});

test ('PAYCOMM CRUD - MANUAL TRANSACTION', async ({ page, context }) => {
  await manualtransaction_CRUD({ page, context})
});
