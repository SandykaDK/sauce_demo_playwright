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
  // await login(page);
  await page.goto('/')
})

test('TC-AUTH-001 Open login page', async ({ page }) => {
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

  await expect(page.locator('div.login_credentials_wrap')).toBeVisible();
});

test('TC-AUTH-002 Login with valid credentials', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveTitle('Swag Labs')
});

test('TC-AUTH-003 Login with invalid username', async ({ page }) => {
  const username = 'wrong_username';
  const password = 'secret_sauce';

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText('Username and password do not match any user in this service');
});

test('TC-AUTH-004 Login with invalid password', async ({ page }) => {
  const username = 'standard_user';
  const password = 'wrong_password';

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText('Username and password do not match any user in this service');
});

test('TC-AUTH-005 Login with empty username and password', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
});

test('TC-AUTH-006 Login with empty username', async ({ page }) => {
  const password = 'wrong_password';

  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText('Username is required');
});

test('TC-AUTH-007 Login with empty password', async ({ page }) => {
  const username = 'standard_user';

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText('Password is required');
});

test('TC-AUTH-008 Logout successfully after login', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveTitle('Swag Labs');

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page).toHaveURL('/')
});

test('TC-AUTH-009 Locked out user cannot login', async ({ page }) => {
  const username = 'locked_out_user';
  const password = 'secret_sauce';

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toContainText('Sorry, this user has been locked out');
});

