type JsonSchema = Record<string, any>;

export interface ValidationResult {
    valid: boolean;
    errors?: string[];
}

export interface DetailedValidationError {
    path: string;
    keyword: string;
    message: string;
    expected?: string;
    actual?: string;
}

export class SchemaValidator {
    validate(data: unknown, schema: JsonSchema): ValidationResult {
        try {
            const errors = this.validateValue(data, schema, '');

            if (errors.length > 0) {
                return {
                    valid: false,
                    errors: errors.map((e) => `${e.path || 'root'} ${e.keyword}: ${e.message}`),
                };
            }

            return { valid: true };
        } catch (error) {
            return {
                valid: false,
                errors: [error instanceof Error ? error.message : 'Unknown validation error'],
            };
        }
    }

    getDetailedErrors(data: unknown, schema: JsonSchema): DetailedValidationError[] {
        try {
            return this.validateValue(data, schema, '');
        } catch (error) {
            return [
                {
                    path: 'root',
                    keyword: 'error',
                    message: error instanceof Error ? error.message : 'Unknown validation error',
                },
            ];
        }
    }

    private validateValue(
        data: unknown,
        schema: JsonSchema,
        path: string,
    ): DetailedValidationError[] {
        const errors: DetailedValidationError[] = [];

        if (schema.type) {
            const typeError = this.validateType(data, schema.type, path);
            if (typeError) {
                errors.push(typeError);
                return errors;
            }
        }

        if (data === null || data === undefined) {
            return errors;
        }

        if (typeof data === 'string') {
            errors.push(...this.validateString(data, schema, path));
        }

        if (typeof data === 'number') {
            errors.push(...this.validateNumber(data, schema, path));
        }

        if (Array.isArray(data)) {
            errors.push(...this.validateArray(data, schema, path));
        }

        if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
            errors.push(...this.validateObject(data as Record<string, any>, schema, path));
        }

