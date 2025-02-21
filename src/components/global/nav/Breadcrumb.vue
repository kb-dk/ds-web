<template>
	<div :class="`bg-container ${currentPage}`">
		<div class="breadcrumb container">
			<span class="material-icons home-icon">home</span>
			<span class="material-icons back-arrow">chevron_left</span>
			<Transition name="breadcrumb">
				<button
					v-if="dotsShown"
					class="dot-button"
					@click="showDotContent()"
				>
					...&nbsp;&nbsp;/
				</button>
			</Transition>
			<Transition name="breadcrumb-content">
				<div
					v-if="prelinksShown"
					class="dot-content"
					@mouseleave="hideDotContentOnDelay()"
					@mouseover="resetTimeout()"
				>
					<a
						:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'home-logo', 0)"
						href="https://www.kb.dk"
						class="level-1"
						:title="t('breadcrumb.frontpage')"
					>
						<span class="breadcrumb-title">{{ t('breadcrumb.frontpage') }}</span>
					</a>
					<span class="line">/</span>

					<a
						:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'find-materials', 1)"
						href="https://www.kb.dk/find-materiale"
						class="level-2"
						:title="t('breadcrumb.findMaterials')"
					>
						<span class="breadcrumb-title">{{ t('breadcrumb.findMaterials') }}</span>
					</a>
					<span class="line level-2">/</span>
				</div>
			</Transition>
			<router-link
				:to="{ path: '/' }"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'frontpage', 2)"
				class="level-3"
				:title="t('breadcrumb.drArchive')"
				@click="searchResultStore.resetSearch()"
			>
				<span class="breadcrumb-title highlighted">{{ t('breadcrumb.drArchive') }}</span>
			</router-link>
			<span
				v-if="$route.name === 'Search'"
				class="line"
			>
				/
			</span>
			<span
				v-if="$route.name === 'Search'"
				class="level-4"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</span>
			<span
				v-if="$route.name === 'Record' && lastPath"
				class="line level-5"
			>
				/
			</span>
			<router-link
				v-if="$route.name === 'Record' && lastPath"
				class="level-5"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-with-result', 3)"
				:to="lastPath"
				:title="t('breadcrumb.search')"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<router-link
				v-if="$route.name === 'Record' && !lastPath"
				class="level-5"
				:to="{ name: 'Search' }"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-empty', 4)"
				:title="t('breadcrumb.search')"
			>
				<span class="line">/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<span v-if="$route.name === 'Record'">/</span>
			<span
				v-if="$route.name === 'Record'"
				class="level-6"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.record') }}</span>
			</span>
			<div class="search-tip">
				<InfoComponent
					icon="info_outline"
					:title="t('search.frontpageGuide.title')"
					modal-align="right"
				>
					<div class="search-help">
						<span>
							{{ t('search.frontpageGuide.first.part1') + ' ' }}
						</span>
						<span class="cursive-text">
							{{ t('search.frontpageGuide.first.cursive1') + ' ' }}
						</span>
						<span>
							{{ t('search.frontpageGuide.first.part2') + ' ' }}
						</span>
						<span class="cursive-text">
							{{ t('search.frontpageGuide.first.cursive2') + ' ' }}
						</span>
						<span>
							{{ t('search.frontpageGuide.first.part3') + ' ' }}
						</span>
						<span class="cursive-text">
							{{ t('search.frontpageGuide.first.cursive3') }}
						</span>
						<p>
							{{ t('search.frontpageGuide.second') }}
						</p>
						<p>
							{{ t('search.frontpageGuide.third') }}
						</p>
						<a
							target="_blank"
							:href="t('search.frontpageGuide.link')"
						>
							{{ t('search.frontpageGuide.linktext') }}
						</a>
					</div>
				</InfoComponent>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import InfoComponent from '@/components/common/InfoComponent.vue';

export default defineComponent({
	name: 'Breadcrumb',
	components: {
		InfoComponent,
	},
	setup() {
		const { t } = useI18n();
		const router = useRouter();
		const lastPath = ref('');
		const searchResultStore = useSearchResultStore();
		const route = useRoute();
		const prelinksShown = ref(false);
		const dotsShown = ref(true);
		const timeout: Ref<number | null> = ref(null);

		const currentPage = computed(() => {
			let page = route.name as string;
			if (page) {
				return page.toLowerCase();
			} else {
				return '';
			}
		});

		const resetTimeout = () => {
			if (timeout.value !== null) {
				clearTimeout(timeout.value);
				timeout.value = null;
			}
		};

		const hideDotContentOnDelay = () => {
			timeout.value = setTimeout(() => {
				togglePreLinks(false);
				toggleDots(true);
			}, 1000);
		};

		const showDotContent = () => {
			togglePreLinks(true);
			toggleDots(false);
			timeout.value = setTimeout(() => {
				togglePreLinks(false);
				toggleDots(true);
			}, 5000);
		};

		const togglePreLinks = (value: boolean) => {
			prelinksShown.value = value;
		};

		const toggleDots = (value: boolean) => {
			dotsShown.value = value;
		};

		onMounted(() => {
			let back = router.options.history.state.back as string;
			if (back && back.substring(0, 5) === '/find') {
				lastPath.value = router.options.history.state.back as string;
			} else {
				lastPath.value = '/';
			}
		});

		watch(
			() => route.path,
			() => {
				let back = router.options.history.state.back as string;
				if (back && back.substring(0, 5) === '/find') {
					lastPath.value = router.options.history.state.back as string;
				} else if (back && back.substring(0, 5) !== '/post') {
					lastPath.value = '/';
				}
			},
		);

		return {
			t,
			addTestDataEnrichment,
			lastPath,
			searchResultStore,
			currentPage,
			prelinksShown,
			togglePreLinks,
			toggleDots,
			dotsShown,
			hideDotContentOnDelay,
			showDotContent,
			resetTimeout,
		};
	},
});
</script>

