import { test as base } from '@playwright/test';
import { ApiFactory } from '@api/api-factory';

export const test = base.extend<{
    apis: ApiFactory;
}>({
    apis: async ({ request }, use) => {
        const api = new ApiFactory(request);
        await use(api);
    },
});

export const expect = test.expect;
