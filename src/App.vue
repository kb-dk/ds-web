<template>
	<div class="app">
		<div
			v-if="!isProduction()"
			class="test-env"
		>
			<span class="w">⚠</span>
			This is a
			<span>{{ returnCurrentEnv() }}</span>
			environment
			<span class="w">⚠</span>
		</div>
		<Notifier></Notifier>
		<Spinner></Spinner>
		<kb-menu
			:vueRouting="true"
			:locale="currentLocale"
		></kb-menu>
		<div
			class="wipe"
			ref="wipe"
		>
			<img
				title="Royal Danish Library"
				alt="Logo of the Royal Danish Library"
				:src="getImgServerSrcURL()"
			/>
		</div>
	</div>
	<div class="content">
		<router-view v-slot="{ Component }">
			<transition
				:name="transitionName || 'fade'"
				:duration="transitionName === 'swipe' ? { enter: td * 1000, leave: td * 1000 } : undefined"
				@before-leave="onBeforeLeave(transitionName)"
				@before-enter="onBeforeEnter(transitionName)"
				mode="out-in"
			>
				<component :is="Component" />
			</transition>
		</router-view>
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

import '@/components/global/nav/wc-header-menu';

export default defineComponent({
	name: 'App',
	components: {
		Notifier,
		Spinner,
		Footer,
	},
	setup() {
		const td = ref(0.4);
		let leaveDone = false;
		let currentLocale = ref('da');
		const transitionName = ref('fade');
		const wipe = ref<HTMLElement | null>(null);
		const router = useRouter();
		const route = useRoute();
		const { locale } = useI18n({ useScope: 'global' });

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
			if (from.name === 'Home' && to.name === 'Record') {
				transitionName.value = 'from-search-to-record';
			} else if (from.name === 'Record' && to.name === 'Home') {
				transitionName.value = 'from-record-to-search';
			} else {
				transitionName.value = 'swipe';
			}
			console.log(transitionName.value, 'transition');
		});

		onMounted(async () => {
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

		const isProduction = () => {
			return import.meta.env.MODE === 'production';
		};

		const returnCurrentEnv = () => {
			return import.meta.env.MODE;
		};

		onBeforeMount(() => {
			//Remember to check for init locale once we now where to get it from
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
			isProduction,
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
	font-size: 20px;
	color: #002e70;
	top: 0px;
	left: 0px;
	width: 100%;
	z-index: 1000;
	text-align: center;
	background-image: radial-gradient(circle 674px at 50% 50%, rgba(139, 186, 244, 1) 3.4%, rgba(15, 51, 92, 1) 86.6%);

	.w,
	span {
		color: red;
		font-weight: bold;
	}
}

.from-record-to-search-enter-active,
.from-record-to-search-leave-active {
	transition: all 0.25s linear;
}

.from-record-to-search-enter-from {
	//transform: scale(0.9);
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

.from-record-to-search-enter-to {
	//transform: scale(1);
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.from-record-to-search-leave-from {
	//transform: scale(1);
	top: 0px;
	opacity: 1;
	position:relative;
}

.from-record-to-search-leave-to {
	//transform: scale(0.9);
	margin-top: 50px;
	opacity: 0;
	position:relative;
}
.from-record-to-search-leave-active,
.from-search-to-record-enter-active {
	z-index:1000;
}

.from-search-to-record-enter-active,
.from-search-to-record-leave-active {
	transition: all .25s linear;
	position: relative;
}

.from-search-to-record-enter-from {
	//transform: scale(0.9);
	margin-top: 50px;
	opacity: 0;
	position: absolute;
}

.from-search-to-record-enter-to {
	//transform: scale(1);
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.from-search-to-record-leave-from {
	//transform: scale(1);
	top: 0px;
	opacity: 1;
	position: relative;
}

.from-search-to-record-leave-to {
	//transform: scale(0.9);
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
	//transform: translateX(-100%);
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
	//font-family: Avenir, Helvetica, Arial, sans-serif;
	font-family: noway, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

#nav {
	padding: 30px;
	display: flex;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}

.content {
	position: relative;
	background-color: white;
	//z-index: 2
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
::-webkit-scrollbar {
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
}
</style>
