<template>
	<div class="container">
		<div class="row">
			<div class="hit-count">
				<div :class="!searchResultStore.loading ? 'filter-options' : 'filter-options disabled'">
					<div class="filter-buttons">
						<button
							ref="toggleFacetsButton"
							role="switch"
							aria-checked="true"
							class="filter-button"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-filters', 0)"
							@click="toggleFacets()"
						>
							<span class="material-icons">tune</span>
							<span class="filter-button-text">
								{{ searchResultStore.showFacets ? $t('search.hideFilters') : $t('search.showFilters') }}
							</span>
						</button>
						<button
							v-if="searchResultStore.filters.length > 0 || searchResultStore.channelFilters.length > 0"
							class="reset"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'reset-filters', 0)"
							@click="resetFilters()"
						>
							<span>×</span>
							Reset filtre
						</button>
					</div>
					<button
						:class="tvToggled ? 'source-facet-button open' : 'source-facet-button'"
						:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-tv', 0)"
						@click="toggleTV($event)"
					>
						<span class="material-icons second">play_circle_filled</span>
						TV
						<span :class="tvToggled ? 'dark-bar open' : 'dark-bar closed'">
							<span class="dot">
								<TransitionGroup>
									<div
										v-if="tvToggled"
										class="close"
									></div>
									<div
										v-else
										class="check"
									></div>
								</TransitionGroup>
							</span>
						</span>
					</button>
					<button
						:class="radioToggled ? 'source-facet-button open' : 'source-facet-button'"
						:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-radio', 0)"
						@click="toggleRadio($event)"
					>
						<span class="material-icons second">volume_up</span>
						RADIO
						<span :class="radioToggled ? 'dark-bar open' : 'dark-bar closed'">
							<span class="dot">
								<TransitionGroup>
									<div
										v-if="radioToggled"
										class="close"
									></div>
									<div
										v-else
										class="check"
									></div>
								</TransitionGroup>
							</span>
						</span>
					</button>
				</div>
				<Facets :facet-results="searchResultStore.facetResult" />
				<div class="result-options">
					<div class="hits">
						<HitCount
							:hit-count="searchResultStore.numFound"
							:no-hits="searchResultStore.noHits"
							:query="searchResultStore.lastSearchQuery !== undefined ? searchResultStore.lastSearchQuery : ''"
						/>
					</div>
				</div>
				<div class="sort-options">
					<Sort></Sort>
					<div class="search-options">
						<Transition name="fade">
							<div
								v-show="!searchResultStore.loading && searchResultStore.numFound > 0"
								class="page-count"
							>
								{{ t('search.page') }}
								{{
									(Number(searchResultStore.start) + Number(searchResultStore.rowCount)) /
									Number(searchResultStore.rowCount)
								}}
								{{ t('search.of') }}
								{{
									new Intl.NumberFormat('de-DE').format(
										Math.ceil(searchResultStore.numFound / Number(searchResultStore.rowCount)),
									)
								}}
							</div>
						</Transition>
						<button
							:class="
								searchResultStore.loading
									? 'display-option list loading'
									: searchResultStore.resultGrid
									  ? 'display-option list'
									  : 'display-option list active'
							"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-list', 0)"
							@click="setGridAndLoadResults(false)"
						>
							<span class="material-icons">toc</span>
						</button>
						<button
							:class="
								searchResultStore.loading
									? 'display-option grid loading'
									: searchResultStore.resultGrid
									  ? 'display-option grid active'
									  : 'display-option grid'
							"
							class="display-option grid"
							:data-testid="addTestDataEnrichment('button', 'search-overhead', 'toggle-grid', 0)"
							@click="setGridAndLoadResults(true)"
						>
							<span class="material-icons">apps</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Facets from '@/components/search/Facets.vue';
