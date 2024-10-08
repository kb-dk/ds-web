<template>
	<div class="app">
		<div
			v-if="isDevelopment()"
			class="test-env"
		>
			This is a
			<span>{{ returnCurrentEnv() }}</span>
			environment
		</div>
		<Notifier></Notifier>
		<Spinner></Spinner>
		<Header :locale="currentLocale"></Header>
	</div>
	<div class="content">
		<router-view v-slot="{ Component }">
			<transition
				:name="transitionName || 'fade'"
				:duration="transitionName === 'swipe' ? { enter: td * 1000, leave: td * 1000 } : 500"
				mode="out-in"
				@before-leave="onBeforeLeave(transitionName)"
				@before-enter="onBeforeEnter(transitionName)"
			>
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
	<div
		ref="wipe"
		class="wipe"
	>
		<img
			title="Royal Danish Library"
			alt="Logo of the Royal Danish Library"
			:src="getImgServerSrcURL()"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onBeforeMount, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import gsap from 'gsap';
import Notifier from '@/components/global/notification/Notifier.vue';
import Spinner from '@/components/global/spinner/Spinner.vue';
import { LocalStorageWrapper } from './utils/local-storage-wrapper';
import Footer from '@/components/global/nav/Footer.vue';
import Header from '@/components/search/Header.vue';
import { useAuthStore } from '@/store/authStore';
import '@/components/global/nav/wc-header-menu';
import { APIService } from '@/api/api-service';
import { APIAuthMessagesType } from '@/types/APIResponseTypes';

