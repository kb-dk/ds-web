<template>
	<div class="search-box">
		<div class="search-container">
			<div class="container main-12">
				<div class="row">
					<div class="col">
						<form
							ref="searchFormRef"
							class="searchform"
							action=" "
							method=" "
							role="search"
							@submit.prevent="search()"
						>
							<div
								role="group"
								:class="debounceMechanic ? 'rdl-advanced-search locked' : 'rdl-advanced-search'"
							>
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
										class="form-control"
										:placeholder="searchResultStore.searchFired ? '' : t(`search.placeholders.${selectedPortal}`)"
										name="simpleSearch"
										:data-testid="addTestDataEnrichment('input', 'searchbar', 'search-field', 0)"
										@keydown="updateKeystrokeForAutocomplete"
									/>
									<Transition name="fade">
										<div class="autocomplete-container">
											<Autocomplete :keystroke="keyStrokeEvent" />
										</div>
									</Transition>
								</div>
								<div
									v-if="searchResultStore.loading"
									class="spinner-container"
								>
									<div
										:aria-busy="searchResultStore.loading ? true : false"
										:class="searchResultStore.loading ? 'spinner show' : 'spinner hide'"
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
								<div class="dropdown bootstrap-select">
									<button
										ref="selectButtonRef"
										type="button"
										class="btn dropdown-toggle btn-outline-primary"
										data-toggle="dropdown"
										role="combobox"
										aria-haspopup="listbox"
										aria-expanded="false"
										title="Select portal"
										aria-controls="searchbar-select-portal"
										:data-testid="addTestDataEnrichment('button', 'portal', 'select-portal-toggle', 0)"
										@click="togglePortalSelector()"
									>
										<div class="filter-option">
											<div class="filter-option-inner">
												<div class="filter-option-inner-inner">
													{{ t(`search.portals.${selectedPortal}`) }}
												</div>
											</div>
										</div>
									</button>
									<div
										:class="showPortalSelector ? 'dropdown-menu select-show' : 'dropdown-menu'"
										style=""
									>
										<div
											id="bs-select-1"
											class="inner show"
											role="listbox"
											tabindex="1"
										>
											<ul
												class="dropdown-menu-inner inner show"
												role="presentation"
												style="margin-top: 0px; margin-bottom: 0px"
											>
												<li
													role="option"
													class="selected active"
												>
													<button
														type="button"
														class="dropdown-item"
														:title="t(`search.portals.${selectorValues[0].name}`)"
														:data-testid="addTestDataEnrichment('button', 'portal', 'drarchive', 0)"
														@click="selectPortal(0)"
													>
														<span class="text">
															{{ t(`search.portals.${selectorValues[0].name}`) }}
														</span>
													</button>
												</li>
												<li role="option">
													<button
														type="button"
														class="dropdown-item"
														:title="t(`search.portals.${selectorValues[1].name}`)"
														:data-testid="addTestDataEnrichment('button', 'portal', 'primo', 0)"
														@click="selectPortal(1)"
													>
														<span class="text">
															{{ t(`search.portals.${selectorValues[1].name}`) }}
														</span>
													</button>
												</li>
												<li role="option">
													<button
														type="button"
														class="dropdown-item"
														:title="t(`search.portals.${selectorValues[2].name}`)"
														:data-testid="addTestDataEnrichment('button', 'portal', 'kbdk', 0)"
														@click="selectPortal(2)"
													>
														<span class="text">
															{{ t(`search.portals.${selectorValues[2].name}`) }}
														</span>
													</button>
												</li>
												<li role="option">
													<button
														type="button"
														class="dropdown-item"
														:title="t(`search.portals.${selectorValues[3].name}`)"
														:data-testid="addTestDataEnrichment('button', 'portal', 'webshop', 0)"
														@click="selectPortal(3)"
													>
														<span class="text">
															{{ t(`search.portals.${selectorValues[3].name}`) }}
														</span>
													</button>
												</li>
												<li role="option">
													<a
														:title="t(`search.portals.${selectorValues[4].name}`)"
														class="dropdown-item"
														:href="'https://www.kb.dk/find-materiale'"
														:data-testid="addTestDataEnrichment('link', 'portal', 'all-materials', 0)"
													>
														<span class="text">
															{{ t(`search.portals.${selectorValues[4].name}`) }}
														</span>
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
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
									<span class="d-none d-search-inline-flex searchSpan">{{ t('search.searchbtn') }}</span>
									<span class="d-inline-flex d-search-none searchHereSpan">{{ t('search.searchHere') }}</span>
									<i
										class="material-icons"
										aria-hidden="true"
									>
										search
									</i>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import Autocomplete from '@/components/search/Autocomplete.vue';
