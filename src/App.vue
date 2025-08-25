<template>
	<header
		:aria-label="`${route.name as string} header`"
		class="header"
	>
		<a
			href="#main-content"
			class="skip-link"
		>
			{{ t('app.skip') }}
		</a>
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
	</header>
	<main
		id="main-content"
		class="content"
	>
		<router-view v-slot="{ Component }">
			<transition
				:name="transitionName || 'fade'"
				:duration="{ enter: 500, leave: 500 }"
				mode="out-in"
			>
				<component :is="Component" />
			</transition>
		</router-view>
	</main>
	<Footer />
</template>

<script lang="ts">
import { defineComponent, inject, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Notifier from '@/components/global/notification/Notifier.vue';
import Spinner from '@/components/global/spinner/Spinner.vue';
import { LocalStorageWrapper } from '@/utils/local-storage-wrapper';
import Footer from '@/components/global/nav/Footer.vue';
import Header from '@/components/search/Header.vue';
import { useAuthStore } from '@/store/authStore';
import { APIService } from '@/api/api-service';
import { APIAuthMessagesType, APISearchResponseType } from '@/types/APIResponseTypes';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { Priority, Severity } from '@/types/NotificationType';

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
		const router = useRouter();
		const route = useRoute();
		const { locale, t } = useI18n({ useScope: 'global' });
		const authStore = useAuthStore();
		const searchResultStore = useSearchResultStore();
		const errorManager = inject('errorManager') as ErrorManagerType;

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

		router.beforeEach((to, from) => {
			if (from.name === 'Search' && to.name === 'Record') {
				transitionName.value = 'search-to-record';
			} else if (from.name === 'Record' && to.name === 'Search') {
				transitionName.value = 'record-to-search';
			} else if (from.name === 'Home' && to.name === 'Search') {
				transitionName.value = 'home-to-search';
			} else if (from.name === 'Search' && to.name === 'Home') {
				transitionName.value = 'record-to-search';
			} else if (from.name === 'Record' && to.name === 'Home') {
				transitionName.value = 'record-to-search';
			} else if (from.name === 'Home' && to.name === 'Record') {
				transitionName.value = 'search-to-record';
			} else if (from.name === 'Record' && to.name === 'Record') {
				transitionName.value = 'search-to-record';
			} else {
				//Just a fix for now - we need a talk about transitions.
				transitionName.value = 'home-to-search';
			}
		});

		onMounted(async () => {
			//for now, we set the title of the app to the archive. Can be changed if we ever go portal-mode.
			document.title = t('app.titles.frontpage.archive.name') as string;

			// we try to get the kaltura conf id's here. we got some backup ones from aegis, and they're
			// fallback if we can't get these. But if the bff backend has some, we use them instead
			watch(
				() => authStore.firstAuthDone,
				(newVal: boolean) => {
					if (newVal) {
						// ask for facets
						const facetAPICall = APIService.getFullResultWithFacets();
						let facetAPiCallFurfilled = false;
						// timeout promise for long responsetimes. (7 seconds pt.)
						const maximumWaitTime = new Promise<void>((resolve) => {
							setTimeout(() => {
								// if the api promise was not furfilled yet, we tell people to wait a bit longer
								if (!facetAPiCallFurfilled) {
									errorManager.submitCustomError(
										'long-response',
										t('facets.slowResponse.title'),
										t('facets.slowResponse.text'),
										Severity.INFO,
										false,
										Priority.MEDIUM,
									);
								}
								resolve();
							}, 7000);
						});
						// promise race - first one back wins
						Promise.race([facetAPICall, maximumWaitTime])
							.then((response) => {
								if (response) {
									//if api comes back first, we get the results and set our boolean to true.
									const typedResponse = response as APISearchResponseType;
									searchResultStore.initFacets = typedResponse.data.facet_counts;
									searchResultStore.firstBackendFetchExecuted = true;
									facetAPiCallFurfilled = true;
								}
								// If timeout resolves first, wait for `apiPromise` and handle its result
								return facetAPICall;
							})
							.then((response) => {
								// if the timeout was first, we still want the api promise returned here
								// unless it the results were already back - then we ignore this.
								if (!facetAPiCallFurfilled) {
									const typedResponse = response as APISearchResponseType;
									searchResultStore.initFacets = typedResponse.data.facet_counts;
									searchResultStore.firstBackendFetchExecuted = true;
									facetAPiCallFurfilled = true;
								}
							})
							// and we throw an error if the API returned an error.
							.catch(() => {
								facetAPiCallFurfilled = true;
								errorManager.submitCustomError(
									'solr-error',
									t('error.title'),
									t('error.backend.solr.notResponsive'),
									Severity.ERROR,
									true,
									Priority.HIGH,
								);
								searchResultStore.firstBackendFetchExecuted = true;
							});

						const bffBackendCall = APIService.getKalturaConfIds();
						let bffBackendCallFurfilled = false;
						// timeout promise for long responsetimes. (7 seconds pt.)
						const maximumBffWaitTime = new Promise<void>((resolve) => {
							setTimeout(() => {
								// if the api promise was not furfilled yet, we tell people to wait a bit longer
								if (!bffBackendCallFurfilled) {
									errorManager.submitCustomError(
										'long-response',
										`${t('facets.slowResponse.title')}`,
										t('facets.slowResponse.text'),
										Severity.INFO,
										false,
										Priority.MEDIUM,
									);
								}
								resolve();
							}, 7000);
						});
						// promise race - first one back wins
						Promise.race([bffBackendCall, maximumBffWaitTime])
							.then((response) => {
								if (response) {
									//if api comes back first, we get the results and set our boolean to true.
									handleBffRsponse(response);
									bffBackendCallFurfilled = true;
								}
								// If timeout resolves first, wait for `apiPromise` and handle its result
								return bffBackendCall;
							})
							.then((response) => {
								// if the timeout was first, we still want the api promise returned here
								// unless it the results were already back - then we ignore this.
								if (!bffBackendCallFurfilled) {
									handleBffRsponse(response);
									bffBackendCallFurfilled = true;
								}
							})
							// and we throw an error if the API returned an error.
							.catch(() => {
								errorManager.submitCustomError(
									'bff-error',
									t('error.title'),
									t('error.backend.bff.notResponsive'),
									Severity.ERROR,
									true,
									Priority.MEDIUM,
								);
								authStore.kalturaIdFetchExecuted = true;
								bffBackendCallFurfilled = true;
							});
					}
				},
			);

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

		const handleBffRsponse = (response: APIAuthMessagesType) => {
			const typedResponse = response as APIAuthMessagesType; // Assert the correct type
			searchResultStore.setCuratedContent(typedResponse.data.curatedItems);
			authStore.partnerId = typedResponse.data.partnerId;
			authStore.audioUiConfId = typedResponse.data.AudioUiConfId;
			authStore.videoUiConfId = typedResponse.data.videoUiConfId;
			authStore.streamingBaseUrlAudio = typedResponse.data.streamingBaseUrlAudio;
			authStore.streamingBaseUrlVideo = typedResponse.data.streamingBaseUrlVideo;
			authStore.kalturaIdFetchExecuted = true;
			if (typedResponse.data.alert1) {
				errorManager.submitCustomError(
					'messages-error',
					t('error.title'),
					typedResponse.data.alert1,
					getSevertiyFromResponse(typedResponse.data.severity),
					true,
					Priority.HIGH,
				);
			}
		};

		const getSevertiyFromResponse = (severity?: Severity): Severity => {
			if (severity === 1) {
				return Severity.SUCCESS;
			} else if (severity === 2) {
				return Severity.INFO;
			} else if (severity === 3) {
				return Severity.WARNING;
			} else {
				return Severity.ERROR;
			}
		};

		const isDevelopment = () => {
			return import.meta.env.MODE !== 'production';
		};

		const returnCurrentEnv = () => {
			return import.meta.env.MODE;
		};

		onBeforeMount(() => {
			window.addEventListener('change-path', gotoPath);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('change-path', gotoPath);
		});

		return {
			td,
			route,
			leaveDone,
			currentLocale,
			transitionName,
			isDevelopment,
			returnCurrentEnv,
			t,
		};
	},
});
</script>

