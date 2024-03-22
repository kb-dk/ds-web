module.exports = {
	root: true,
	env: {
		node: true,
		es2022: true,
	},
	extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/typescript/recommended', 'prettier'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'vue/multi-word-component-names': 'off',
		'prettier/prettier': 'error',
		semi: ['error', 'always'],
		'no-mixed-spaces-and-tabs': 'off',
	},
	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true,
			},
		},
		{
			files: ['vite.config.mts'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
};
