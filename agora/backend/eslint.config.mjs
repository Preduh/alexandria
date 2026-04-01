import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginSecurity from 'eslint-plugin-security';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginSecurity.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        // Default: camelCase
        {
          selector: 'default',
          format: ['camelCase'],
        },
        // Variables: camelCase, UPPER_CASE ou PascalCase (para constantes de Schema Zod/OpenAPI)
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // Parameters: permite leading underscore (padrão opcional de DI)
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Propriedades de classe: camelCase (sem obrigar underscore em private)
        {
          selector: 'classProperty',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Tipos e classes: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Importações: camelCase ou PascalCase
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
        // Propriedades de objeto literal: sem restrição (para suportar HTTP codes e content-type)
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
      ],
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