<style lang="scss">
#cookiescript_reportdate a,
#cookiescript_cookiescriptlink,
#cookiescript_reportlink {
	text-decoration: underline !important;
}

.skip-link {
	position: absolute;
	top: -40px;
	left: 0;
	background-color: #f0f0f0;
	padding: 5px;
	z-index: 9999;
}
.skip-link:focus {
	top: 0;
}

:focus {
	outline: none;
}

:focus-visible {
	box-shadow: 0 0 0 3px #02204bea !important;
	border-radius: 4px !important;
	transition: box-shadow 0.2s ease-in-out;
}

.result-enter-active,
.result-leave-active {
	transition: all 0.15s ease-in-out;
}

.result-enter {
	transition-delay: 0.15s;
}

.header {
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

/* SEARCH TO HOME TRANSITION */

.search-to-home-enter-active,
.search-to-home-leave-active {
	transition: all 0.25s linear;
}

.search-to-home-enter-from {
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

.search-to-home-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.search-to-home-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
	z-index: 3;
}

#main-content {
	min-height: 50vh;
}

.search-to-home-leave-to {
	margin-top: 50px;
	opacity: 0;
	position: relative;
}
.search-to-home-leave-active {
	z-index: 0;
}

/* HOME TO SEARCH TRANSITION */

.home-to-search-enter-active,
.home-to-search-leave-active {
	transition: all 0.25s linear;
}

.home-to-search-enter-from {
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

.home-to-search-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.home-to-search-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
	z-index: 3;
}

.home-to-search-leave-to {
	margin-top: 50px;
	opacity: 0;
	position: relative;
}
.home-to-search-leave-active {
	z-index: 0;
}

/* RECORD TO SEARCH TRANSITION */
.record-to-search-enter-active,
.record-to-search-leave-active {
	transition: all 0.25s linear;
}

.record-to-search-enter-from {
	margin-top: -50px;
	opacity: 0;
	position: relative;
}

.record-to-search-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.record-to-search-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
}

.record-to-search-leave-to {
	margin-top: 50px;
	opacity: 0;
	position: relative;
}
.record-to-search-leave-active,
.search-to-record-enter-active {
	z-index: 1000;
}

.search-to-record-enter-active,
.search-to-record-leave-active {
	transition: all 0.25s linear;
	position: relative;
}

/* SEARCH TO RECORD TRANSITION */

.search-to-record-enter-from {
	margin-top: 50px;
	opacity: 0;
	position: absolute;
}

.search-to-record-enter-to {
	margin-top: 0px;
	opacity: 1;
	position: relative;
}

.search-to-record-leave-from {
	top: 0px;
	opacity: 1;
	position: relative;
}

.search-to-record-leave-to {
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
