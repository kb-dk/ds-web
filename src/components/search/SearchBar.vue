<template>
	<div
		v-if="route.name !== 'Record'"
		class="search-box"
	>
		<div class="search-container">
			<div class="container main-12">
				<form
					ref="searchFormRef"
					action=" "
					method=" "
					role="search"
					class="search-form"
					@submit.prevent="search()"
				>
					<div
						role="group"
						:class="debounceMechanic ? 'rdl-advanced-search locked' : 'rdl-advanced-search'"
					>
						<div class="search-bar-container">
							<div class="rdl-advanced-search-input">
								<label
									for="focusSearchInput"
									class="sr-only"
								>
									{{ t('search.searchInput') }}
								</label>
								<input
									id="focusSearchInput"
									v-model="searchResultStore.currentQuery"
									spellcheck="false"
									autocomplete="off"
									type="search"
									:disabled="debounceMechanic ? true : false"
									class="form-control label-big"
									:class="{ 'form-control-search': route.name === 'Search' }"
									:placeholder="searchResultStore.searchFired ? '' : t(`search.placeholder`)"
									name="simpleSearch"
									:data-testid="addTestDataEnrichment('input', 'searchbar', 'search-field', 0)"
									@keydown="updateKeystrokeForAutocomplete"
								/>
							</div>
							<div class="button-container">
								<div
									v-if="searchResultStore.loading"
									class="spinner-container"
								>
									<div
										:aria-busy="searchResultStore.loading ? true : false"
										:class="searchResultStore.loading || true ? 'spinner show' : 'spinner hide'"
									></div>
								</div>
								<button
									v-if="
										searchResultStore.searchResult.length !== 0 ||
										searchResultStore.searchFired === true ||
										(searchResultStore.currentQuery.length !== 0 && searchResultStore.currentQuery !== undefined)
									"
									id="resetButton"
									type="button"
									aria-label="reset"
									class="btn btn-primary btn-icon"
									:data-testid="addTestDataEnrichment('button', 'searchbar', 'search-reset', 0)"
									@click="reset()"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									>
										close
									</i>
								</button>
								<button
									id="searchButton"
									ref="searchButton"
									:disabled="debounceMechanic ? true : false"
									type="submit"
									aria-label="search"
									class="btn btn-primary btn-icon"
									:data-testid="addTestDataEnrichment('button', 'searchbar', 'search-execute', 0)"
									@submit="search()"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									>
										search
									</i>
								</button>
							</div>
						</div>

						<Transition name="fade">
							<div class="autocomplete-container">
								<Autocomplete :keystroke="keyStrokeEvent" />
							</div>
						</Transition>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import Autocomplete from '@/components/search/Autocomplete.vue';
import { LocationQueryRaw } from 'vue-router';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Searchbar',
	components: {
		Autocomplete,
	},
	setup() {
		const { t } = useI18n();
		const searchResultStore = useSearchResultStore();
		const debounceMechanic = ref(false);
		const keyStrokeEvent = ref<KeyboardEvent | undefined>(undefined);
		let AutocompleteTimer: ReturnType<typeof setTimeout>;
		const searchFormRef = ref<HTMLFormElement | null>(null);
		const showPortalSelector = ref(false);
		const selectedPortal = ref('drArchive');
		const route = useRoute();
		const selectButtonRef = ref<HTMLButtonElement | null>(null);
		watch(
			() => searchResultStore.currentQuery,
			(newStart: string, prevStart: string) => {
				if (newStart !== prevStart) {
					clearTimeout(AutocompleteTimer);
					if (newStart.length < 2) {
						searchResultStore.autocompleteResult = [];
					}
					if (!searchResultStore.blockAutocomplete) {
						AutocompleteTimer = setTimeout(() => {
							getAutocompleteResponse(newStart);
						}, 500); // 1000 milliseconds (0.5 second) delay
					}
				} else {
					searchResultStore.autocompleteResult = [];
				}
			},
		);

		const updateKeystrokeForAutocomplete = (e: KeyboardEvent) => {
			keyStrokeEvent.value = e;
		};

		const getAutocompleteResponse = (query: string) => {
			if (query !== undefined && query.length >= 3 && !searchResultStore.blockAutocomplete) {
				searchResultStore.getAutocompleteResults(query);
			}
		};

		const search = () => {
			if (
				router.currentRoute.value.name !== 'Search' ||
				searchResultStore.lastSearchQuery !== searchResultStore.currentQuery
			) {
				searchResultStore.searchResult = [];
			}
			searchResultStore.resetAutocomplete();
			searchResultStore.channelFilters = [];
			searchResultStore.categoryFilters = [];
			clearTimeout(AutocompleteTimer);
			debounceMechanic.value = true;
			setTimeout(() => {
				debounceMechanic.value = false;
			}, 500);
			let query: LocationQueryRaw = {
				q: searchResultStore.currentQuery === '' ? ':*' : searchResultStore.currentQuery,
				start: 0,
			};

			searchResultStore.preliminaryFilter = '';

			query.sort = encodeURIComponent(`score desc`);

			router.push({
				name: 'Search',
				query: query,
			});
		};

		const reset = () => {
			searchResultStore.currentQuery = '';
			searchResultStore.loading = false;
			setPreliminaryFilter('');
			router.push({ name: 'Home' });
		};

		const setPreliminaryFilter = (value: string) => {
			searchResultStore.preliminaryFilter = value;
			if (searchResultStore.currentQuery !== '' && searchResultStore.currentQuery !== undefined) {
				search();
			}
		};

		return {
			searchResultStore,
			debounceMechanic,
			setPreliminaryFilter,
			search,
			reset,
			t,
			updateKeystrokeForAutocomplete,
			keyStrokeEvent,
			addTestDataEnrichment,
			searchFormRef,
			showPortalSelector,
			selectButtonRef,
			selectedPortal,
			route,
		};
	},
});
</script>

