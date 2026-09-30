<template>
	<div class="sort">
		<div class="sort-label">
			<span
				class="material-icons sort-icon"
				aria-hidden="true"
			>
				sort
			</span>
			<p class="sort-by">{{ t('search.sortBy') }}:</p>
		</div>
		<KBButtonSort
			class="btn-reg"
			left-icon-name="search"
			:active="activeIndex === 0"
			:button-text="t('search.relevance')"
			:data-testid="addTestDataEnrichment('button', 'sort', 'sort-relevance', 0)"
			@click="newSort(0, 'score')"
		></KBButtonSort>
		<KBButtonSort
			class="btn-reg"
			:active="activeIndex === 1"
			:has-arrow-icons="true"
			:button-text="t('search.title')"
			:is-asc-sort="activeIndex === 1 && sortAsc"
			:is-desc-sort="activeIndex === 1 && !sortAsc"
			:data-testid="addTestDataEnrichment('button', 'sort', 'sort-title', 0)"
			@click="newSort(1, 'title_sort_da')"
		></KBButtonSort>
		<KBButtonSort
			class="btn-reg"
			:active="activeIndex === 2"
			:has-arrow-icons="true"
			:button-text="t('search.date')"
			:is-asc-sort="activeIndex === 2 && sortAsc"
			:is-desc-sort="activeIndex === 2 && !sortAsc"
			:data-testid="addTestDataEnrichment('button', 'sort', 'sort-time', 0)"
			@click="newSort(2, 'startTime')"
		></KBButtonSort>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import KBButtonSort from '@/components/common/KBButtonSort.vue';
export default defineComponent({
	name: 'Sort',
	components: { KBButtonSort },
	setup() {
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();
		const sortAsc = ref(false);
		const activeIndex = ref(-1);
		const setCurrentActive = (sort: string | undefined) => {
			if (!sort) {
				activeIndex.value = 0;
				sortAsc.value = false;
				return;
			}
			const decodedSort = decodeURIComponent(sort);
			const [sortField, direction] = decodedSort.split(' ');
			sortAsc.value = direction === 'asc';
			switch (sortField) {
				case 'title_sort_da':
					activeIndex.value = 1;
					break;
				case 'startTime':
					activeIndex.value = 2;
					break;
				default:
					activeIndex.value = 0;
					sortAsc.value = false;
					break;
			}
		};
		watch(
			() => route.query.sort,
			(newSortValue) => {
				setCurrentActive(newSortValue as string | undefined);
			},
		);
		const newSort = (clickedElement: number, sortValue: string) => {
			if (clickedElement === 0 && activeIndex.value === 0) {
				return;
			}
			if (activeIndex.value === clickedElement) {
				sortAsc.value = !sortAsc.value;
			} else {
				activeIndex.value = clickedElement;
				sortAsc.value = false;
			}
			const sort = `${sortValue} ${getAscOrDesc(sortAsc.value)}`;
			const start = '0';
			router.push({ query: { ...route.query, sort, start } });
		};
		const getAscOrDesc = (sortAsc: boolean): string => {
			return sortAsc ? 'asc' : 'desc';
		};
		onMounted(() => {
			const sortingValue = route.query.sort as string | undefined;
			if (sortingValue) {
				searchResultStore.setSortValue(decodeURIComponent(sortingValue));
				setCurrentActive(sortingValue);
			} else {
				searchResultStore.setSortValue('score desc');
				setCurrentActive(undefined);
			}
		});
		return { newSort, sortAsc, searchResultStore, t, addTestDataEnrichment, getAscOrDesc, activeIndex };
	},
});
</script>
<style scoped>
.sort {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	padding-top: 20px;
	justify-content: space-between;
	flex-wrap: wrap;
}
.sort-label {
	display: inline-flex;
	flex-direction: row;
	padding: var(--padding-00, 10px) var(--padding-medium);
	gap: var(--padding-02);
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	border-bottom: 1px solid transparent;
	box-sizing: border-box;
}
.material-icons {
	position: relative;
}
.sort-by {
	margin-right: 10px !important;
}
.sort p {
	margin: 0;
	padding: 0;
	color: var(--color-default);
}
.sort-icon {
	color: var(--color-default);
}
@media (min-width: 640px) {
	.sort-by {
		margin-right: initial;
	}
	.sort {
		justify-content: initial;
	}
}
</style>
