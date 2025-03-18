// Nombre del programa: Impulsa tu futuro
// Copyright (C) 2025 - Autores:
// Merino Peña Kevin Ariel
// Ortíz Montiel Diego Iain
// Rodríguez Dimayuga Laura Itzel
// Sosa Romo Juan Mario
// Vargas Campos Miguel Angel
//
// Este archivo se distribuye bajo los términos de la Licencia Pública General de GNU v3.
// Consulte <https://www.gnu.org/licenses/> para más detalles.

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
