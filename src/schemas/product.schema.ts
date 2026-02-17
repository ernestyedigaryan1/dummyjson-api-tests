export const productSchema = {
    type: 'object',
    required: [
        'id',
        'title',
        'description',
        'price',
        'discountPercentage',
        'rating',
        'stock',
        'category',
        'thumbnail',
        'images',
    ],
    properties: {
        id: {
            type: 'number',
            description: 'Product unique identifier',
            minimum: 1,
        },
        title: {
            type: 'string',
            description: 'Product title',
            minLength: 1,
            maxLength: 500,
        },
        description: {
            type: 'string',
            description: 'Product description',
            minLength: 1,
            maxLength: 5000,
        },
        category: {
            type: 'string',
            description: 'Product category',
            minLength: 1,
            maxLength: 100,
        },
        price: {
            type: 'number',
            description: 'Product price',
            minimum: 0,
        },
        discountPercentage: {
            type: 'number',
            description: 'Discount percentage',
            minimum: 0,
            maximum: 100,
        },
        rating: {
            type: 'number',
            description: 'Product rating',
            minimum: 0,
            maximum: 5,
        },
        stock: {
            type: 'integer',
            description: 'Stock quantity',
            minimum: 0,
        },
        tags: {
            type: 'array',
            description: 'Product tags',
            items: {
                type: 'string',
            },
        },
        brand: {
            type: 'string',
            description: 'Product brand',
            minLength: 1,
            maxLength: 200,
        },
        sku: {
            type: 'string',
            description: 'Stock keeping unit',
        },
        weight: {
            type: 'number',
            description: 'Product weight',
            minimum: 0,
        },
        dimensions: {
            type: 'object',
            description: 'Product dimensions',
            properties: {
                width: { type: 'number', minimum: 0 },
                height: { type: 'number', minimum: 0 },
                depth: { type: 'number', minimum: 0 },
            },
        },
        warrantyInformation: {
            type: 'string',
            description: 'Warranty information',
        },
        shippingInformation: {
            type: 'string',
            description: 'Shipping information',
        },
        availabilityStatus: {
            type: 'string',
            description: 'Availability status',
        },
        reviews: {
            type: 'array',
            description: 'Product reviews',
            items: {
                type: 'object',
                properties: {
                    rating: { type: 'number', minimum: 0, maximum: 5 },
                    comment: { type: 'string' },
                    date: { type: 'string' },
                    reviewerName: { type: 'string' },
                    reviewerEmail: { type: 'string', format: 'email' },
                },
            },
        },
        returnPolicy: {
            type: 'string',
            description: 'Return policy',
        },
        minimumOrderQuantity: {
            type: 'integer',
            description: 'Minimum order quantity',
            minimum: 1,
        },
        meta: {
            type: 'object',
            description: 'Metadata',
            properties: {
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                barcode: { type: 'string' },
                qrCode: { type: 'string' },
            },
        },
        images: {
            type: 'array',
            description: 'Array of product images',
            items: {
                type: 'string',
                format: 'uri',
            },
            minItems: 0,
        },
        thumbnail: {
            type: 'string',
            description: 'Product thumbnail URL',
            format: 'uri',
        },
    },
    additionalProperties: true,
};

export const productsListResponseSchema = {
    type: 'object',
    required: ['products', 'total', 'skip', 'limit'],
    properties: {
        products: {
            type: 'array',
            items: productSchema,
            minItems: 0,
        },
        total: {
            type: 'integer',
            minimum: 0,
            description: 'Total number of products',
        },
        skip: {
            type: 'integer',
            minimum: 0,
            description: 'Number of products skipped',
        },
        limit: {
            type: 'integer',
            minimum: 1,
            description: 'Maximum number of products returned',
        },
    },
    additionalProperties: false,
};
