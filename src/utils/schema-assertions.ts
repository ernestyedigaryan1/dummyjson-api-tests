import { expect } from '@playwright/test';
import { schemaValidator } from '@utils/schema.validator';

export class SchemaAssertions {
    static matchesSchema(data: unknown, schema: Record<string, any>, schemaName?: string): void {
        const validation = schemaValidator.validate(data, schema);

        if (!validation.valid) {
            const errorDetails = schemaValidator.getDetailedErrors(data, schema);
            console.error(
                `Schema validation failed for ${schemaName || 'schema'}:`,
                errorDetails.map((e) => `${e.path} [${e.keyword}]: ${e.message}`).join('\n'),
            );
        }

        expect(validation.valid).toBe(true);
    }

    static arrayItemsMatchSchema(
        items: unknown[],
        schema: Record<string, any>,
        schemaName?: string,
    ): void {
        expect(Array.isArray(items)).toBe(true);

        items.forEach((item, index) => {
            const validation = schemaValidator.validate(item, schema);

            if (!validation.valid) {
                const errorDetails = schemaValidator.getDetailedErrors(item, schema);
                console.error(
                    `Item at index ${index} failed ${schemaName || 'schema'} validation:`,
                    errorDetails,
                );
            }

            expect(validation.valid).toBe(true);
        });
    }

    static isInRange(value: number, min: number, max: number): void {
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
    }

    static isValidUrl(url: string): void {
        const urlRegex = /^https?:\/\/.+/;
        expect(url).toMatch(urlRegex);
    }

    static isPositive(value: number): void {
        expect(value).toBeGreaterThan(0);
    }

    static isNonNegative(value: number): void {
        expect(value).toBeGreaterThanOrEqual(0);
    }

    static isInteger(value: number): void {
        expect(Number.isInteger(value)).toBe(true);
    }

    static hasMinItems(items: unknown[], minItems: number): void {
        expect(items.length).toBeGreaterThanOrEqual(minItems);
    }

    static isNotEmpty(value: string | any[]): void {
        if (typeof value === 'string') {
            expect(value.length).toBeGreaterThan(0);
        } else if (Array.isArray(value)) {
            expect(value.length).toBeGreaterThan(0);
        }
    }

    static exists(value: unknown): void {
        expect(value).toBeDefined();
        expect(value).not.toBeNull();
    }

    static hasType(value: unknown, expectedType: string): void {
        if (expectedType === 'array') {
            expect(Array.isArray(value)).toBe(true);
        } else {
            expect(typeof value).toBe(expectedType);
        }
    }

    static isFinite(value: number): void {
        expect(Number.isFinite(value)).toBe(true);
    }

    static equals<T>(actual: T, expected: T): void {
        expect(actual).toBe(expected);
    }
}
