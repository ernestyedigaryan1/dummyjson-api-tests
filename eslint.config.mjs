import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores(['allure-report/', '**/*.mjs']),
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    prettierConfig,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
        // ignores: ['allure-report/*'],
    },
);
