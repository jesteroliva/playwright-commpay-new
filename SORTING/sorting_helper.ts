import {expect, Page } from '@playwright/test';

export async function expandToHundredRows(page: Page) {
  try {
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByRole('combobox', { name: '10' }).click();
    await page.getByRole('option', { name: '100' }).click();
    await page.getByRole('button', { name: 'Apply' }).click();
    await page.locator('.drawer-overlay').click();
    await page.waitForTimeout(500);
  } catch {
  }
}

const firstLine = (v: string) => v.split('\n')[0]?.trim() ?? '';
const textKey = (v: string) => firstLine(v);
const numberText = (v: string) => firstLine(v).replace(/,/g, '').trim();
const monthName = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i;
const strictNumber = /^-?\d+(\.\d+)?$/;
const hasLeadingZero = (v: string) => /^-?0\d+(\.\d+)?$/.test(numberText(v));
const asNumber = (v: string) => {
  const txt = numberText(v);
  if (!strictNumber.test(txt)) return null;
  const n = Number(txt);
  return Number.isFinite(n) ? n : null;
};
const asDate = (v: string) => {
  const txt = firstLine(v);
  if (!monthName.test(txt)) return null;
  const t = Date.parse(txt);
  return Number.isNaN(t) ? null : t;
};
const isCheckable = (v: string) => firstLine(v) !== '';
const asciiCompare = (a: string, b: string) => {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = a.charCodeAt(i) - b.charCodeAt(i);
    if (diff !== 0) return diff;
  }
  return a.length - b.length;
};

const compareLetters = (aRaw: string, bRaw: string, dir: 'asc' | 'desc') => {
  const [a, b] = [textKey(aRaw), textKey(bRaw)];
  if (!a || !b) return true;
  const cmp = asciiCompare(a, b);
  return dir === 'asc' ? cmp <= 0 : cmp >= 0;
};

const getMode = (values: string[]) => {
  const clean = values.map(firstLine).filter(Boolean);
  const allDates = clean.length > 0 && clean.every(v => asDate(v) !== null);
  if (allDates) return 'date';
  const allNumeric = clean.length > 0 && clean.every(v => strictNumber.test(v.replace(/,/g, '')));
  const anyLeadingZero = clean.some(v => hasLeadingZero(v));
  return allNumeric && !anyLeadingZero ? 'number' : 'text';
};

const validatePairs = (values: string[], dir: 'asc' | 'desc') => {
  const mode = getMode(values);
  const pairOk = (left: string, right: string) => {
    if (mode === 'number') {
      const [a, b] = [asNumber(left), asNumber(right)];
      if (a === null || b === null) return true;
      return dir === 'asc' ? a <= b : a >= b;
    }
    if (mode === 'date') {
      const [a, b] = [asDate(left), asDate(right)];
      if (a === null || b === null) return true;
      return dir === 'asc' ? a <= b : a >= b;
    }
    return compareLetters(left, right, dir);
  };

  for (let i = 0; i < values.length - 1; i++) {
    const ok = pairOk(values[i], values[i + 1]);
    if (!ok) return `Pair violation at ${i}: "${firstLine(values[i])}" -> "${firstLine(values[i + 1])}" (${dir}, ${mode})`;
  }
  return null;
};


export async function sampleAtLeastFive(page: Page, tableId: string, col: number) {
  const read = async () =>
    page.$$eval(`#${tableId} tbody tr td:nth-child(${col})`, tds => tds.map(td => td.textContent?.trim() || ''));

  const checkable = (await read()).filter(isCheckable);
  return checkable.length >= 5 ? checkable.slice(0, 5) : checkable;
}

export async function checkTableSortingDynamic(page: Page) {
  const clickAndReadSort = async (header: any) => {
    const before = await header.getAttribute('aria-sort');
    await header.click(); // click header
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(200);
      const after = await header.getAttribute('aria-sort');
      if (after && after !== before) return after;
      if (after && !before) return after;
    }
    return (await header.getAttribute('aria-sort')) ?? null;
  };

  await expandToHundredRows(page);

  const tables = page.locator('table:visible[id]');
  for (let t = 0; t < await tables.count(); t++) {
    const table = tables.nth(t);
    const tableId = await table.getAttribute('id');
    if (!tableId) continue;

    const headers = table.locator('th');
    for (let i = 0; i < await headers.count(); i++) {
      const h = headers.nth(i);
      if (!(await h.isVisible()) || !(await h.isEnabled())) continue;
      const clickable = await h.evaluate(el => {
        const s = window.getComputedStyle(el);
        return s.cursor === 'pointer' && s.pointerEvents !== 'none' && !el.hasAttribute('disabled');
      });
      if (!clickable) continue;

      const name = (await h.innerText().catch(() => '')).trim() || `Column ${i + 1}`;
      const seen = new Set<'asc' | 'desc'>();
      for (let attempts = 0; attempts < 4 && seen.size < 2; attempts++) {
        const errors: { status: number; url: string }[] = [];
        const onResponse = (res: any) => res.status() >= 400 && errors.push({ status: res.status(), url: res.url() });
        page.on('response', onResponse);
        const sort = await clickAndReadSort(h);
        page.off('response', onResponse);
        expect.soft(errors).toEqual([]);

        if (sort !== 'ascending' && sort !== 'descending') continue;
        const dir: 'asc' | 'desc' = sort === 'ascending' ? 'asc' : 'desc';
        if (seen.has(dir)) continue;
        seen.add(dir);

        const values = await sampleAtLeastFive(page, tableId, i + 1);
        const violation = validatePairs(values, dir);

        console.log(`📊 ${name} [${dir}] (${getMode(values)}) - ${violation ? `❌ ${violation}` : '✅ OK'}`);
        expect.soft(violation, `Column "${name}" [${dir}] sort order`).toBeNull();
      }
    }
  }
}