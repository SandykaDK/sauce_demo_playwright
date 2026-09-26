import { expect, test } from '@playwright/test';

async function login(page) {
	await page.goto('/');
	await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
	await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
	await page.getByRole('button', { name: 'Login' }).click();
}

test.beforeEach(async ({ page }) => {
	await login(page);
});

test('TC-CART-001 Open cart after adding a product', async ({ page }) => {
	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await page.locator('.shopping_cart_link').click();

	await expect(page).toHaveURL('/cart.html');
	await expect(page.locator('.cart_item')).toHaveCount(1);
	await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
});

test('TC-CART-002 Cart badge matches the number of added products', async ({ page }) => {
	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	const bikeLight = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });
	const cartBadge = page.locator('.shopping_cart_badge');

	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await expect(cartBadge).toHaveText('1');

	await bikeLight.getByRole('button', { name: 'Add to cart' }).click();
	await expect(cartBadge).toHaveText('2');
});

test('TC-CART-003 Remove a product from cart', async ({ page }) => {
	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await page.locator('.shopping_cart_link').click();

	const cartItems = page.locator('.cart_item');
	await expect(cartItems).toHaveCount(1);
	await cartItems.getByRole('button', { name: 'Remove' }).click();

	await expect(cartItems).toHaveCount(0);
	await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

test('TC-CART-004 Continue shopping returns to inventory', async ({ page }) => {
	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await page.locator('.shopping_cart_link').click();
	await expect(page).toHaveURL('/cart.html');

	await page.getByRole('button', { name: 'Continue Shopping' }).click();

	await expect(page).toHaveURL('/inventory.html');
	await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('TC-CART-005 Cart product name and price match inventory', async ({ page }) => {
	const product = page.locator('.inventory_item').first();
	const productName = (await product.locator('.inventory_item_name').innerText()).trim();
	const productPrice = (await product.locator('.inventory_item_price').innerText()).trim();

	await product.getByRole('button', { name: 'Add to cart' }).click();
	await page.locator('.shopping_cart_link').click();

	const cartItem = page.locator('.cart_item');
	await expect(cartItem).toHaveCount(1);
	await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);
	await expect(cartItem.locator('.inventory_item_price')).toHaveText(productPrice);
});