        return errors;
    }

    private validateType(
        data: unknown,
        expectedType: string,
        path: string,
    ): DetailedValidationError | null {
        const actualType = this.getType(data);

        if (expectedType === 'integer') {
            if (typeof data !== 'number' || !Number.isInteger(data)) {
                return {
                    path: path || 'root',
                    keyword: 'type',
                    message: `should be integer`,
                    expected: 'integer',
                    actual: actualType,
                };
            }
            return null;
        }

        if (actualType !== expectedType) {
            return {
                path: path || 'root',
                keyword: 'type',
                message: `should be ${expectedType}`,
                expected: expectedType,
                actual: actualType,
            };
        }

        return null;
    }

    private validateString(
        value: string,
        schema: JsonSchema,
        path: string,
    ): DetailedValidationError[] {
        const errors: DetailedValidationError[] = [];

        if (schema.minLength !== undefined && value.length < schema.minLength) {
            errors.push({
                path,
                keyword: 'minLength',
                message: `should have at least ${schema.minLength} characters`,
                expected: `>= ${schema.minLength}`,
                actual: `${value.length}`,
            });
        }

        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
            errors.push({
                path,
                keyword: 'maxLength',
                message: `should have at most ${schema.maxLength} characters`,
                expected: `<= ${schema.maxLength}`,
                actual: `${value.length}`,
            });
        }

        if (schema.pattern !== undefined) {
            const regex = new RegExp(schema.pattern);
            if (!regex.test(value)) {
                errors.push({
                    path,
                    keyword: 'pattern',
                    message: `should match pattern ${schema.pattern}`,
                    expected: schema.pattern,
                    actual: value,
                });
            }
        }

        if (schema.format !== undefined) {
            const formatError = this.validateFormat(value, schema.format, path);
            if (formatError) {
                errors.push(formatError);
            }
        }

        if (schema.enum !== undefined && !schema.enum.includes(value)) {
            errors.push({
                path,
                keyword: 'enum',
                message: `should be one of [${schema.enum.join(', ')}]`,
                expected: `[${schema.enum.join(', ')}]`,
                actual: value,
            });
        }

        return errors;
    }

    private validateNumber(
        value: number,
        schema: JsonSchema,
        path: string,
    ): DetailedValidationError[] {
        const errors: DetailedValidationError[] = [];

        if (schema.minimum !== undefined && value < schema.minimum) {
            errors.push({
                path,
                keyword: 'minimum',
                message: `should be >= ${schema.minimum}`,
                expected: `>= ${schema.minimum}`,
                actual: String(value),
            });
        }

        if (schema.exclusiveMinimum !== undefined && value <= schema.exclusiveMinimum) {
            errors.push({
                path,
                keyword: 'exclusiveMinimum',
                message: `should be > ${schema.exclusiveMinimum}`,
                expected: `> ${schema.exclusiveMinimum}`,
                actual: String(value),
            });
        }

        if (schema.maximum !== undefined && value > schema.maximum) {
            errors.push({
                path,
                keyword: 'maximum',
                message: `should be <= ${schema.maximum}`,
                expected: `<= ${schema.maximum}`,
                actual: String(value),
            });
        }

        if (schema.exclusiveMaximum !== undefined && value >= schema.exclusiveMaximum) {
            errors.push({
                path,
                keyword: 'exclusiveMaximum',
                message: `should be < ${schema.exclusiveMaximum}`,
                expected: `< ${schema.exclusiveMaximum}`,
                actual: String(value),
            });
        }

        if (schema.enum !== undefined && !schema.enum.includes(value)) {
            errors.push({
                path,
                keyword: 'enum',
                message: `should be one of [${schema.enum.join(', ')}]`,
                expected: `[${schema.enum.join(', ')}]`,
                actual: String(value),
            });
        }

        return errors;
    }

    private validateArray(
        value: any[],
        schema: JsonSchema,
        path: string,
    ): DetailedValidationError[] {
        const errors: DetailedValidationError[] = [];

        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push({
                path,
                keyword: 'minItems',
                message: `should have at least ${schema.minItems} items`,
                expected: `>= ${schema.minItems}`,
                actual: `${value.length}`,
            });
        }

        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            errors.push({
                path,
                keyword: 'maxItems',
                message: `should have at most ${schema.maxItems} items`,
                expected: `<= ${schema.maxItems}`,
                actual: `${value.length}`,
            });
        }

        if (schema.items !== undefined) {
            value.forEach((item, index) => {
                const itemPath = `${path}[${index}]`;
                const itemErrors = this.validateValue(item, schema.items, itemPath);
                errors.push(...itemErrors);
            });
        }

        return errors;
    }

    private validateObject(
        obj: Record<string, any>,
        schema: JsonSchema,
        path: string,
    ): DetailedValidationError[] {
        const errors: DetailedValidationError[] = [];

        if (schema.required && Array.isArray(schema.required)) {
            for (const requiredProp of schema.required) {
                if (!(requiredProp in obj)) {
                    errors.push({
                        path: path ? `${path}/${requiredProp}` : `/${requiredProp}`,
                        keyword: 'required',
                        message: `is required`,
                        expected: requiredProp,
                        actual: 'undefined',
                    });
                }
            }
        }

        if (schema.properties && typeof schema.properties === 'object') {
            for (const [propName, propSchema] of Object.entries(schema.properties)) {
                if (propName in obj) {
                    const propPath = path ? `${path}/${propName}` : `/${propName}`;
                    const propErrors = this.validateValue(
                        obj[propName],
                        propSchema as JsonSchema,
                        propPath,
                    );
                    errors.push(...propErrors);
                }
            }
        }

        if (schema.additionalProperties === false && schema.properties) {
            for (const key of Object.keys(obj)) {
                if (!(key in schema.properties)) {
                    errors.push({
                        path: path ? `${path}/${key}` : `/${key}`,
                        keyword: 'additionalProperties',
                        message: `should not have additional property '${key}'`,
                        expected: 'none',
                        actual: key,
                    });
                }
            }
        }

        return errors;
    }

    private validateFormat(
        value: string,
        format: string,
        path: string,
    ): DetailedValidationError | null {
        const formats: Record<string, RegExp> = {
            uri: /^https?:\/\/.+/,
            url: /^https?:\/\/.+/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^\d{2}:\d{2}:\d{2}/,
            'date-time': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
        };

        const regex = formats[format];
        if (regex && !regex.test(value)) {
            return {
                path,
                keyword: 'format',
                message: `should be a valid ${format}`,
                expected: format,
                actual: value,
            };
        }

        return null;
    }

    private getType(value: unknown): string {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }
}

export const schemaValidator = new SchemaValidator();
