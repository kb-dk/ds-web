<template>
	<div class="search-box">
		<img
			:src="backgroundImage"
			title="search background"
			alt="Image of the Royal Danish Library"
			loading="lazy"
			class="bg-image"
		/>
		<div class="search-container">
			<div class="container main-12">
				<div class="row">
					<div class="col">
						<form
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
										spellcheck="false"
										autocomplete="off"
										type="search"
										:disabled="debounceMechanic ? true : false"
										id="focusSearchInput"
										class="form-control"
										:placeholder="t('search.searchInput')"
										name="simpleSearch"
										v-model="searchResultStore.currentQuery"
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
									@click="reset()"
								>
									<i
										class="material-icons"
										aria-hidden="true"
									>
										close
									</i>
								</button>
								<div class="rdl-advanced-radio">
									<label for="radio-btn-all">
										<input
											class="selectAll"
											type="radio"
											id="radio-btn-all"
											name="delimitation"
											value="all"
											checked
											@click="setPreliminaryFilter(delimitationOptions.all)"
										/>
										<span class="selectAllSpan">{{ t('search.all') }}</span>
									</label>
									<label for="radio-btn-tv">
										<input
											class="selectTv"
											type="radio"
											id="radio-btn-tv"
											name="delimitation"
											value="tv"
											@click="setPreliminaryFilter(delimitationOptions.tv)"
										/>
										<span class="selectTvSpan">{{ t('search.tv') }}</span>
									</label>
									<label for="radio-btn-radio">
										<input
											class="selectRadio"
											type="radio"
											id="radio-btn-radio"
											name="delimitation"
											value="radio"
											@click="setPreliminaryFilter(delimitationOptions.radio)"
										/>
										<span class="selectRadioSpan">{{ t('search.radio') }}</span>
									</label>
								</div>
								<button
									:disabled="debounceMechanic ? true : false"
									ref="searchButton"
									id="searchButton"
									type="submit"
									aria-label="search"
									class="btn btn-primary btn-icon"
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
		<div class="edge white"></div>
	</div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import Autocomplete from '@/components/search/Autocomplete.vue';
import router from '@/router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Searchbar',
	components: {
		Autocomplete,
	},

	setup() {
		const { t } = useI18n();

		const delimitationOptions = {
			all: '',
			tv: 'origin:"ds.tv"',
			radio: 'origin:"ds.radio"',
		};

		const searchResultStore = useSearchResultStore();
		const preliminaryFilter = ref('');
		const stopAutcomplete = ref(false);
		const debounceMechanic = ref(false);
		const keyStrokeEvent = ref<KeyboardEvent | undefined>(undefined);
		let AutocompleteTimer: ReturnType<typeof setTimeout>;

		watch(
			() => searchResultStore.currentQuery,
			(newStart: string, prevStart: string) => {
				if (newStart !== prevStart) {
					clearTimeout(AutocompleteTimer);
					if (!stopAutcomplete.value) {
						if (newStart.length < 2) {
							searchResultStore.autocompleteResult = [];
						}
						if (!searchResultStore.loading) {
							AutocompleteTimer = setTimeout(() => {
								getAutocompleteResponse(newStart);
							}, 300); // 1000 milliseconds (1 second) delay
						}
					} else {
						searchResultStore.autocompleteResult = [];
						stopAutcomplete.value = false;
					}
				}
			},
		);

		const updateKeystrokeForAutocomplete = (e: KeyboardEvent) => {
			keyStrokeEvent.value = e as KeyboardEvent;
		};

		const getAutocompleteResponse = (query: string) => {
			if (query !== undefined && query.length >= 2) {
				searchResultStore.getAutocompleteResults(query);
			}
		};

		const getBackgroundImage = () => {
			return require('@/assets/images/_Den_Sorte_Diamant-Laura_Stamer-min.jpg');
		};
		const backgroundImage = computed(() => {
			return getBackgroundImage();
		});

		const search = () => {
			stopAutcomplete.value = true;
			clearTimeout(AutocompleteTimer);
			debounceMechanic.value = true;
			setTimeout(() => {
				debounceMechanic.value = false;
			}, 500);
			if (preliminaryFilter.value.length > 0) {
				if (searchResultStore.sort !== null) {
					router.push({
						name: 'Home',
						query: { q: searchResultStore.currentQuery, start: 0, fq: preliminaryFilter.value },
					});
				} else {
					router.push({
						name: 'Home',
						query: {
							q: searchResultStore.currentQuery,
							start: 0,
							fq: preliminaryFilter.value,
							sort: searchResultStore.sort,
						},
					});
				}
			} else {
				if (searchResultStore.sort !== null) {
					router.push({ name: 'Home', query: { q: searchResultStore.currentQuery, start: 0 } });
				} else {
					router.push({
						name: 'Home',
						query: { q: searchResultStore.currentQuery, start: 0, sort: searchResultStore.sort },
					});
				}
			}
		};

		const reset = () => {
			searchResultStore.currentQuery = '';
			searchResultStore.loading = false;
			router.push({ name: 'Home' });
		};

		const setPreliminaryFilter = (value: string) => {
			preliminaryFilter.value = value;
			search();
		};

		return {
			searchResultStore,
			debounceMechanic,
			setPreliminaryFilter,
			delimitationOptions,
			search,
			reset,
			t,
			backgroundImage,
			updateKeystrokeForAutocomplete,
			keyStrokeEvent,
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
	z-index: 500z;
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
	/*overflow:hidden; */
	height: 100%;
	display: block;
	/* opacity: 0;
			transition: opacity 0.5s; */
}

.search-box {
	height: 100%;
	position: relative;
}

.bg-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	position: absolute;
}

.btn-icon i {
	margin-left: auto;
}

.edge {
	height: 31px;
}

.locked input {
	pointer-events: none;
	cursor: default;
}

.edge.white {
	width: 100%;
	position: absolute;
	background-color: white;
	clip-path: polygon(0 0, 0 100%, 100% 100%);
	margin-top: -30px;
}

.search-container {
	display: flex;
	height: 100%;
	background-image: url('https://design.kb.dk/components/assets/images/sourcesets/2/1280x560px_a.jpg');
	align-content: center;
	justify-content: center;
	align-items: center;
	background-size: cover;
	background-position: center;
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
	/* margin-right: -12px;
			margin-left: -12px;
			width: 100vw; */
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
	margin-top: -33px;
	margin-bottom: 22px;
	color: white;
	line-height: 48px;
	justify-content: space-evenly;
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
	/* #resetButton {
				right: calc(50% + 10px);
			} */
	.container {
		max-width: 990px;
	}
	/* .rdl-advanced-search-input {
				width: calc(50% - 12px);
				margin-bottom:0px;
			} */

	/* .rdl-advanced-search {
				flex-wrap: nowrap;
			} */
	/* .btn-primary {
				width: calc(50% - 12px);
			} */
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

	.btn-icon i {
		margin-left: initial;
	}

	.rdl-advanced-radio {
		position: absolute;
		top: 73px;
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
		font-size: 1rem;
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
