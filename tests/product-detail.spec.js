import { test, expect } from '@playwright/test';

async function login(page) {
  const username = 'standard_user';
  const password = 'secret_sauce';

  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.beforeEach(async ({ page }) => {
  await login(page);
})

test('TC-PROD-001 Validate product detail information', async ({ page }) =>{
  await page.getByText('Sauce Labs Backpack', { exact: true }).click();
  await expect(page).toHaveURL('/inventory-item.html?id=4');

  await expect(page.locator('div.inventory_details_name.large_size')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('div.inventory_details_desc'))
    .toHaveText(
        'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );
  await expect(page.locator('div.inventory_details_price'))
    .toHaveText('$29.99');
  await expect(page.getByRole('img', { name: 'Sauce Labs Backpack' }))
    .toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});

test('TC-PROD-002 Add product to cart from product details', async ({ page }) => {
    const details = page.locator('.inventory_details');
    const cartItem = page.locator('.cart_item');
    const itemName = 'Sauce Labs Backpack';
    const itemDesc = 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.';
    const itemPrice = '$29.99';

    await page.getByText('Sauce Labs Backpack', { exact: true }).click();
    await details.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('/cart.html');

    await expect(cartItem.getByText(itemName, { exact: true })).toBeVisible();
    await expect(cartItem.getByText(itemDesc, { exaxt: true })).toBeVisible();
    await expect(cartItem.getByText(itemPrice, { exact: true })).toBeVisible();
});

test('TC-PROD-003 Return to inventory from product details', async ({ page }) => {
    await page.getByText('Sauce Labs Bike Light', { exact: true }).click();
    await expect(page).toHaveURL('/inventory-item.html?id=0');

    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page).toHaveURL('/inventory.html')
});