export default defineComponent({
	name: 'App',
	components: {
		Notifier,
		Spinner,
		Footer,
		Header,
	},
	setup() {
		const td = ref(0.4);
		let leaveDone = false;
		let currentLocale = ref('da');
		const transitionName = ref('fade');
		const wipe = ref<HTMLElement | null>(null);
		const router = useRouter();
		const route = useRoute();
		const { locale, t } = useI18n({ useScope: 'global' });
		const authStore = useAuthStore();

		const html = document.querySelector('html');
		html?.setAttribute('lang', 'da');

		const gotoPath = (e: Event) => {
			e.preventDefault();
			changePath(e as CustomEvent);
		};

		const changePath = (e: CustomEvent) => {
			if (e.detail.name) {
				router.push({ name: e.detail.name });
			} else {
				router.push({ path: e.detail.path });
			}
		};

		const switchLocale = (e: Event) => {
			e.preventDefault();
			locale.value = currentLocale.value = locale.value === 'da' ? 'en' : 'da';
			const html = document.querySelector('html');
			html?.setAttribute('lang', locale.value);
			LocalStorageWrapper.set('locale', locale.value);
			const routeQueries = { ...route.query };
			routeQueries.locale = currentLocale.value;
			router.replace({ query: routeQueries });
		};

		const getImgServerSrcURL = () => {
			return new URL(`@/assets/images/crown.png`, import.meta.url).href;
		};

		const onBeforeLeave = (transitionName: string) => {
			if (transitionName !== 'swipe') {
				return;
			}
			gsap.set(wipe.value, { clipPath: 'polygon(0% 0%,0% 0%,0% 0%,0% 0%,0% 0%,0% 0%)' });
			gsap.to(wipe.value, {
				clipPath: 'polygon(100% 0%,0% 0%,0% 0%,0% 100%,0% 100%,100% 0%)',
				duration: td.value / 2,
				ease: 'linear',
				overwrite: true,
				onComplete: () => {
					gsap.to(wipe.value, {
						clipPath: 'polygon(100% 0%,0% 0%,0% 0%,0% 100%,100% 100%,100% 100%)',
						duration: td.value / 2,
						ease: 'linear',
						overwrite: true,
					});
					leaveDone = true;
				},
			});
		};

		const onBeforeEnter = (transitionName: string) => {
			if (transitionName !== 'swipe' || !leaveDone) {
				return;
			}
			gsap.to(wipe.value, {
				duration: td.value / 2,
				overwrite: true,
				clipPath: 'polygon(100% 0%,100% 0%,0% 100%,0% 100%,100% 100%,100% 100%)',
				ease: 'linear',
				onComplete: () => {
					gsap.to(wipe.value, {
						clipPath: 'polygon(100% 100%,100% 100%,100% 100%,100% 100%,100% 100%,100% 100%)',
						duration: td.value / 2,
						ease: 'linear',
						overwrite: true,
					});
					leaveDone = false;
				},
			});
		};

		router.beforeEach((to, from) => {
			if (from.name === 'Search' && to.name === 'Record') {
				transitionName.value = 'from-search-to-record';
			} else if (from.name === 'Record' && to.name === 'Search') {
				transitionName.value = 'from-record-to-search';
			} else if (from.name === 'Home' && to.name === 'Search') {
				transitionName.value = 'from-record-to-search';
			} else if (from.name === 'Search' && to.name === 'Home') {
				transitionName.value = 'from-record-to-search';
			} else if (from.name === 'Record' && to.name === 'Home') {
				transitionName.value = 'from-record-to-search';
			} else if (from.name === 'Home' && to.name === 'Record') {
				transitionName.value = 'from-search-to-record';
			} else {
				transitionName.value = 'swipe';
			}
		});

		onMounted(async () => {
			//for now, we set the title of the app to the archive. Can be changed if we ever go portal-mode.
			document.title = t('app.titles.frontpage.archive.name') as string;

			// we try to get the kaltura conf id's here. we got some backup ones from aegis, and they're
			// fallback if we can't get these. But if the bff backend has some, we use them instead

			Promise.race([APIService.getKalturaConfIds(), new Promise((_, reject) => setTimeout(() => reject(), 5000))])
				.then((response) => {
					const typedResponse = response as APIAuthMessagesType; // Assert the correct type
					authStore.partnerId = typedResponse.data.partnerId;
					authStore.audioUiConfId = typedResponse.data.AudioUiConfId;
					authStore.videoUiConfId = typedResponse.data.videoUiConfId;
					authStore.streamingBaseUrlAudio = typedResponse.data.streamingBaseUrlAudio;
					authStore.streamingBaseUrlVideo = typedResponse.data.streamingBaseUrlVideo;
					authStore.kalturaIdFetchExecuted = true;
				})
				.catch(() => {
					authStore.kalturaIdFetchExecuted = true;
				});

			await router.isReady();
			const hasLocaleParam = Object.prototype.hasOwnProperty.call(route.query, 'locale');
			const storedLocale = LocalStorageWrapper.get('locale') as string;
			if (hasLocaleParam) {
				const localeFromURL = route.query.locale;
				// Just a safeguard aginst somebody trying to inject an unknown query
				currentLocale.value = localeFromURL === 'da' || localeFromURL === 'en' ? localeFromURL : 'da';
				locale.value = currentLocale.value;
			} else if (storedLocale) {
				locale.value = storedLocale;
				currentLocale.value = storedLocale;
			} else {
				locale.value = 'da';
				currentLocale.value = 'da';
			}
		});

		const isDevelopment = () => {
			return import.meta.env.MODE !== 'production';
		};

		const returnCurrentEnv = () => {
			return import.meta.env.MODE;
		};

		onBeforeMount(() => {
			window.addEventListener('locale-switch', switchLocale);
			window.addEventListener('change-path', gotoPath);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('locale-switch', switchLocale);
			window.removeEventListener('change-path', gotoPath);
		});

		return {
			td,
			leaveDone,
			currentLocale,
			wipe,
			transitionName,
			getImgServerSrcURL,
			onBeforeEnter,
			onBeforeLeave,
			isDevelopment,
			returnCurrentEnv,
		};
	},
});
</script>