import { LocationQueryRaw } from 'vue-router';
import router from '@/router';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import gsap from 'gsap';
import { PortalSelectItem } from '@/types/SearchBarTypes';

export default defineComponent({
	name: 'Searchbar',
	components: {
		Autocomplete,
	},

	setup() {
		const { t } = useI18n();
		const visibleSearchfield = ref(true);
		const searchResultStore = useSearchResultStore();
		const debounceMechanic = ref(false);
		const keyStrokeEvent = ref<KeyboardEvent | undefined>(undefined);
		let AutocompleteTimer: ReturnType<typeof setTimeout>;
		const searchFormRef = ref<HTMLFormElement | null>(null);
		const showPortalSelector = ref(false);
		const selectedPortal = ref('drArchive');
		const selectButtonRef = ref<HTMLButtonElement | null>(null);
		const selectorValues: PortalSelectItem[] = [
			{
				name: 'drArchive',
				destination: '',
			},
			{
				name: 'booksAndMaterials',
				destination:
					'https://soeg.kb.dk/discovery/search?query=any,contains,sq&tab=Everything&search_scope=MyInst_and_CI&vid=45KBDK_KGL:KGL&lang=',
			},
			{
				name: 'kbdk',
				destination: 'https://www.kb.dk/search/site?search_api_fulltext=sq&search_type=kbdk',
			},
			{
				name: 'webshop',
				destination: 'https://webshop.kb.dk/?s=sq&post_type=product',
			},
			{
				name: 'seeAllMaterials',
				destination: '',
			},
		];

		onMounted(() => {
			window.addEventListener('toggle-search', toggleSearchField);
		});

		onUnmounted(() => {
			window.removeEventListener('toggle-search', toggleSearchField);
		});

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

		const toggleSearchField = () => {
			if (visibleSearchfield.value) {
				gsap.to(searchFormRef.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
					opacity: 1,
					overflow: 'hidden',
					onComplete: () => {
						gsap.set(searchFormRef.value, {
							display: 'none',
							overwrite: true,
						});
					},
				});
			} else {
				gsap.set(searchFormRef.value, {
					display: 'block',
					overwrite: true,
					onComplete: () => {
						gsap.to(searchFormRef.value, {
							height: 'auto',
							duration: 0.5,
							overwrite: true,
							opacity: 1,
							onComplete: () => {
								gsap.set(searchFormRef.value, {
									overflow: 'visible',
								});
							},
						});
					},
				});
			}
			visibleSearchfield.value = !visibleSearchfield.value;
		};

		const updateKeystrokeForAutocomplete = (e: KeyboardEvent) => {
			keyStrokeEvent.value = e;
		};

		const getAutocompleteResponse = (query: string) => {
			if (
				query !== undefined &&
				query.length >= 3 &&
				!searchResultStore.blockAutocomplete &&
				selectedPortal.value === 'drArchive'
			) {
				searchResultStore.getAutocompleteResults(query);
			}
		};

		const search = () => {
			if (selectedPortal.value === 'drArchive') {
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
					q: searchResultStore.currentQuery,
					start: 0,
				};

				searchResultStore.preliminaryFilter = '';

				query.sort = encodeURIComponent(`score desc`);

				router.push({
					name: 'Search',
					query: query,
				});
			} else {
				let URL = selectorValues.find((item) => item.name === selectedPortal.value)?.destination;
				if (URL) {
					URL = URL.replace(/sq/g, encodeURIComponent(searchResultStore.currentQuery));
					window.location.href = URL;
				}
			}
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

		const togglePortalSelector = () => {
			showPortalSelector.value = !showPortalSelector.value;
		};

		const selectPortal = (selected: number) => {
			selectedPortal.value = selectorValues[selected].name;
			togglePortalSelector();
			(document.querySelector('#focusSearchInput') as HTMLInputElement)?.focus();
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
			togglePortalSelector,
			showPortalSelector,
			selectPortal,
			selectButtonRef,
			selectedPortal,
			selectorValues,
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
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	-webkit-font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
}

.autocomplete-container {
	position: relative;
	z-index: 10;
}

#searchButton,
#focusSearchInput,
.rdl-advanced-radio {
	transition: color 0.1s linear 0s;
}

.locked {
	/* https://jxnblk.github.io/grays/ */
	color: #767676;
}

.locked #searchButton,
.locked #focusSearchInput,
.locked .rdl-advanced-radio {
	/* https://jxnblk.github.io/grays/ */
	color: #767676;
}

:host {
	max-width: 100vw;
	height: 100%;
	display: block;
}

.searchform {
	overflow: visible;
}

.search-box {
	height: 100%;
	position: relative;
	z-index: 6;
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
	background-size: cover;
	background-position: center;
	background-color: #caf0fe;
}

.btn-icon {
	display: inline-flex;
	align-items: center;
	padding-top: 12px;
	padding-right: 8px;
	padding-bottom: 12px;
}

textarea:focus,
input:focus {
	outline: none;
}
/* For .rdl-advanced-search and .rdl-spot-search .rdl-advanced-search */
.container {
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
	width: 100%;
	/* display: flex;
			align-content: center;
			flex-wrap: wrap; */
}

.spinner-container {
	width: 30px;
	position: absolute;
	right: 60px;
}

.spinner {
	width: 100%;
	--spinner-color: #171717;
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
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	color: #171717;
	margin-bottom: 12px;
	border: 0px solid #f5f5f5;
	box-shadow: 0 0px 0px rgba(0, 0, 0, 0.24);
	border-radius: 0px;
}
.rdl-advanced-search-input {
	background-color: white;
	margin-bottom: 32px;
	width: 100%;
}
.form-control {
	width: 100%;
	padding: 6px 12px;
	border: 1px solid #757575;
	border-radius: 2px;
	height: 3rem;
	padding: 0.375rem 0.75rem;
}
.col {
	flex-basis: 0;
	flex-grow: 1;
	max-width: 100%;
	position: relative;
	width: 100%;
	/* 			padding-right: 12px;
			padding-left: 12px; */
}
.row {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}

.btn-primary {
	display: block;
	width: 100%;
	color: #fff;
	padding: 0 22px;
	background: #002e70;
	margin-bottom: 0;
	border-radius: 2px;
	padding: 13px 2.875rem;
	font-size: 1rem;
	line-height: 1.25rem;
	border-radius: 0.25rem;
	cursor: pointer;
	border: none;
}

#resetButton {
	position: absolute;
	width: 40px;
	right: 25px;
	padding-left: 0px;
	padding-top: 7px;
	padding-bottom: 7px;
	top: 5px;
	background-color: transparent;
	color: #002e70;
}

.btn-icon {
	display: inline-flex;
	align-items: center;
	padding-top: 12px;
	padding-right: 8px;
	padding-bottom: 12px;
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

.rdl-advanced-radio {
	background-color: #002e70;
	display: flex;
	width: calc(100% - 1px);
	height: 48px;
	margin-bottom: 22px;
	color: white;
	line-height: 48px;
	justify-content: space-evenly;
	position: absolute;
	top: -47px;
}

.rdl-advanced-radio label,
.rdl-advanced-radio input {
	cursor: pointer;
}

.rdl-advanced-radio label {
	margin-right: 15px;
}

.d-none {
	display: none;
}

.btn-outline-primary:focus,
.btn-outline-primary.focus {
	box-shadow: 0 0 0 0.2rem rgba(0, 46, 112, 0.5);
}

.bootstrap-select {
	width: auto;
	min-width: 220px;
	margin-bottom: 0;
	position: relative;
	vertical-align: middle;
	display: none;
	width: 100%;
	border: 1px solid black;
	height: 48px;
	margin-bottom: 26px;
	border-radius: 0.25rem;
}

.selectpicker {
	position: absolute !important;
	bottom: 0;
	left: 50%;
	display: block !important;
	width: 0.5px !important;
	height: 100% !important;
	padding: 0 !important;
	opacity: 0 !important;
	border: none;
	z-index: 0 !important;
}

.dropdown-toggle {
	position: relative;
	width: 100%;
	text-align: right;
	white-space: nowrap;
	display: inline-flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 2px;
	padding: 0.375rem 0.75rem;
	height: 3rem;
	font-size: 1rem;
	line-height: 2.25rem;
	margin-bottom: 0;
	padding: 20px 12px;
	height: 72px;
	border: none;
	background: white;
	font-family: 'noway', sans-serif;
	cursor: pointer;
	overflow: hidden;
	text-overflow: ellipsis;
	color: #002e70;

	width: 100%;
	padding: 6px 12px;
	height: auto;
}

.dropdown-toggle::after {
	vertical-align: middle;
	margin-left: 1rem;
	border: none;
	content: 'expand_more';
	font-family: 'Material Icons', serif;
	font-weight: normal;
	font-style: normal;
	font-size: 24px;
	display: inline-block;
	line-height: 1;
	text-transform: none;
	letter-spacing: normal;
	word-wrap: normal;
	white-space: nowrap;
	direction: ltr;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	-moz-osx-font-smoothing: grayscale;
	font-feature-settings: 'liga';
}

.dropdown-menu-inner li:last-child {
	border-top: 1px solid #d6d6d6;
}

.filter-option {
	position: static;
	top: 0;
	left: 0;
	float: left;
	height: 100%;
	width: 100%;
	text-align: left;
	overflow: hidden;
	flex: 0 1 auto;
}

.dropdown-item {
	display: block;
	width: 100%;
	padding: 0.75rem 0.75rem;
	clear: both;
	font-weight: 400;
	color: #171717;
	text-align: inherit;
	text-decoration: none;
	white-space: nowrap;
	background-color: transparent;
	border: 0;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 5;
	display: none;
	float: left;
	min-width: 10rem;
	padding: 0 0;
	margin: 0.125rem 0 0;
	font-size: 1rem;
	color: #212529;
	text-align: left;
	list-style: none;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid rgba(0, 0, 0, 0.15);
	border-radius: 0.125rem;
	min-width: 100%;
}

.dropdown-menu-inner {
	position: absolute;
	top: 100%;
	left: 0;
	z-index: 5;
	float: left;
	min-width: 10rem;
	padding: 0 0;
	margin: 0.125rem 0 0;
	font-size: 1rem;
	color: #212529;
	text-align: left;
	list-style: none;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid #f5f5f5;
	border-radius: 0.125rem;
	min-width: 100%;
	margin-left: -2px;
	top: -2px;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.12);
}

.dropdown-menu-inner button,
.dropdown-menu-inner a {
	font-family: 'noway', sans-serif;
	font-size: 16px;
	transition: all 0.3s linear 0s;
}

.dropdown-menu-inner button:hover,
.dropdown-menu-inner a:hover {
	color: #002e70;
	background-color: #f2f4f8;
	cursor: pointer;
}

.dropdown-menu.select-show {
	display: block;
}
#bs-select-1-3 {
	border-top: 1px solid #d6d6d6;
}

