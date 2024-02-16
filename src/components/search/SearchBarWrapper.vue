<template>
	<SearchBar />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onBeforeMount, ref, computed, inject, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import SearchBar from '@/components/search/SearchBar.vue';
/* import '@/components/search/wc-searchbar'; */

export default defineComponent({
	name: 'SearchBarWrapper',
	setup() {
		const { t, locale } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const searchResultStore = useSearchResultStore();

		const handleError = (e: Event) => {
			//Maybe we could abstract this out in some kind og util method
			const customEvent = e as CustomEvent;
			const errorKey = customEvent.detail.message;
			if (customEvent.detail.customError) {
				errorManager.submitCustomError(errorKey, t(`error.${errorKey}`));
			}
		};

		onBeforeMount(() => {
			window.addEventListener('component-error', handleError);
		});
		onBeforeUnmount(() => {
			window.removeEventListener('component-error', handleError);
		});
		return {
			searchResultStore,
			locale,
		};
	},
	components: { SearchBar },
});
</script>

<style lang="scss" scoped></style>
