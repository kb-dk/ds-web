<template>
	<div class="sort">
		<div class="sort-label">
			<span class="material-icons sort-icon">sort</span>
			<p class="sort-by">{{ t('search.sortBy') }}:</p>
		</div>

		<KBButtonSort
			class="btn-reg"
			left-icon-name="search"
			:active="activeIndex === 0"
			:button-text="t('search.relevance')"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-relevance`, 0)"
			@click="newSort(0, `score`)"
		></KBButtonSort>
		<KBButtonSort
			class="btn-reg"
			:active="activeIndex === 1"
			:has-arrow-icons="true"
			:button-text="t('search.title')"
			:is-asc-sort="sortAsc"
			:is-desc-sort="!sortAsc"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-title`, 0)"
			@click="newSort(1, `title_sort_da`)"
		></KBButtonSort>
		<KBButtonSort
			class="btn-reg"
			:active="activeIndex === 2"
			:has-arrow-icons="true"
			:button-text="t('search.date')"
			:is-asc-sort="sortAsc"
			:is-desc-sort="!sortAsc"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-time`, 0)"
			@click="newSort(2, `startTime`)"
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
	components: {
		KBButtonSort,
	},
	setup() {
		const showSortingOptions = ref(false);
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();
		const sortAsc = ref(false);
		const activeIndex = ref(-1);
		const revealSortingOptions = () => {
			showSortingOptions.value = !showSortingOptions.value;
		};

		watch(
			() => route,
			(newSortValue) => {
				setCurrentActive(newSortValue.query.sort as string);
			},
			{ deep: true },
		);

		const setCurrentActive = (active: string | undefined) => {
			if (active) {
				if (decodeURIComponent(active) === `title_sort_da ${getAscOrDesc(sortAsc.value)}`) {
					activeIndex.value = 1;
				} else if (decodeURIComponent(active) === `startTime ${getAscOrDesc(sortAsc.value)}`) {
					activeIndex.value = 2;
				} else {
					activeIndex.value = 0;
				}
			}
		};

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
			sortValue = `${sortValue} ${getAscOrDesc(sortAsc.value)}`;
			const sort = encodeURIComponent(`${sortValue}`);
			const start = `${0}`;
			const query = { ...route.query, sort, start };
			router.push({ query });
			showSortingOptions.value = false;
			searchResultStore.resetStart();
		};

		const getAscOrDesc = (sortAsc: boolean): string => {
			return sortAsc ? 'asc' : 'desc';
		};

		onMounted(() => {
			if (route.query.sort) {
				const sortingValue = route.query.sort as string;
				searchResultStore.setSortValue(decodeURIComponent(sortingValue));
				setCurrentActive(route.query.sort as string);
			} else {
				setCurrentActive(route.query.sort as string);
				searchResultStore.setSortValue('score desc');
			}
		});

		return {
			revealSortingOptions,
			showSortingOptions,
			newSort,
			sortAsc,
			searchResultStore,
			t,

			addTestDataEnrichment,
			getAscOrDesc,

			activeIndex,
		};
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
	color: #002e70;
}

.sort-icon {
	color: #002e70;
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
