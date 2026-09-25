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
  const sort = page.locator('.product_sort_container');
  const productNames = page.locator('.inventory_item_name');
  const namesBeforeSorting = await productNames.allTextContents();
  const namesAscending = [...namesBeforeSorting].sort((firstName, secondName) =>
    firstName.localeCompare(secondName)
  );
  const namesDescending = [...namesAscending].reverse();

  await sort.selectOption('az');
  await expect(sort).toHaveValue('az');
  await expect(productNames).toHaveText(namesAscending);

  await sort.selectOption('za');
  await expect(sort).toHaveValue('za');
  await expect(productNames).toHaveText(namesDescending);
});

test('TC-INV-004 Sort products by price', async ({ page }) => {
  const sort = page.locator('.product_sort_container');
  const productPrices = page.locator('.inventory_item_price');
  const pricesBeforeSorting = await productPrices.allTextContents();
  const pricesAscending = [...pricesBeforeSorting].sort(
    (firstPrice, secondPrice) =>
      parseFloat(firstPrice.replace('$', '')) - parseFloat(secondPrice.replace('$', ''))
  );
  const pricesDescending = [...pricesAscending].reverse();

  await sort.selectOption('lohi');
  await expect(sort).toHaveValue('lohi');
  await expect(productPrices).toHaveText(pricesAscending);

  await sort.selectOption('hilo');
  await expect(sort).toHaveValue('hilo');
  await expect(productPrices).toHaveText(pricesDescending);
});

test('TC-INV-005 Add a product to cart from inventory', async ({ page }) => {
    const cartItem = page.locator('.cart_item');
    const itemName = 'Sauce Labs Backpack';
    const itemDesc = 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.';
    const itemPrice = '$29.99';
    const product = page.locator('.inventory_item').filter({has: page.getByText(itemName, { exact: true })});
  
  await product.getByRole('button', { name: 'Add to cart' }).click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL('/cart.html');

  await expect(cartItem.getByText(itemName, { exact: true })).toBeVisible();
  await expect(cartItem.getByText(itemDesc, { exaxt: true })).toBeVisible();
  await expect(cartItem.getByText(itemPrice, { exact: true })).toBeVisible();
});