#bs-select-1-3:after {
	content: 'link';
	float: right;
	line-height: 1.5rem;
	font-family: 'Material Icons';
	font-size: 24px;
	transform: translate(-100%, 0px);
}

.bootstrap-select .dropdown-menu li {
	position: relative;
	padding: 0;
	margin: 0;
	overflow: hidden;
}

.bootstrap-select .dropdown-menu.inner {
	position: static;
	float: none;
	border: 0;
	padding: 0;
	margin: 0;
	border-radius: 0;
	box-shadow: none;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.rdl-advanced-radio {
		width: 50%;
	}

	.bootstrap-select {
		display: block;
	}

	.container {
		max-width: 990px;
	}

	.bootstrap-select {
		width: calc(50% - 10px);
		box-sizing: border-box;
	}

	.dropdown-toggle {
		height: 46px;
	}

	#searchButton {
		width: calc(50% - 10px);
		box-sizing: border-box;
		height: 48px;
	}
}
/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	.spinner-container {
		background-color: white;
		display: flex;
		right: initial;
		margin-top: initial;
		position: initial;
		width: 48px;
	}

	#searchButton {
		width: auto;
		height: auto;
	}

	.dropdown-toggle {
		height: 72px;
		padding: 20px 12px;
	}

	.dropdown-menu {
		top: 71px;
	}

	.bootstrap-select {
		border: 0px;
		margin-bottom: 0px;
		width: auto;
	}

	.btn-icon i {
		margin-left: initial;
	}

	.rdl-advanced-radio {
		position: absolute;
		top: -40px;
		left: 0px;
		margin-top: unset;
		margin-bottom: unset;
		width: auto;
		padding: 5px 20px;
		height: 30px;
		line-height: 30px;
	}

	#resetButton {
		position: unset;
		width: unset;
		right: unset;
		padding: 0 22px;
		background: #fff;
	}

	.d-search-none {
		display: none;
	}

	.d-none {
		display: block;
	}

	.btn-primary {
		width: auto;
		margin-bottom: 0;
		color: #002e70;
		background-color: #fff;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: center;
		color: #002e70;
		padding: 0 22px;
		background: #fff;
		margin-bottom: 0;
		border-radius: 0;
		cursor: pointer;
		border: none;
		display: flex;
	}

	.rdl-advanced-search {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		color: #171717;
		margin-bottom: 12px;
		flex-wrap: nowrap;
		border: 1px solid #f5f5f5;
		box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
		border-radius: 2px;
		height: 71px;
	}
	.rdl-advanced-search-input {
		width: 100%;
	}
	.form-control {
		padding: 20px 12px;
		height: 72px;
		border: none;
		display: block;
		width: 100%;
		font-size: 1.01rem;
		font-weight: 400;
		line-height: 1.5;
		color: #495057;
		background-color: #fff;
		background-clip: padding-box;
		border-radius: 2px;
		transition:
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		/* flex-direction: column; */
		max-width: 1150px;
	}

	.spinner-container {
		background-color: white;
		display: flex;
		right: initial;
		margin-top: initial;
		position: initial;
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
		/* padding-right: 0;
				padding-left: 0; */
	}
}
</style>
