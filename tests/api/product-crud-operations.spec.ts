import { test } from '@fixtures/test-extend.fixture';
import { expect } from '@playwright/test';
import { validNewProductData, updateProductData } from '@test-data/product.data';

test.describe('Product CRUD Operations', () => {
    test('POST /products/add - should create a new product', async ({ apis }) => {
        const product = await apis.product.createProduct(validNewProductData);

        expect(product).toHaveProperty('id');
        expect(product.title).toBe(validNewProductData.title);
        expect(product.price).toBe(validNewProductData.price);
        expect(product.category).toBe(validNewProductData.category);
    });

    test('POST /products/add - should return created product with ID', async ({ apis }) => {
        const product = await apis.product.createProduct(validNewProductData);

        expect(product.id).toBeDefined();
        expect(typeof product.id).toBe('number');
        expect(product.id).toBeGreaterThan(0);
    });

    test('PUT /products/{id} - should update an existing product', async ({ apis }) => {
        const productId = 1;
        const updatedProduct = await apis.product.updateProduct(productId, updateProductData);

        expect(updatedProduct.id).toBe(productId);
        expect(updatedProduct.title).toBe(updateProductData.title);
        expect(updatedProduct.price).toBe(updateProductData.price);
    });

    test('PUT /products/{id} - should support partial updates', async ({ apis }) => {
        const productId = 2;
        const partialUpdate = { title: 'Partially Updated Product' };

        const updatedProduct = await apis.product.updateProduct(productId, partialUpdate);

        expect(updatedProduct.title).toBe(partialUpdate.title);
    });

    test('PATCH /products/{id} - should update product with PATCH', async ({ apis }) => {
        const productId = 3;
        const patchData = { stock: 100 };

        const updatedProduct = await apis.product.updateProductViaPatch(productId, patchData);

        expect(updatedProduct.stock).toBe(patchData.stock);
    });

    test('DELETE /products/{id} - should delete a product', async ({ apis }) => {
        const productId = 1;

        const deletedProduct = await apis.product.deleteProduct(productId);

        expect(deletedProduct.id).toBe(productId);
        expect(deletedProduct.isDeleted).toBe(true);
    });

    test('DELETE /products/{id} - should mark product as deleted', async ({ apis }) => {
        const productId = 2;

        const result = await apis.product.deleteProduct(productId);

        expect(result.isDeleted).toBeDefined();
        expect(result.isDeleted).toBe(true);
    });

    test('DELETE /products/{id} - should return 404 for non-existent product', async ({
        request,
    }) => {
        const response = await request.delete('/products/99999');

        expect(response.status()).toBe(404);
    });
});