<style scoped>
/* Base transition styles */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
	transition: all 0.5s ease;
	max-width: 50px;
}

.breadcrumb-enter-active {
	transition-delay: 0.5s; /* Delay for enter transition */
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
	opacity: 0;
	max-width: 0px;
}

.breadcrumb-leave-active {
	pointer-events: none; /* Avoid triggering mouse events during fade-out */
	transition-delay: 0s; /* No delay for leave transition */
}

/* Base transition styles */
.breadcrumb-content-enter-active,
.breadcrumb-content-leave-active {
	transition: all 0.5s ease;
	max-width: 200px;
}

.breadcrumb-content-enter-active {
	transition-delay: 0.2s; /* Delay for enter transition */
}

.breadcrumb-content-enter-from,
.breadcrumb-content-leave-to {
	opacity: 0;
	max-width: 0px;
}

.breadcrumb-content-leave-active {
	pointer-events: none; /* Avoid triggering mouse events during fade-out */
	transition-delay: 0s; /* No delay for leave transition */
}

.breadcrumb {
	height: 40px;
	position: relative;
	background-color: #caf0fe;
	z-index: 1;
	display: flex;
	flex-direction: row;
	font-size: 16px;
}

.dot-content {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.level-2 {
	display: none;
}

.dot-button {
	min-width: 30px;
	font-size: 16px;
	background-color: transparent;
	border: 0px solid transparent;
	display: flex;
	font-family: noway, sans-serif;
	padding: 0;
	margin: 0;
	cursor: pointer;
	transition: all 0.15s linear 0s;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.dot-button:hover {
	color: #002e70;
}

.mobile-hidden {
	display: none;
}

.home .level-2,
.home .level-3 {
	display: initial;
}

.record .level-5,
.record .level-6 {
	display: initial;
}

.record .level-5 .line {
	display: none;
}

.search .level-3,
.search .level-4 {
	display: initial;
}

.home-icon {
	display: none;
	font-size: 18px;
}

.back-arrow {
	font-size: 18px;
}

.breadcrumb a {
	text-decoration: none;
}

.breadcrumb a:hover span {
	color: #002e70;
}

.breadcrumb a:hover .line {
	color: black;
}

.breadcrumb a:hover .highlighted {
	color: #002e70;
}

.breadcrumb a:visited {
	color: black;
}

.breadcrumb-title.highlighted {
	color: white;
	background-color: #002e70;
	border-radius: 4px;
	margin: 0px 8px;
	padding: 2px 6px 3px 6px;
	border: 1px solid #002e70;
	transition: all 0.1s linear 0s;
	white-space: pre;
}

.breadcrumb-title.highlighted:hover {
	background-color: #c4f1ed;
	color: pink;
}

.bg-container {
	z-index: 5;
	background-color: #caf0fe;
	position: relative;
}

.breadcrumb-title {
	padding: 0px 4px;
	text-decoration: none;
	margin: 0px 2px;
	color: black;
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.record .breadcrumb-title.level-4 {
	display: initial;
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	align-items: center;
}

.container span {
	color: black;
}

.search-tip {
	margin-left: auto;
}

.search-help a {
	color: #002e70;
	text-decoration: underline;
}

.search-help span {
	color: #002e70;
}

.cursive-text {
	font-style: italic;
}

/* MEDIA QUERY 510 */
@media (min-width: 510px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
	.breadcrumb-title {
		font-size: 14px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.breadcrumb-title {
		padding: 0px 3px;
		margin: 0px 5px;
		font-size: 16px;
	}
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		max-width: 1150px;
	}

	.back-arrow {
		display: none;
	}

	.mobile-hidden {
		display: initial;
	}

	.level-1,
	.level-2,
	.level-3,
	.level-4,
	.level-5,
	.level-6 {
		display: initial;
	}

	.line {
		display: initial !important;
	}

	.home-icon {
		display: block;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