import { cloneRouteQuery, normalizeFq } from '@/utils/filter-utils';
import Sort from './Sort.vue';
import HitCount from './HitCount.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'SearchOverhead',
	components: {
		HitCount,
		Sort,
		Facets,
	},
	props: {
		showFacets: { type: Boolean },
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		const router = useRouter();
		const route = useRoute();
		const { t } = useI18n();
		const toggleFacetsButton = ref<HTMLButtonElement | null>(null);
		const tvToggled = ref(true);
		const radioToggled = ref(true);

		const delimitationOptions = {
			all: '',
			tv: 'origin:"ds.tv"',
			radio: 'origin:"ds.radio"',
		};

		onMounted(() => {
			searchResultStore.showFacets = false;
		});

		watch(
			() => route.query.fq,
			(newFq) => {
				/* 
				we have to do this, because vue acts weird here.
				when we have normal route changes, it seems like we get an array here,
				but when we use brower back and forth buttons, we get strings, IF there is only one filter.
				Weird and breaking behavior, that we have to account for here.
				*/
				const normalizedFq: string[] = Array.isArray(newFq) ? (newFq as string[]) : newFq ? [newFq as string] : [];
				const originFilter = normalizedFq.find((fq: string) => fq.includes('origin'));
				if (originFilter) {
					if (decodeURIComponent(originFilter) === delimitationOptions.radio) {
						tvToggled.value = false;
					} else if (decodeURIComponent(originFilter) === delimitationOptions.tv) {
						radioToggled.value = false;
					}
				}
			},
			{ immediate: true },
		);

		const resetFilters = () => {
			searchResultStore.setKeepFacets(false);
			router.push({
				name: 'Home',
				query: { q: searchResultStore.currentQuery },
			});
		};

		const setDelimitationFilterAndExecute = () => {
			let val = '';
			if ((tvToggled.value && radioToggled) || (!tvToggled.value && !radioToggled.value)) {
				val = delimitationOptions.all;
				searchResultStore.preliminaryFilter = '';
			}
			if (tvToggled.value && !radioToggled.value) {
				val = delimitationOptions.tv;
			}
			if (!tvToggled.value && radioToggled.value) {
				val = delimitationOptions.radio;
			}
			searchResultStore.resetAutocomplete();
			const routeQueries = cloneRouteQuery(route);
			const existingFq = normalizeFq(routeQueries.fq as string[] | string);
			if (existingFq) {
				const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes('origin'));
				if (creatorAffiliationFilter) {
					const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
					if (index !== -1) {
						existingFq.splice(index, 1);
					}
				}
				if (val !== '') {
					existingFq.push(encodeURIComponent(val));
				}
				routeQueries.fq = existingFq;
			} else {
				if (val !== '') {
					routeQueries.fq = [];
					routeQueries.fq.push(encodeURIComponent(val));
				}
			}
			router.push({
				name: 'Home',
				query: routeQueries,
			});
		};

		const toggleTV = (event: Event) => {
			tvToggled.value = !tvToggled.value;
			if (event.target) {
				const btn = event.target as HTMLButtonElement;
				btn.setAttribute('aria-checked', tvToggled.value.toString());
			}
			if (!tvToggled.value && !radioToggled.value) {
				radioToggled.value = !radioToggled.value;
				notifyUserForAtLeastOneSource();
			}
			setDelimitationFilterAndExecute();
		};

		const toggleRadio = (event: Event) => {
			radioToggled.value = !radioToggled.value;
			if (event.target) {
				const btn = event.target as HTMLButtonElement;
				btn.setAttribute('aria-checked', radioToggled.value.toString());
			}
			if (!tvToggled.value && !radioToggled.value) {
				tvToggled.value = !tvToggled.value;
				notifyUserForAtLeastOneSource();
			}
			setDelimitationFilterAndExecute();
		};

		/* Needs to be translated! */
		const notifyUserForAtLeastOneSource = () => {
			const customEvent = new CustomEvent('notify-user', {
				detail: {
					title: 'Der skal være valgt et materiale',
					message: 'Der skal være valgt mindst et materiale for at få et søgeresultat.',
					key: true,
					severity: 'low',
					userClose: false,
				},
			});
			window.dispatchEvent(customEvent);
		};

		const toggleFacets = () => {
			searchResultStore.toggleShowFacets(!searchResultStore.showFacets);
			toggleFacetsButton.value?.setAttribute('aria-checked', searchResultStore.showFacets.toString());
		};

		const setGridAndLoadResults = (grid: boolean) => {
			if (searchResultStore.resultGrid !== grid) {
				searchResultStore.setResultGrid(grid);
				searchResultStore.setStart('0');
				const start = '0';
				const rows = grid ? 40 : 10;
				const query = { ...route.query, start, rows };
				router.push({ query });
			}
		};

		return {
			searchResultStore,
			setGridAndLoadResults,
			t,
			toggleFacets,
			toggleFacetsButton,
			tvToggled,
			radioToggled,
			toggleRadio,
			toggleTV,
			resetFilters,
			addTestDataEnrichment,
		};
	},
});
</script>

