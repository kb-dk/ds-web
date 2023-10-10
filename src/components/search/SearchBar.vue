<template>
	<kb-searchbar
		:query="query"
		:background="backgroundImage"
	></kb-searchbar>
	{{ query }}
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onBeforeMount, ref, computed, inject, watch } from 'vue';
import './search-component';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { ErrorManagerType } from '@/types/ErrorManagerType';

export default defineComponent({
	name: 'SearchBar',
	setup() {
		const searchQuery = ref('');
		const { t } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const router = useRouter();

		watch(router.currentRoute, (newValue, oldValue) => {
			console.log('route change!', newValue.query.q);
			const newQuery = newValue.query.q as string;
			if (newQuery !== null) {
				searchQuery.value = newQuery;
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

		const query = computed(() => {
			return searchQuery.value;
		});

		const updateWrapper = (e: Event) => {
			updateQuery(e as CustomEvent);
		};

		const reset = () => {
			console.log('YEP', router);
			router.replace({ path: '/' });
		};

		const updateQuery = (e: CustomEvent) => {
			e.stopPropagation();
			e.preventDefault();
			searchQuery.value = e.detail.query;
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
				router.push({ name: 'Home', query: { q: searchQuery.value } });
			}
		};

		onBeforeMount(() => {
			console.log('MOUNTING AGAIN');
			window.addEventListener('component-error', handleError);
			window.addEventListener('query-update', updateWrapper);
			window.addEventListener('query-search', search);
			window.addEventListener('reset-search', reset);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('component-error', handleError);
			window.removeEventListener('query-update', updateWrapper);
			window.removeEventListener('query-search', search);
			window.removeEventListener('reset-search', reset);
		});

		return {
			backgroundImage,
			query,
		};
	},
});
</script>

<style lang="scss" scoped></style>
