import { expect, test } from '@playwright/test';

const password = 'secret_sauce';

async function login(page, username) {
	await page.goto('/');
	await page.getByRole('textbox', { name: 'Username' }).fill(username);
	await page.getByRole('textbox', { name: 'Password' }).fill(password);
	await page.getByRole('button', { name: 'Login' }).click();
}

test('TC-USER-001 problem_user shows product and cart issues', async ({ page }) => {
	await login(page, 'problem_user');

	await expect(page).toHaveURL('/inventory.html');
	await expect(page).toHaveTitle('Swag Labs');

	const products = page.locator('.inventory_item');
	await expect(products).toHaveCount(6);

	for (let index = 0; index < 6; index++) {
		await expect(products.nth(index).locator('img')).toBeVisible();
		await expect(products.nth(index).getByRole('button', { name: 'Add to cart' })).toBeVisible();
	}

	await page.getByText('Sauce Labs Backpack', { exact: true }).click();
	await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Fleece Jacket');
	await expect(page.locator('.inventory_details_img')).toBeVisible();
	await page.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

test('TC-USER-002 problem_user cannot remove an inventory item from the cart', async ({ page }) => {
	await login(page, 'problem_user');

	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

	await backpack.getByRole('button', { name: 'Remove' }).click();
	await page.locator('.shopping_cart_link').click();

	await expect(page.locator('.cart_item')).toHaveCount(0);
});

test('TC-USER-003 problem_user cart item image is missing', async ({ page }) => {
	await login(page, 'problem_user');

	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

	await page.locator('.shopping_cart_link').click();

	const cartBackpack = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
	await expect(cartBackpack).toHaveCount(1);
	await expect(cartBackpack.locator('img')).toBeVisible();
});

test('TC-USER-004 problem_user starts with an empty cart', async ({ page }) => {
	await login(page, 'problem_user');

	await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

	await page.locator('.shopping_cart_link').click();
	await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
	await expect(page.locator('.cart_item')).toHaveCount(0);
});

test('TC-USER-005 problem_user can add every inventory product to cart', async ({ page }) => {
	await login(page, 'problem_user');

	const products = page.locator('.inventory_item');
	const cartBadge = page.locator('.shopping_cart_badge');
	await expect(products).toHaveCount(6);
	await expect(cartBadge).toHaveCount(0);

	for (let index = 0; index < await products.count(); index++) {
		const product = products.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();
		const badgeCountBefore = await cartBadge.count() === 0
			? 0
			: Number(await cartBadge.innerText());

		await test.step(`Add ${productName}`, async () => {
			await product.getByRole('button', { name: 'Add to cart' }).click();
			await expect.soft(
				cartBadge,
				`Cart badge should increase after adding ${productName}`
			).toHaveText(String(badgeCountBefore + 1));
			await expect.soft(
				product.getByRole('button', { name: 'Remove' }),
				`Add button should change to Remove for ${productName}`
			).toBeVisible();
		});
	}
});

test('TC-USER-006 Login as performance_glitch_user', async ({ page }) => {
	test.setTimeout(60_000);
	await login(page, 'performance_glitch_user');

	await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', { timeout: 60_000 });
	await expect(page.locator('.inventory_item')).toHaveCount(6);

	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

	await page.locator('.shopping_cart_link').click();
	await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
	await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
});

test('TC-USER-007 Login as error_user', async ({ page }) => {
	await login(page, 'error_user');

	await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

	const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
	await backpack.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

	await page.locator('.shopping_cart_link').click();
	await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
	await page.getByRole('button', { name: 'Checkout' }).click();
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByRole('alert')).toContainText('First Name is required');
});

test('TC-USER-008 Login as visual_user', async ({ page }, testInfo) => {
	await login(page, 'visual_user');

	await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
	await expect(page).toHaveTitle('Swag Labs');
	await expect(page.locator('.inventory_item')).toHaveCount(6);

	for (const product of await page.locator('.inventory_item').all()) {
		await expect(product.locator('img')).toBeVisible();
		await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
	}

	await page.screenshot({
		path: testInfo.outputPath('visual-user-inventory.png'),
		fullPage: true,
	});
});

test('TC-USER-009 problem_user detail URLs, names, and prices match standard_user', async ({ page }) => {
	test.setTimeout(90_000);
	const standardDetailsByProduct = new Map();

	await login(page, 'standard_user');
	const standardProducts = page.locator('.inventory_item');
	await expect(standardProducts).toHaveCount(6);

	for (let index = 0; index < await standardProducts.count(); index++) {
		const product = standardProducts.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();

		await product.locator('.inventory_item_name').click();
		standardDetailsByProduct.set(productName, {
			url: page.url(),
			name: await page.locator('.inventory_details_name').innerText(),
			price: await page.locator('.inventory_details_price').innerText(),
		});
		await page.getByText('Back to products', { exact: true }).click();
	}

	await page.getByRole('button', { name: 'Open Menu' }).click();
	await page.getByRole('button', { name: 'Logout' }).click();

	await login(page, 'problem_user');

	const products = page.locator('.inventory_item');
	await expect(products).toHaveCount(6);

	for (let index = 0; index < await products.count(); index++) {
		const product = products.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();
		const expectedDetails = standardDetailsByProduct.get(productName);

		await product.locator('.inventory_item_name').click();
		await expect.soft(
			page,
			`Detail URL for ${productName} should match standard_user`
		).toHaveURL(expectedDetails?.url ?? '', { timeout: 1_000 });
		await expect.soft(
			page.locator('.inventory_details_name'),
			`Detail name for ${productName} should match standard_user`
		).toHaveText(expectedDetails?.name ?? '', { timeout: 1_000 });
		await expect.soft(
			page.locator('.inventory_details_price'),
			`Detail price for ${productName} should match standard_user`
		).toHaveText(expectedDetails?.price ?? '', { timeout: 1_000 });
		await page.getByText('Back to products', { exact: true }).click();
	}
});

test('TC-USER-010 problem_user inventory images match standard_user', async ({ page }) => {
	test.setTimeout(60_000);
	const standardImagesByProduct = new Map();

	await login(page, 'standard_user');
	const standardProducts = page.locator('.inventory_item');
	await expect(standardProducts).toHaveCount(6);

	for (let index = 0; index < await standardProducts.count(); index++) {
		const product = standardProducts.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();
		standardImagesByProduct.set(
			productName,
			await product.locator('img').getAttribute('src')
		);
	}

	await page.getByRole('button', { name: 'Open Menu' }).click();
	await page.getByRole('button', { name: 'Logout' }).click();

	await login(page, 'problem_user');
	const problemProducts = page.locator('.inventory_item');
	await expect(problemProducts).toHaveCount(6);

	for (let index = 0; index < await problemProducts.count(); index++) {
		const product = problemProducts.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();
		const problemImage = product.locator('img');
		const expectedImageSrc = standardImagesByProduct.get(productName);

		await expect.soft(
			problemImage,
			`Image for ${productName} should match standard_user`
		).toHaveAttribute('src', expectedImageSrc ?? '', { timeout: 1_000 });
	}
});

test('TC-USER-011 problem_user detail images match standard_user', async ({ page }) => {
	test.setTimeout(90_000);
	const standardDetailImagesByProduct = new Map();

	await login(page, 'standard_user');
	const standardProducts = page.locator('.inventory_item');
	await expect(standardProducts).toHaveCount(6);

	for (let index = 0; index < await standardProducts.count(); index++) {
		const product = standardProducts.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();

		await product.locator('.inventory_item_name').click();
		const detailImage = page.locator('.inventory_details_img');
		standardDetailImagesByProduct.set(productName, await detailImage.getAttribute('src'));

		await page.getByText('Back to products', { exact: true }).click();
	}

	await page.getByRole('button', { name: 'Open Menu' }).click();
	await page.getByRole('button', { name: 'Logout' }).click();

	await login(page, 'problem_user');
	const problemProducts = page.locator('.inventory_item');
	await expect(problemProducts).toHaveCount(6);

	for (let index = 0; index < await problemProducts.count(); index++) {
		const product = problemProducts.nth(index);
		const productName = (await product.locator('.inventory_item_name').innerText()).trim();
		const expectedImageSrc = standardDetailImagesByProduct.get(productName);

		await product.locator('.inventory_item_name').click();
		await expect.soft(
			page.locator('.inventory_details_img'),
			`Detail image for ${productName} should match standard_user`
		).toHaveAttribute('src', expectedImageSrc ?? '', { timeout: 1_000 });
		await page.getByText('Back to products', { exact: true }).click();
	}
});

test('TC-USER-012 problem_user can sort inventory by name and price', async ({ page }) => {
	await login(page, 'problem_user');

	const sort = page.locator('.product_sort_container');
	const productNames = page.locator('.inventory_item_name');
	const productPrices = page.locator('.inventory_item_price');
	const namesBeforeSort = await productNames.allTextContents();
	const namesAscending = [...namesBeforeSort].sort((firstName, secondName) =>
		firstName.localeCompare(secondName)
	);
	const namesDescending = [...namesAscending].reverse();
	const getNumericPrices = async () =>
        (await productPrices.allTextContents()).map(price => Number(price.replace('$', '')));

    // Name ASC
	await sort.selectOption('az');
	await expect.soft(
        productNames, 
        'Names should sort A to Z'
    ).toHaveText(namesAscending);

    // Name DESC
	await sort.selectOption('za');
	await expect.soft(
        productNames, 
        'Names should sort Z to A'
    ).toHaveText(namesDescending);

    // Price ASC
	await sort.selectOption('lohi');
	const pricesLowToHigh = await getNumericPrices();
	await expect.soft(
		pricesLowToHigh,
		'Prices should sort from low to high'
	).toEqual([...pricesLowToHigh].sort((firstPrice, secondPrice) => firstPrice - secondPrice));

    // Price DESC
	await sort.selectOption('hilo');
	const pricesHighToLow = await getNumericPrices();
	await expect.soft(
		pricesHighToLow,
		'Prices should sort from high to low'
	).toEqual([...pricesHighToLow].sort((firstPrice, secondPrice) => secondPrice - firstPrice));
});

