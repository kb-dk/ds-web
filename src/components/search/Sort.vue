<template>
	<div class="sort">
		<span class="material-icons">sort</span>
		<p ref="currentSort">{{ t('search.sortBy') }}:</p>

		<button @click="newSort('title_sort_da asc')">{{ t('search.title') }}</button>
		<button @click="newSort('score desc')">{{ t('search.score') }}</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

export default defineComponent({
	name: 'Sort',
	setup() {
		const showSortingOptions = ref(false);
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();

		const revealSortingOptions = () => {
			showSortingOptions.value = !showSortingOptions.value;
		};

		const newSort = (sortValue: string) => {
			const sort = encodeURIComponent(`${sortValue}`);
			const start = `${0}`;
			const query = { ...route.query, sort, start };
			router.push({ query });
			showSortingOptions.value = false;
			searchResultStore.resetStart();
		};

		onMounted(() => {
			if (route.query.sort) {
				const sortingValue = route.query.sort as string;
				searchResultStore.setSortValue(sortingValue.split('%20')[0]);
			}
		});

		return { revealSortingOptions, showSortingOptions, newSort, searchResultStore, t };
	},
});
</script>

<style scoped>
.sort {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	padding-top: 20px;
}

.sort .material-icons {
	color: #002e70;
}

.sort p {
	margin: 0;
	padding: 0;
	color: #002e70;
	height: 20px;
	margin-left: 5px;
}

.sort-options button {
	font-size: 16px;
	cursor: pointer;
	border: 0px;
	padding: 0px 7px;
	background-color: white;
	height: 20px;
	text-align: center;
	position: relative;
	top: 1px;
}
</style>
