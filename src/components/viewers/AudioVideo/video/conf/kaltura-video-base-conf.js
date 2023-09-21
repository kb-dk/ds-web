const KalturaVideoBaseConfig = {
	plugins: {},
	playback: {
		audioLanguage: '',
		textLanguage: '',
		useNativeTextTrack: false,
		volume: 1,
		startTime: 0,
		playsinline: true,
		preload: 'none',
		autoplay: false,
		allowMutedAutoPlay: true,
		muted: false,
	},
	log: {
		level: 'DEBUG',
	},
	text: {
		useNativeTextTrack: false,
	},
};

export { KalturaVideoBaseConfig };
