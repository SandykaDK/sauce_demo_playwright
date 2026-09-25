import { test, expect } from '@playwright/test';

async function login(page) {
  const username = 'standard_user';
  const password = 'secret_sauce';

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.beforeEach(async ({ page }) =>{
  await login(page);
})

test('TC-NAV-001 - Membuka sidebar', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();

  await expect(page.getByRole('button', { name: 'All Items' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dynamic Catalog' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible(); //Tidak konsisten karena cuma ini yang bukan pakai button
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset App State' })).toBeVisible();
  await expect(page.locator('span.submenu-chevron')).toBeVisible();
});

test('TC-NAV-002 - Navigasi ke All Items', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'All Items' }).click();
});

test('TC-NAV-003 - Navigasi ke About', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('link', { name: 'About' }).click();
});

test('TC-NAV-004 - Reset App State', async ({ page }) => {
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'Reset App State' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

test('TC-NAV-005 - Logout dari sidebar', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/');
});