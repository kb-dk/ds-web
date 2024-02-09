module.exports = {
	chainWebpack: (config) => {
		config.module
			.rule('vue')
			.use('vue-loader')
			.tap((options) => ({
				...options,
				compilerOptions: {
					// treat any tag that starts with ion- as custom elements
					isCustomElement: (tag) => tag.startsWith('kb-') || tag.startsWith('media-'),
				},
			}));
		config.plugin('define').tap((args) => {
			// eslint-disable-next-line
			let v = JSON.stringify(require('./package.json').version);
			args[0]['process.env']['VUE_APP_VERSION'] = process.env.NODE_ENV === 'production' ? v : '"DEVELOPMENT BUILD"';
			return args;
		});
	},

	publicPath: process.env.NODE_ENV === 'production' ? '/dsweb/' : '/',
	assetsDir: 'static',
	devServer: {
		proxy: {
			'^/ds-api/search/': {
				target: process.env.DEVEL_API_SEARCH,
				pathRewrite: { '^/ds-api/search/': '' },
				changeOrigin: true,
			},
			'^/ds-api/record/': {
				target: process.env.DEVEL_API_RECORD,
				pathRewrite: { '^/ds-api/record/': '' },
				changeOrigin: true,
			},
			'^/ds-api/mlt/': {
				target: process.env.DEVEL_API_MLT,
				pathRewrite: { '^/ds-api/mlt/': '' },
				changeOrigin: true,
			},
			'^/ds-api/suggest/': {
				target: process.env.DEVEL_API_SUGGEST,
				pathRewrite: { '^/ds-api/suggest/': '' },
				changeOrigin: true,
			},
		},
	},
};
