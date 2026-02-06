import { test, expect, Page } from '@playwright/test';
import { agencies_CRUD } from '../CRUD/agencies_CRUD';
import { garnishments_CRUD } from '../CRUD/garnishments_CRUD';
import { liabilities_CRUD } from '../CRUD/liabilities_CRUD';
import { beneficiary_CRUD } from '../CRUD/beneficiary_CRUD';
import { manualtransaction_CRUD } from '../CRUD/manualtransaction_CRUD';
import { producers_CRUD } from '../CRUD/producers_CRUD';

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

test ('PAYCOMM SORTING - PRODUCERS', async ({ page, context }) => {
  await producers_CRUD({ page, context });
});
