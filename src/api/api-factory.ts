import { ProductApi } from '@api/resources/product.api';
import type { APIRequestContext } from '@playwright/test';

export class ApiFactory {
    constructor(private readonly request: APIRequestContext) {}

    get product(): ProductApi {
        return new ProductApi(this.request);
    }
}