<style scoped>
/* clears the ‘X’ from Internet Explorer */
input[type='search']::-ms-clear {
	display: none;
	width: 0;
	height: 0;
}
input[type='search']::-ms-reveal {
	display: none;
	width: 0;
	height: 0;
}
/* clears the ‘X’ from Chrome */
input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
	display: none;
}

.material-icons {
	color: var(--color-main);
	font-size: var(--fs-xl);
}

.autocomplete-container {
	z-index: 15;
}

#searchButton,
#resetButton {
	padding: 0 10px 0 0;
}
.search-form {
	width: 100%;
}
.locked {
	/* https://jxnblk.github.io/grays/ */
	color: #767676;
}

.locked #searchButton,
.locked #focusSearchInput {
	/* https://jxnblk.github.io/grays/ */
	color: #767676;
}

:host {
	max-width: 100vw;
	height: 100%;
	display: block;
}

.search-box {
	z-index: 6;
	left: 0;
	width: 100%;
	border-radius: var(--rounded-medium);
	display: flex;
}
.btn-icon i {
	margin-left: auto;
}

.locked input {
	pointer-events: none;
	cursor: default;
}

.search-container {
	display: flex;
	height: 100%;
	align-content: center;
	justify-content: center;
	align-items: center;
}

.btn-icon {
	display: inline-flex;
	align-items: center;
}

input:focus-visible,
input:focus {
	outline: none;
}
/* For .rdl-advanced-search and .rdl-spot-search .rdl-advanced-search */
.container {
	margin-right: auto;
	margin-left: auto;
	width: 100%;
	box-sizing: border-box;
}

.spinner-container {
	/* width: 30px; */
	position: absolute;
	/* right: 60px; */
	display: flex;
	right: initial;
	margin-top: initial;
	position: initial;
	width: 48px;
}

.spinner {
	width: 100%;
	--spinner-color: #ffffff;
	--spinner-mask: url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='50' height='50' viewBox='0 0 50 50' xml:space='preserve'%3E%3Ccircle stroke-width='1.86' fill='none' stroke='currentColor' cx='25' cy='25' r='14'/%3E%3C/svg%3E");
	--spinner-size: 3rem;
	display: block;
	margin: auto;
	background-image: conic-gradient(transparent 90deg, var(--spinner-color, white));
	-webkit-mask: var(--spinner-mask) 0/100% 100%;
	mask: var(--spinner-mask) 0/100% 100%;
	will-change: transform;
	animation: spin 2s linear infinite;
	animation-play-state: var(--spinner-animation-play-state, paused);
	aspect-ratio: 1;
	height: var(--spinner-size, 16rem);
	transition: opacity 0.3s linear 0s;
}
[aria-busy] {
	--spinner-animation-play-state: running;
}
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.spinner.show {
	opacity: 1;
}

.spinner.hide {
	opacity: 0;
}

.rdl-advanced-search {
	display: flex;
	flex-direction: column;
	color: var(--color-main);
	flex-wrap: nowrap;
	border-radius: 2px;
	height: 71px;
	overflow: visible;
}
.rdl-advanced-search-input {
	color: var(--color-main);
}
.search-bar-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	box-sizing: border-box;
}
.form-control {
	width: calc(100vw - 150px);
	padding: 6px 12px;
	border-radius: 2px 0px 0px 2px;
	color: var(--color-main);
	background-color: var(--bg-default);
	padding: 20px 12px;
	height: 71px;
	border: none;
	/* display: block; */
	background-clip: padding-box;
	transition: all 0.7s linear;
	border-left: 1px solid var(--color-border-success);
	border-top: 1px solid var(--color-border-success);
	border-bottom: 1px solid var(--color-border-success);
	box-sizing: border-box;
}
.form-control:focus {
	width: calc(100vw - 150px);
}

.form-control::placeholder {
	color: var(--color-main);
}
.button-container {
	display: flex;
	flex-direction: row;
	width: 150px;
	min-width: 150px;
	position: relative;
	justify-content: flex-end;
	background-color: var(--bg-default);
	border-top: 1px solid var(--color-border-success);
	border-bottom: 1px solid var(--color-border-success);
	border-right: 1px solid var(--color-border-success);
	border-left: 0;
	border-radius: 0px 2px 2px 0px;
	box-sizing: border-box;
}
.btn-primary {
	display: block;
	width: 50px;
	margin-bottom: 0;
	cursor: pointer;
	background-color: var(--bg-default);
	border: 0;
}

#resetButton {
	position: absolute;
	width: 40px;
	right: 25px;
	top: 5px;
	color: #002e70;
	position: unset;
	width: unset;
	right: unset;
}

.btn-icon {
	display: inline-flex;
	align-items: center;
}

.btn-icon span {
	margin-left: auto;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.btn-outline-primary:focus,
.btn-outline-primary.focus {
	box-shadow: 0 0 0 0.2rem rgba(0, 46, 112, 0.5);
}

#bs-select-1-3 {
	border-top: 1px solid #d6d6d6;
}

/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	.btn-icon i {
		margin-left: initial;
	}

	.btn-primary {
		width: auto;
		margin-bottom: 0;
		color: #002e70;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: center;
		color: #002e70;
		margin-bottom: 0;
		border-radius: 0;
		cursor: pointer;
		display: flex;
	}
}
@media (min-width: 1280px) {
	.form-control {
		width: 340px;
	}
	.form-control.form-control-search {
		width: 1130px;
	}
	.form-control:focus {
		width: 1130px;
	}
}
</style>