<style lang="scss">
.result-enter-active,
.result-leave-active {
	transition: all 0.15s ease-in-out;
}

.result-enter {
	transition-delay: 0.15s;
}

.app {
	position: relative;
}

.result-enter-from,
.result-leave-to {
	opacity: 0;
	transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.test-env {
	text-transform: uppercase;
	position: sticky;
	height: 30px;
	line-height: 30px;
	font-size: 16px;
	color: white;
	top: 0px;
	left: 0px;
	width: 100%;
	z-index: 5;
	text-align: center;
	background: #002e70;

	span {
		border-bottom: 1px solid white;
	}
}

.from-record-to-search-enter-active,
.from-record-to-search-leave-active {
	transition: all 0.25s linear;
}

.from-record-to-search-enter-from {
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

.from-record-to-search-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.from-record-to-search-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
}

.from-record-to-search-leave-to {
	margin-top: 50px;
	opacity: 0;
	position: relative;
}
.from-record-to-search-leave-active,
.from-search-to-record-enter-active {
	z-index: 1000;
}

.from-search-to-record-enter-active,
.from-search-to-record-leave-active {
	transition: all 0.25s linear;
	position: relative;
}

.from-search-to-record-enter-from {
	margin-top: 50px;
	opacity: 0;
	position: absolute;
}

.from-search-to-record-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.from-search-to-record-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
}

.from-search-to-record-leave-to {
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

/* This probably shouldn't be here. We need a place for global styles at some point i guess */
@font-face {
	font-family: 'noway';
	font-style: normal;
	font-weight: 400;
	src: url('./assets/fonts/noway-regular-webfont.woff2') format('woff2');
}

@font-face {
	font-family: 'noway';
	font-style: normal;
	font-weight: 700;
	src: url('./assets/fonts/noway-medium-webfont.woff2') format('woff2');
}

@font-face {
	font-family: 'LibreBaskerville';
	src: url('./assets/fonts/LibreBaskerville-Bold.ttf') format('truetype');
	font-weight: bold;
}

@font-face {
	font-family: 'LibreBaskerville';
	src: url('./assets/fonts/LibreBaskerville-Italic.ttf') format('truetype');
	font-style: italic;
}

@font-face {
	font-family: 'LibreBaskerville';
	src: url('./assets/fonts/LibreBaskerville-Regular.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}

body {
	margin: 0;
	padding: 0;
	overscroll-behavior: none;
	overflow-x: hidden;
}

.remove-body-scroll {
	max-height: 100%;
	overflow: hidden;
}

@media (min-width: 640px) {
	.remove-body-scroll {
		max-height: initial;
		overflow: initial;
	}
}

.wipe {
	opacity: 1;
	pointer-events: none;
	z-index: 50;
	top: 0;
	margin: 0;
	left: 0;
	padding: 0;
	position: fixed;
	width: 100vw;
	height: 100vh;
	clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%);
	display: flex;
	justify-content: center;
	align-content: center;
	flex-wrap: wrap;
	background-color: #002e70;
}

nav {
	flex-basis: 0;
	flex-grow: 1;
	max-width: 100%;
	position: relative;
	width: 100%;
	padding-right: 12px;
	padding-left: 12px;
	box-sizing: border-box;
}

#app {
	font-family: noway, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	overflow-x: hidden;
}

.content {
	position: relative;
	background-color: white;
}

@media (min-width: 1280px) {
	.content {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
}

.lang-switcher {
	float: right;
}

/* custom scrollbar */
/* We remove this for now. */
/* ::-webkit-scrollbar {
	width: 20px;
}

::-webkit-scrollbar-track {
	background-color: rgb(238, 238, 238);
}

::-webkit-scrollbar-thumb {
	background-color: rgb(120, 120, 120);
	border-radius: 20px;
	border: 6px solid transparent;
	background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
	background-color: rgb(160, 160, 160);
} */
</style>
