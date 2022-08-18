module.exports = {
	chainWebpack: (config) => {
		config.plugin('define').tap((args) => {
			// eslint-disable-next-line
      let v = JSON.stringify(require("./package.json").version)
			args[0]['process.env']['VUE_APP_VERSION'] = process.env.NODE_ENV === 'production' ? v : '"DEVELOPMENT BUILD"';
			return args;
		});
	},

	publicPath: process.env.NODE_ENV === 'production' ? '/digisam/' : '/',
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
		},
	},
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
				@import "bootstrap/scss/functions.scss";
				@import "bootstrap/scss/mixins.scss";
				@import "bootstrap/scss/variables.scss";
				@import "@/assets/styles/generic/custom-variables.scss";
			`,
			},
		},
	},
};