<style scoped>
.display-option {
	color: #002e70;
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding: 0px;
	width: 30px;
	height: 30px;
	border-bottom: 1px solid transparent;
}

.display-option.list {
	position: relative;
	margin-left: 30px;
	margin-right: 5px;
}

.display-option.active {
	border-bottom: 2px solid #002e70;
	box-sizing: border-box;
}

.display-option.loading {
	pointer-events: none;
	color: grey;
}

.display-option.list span {
	font-size: 32px;
	position: relative;
	top: -2px;
}

.container {
	min-height: 91px;
}

.result-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	height: 47px;
}

.sort-options {
	position: relative;
	display: flex;
	justify-content: space-between;
	z-index: 5;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
}

.filter-options.disabled button {
	pointer-events: none;
	cursor: default;
	color: #757575 !important;
	background-color: rgb(250, 250, 250);
	transition: all 0.2s linear 0s;
	border: 1px solid #7575755e;
}

.filter-options.disabled button .dark-bar {
	background-color: #757575 !important;
}

.buffer {
	height: 20px;
	width: 100%;
}

.hits {
	width: 100%;
	margin-right: auto;
	margin-left: 0;
}

.search-options {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.page-count {
	font-size: 16px;
	display: inline-block;
}

.filter-button {
	border: 0px;
	background-color: transparent;
	line-height: 24px;
	cursor: pointer;
	margin: 10px 0px;
	margin-right: auto;
	margin-left: 0;
	background-color: #002e70;
	color: white;
	box-shadow:
		inset 1px 1px 2px #00000000,
		1px 1px 2px #00000029;
	border-radius: 4px;
	z-index: 1;
	font-size: 20px;
	margin-right: 10px;
}

.filter-button .material-icons {
	font-size: 16px;
	position: relative;
	top: 2px;
}

.filter-button-text {
	padding-left: 5px;
	font-size: 16px;
}

.source-facet-button {
	cursor: pointer;
	padding: 3px 3px;
	font-size: 18px;
	width: fit-content;
	display: flex;
	align-items: center;
	box-shadow: 1px 1px 2px #00000000;
	border: 1px solid #d9d8d8;
	background: rgb(250, 250, 250);
	color: #757575;
	border-radius: 4px;
	transition: all 0s linear 0s;
	margin-left: 10px;
	z-index: 1;
}

.source-facet-button.open {
	color: #002e70;
}

.dark-bar {
	width: 50px;
	background-color: #d5d5d5;
	height: 24px;
	border-radius: 20px;
	margin-left: 20px;
	transition: all 0.1s linear 0s;
}

.dark-bar.open {
	background-color: #002e70;
}

.dark-bar .dot {
	width: 18px;
	height: 18px;
	display: block;
	background-color: white;
	border-radius: 15px;
	top: 3px;
	left: 3px;
	position: relative;
	transition: all 0.1s linear 0s;
}

.dark-bar.open .dot {
	left: 29px;
}

.dark-bar .dot .close:before {
	content: '';
	display: block;
	width: 7px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 10px;
	left: 2px;
	position: relative;
}
.dark-bar .dot .close:after {
	content: '';
	display: block;
	width: 12px;
	height: 2px;
	background-color: #002e70;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	position: relative;
	left: 5px;
}

.dark-bar .dot .check:before {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(45deg);
	top: 8px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}
.dark-bar .dot .check:after {
	content: '';
	display: block;
	width: 15px;
	height: 2px;
	background-color: #757575;
	transform-origin: center;
	transform: rotateZ(-45deg);
	top: 6px;
	left: 1px;
	position: relative;
	border-radius: 15px;
}

.reset {
	cursor: pointer;
	padding: 3px 3px;
	font-size: 18px;
	width: fit-content;
	display: flex;
	align-items: center;
	border: 1px solid #f7ae3b;
	background: #ffffff;
	color: #002e70;
	border-radius: 4px;
	transition: all 0s linear 0s;
	background-color: #f7ae3b;
	max-height: 28px;
	z-index: 1;
	box-shadow:
		inset 1px 1px 2px #00000000,
		1px 1px 2px #00000029;
}

.reset span {
	font-size: 25px;
	padding-right: 5px;
}

.filter-buttons {
	margin-right: auto;
	display: flex;
	align-items: center;
	align-content: center;
	flex-wrap: nowrap;
	flex-direction: row;
}
</style>
