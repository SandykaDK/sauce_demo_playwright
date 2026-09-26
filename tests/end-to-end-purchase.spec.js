import { expect, test } from '@playwright/test';

async function completePurchase(page, productName, price, tax, total) {
	await page.goto('/');
	await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
	await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
	await page.getByRole('button', { name: 'Login' }).click();
	await expect(page).toHaveURL('/inventory.html');

	const product = page.locator('.inventory_item').filter({ hasText: productName });
	await product.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

	await page.locator('.shopping_cart_link').click();
	await expect(page).toHaveURL('/cart.html');
	await expect(page.locator('.cart_item')).toContainText(productName);
	await page.getByRole('button', { name: 'Checkout' }).click();

	await page.getByRole('textbox', { name: 'First Name' }).fill('Test');
	await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
	await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page).toHaveURL('/checkout-step-two.html');

	const summaryItem = page.locator('.cart_item');
	await expect(summaryItem.locator('.inventory_item_name')).toHaveText(productName);
	await expect(summaryItem.locator('.inventory_item_price')).toHaveText(price);
	await expect(page.locator('.summary_subtotal_label')).toHaveText(`Item total: ${price}`);
	await expect(page.locator('.summary_tax_label')).toHaveText(`Tax: ${tax}`);
	await expect(page.locator('.summary_total_label')).toHaveText(`Total: ${total}`);

	await page.getByRole('button', { name: 'Finish' }).click();
	await expect(page).toHaveURL('/checkout-complete.html');
	await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
}

test('TC-E2E-001 Complete purchase of Sauce Labs Backpack', async ({ page }) => {
	await completePurchase(page, 'Sauce Labs Backpack', '$29.99', '$2.40', '$32.39');
});

test('TC-E2E-002 Complete purchase of Sauce Labs Bike Light', async ({ page }) => {
	await completePurchase(page, 'Sauce Labs Bike Light', '$9.99', '$0.80', '$10.79');
});
