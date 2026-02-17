import { env } from '@env';
import { BaseApi, QueryParams } from '@api/base.api';
import { APIRequestContext } from '@playwright/test';

export class ProductApi extends BaseApi {
    constructor(request: APIRequestContext) {
        super(request, env.BASE_URL);
    }

    async getProducts(limits?: QueryParams): Promise<any> {
        return this.get('/products', limits);
    }

    async getProductById(id: number): Promise<any> {
        return this.get(`/products/${id}`);
    }

    async createProduct(data: any): Promise<any> {
        return this.post('/products/add', data);
    }

    async updateProduct(id: number, data: any): Promise<any> {
        return this.put(`/products/${id}`, data);
    }

    async updateProductViaPatch(id: number, data: any): Promise<any> {
        return this.patch(`/products/${id}`, data);
    }

    async deleteProduct(id: number): Promise<any> {
        return this.delete(`/products/${id}`);
    }
}
