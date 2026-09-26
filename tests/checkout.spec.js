import { expect, test } from '@playwright/test';

async function login(page) {
	await page.goto('/');
	await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
	await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
	await page.getByRole('button', { name: 'Login' }).click();
}

async function startCheckout(page) {
	await page.locator('.inventory_item')
		.filter({ hasText: 'Sauce Labs Backpack' })
		.getByRole('button', { name: 'Add to cart' })
		.click();
	await page.locator('.shopping_cart_link').click();
	await page.getByRole('button', { name: 'Checkout' }).click();
}

test.beforeEach(async ({ page }) => {
	await login(page);
});

test('TC-CHECK-001 Open checkout information', async ({ page }) => {
	await startCheckout(page);

	await expect(page).toHaveURL('/checkout-step-one.html');
	await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();
});

test('TC-CHECK-002 Continue checkout with valid information', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();

	await expect(page).toHaveURL('/checkout-step-two.html');
});

test('TC-CHECK-003 Show validation when First Name is empty', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();

	await expect(page.getByRole('alert')).toContainText('First Name is required');
});

test('TC-CHECK-004 Show validation when Last Name is empty', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();

	await expect(page.getByRole('alert')).toContainText('Last Name is required');
});

test('TC-CHECK-005 Show validation when Postal Code is empty', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('button', { name: 'Continue' }).click();

	await expect(page.getByRole('alert')).toContainText('Postal Code is required');
});

test('TC-CHECK-006 Validate order summary and total', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();

	const summaryItem = page.locator('.cart_item');
	await expect(summaryItem.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
	await expect(summaryItem.locator('.inventory_item_price')).toHaveText('$29.99');
	await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99');
	await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40');
	await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39');
});

test('TC-CHECK-007 Finish checkout and show order confirmation', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('button', { name: 'Finish' }).click();

	await expect(page).toHaveURL('/checkout-complete.html');
	await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
	await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
	await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

test('TC-CHECK-008 Cancel checkout and return to cart', async ({ page }) => {
	await startCheckout(page);
	await page.getByRole('button', { name: 'Cancel' }).click();

	await expect(page).toHaveURL('/cart.html');
	await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
});
