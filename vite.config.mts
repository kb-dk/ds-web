import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return defineConfig({
		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.startsWith('kb-') || tag.startsWith('media-'),
					},
				},
			}),
			eslint(),
		],

		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
			},
		},

		base: '/' + env.APP_BASE_PATH,

		build: {
			outDir: 'dist',
			assetsDir: 'static',
		},

		server: {
			port: 3000,
			proxy: {
				'/ds-api/bff/': {
					target: env.DEVEL_API_BFF,
					rewrite: (path) => path.replace(/^\/ds-api\/bff\//, ''),
					changeOrigin: true,
				},
			},
		},
	});
};
