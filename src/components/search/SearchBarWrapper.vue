<template>
	<kb-searchbar
		:q="searchQuery"
		:reset-value="xReset"
		:background-img-url="backgroundImage"
	></kb-searchbar>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onBeforeMount, ref, computed, inject, watch, onMounted, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';

import '@/components/search/wc-searchbar';

export default defineComponent({
	name: 'SearchBarWrapper',
	setup() {
		const searchQuery = ref('');
		const preliminayFilter = ref('');
		const { t } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const router = useRouter();
		const route = useRoute();

		const searchResultStore = useSearchResultStore();
		const xReset = ref(false);

		onMounted(() => {
			if (searchResultStore.searchFired) {
				xReset.value = true;
			}
			if (route.query) {
				searchQuery.value = route.query.q as string;
			}
		});

		watch(searchQuery, (newValue, oldValue) => {
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

		watch(searchResultStore, (newValue, oldValue) => {
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
			xReset.value = false;
			router.push({ name: 'Home' });
		};

		const updateQuery = (e: CustomEvent) => {
			e.stopPropagation();
			e.preventDefault();
			searchQuery.value = e.detail.query;
			preliminayFilter.value = e.detail.filter;
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
			if (searchQuery.value) {
				if (preliminayFilter.value.length > 0) {
					router.push({ name: 'Home', query: { q: searchQuery.value, start: 0, fq: preliminayFilter.value } });
				} else {
					router.push({ name: 'Home', query: { q: searchQuery.value, start: 0 } });
				}
			}
		};

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
		};
	},
});
</script>

<style lang="scss" scoped></style>
