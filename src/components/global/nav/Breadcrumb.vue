<template>
	<div :class="`bg-container ${currentPage}`">
		<div class="breadcrumb container">
			<span class="material-icons home-icon">home</span>
			<span class="material-icons back-arrow">chevron_left</span>
			<router-link
				class="level-3"
				:to="{ name: 'Home' }"
			>
				{{ t('breadcrumb.frontpage') }}
			</router-link>

			<span
				v-if="$route.name === 'Search'"
				class="line"
			>
				/
			</span>
			<span
				v-if="$route.name === 'Search'"
				class="level-4 btn-reg"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}{{ searchWord }}</span>
			</span>
			<span
				v-if="$route.name === 'Record' && lastPath"
				class="line level-5"
			>
				/
			</span>
			<router-link
				v-if="$route.name === 'Record' && lastPath"
				class="level-5 btn-reg"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-with-result', 3)"
				:to="lastPath"
				:title="t('breadcrumb.search')"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}{{ searchWord }}</span>
			</router-link>
			<router-link
				v-if="$route.name === 'Record' && !lastPath"
				class="level-5 btn-reg"
				:to="{ name: 'Search' }"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-empty', 4)"
				:title="t('breadcrumb.search')"
			>
				<span class="line">/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}{{ searchWord }}</span>
			</router-link>
			<span v-if="$route.name === 'Record'">/</span>
			<span
				v-if="$route.name === 'Record'"
				class="level-6 btn-reg"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.record') }}</span>
			</span>
			<!-- <div class="search-tip">
				<InfoComponent
					icon="info"
					:title="t('search.frontpageGuide.title')"
					modal-align="right"
				>
					<div class="search-help">
						<span v-if="locale === 'en'">
							{{ t('search.frontpageGuide.disclaimer') }}
							<br />
							<br />
						</span>
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
						<p>
							<a
								class="link"
								target="_blank"
								:href="t('search.frontpageGuide.link')"
							>
								<span class="material-icons">link</span>
								<span class="link-text">{{ t('search.frontpageGuide.linktext') }}</span>
							</a>
						</p>
					</div>
				</InfoComponent>
			</div> -->
		</div>
	</div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'Breadcrumb',
	components: {},
	setup() {
		const { t, locale } = useI18n();
		const router = useRouter();
		const lastPath = ref('');
		const searchResultStore = useSearchResultStore();
		const route = useRoute();
		const searchWord = computed(() => {
			if (searchResultStore.lastSearchQuery) {
				if (searchResultStore.lastSearchQuery !== '*:*') {
					return `: ${searchResultStore.lastSearchQuery}`;
				}
				return '';
			}
			return '';
		});
		const currentPage = computed(() => {
			let page = route.name as string;
			if (page) {
				return page.toLowerCase();
			} else {
				return '';
			}
		});

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
			locale,
			addTestDataEnrichment,
			lastPath,
			searchResultStore,
			currentPage,
			searchWord,
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
	height: 47px;
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: row;
	font-size: 16px;
}
.breadcrumb a {
	color: var(--color-main);
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
	padding: 0;
	margin: 0;
	cursor: pointer;
	transition: all 0.15s linear 0s;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: var(--color-main);
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
.level-3 {
	margin-left: 4px;
	margin-right: 4px;
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
.level-4,
.level-5 {
	white-space: nowrap;
	max-width: 10rem;
	overflow: hidden;
	text-overflow: ellipsis;
}
.level-1,
.level-2,
.level-4,
.level-5,
.level-6 {
	height: 20px;
	align-content: center;
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
.breadcrumb a:visited {
	color: var(--color-main);
}

.btn-reg.highlighted {
	color: var(--color-main);
	background-color: #002e70;
	border-radius: 4px;
	margin: 0px 8px;
	padding: 2px 6px 3px 6px;
	border: 1px solid #002e70;
	transition: all 0.1s linear 0s;
	white-space: pre;
}

.btn-reg.highlighted:hover {
	background-color: #c4f1ed;
	color: pink;
}

.bg-container {
	position: relative;
	margin-top: 50px;
}

.breadcrumb-title {
	padding: 0px 4px;
	text-decoration: none;
	margin: 0px 2px;
	color: var(--color-main);
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
	color: var(--color-main);
}

.search-tip {
	margin-left: auto;
}

.search-help span {
	color: var(--color-default);
}

.cursive-text {
	font-style: italic;
}
.link {
	color: var(--color-default);
	text-align: left;
	text-decoration: none;
	border-radius: 4px;
	display: flex;
	align-items: center;
	width: fit-content;
}
.link > .material-icons {
	margin-right: 2px;
}
.link-text {
	transition: 200ms;
	border-bottom: 1px solid transparent;
}
.link:hover {
	transition: all 5s ease 0s;
	color: var(--color-default);
	.link-text {
		border-color: var(--color-default);
	}
}

/* MEDIA QUERY 510 */
@media (min-width: 510px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.breadcrumb-title {
		padding: 0px 3px;
		margin: 0px 5px;
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
	.level-4,
	.level-5 {
		max-width: 15rem;
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
		padding-right: 0px;
		padding-left: 0px;
	}
	.bg-container {
		padding-left: 12px;
		padding-right: 12px;
	}
}
</style>
