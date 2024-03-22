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

		base: env.NODE_ENV === 'production' ? '/dsweb/' : '/',

		build: {
			outDir: 'dist',
			assetsDir: 'static',
		},

		server: {
			port: 3000,
			proxy: {
				'/ds-api/search/': {
					target: env.DEVEL_API_SEARCH,
					rewrite: (path) => path.replace(/^\/ds-api\/search\//, ''),
					changeOrigin: true,
				},
				'/ds-api/record/': {
					target: env.DEVEL_API_RECORD,
					rewrite: (path) => path.replace(/^\/ds-api\/record\//, ''),
					changeOrigin: true,
				},
				'/ds-api/mlt/': {
					target: env.DEVEL_API_MLT,
					rewrite: (path) => path.replace(/^\/ds-api\/mlt\//, ''),
					changeOrigin: true,
				},
				'/ds-api/suggest/': {
					target: env.DEVEL_API_SUGGEST,
					rewrite: (path) => path.replace(/^\/ds-api\/suggest\//, ''),
					changeOrigin: true,
				},
				'/ds-api/thumbnails/': {
					target: env.DEVEL_API_THUMBNAILS,
					rewrite: (path) => path.replace(/^\/ds-api\/thumbnails\//, ''),
					changeOrigin: true,
				},
			},
		},
	});
};
