import { test } from '@fixtures/test-extend.fixture';
import { expect } from '@playwright/test';

test.describe('Products List Endpoints', () => {
    test('GET /products - should return list of products with pagination', async ({ apis }) => {
        const data = await apis.product.getProducts();

        expect(data).toHaveProperty('products');
        expect(data).toHaveProperty('total');
        expect(data).toHaveProperty('skip');
        expect(data).toHaveProperty('limit');

        expect(Array.isArray(data.products)).toBe(true);
        expect(data.products.length).toBeGreaterThan(0);
        expect(data.total).toBeGreaterThan(0);
    });

    test('GET /products - should have valid product structure', async ({ apis }) => {
        const queryParams = { limit: 1 };
        const data = await apis.product.getProducts(queryParams);

        const product = data.products[0];

        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('discountPercentage');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('stock');
        expect(product).toHaveProperty('brand');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('thumbnail');
        expect(product).toHaveProperty('images');

        expect(typeof product.title).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThanOrEqual(0);
    });

    test('GET /products - should support limit parameter', async ({ apis }) => {
        const queryParams = { limit: 1 };
        const data = await apis.product.getProducts(queryParams);

        expect(data.products.length).toBeLessThanOrEqual(queryParams.limit);
    });

    test('GET /products - should support skip parameter', async ({ apis }) => {
        const limit = 10;
        const skip = 10;
        const queryParams1 = { limit, skip: 0 };
        const queryParams2 = { limit, skip };
        const data1 = await apis.product.getProducts(queryParams1);
        const data2 = await apis.product.getProducts(queryParams2);

        expect(data1.products[0].id).not.toBe(data2.products[0].id);
    });

    test('GET /products - should support select parameter', async ({ apis }) => {
        const queryParams = { select: 'title,price', limit: 1 };
        const data = await apis.product.getProducts(queryParams);
        const product = data.products[0];

        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
    });
});
