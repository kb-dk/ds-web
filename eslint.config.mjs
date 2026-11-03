import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import prettierRecommended from '@vue/eslint-config-prettier';

export default defineConfigWithVueTs(
	{
		ignores: ['dist/**', 'src/assets/js/*.js'],
	},
	js.configs.recommended,
	pluginVue.configs['flat/recommended'],
	vueTsConfigs.recommended,
	prettierRecommended,
	{
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
			'vue/multi-word-component-names': 'off',
			'prettier/prettier': 'error',
			semi: ['error', 'always'],
			'no-mixed-spaces-and-tabs': 'off',
			// Keep the rule set from before the ESLint 10 migration; newer plugin versions made these stricter.
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],
			'@typescript-eslint/no-unused-expressions': 'off',
			'prefer-const': 'off',
			'no-useless-assignment': 'off',
			'vue/no-reserved-component-names': 'off',
			'vue/require-toggle-inside-transition': 'off',
			'vue/no-required-prop-with-default': 'off',
		},
	},
	{
		files: ['vite.config.mts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
);
