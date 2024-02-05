<template>
	<kb-searchbar
		:q="searchQuery"
		:reset-value="xReset"
		:background-img-url="backgroundImage"
		:lang="locale"
		:spinner="searchResultStore.loading"
		:suggest="JSON.stringify(searchResultStore.AutocompleteResult)"
		:disable-search="debounceMechanic"
	></kb-searchbar>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onBeforeMount, ref, computed, inject, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';

import '@/components/search/wc-searchbar';

export default defineComponent({
	name: 'SearchBarWrapper',
	setup() {
		const searchQuery = ref('');
		const preliminaryFilter = ref('');
		const { t, locale } = useI18n();
		const stopAutcomplete = ref(true);
		const errorManager = inject('errorManager') as ErrorManagerType;
		const router = useRouter();
		const route = useRoute();
		let AutocompleteTimer: ReturnType<typeof setTimeout> | null = null;
		const debounceMechanic = ref(false);

		const searchResultStore = useSearchResultStore();
		const xReset = ref(false);

		onMounted(() => {
			if (searchResultStore.searchFired) {
				xReset.value = true;
			}
			if (route.query) {
				searchQuery.value = route.query.q as string;
			}

			window.onpopstate = function () {
				searchQuery.value = route.query.q as string;
			};
		});

		watch(searchQuery, (newValue) => {
			if (
				(newValue?.length !== 0 && newValue !== undefined) ||
				searchResultStore.searchResult.length !== 0 ||
				searchResultStore.searchFired === true
			) {
				xReset.value = true;
			} else {
				xReset.value = false;
			}
		});

		watch(searchResultStore, () => {
			if (
				(searchQuery.value?.length !== 0 && searchQuery.value !== undefined) ||
				searchResultStore.searchResult.length !== 0 ||
				searchResultStore.searchFired
			) {
				xReset.value = true;
			} else {
				xReset.value = false;
			}
		});

		const getBackgroundImage = () => {
			return require('@/assets/images/_Den_Sorte_Diamant-Laura_Stamer-min.jpg');
			/* return res.pages && res.pages.length > 0
        ? res.pages[0].replace(/.info.json$/, '/full/!250,150/0/native.jpg')
        : require('@/assets/images/No-Image-Placeholder.svg.png'); */
		};

		const backgroundImage = computed(() => {
			return getBackgroundImage();
		});

		const updateWrapper = (e: Event) => {
			updateQuery(e as CustomEvent);
		};

		const reset = () => {
			searchQuery.value = '';
			searchResultStore.loading = false;
			xReset.value = false;
			router.push({ name: 'Home' });
		};

		const getAutocompleteResponse = (query: string) => {
			if (query !== undefined && query.length >= 2) {
				searchResultStore.getAutocompleteResults(query);
			}
		};

		const updateQuery = (e: CustomEvent) => {
			e.stopPropagation();
			e.preventDefault();
			searchQuery.value = e.detail.query;
			preliminaryFilter.value = e.detail.filter;
		};

		const handleError = (e: Event) => {
			//Maybe we could abstract this out in some kind og util method
			const customEvent = e as CustomEvent;
			const errorKey = customEvent.detail.message;
			if (customEvent.detail.customError) {
				errorManager.submitCustomError(errorKey, t(`error.${errorKey}`));
			}
		};

		const search = () => {
			stopAutcomplete.value = true;
			if (AutocompleteTimer !== null) {
				clearTimeout(AutocompleteTimer);
			}
			debounceMechanic.value = true;
			setTimeout(() => {
				debounceMechanic.value = false;
			}, 500);
			if (searchQuery.value) {
				if (preliminaryFilter.value.length > 0) {
					if (searchQuery.value !== searchResultStore.currentQuery) {
						router.push({
							name: 'Home',
							query: { q: searchQuery.value, start: 0, fq: preliminaryFilter.value },
						});
					} else {
						router.push({
							name: 'Home',
							query: { q: searchQuery.value, start: 0, fq: preliminaryFilter.value, sort: searchResultStore.sort },
						});
					}
				} else {
					if (searchQuery.value !== searchResultStore.currentQuery) {
						router.push({ name: 'Home', query: { q: searchQuery.value, start: 0 } });
					} else {
						router.push({ name: 'Home', query: { q: searchQuery.value, start: 0, sort: searchResultStore.sort } });
					}
				}
			}
		};

		watch(
			() => searchQuery.value,
			(newStart: string, prevStart: string) => {
				if (newStart !== prevStart) {
					if (!stopAutcomplete.value) {
						if (newStart?.length < 2) {
							searchResultStore.AutocompleteResult = [];
						}
						if (AutocompleteTimer !== null) {
							clearTimeout(AutocompleteTimer);
						}
						if (!searchResultStore.loading) {
							AutocompleteTimer = setTimeout(() => {
								getAutocompleteResponse(newStart);
							}, 300); // 1000 milliseconds (1 second) delay
						}
					} else {
						searchResultStore.AutocompleteResult = [];
						if (AutocompleteTimer !== null) {
							clearTimeout(AutocompleteTimer);
						}
						stopAutcomplete.value = false;
					}
				}
			},
		);

		const resetInput = () => {
			searchQuery.value = '';
		};

		onBeforeMount(() => {
			window.addEventListener('component-error', handleError);
			window.addEventListener('query-update', updateWrapper);
			window.addEventListener('query-search', search);
			window.addEventListener('reset-search', reset);
			window.addEventListener('reset-input', resetInput);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('component-error', handleError);
			window.removeEventListener('query-update', updateWrapper);
			window.removeEventListener('query-search', search);
			window.removeEventListener('reset-search', reset);
			window.removeEventListener('reset-input', resetInput);
		});

		return {
			backgroundImage,
			xReset,
			searchResultStore,
			searchQuery,
			locale,
			debounceMechanic,
		};
	},
});
</script>

<style lang="scss" scoped></style>
