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
});

test('TC-INV-001 Display inventory product list', async ({ page }) => {
    const products = page.locator('.inventory_item');
    const expectedProducts = [
        { name: 'Sauce Labs Backpack', price: '$29.99' },
        { name: 'Sauce Labs Bike Light', price: '$9.99' },
        { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
        { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
        { name: 'Sauce Labs Onesie', price: '$7.99' },
        { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' }
    ];
    
    await expect(products).toHaveCount(expectedProducts.length);

    for (let index = 0; index < expectedProducts.length; index++) {
      const product = products.nth(index);
      const expectedProduct = expectedProducts[index];

      await expect(product.locator('.inventory_item_name')).toHaveText(expectedProduct.name);
      await expect(product.locator('.inventory_item_price')).toHaveText(expectedProduct.price);
      await expect(product.locator('img')).toHaveAttribute('alt', expectedProduct.name);
      await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }
});

test('TC-INV-002 Open product details from inventory', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack', { exact: true }).click();

    await expect(page.locator('div.inventory_details_name.large_size')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('div.inventory_details_desc'))
    .toHaveText(
        'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );
    await expect(page.locator('div.inventory_details_price')).toHaveText('$29.99');
    await expect(page.getByRole('img', { name: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});

test('TC-INV-003 Sort products by name', async ({ page }) => {

});

test('TC-INV-004 Sort products by price', async ({ page }) => {

});

test('TC-INV-005 Add a product to cart from inventory', async ({ page }) => {

});