import { test } from '@fixtures/test-extend.fixture';
import { expect } from '@playwright/test';
import { schemaValidator } from '@utils/schema.validator';
import { productSchema, productsListResponseSchema } from '@schemas/product.schema';
import { SchemaAssertions } from '@utils/schema-assertions';

test.describe('Product Schema Validation', () => {
    test.describe('GET /products - List Response Schema', () => {
        test('should return products list matching schema', async ({ apis }) => {
            const data = await apis.product.getProducts();

            SchemaAssertions.matchesSchema(data, productsListResponseSchema, 'products-list');
        });

        test('should validate each product in list matches schema', async ({ apis }) => {
            const queryParams = { limit: 5 };
            const data = await apis.product.getProducts(queryParams);

            SchemaAssertions.arrayItemsMatchSchema(data.products, productSchema, 'product');
        });

        test('should validate pagination fields', async ({ apis }) => {
            const queryParams = { limit: 10, skip: 5 };
            const data = await apis.product.getProducts(queryParams);

            SchemaAssertions.exists(data.total);
            SchemaAssertions.exists(data.skip);
            SchemaAssertions.exists(data.limit);

            SchemaAssertions.hasType(data.total, 'number');
            SchemaAssertions.hasType(data.skip, 'number');
            SchemaAssertions.hasType(data.limit, 'number');

            SchemaAssertions.isNonNegative(data.total);
            SchemaAssertions.equals(data.skip, 5);
            SchemaAssertions.equals(data.limit, 10);
        });
    });

    test.describe('GET /products/{id} - Single Product Schema', () => {
        test('should return product matching schema', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.matchesSchema(product, productSchema, 'product');
        });

        test('should validate product field types', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.hasType(product.id, 'number');
            SchemaAssertions.hasType(product.title, 'string');
            SchemaAssertions.hasType(product.description, 'string');
            SchemaAssertions.hasType(product.price, 'number');
            SchemaAssertions.hasType(product.discountPercentage, 'number');
            SchemaAssertions.hasType(product.rating, 'number');
            SchemaAssertions.hasType(product.stock, 'number');
            SchemaAssertions.hasType(product.brand, 'string');
            SchemaAssertions.hasType(product.category, 'string');
            SchemaAssertions.hasType(product.thumbnail, 'string');
            SchemaAssertions.hasType(product.images, 'array');
        });

        test('should validate numeric field ranges', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.isPositive(product.id);
            SchemaAssertions.isNonNegative(product.price);
            SchemaAssertions.isInRange(product.discountPercentage, 0, 100);
            SchemaAssertions.isInRange(product.rating, 0, 5);
            SchemaAssertions.isNonNegative(product.stock);
            SchemaAssertions.isInteger(product.stock);
        });

        test('should validate string fields are not empty', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.isNotEmpty(product.title);
            SchemaAssertions.isNotEmpty(product.description);
            SchemaAssertions.isNotEmpty(product.brand);
            SchemaAssertions.isNotEmpty(product.category);
        });

        test('should validate URL formats', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.isValidUrl(product.thumbnail);

            product.images.forEach((imageUrl: string) => {
                SchemaAssertions.isValidUrl(imageUrl);
            });
        });

        test('should validate images array has items', async ({ apis }) => {
            const product = await apis.product.getProductById(1);

            SchemaAssertions.hasMinItems(product.images, 1);
        });
    });

    test.describe('POST /products/add - Created Product Schema', () => {
        test('should return created product matching schema', async ({ apis }) => {
            const newProduct = {
                title: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                discountPercentage: 10,
                rating: 4.5,
                stock: 50,
                brand: 'Test Brand',
                category: 'electronics',
                thumbnail: 'https://example.com/thumb.jpg',
                images: ['https://example.com/image1.jpg'],
            };

            const createdProduct = await apis.product.createProduct(newProduct);

            SchemaAssertions.matchesSchema(createdProduct, productSchema, 'created-product');
        });

        test('should have valid ID in created product', async ({ apis }) => {
            const newProduct = {
                title: 'Test Product',
                price: 49.99,
            };

            const createdProduct = await apis.product.createProduct(newProduct);

            SchemaAssertions.exists(createdProduct.id);
            SchemaAssertions.hasType(createdProduct.id, 'number');
            SchemaAssertions.isPositive(createdProduct.id);
        });
    });

    test.describe('PUT /products/{id} - Updated Product Schema', () => {
        test('should return updated product matching schema', async ({ apis }) => {
            const updateData = {
                title: 'Updated Product',
                price: 149.99,
            };

            const updatedProduct = await apis.product.updateProduct(1, updateData);

            SchemaAssertions.matchesSchema(updatedProduct, productSchema, 'updated-product');
        });

        test('should preserve product ID after update', async ({ apis }) => {
            const productId = 2;
            const updateData = { title: 'Updated Title' };

            const updatedProduct = await apis.product.updateProduct(productId, updateData);

            SchemaAssertions.equals(updatedProduct.id, productId);
        });
    });

    test.describe('DELETE /products/{id} - Deleted Product Schema', () => {
        test('should return deleted product with isDeleted flag', async ({ apis }) => {
            const deletedProduct = await apis.product.deleteProduct(1);

            SchemaAssertions.exists(deletedProduct.id);
            SchemaAssertions.exists(deletedProduct.isDeleted);
            SchemaAssertions.hasType(deletedProduct.isDeleted, 'boolean');
            SchemaAssertions.equals(deletedProduct.isDeleted, true);
        });
    });

    test.describe('Schema Validation Error Reporting', () => {
        test('should detect invalid product data', () => {
            const invalidProduct = {
                id: 'not-a-number',
                title: '',
                price: -50,
                rating: 10,
                stock: 'many',
            };

            const validation = schemaValidator.validate(invalidProduct, productSchema);

            expect(validation.valid).toBe(false);
            expect(validation.errors).toBeDefined();
            expect(validation.errors!.length).toBeGreaterThan(0);
        });

        test('should provide detailed errors for invalid data', () => {
            const invalidProduct = {
                id: 1,
                title: 'Valid Title',
                description: 'Valid Description',
                price: -100,
                discountPercentage: 150,
                rating: 6,
                stock: 10,
                brand: 'Brand',
                category: 'Category',
                thumbnail: 'not-a-url',
                images: [],
            };

            const errors = schemaValidator.getDetailedErrors(invalidProduct, productSchema);

            expect(errors.length).toBeGreaterThan(0);

            const errorPaths = errors.map((e) => e.path);
            expect(errorPaths).toContain('/price');
            expect(errorPaths).toContain('/discountPercentage');
            expect(errorPaths).toContain('/rating');
        });
    });

    test.describe('Multiple Products Validation', () => {
        test('should validate all products have consistent schema', async ({ apis }) => {
            const queryParams = { limit: 20 };
            const data = await apis.product.getProducts(queryParams);

            data.products.forEach((product: any, index: number) => {
                const validation = schemaValidator.validate(product, productSchema);

                if (!validation.valid) {
                    console.error(`Product at index ${index} failed:`, validation.errors);
                }

                expect(validation.valid).toBe(true);
            });
        });

        test('should validate prices are finite numbers', async ({ apis }) => {
            const queryParams = { limit: 10 };
            const data = await apis.product.getProducts(queryParams);

            data.products.forEach((product: any) => {
                SchemaAssertions.isFinite(product.price);
                SchemaAssertions.isNonNegative(product.price);
            });
        });

        test('should validate ratings are within valid range', async ({ apis }) => {
            const queryParams = { limit: 10 };
            const data = await apis.product.getProducts(queryParams);

            data.products.forEach((product: any) => {
                SchemaAssertions.isInRange(product.rating, 0, 5);
            });
        });
    });
});
