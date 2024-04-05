//Types from https://github.com/kaltura/kaltura-player-js/blob/master/ts-typed/player.d.ts
export interface PlayerType {
	dimensions: { width: number; height: number };
	attachMediaSource(): void;
	detachMediaSource(): void;
	getActiveTracks(): { video: { width: number; height: number } };
	pause(): void;
	play(): void;
	isLive: () => boolean;
	isDvr: () => boolean;
	isImage: () => boolean;
	dispatchEvent(event: FakeEvent): boolean;
	seekToLiveEdge(): void;
	destroy(): void;
	reset(): void;
	registerService(name: string, service: object): void;
	hasService(name: string): boolean;
	getService(name: string): object;
	getView: () => Node;
	getMediaInfo: () => any;
	paused: boolean;
	seeking: boolean;
	isOnLiveEdge: () => boolean;
	loadMedia: (mediaInfo: KalturaPlayerTypes.MediaInfo, mediaOptions?: KalturaPlayerTypes.Sources) => Promise<any>;
	setMedia: (options: any) => void;
	getVideoElement(): HTMLVideoElement;
	addEventListener(type: string, listener: CoreEventListener): void;
	removeEventListener: (type: string, listener: CoreEventListener) => void;
	Event: Record<string, any>;
	Error: Record<string, any>;
	currentTime: number;
	playbackRate: number;
	duration: number;
	ended: boolean;
	env: KalturaPlayerTypes.Env;
	ui: any;
	config: KalturaPlayerTypes.PlayerConfig;
	provider: any;
	engineType: string;
	cuePointManager: KalturaPlayerTypes.CuePointManager;
	ready: () => Promise<any>;
	sources: KalturaPlayerTypes.Sources;
	src?: string;
	poster?: string;
	getThumbnail: (time: number) => {
		height: number;
		url: string;
		width: number;
		x: number;
		y: number;
	};
	shouldAddKs: () => boolean;
	updateKalturaPoster(
		playerSources: PKSourcesConfigObject,
		mediaSources: ProviderMediaConfigSourcesObject,
		dimensions: object,
	);
	playlist: KalturaPlayerTypes.Playlist;
	getTracks: (trackType: string) => Array<any>;
	Track: Record<string, string>;
	MediaType: Record<string, string>;
}

//Types from https://github.com/kaltura/kaltura-player-js/blob/master/ts-typed/kaltura-player.d.ts
export interface KalturaPlayerType {
	providers: {
		RequestBuilder: any;
		ResponseTypes: any;
		ProviderParser: any;
	};
	ui: {
		Event: {
			withEventManager: any;
		};
		EventType: Record<string, string>;
		redux: {
			connect: (...args: any) => any;
			useSelector: (...args: any) => any;
		};
		createPortal: (children: any, domElement: HTMLElement) => preact.VNode<any>;
		utils: {
			getLogger: (name: string) => KalturaPlayerTypes.Logger;
			KeyMap: Record<string, number>;
			toHHMMSS: (seconds: number) => string;
		};
		components: {
			SeekBarPlaybackContainer: any;
			Overlay: any;
			withPlayer: any;
			Tooltip: any;
			Icon: any;
			IconType: any;
			IconState: any;
			PLAYER_SIZE: Record<string, string>;
			Remove: string;
			Settings: {
				displayName: string;
			};
			PrevNext: any;
			PrePlaybackPlayOverlay: any;
		};
		style: any;
		preactHooks: any;
		preacti18n: any;
	};
	core: {
		EventType: Record<string, string>;
		FakeEvent: any;
		FakeEventTarget: {
			new (...args: any[]): KalturaPlayerTypes.FakeEventTarget;
		};
		Error: any;
		StateType: Record<string, string>;
		MediaType: Record<string, string>;
		registerPlugin(name: string, component: any): void;
		BasePlugin: {
			new (...args: any[]): KalturaPlayerTypes.BasePlugin;
		};
		BaseMiddleware: {
			new (): KalturaPlayerTypes.BaseMiddleware;
		};
		FakeEventTarget: {
			new (): KalturaPlayerTypes.FakeEventTarget;
		};
		utils: {
			Object: {
				mergeDeep(target: Record<string, any>, ...sources: Record<string, any>[]);
			};
		};
	};
	cuepoint: { [key: string]: string };
	getPlayer(targetId?: string): any;
	setup(options: any): KalturaPlayer;
}
