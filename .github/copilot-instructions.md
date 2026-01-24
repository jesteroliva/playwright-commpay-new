# Commpay Playwright Testing - AI Coding Guide

## Project Architecture

**Commpay Testing Suite** - E2E tests for Commpay commission management system using Playwright.

```
actions/      # Reusable test action modules (CRUD operations)
auth/         # Authentication helpers with SSO flow
tests/        # Test specifications (*.spec.ts)
```

## Authentication Pattern

All tests use SSO authentication via `login()` from [auth/creds.ts](auth/creds.ts):
- Navigates to `commpay-dev.commtpa.com/login`
- Handles popup-based SSO flow (LTC Account)
- Credentials from `.env`: `EMAIL` and `PASSWORD`
- Always ends at `dashboard` → clicks "Manage LION Client"

**Never hardcode credentials** - always use `process.env.EMAIL!` and `process.env.PASSWORD!`

## Test Structure Pattern

Tests follow a **modular action pattern**:
1. **Test file** (`tests/paycomm_CRUD.spec.ts`) - defines test cases
2. **Action module** (`actions/agencies_CRUD.ts`) - contains reusable CRUD logic
3. **Auth module** (`auth/creds.ts`) - handles login

### Example: Modular Test
```typescript
// actions/agencies_CRUD.ts
export async function agencies_CRUD({ page, context }: { page: Page; context: BrowserContext }) {
  await context.tracing.start({ screenshots: true, snapshots: true });
  await login({ page });
  // ... CRUD logic
  await context.tracing.stop({ path: 'traceAgencies.zip' });
}

// tests/paycomm_CRUD.spec.ts
test('PAYCOMM - AGENCIES', async ({ page, context }) => {
  await agencies_CRUD({ page, context });
});
```

### Inline Test Pattern
Some tests (Garnishments, Liabilities) have CRUD logic **inline in test file** - both patterns are valid.

## Critical Conventions

### 1. Tracing for All Tests
**Always** wrap test logic with tracing:
```typescript
await context.tracing.start({ screenshots: true, snapshots: true });
// ... test actions
await context.tracing.stop({ path: 'trace<ModuleName>.zip' });
```

### 2. Dynamic Test Data
Use timestamped names to avoid collisions:
```typescript
const AgencyName = `test_Jester${Date.now()}`
const GarnishmentName = `test_Garnishment${Date.now()}`
```

### 3. Popup Handling
Many navigation flows open popups (agencies, liabilities):
```typescript
const page2Promise = page.waitForEvent('popup');
await page.getByRole('link', { name: 'Agencies' }).click();
const page2 = await page2Promise;
await page2.waitForLoadState('domcontentloaded');
```

### 4. Search-Based Verification
After create/edit, search for entity before asserting:
```typescript
await page.getByRole('searchbox', { name: 'Search here...' }).fill(EntityName);
await page.getByRole('searchbox', { name: 'Search here...' }).press('Enter');
await expect(page.getByRole('cell', { name: EntityName })).toBeVisible();
```

## Test Workflow (CRUD Pattern)

Every module test follows this sequence:
1. **Login** - via `login({ page })`
2. **Create** - fill form → submit → **assert visible**
3. **Edit** - search → click row → edit → update → **assert changes**
4. **Delete** - search → click row → delete button → **assert not visible**

### Delete Button Pattern
Delete buttons use empty name selectors:
```typescript
await page.getByRole('button', { name: '' }).click(); // Opens menu
await page.getByRole('button', { name: 'Delete' }).click();
```

## Form Filling Patterns

### Combobox Selection (Dropdowns)
```typescript
await page.getByRole('combobox', { name: 'Select producer...' }).click();
await page.getByRole('option', { name: 'ACCESS CARE, INC' }).click();
```

### Date Pickers
Use calendar clicks instead of fill():
```typescript
await page.getByRole('textbox', { name: 'Effective Date' }).click();
await page.getByLabel('January 8,').nth(1).click();
```

## Environment Configuration

- **Target**: `commpay-dev.commtpa.com` (dev environment)
- **Browser Projects**: Chromium, Firefox, WebKit (all enabled)
- **Timeout**: 20 minutes (`1200000ms`) set in test file
- **Parallel**: `fullyParallel: true` in config
- **CI**: Retries: 2, Workers: 1

## Running Tests

```bash
npx playwright test                          # Run all tests
npx playwright test --project=chromium       # Single browser
npx playwright test paycomm_CRUD.spec.ts     # Single file
npx playwright show-report                   # View HTML report
```

## Common Gotchas

1. **Wait for DOM** - Popups need `waitForLoadState('domcontentloaded')` before interaction
2. **Search before delete** - Always search/filter to target entity before clicking rows
3. **nth() for ambiguous selectors** - Use when multiple elements match (see `.nth(1)` in date pickers)
4. **Commented selectors** - Some tests have commented fallback selectors (e.g., `.nth(4)` for delete button)

## Adding New Tests

1. Create action module in `actions/<module>_CRUD.ts` OR add inline to spec
2. Import `login` from `auth/creds.ts`
3. Follow CRUD pattern with tracing
4. Use dynamic names with `Date.now()`
5. Add to `tests/paycomm_CRUD.spec.ts` with descriptive name
6. Set appropriate timeout if >30s expected
