<template>
	<div class="sort">
		<span class="material-icons sort-icon">sort</span>
		<p class="sort-by">{{ t('search.sortBy') }}:</p>
		<button
			ref="relevanceRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-relevance`, 0)"
			@click="newSort($refs.relevanceRef, `score`)"
		>
			<p>{{ t('search.relevance') }}</p>
			<span class="material-icons">{{ sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</span>
		</button>
		<button
			ref="titleRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-title`, 0)"
			@click="newSort($refs.titleRef, `title_sort_da`)"
		>
			<p>{{ t('search.title') }}</p>
			<span class="material-icons">{{ sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</span>
		</button>
		<button
			ref="timeRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-time`, 0)"
			@click="newSort($refs.timeRef, `startTime`)"
		>
			<p>{{ t('search.date') }}</p>
			<span class="material-icons">{{ sortAsc ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</span>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Sort',
	setup() {
		const showSortingOptions = ref(false);
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();
		const sortAsc = ref(false);
		const titleRef = ref<HTMLElement | null>();
		const relevanceRef = ref<HTMLElement | null>();
		const timeRef = ref<HTMLElement | null>();
		const activeSort = ref<HTMLElement | null>();

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
				decodeURIComponent(active) === `title_sort_da ${getAscOrDesc(sortAsc.value)}`
					? titleRef.value?.classList.add('active')
					: titleRef.value?.classList.remove('active');
				decodeURIComponent(active) === `score ${getAscOrDesc(sortAsc.value)}`
					? relevanceRef.value?.classList.add('active')
					: relevanceRef.value?.classList.remove('active');
				decodeURIComponent(active) === `startTime ${getAscOrDesc(sortAsc.value)}`
					? timeRef.value?.classList.add('active')
					: timeRef.value?.classList.remove('active');
			} else {
				relevanceRef.value?.classList.add('active');
			}
		};

		const newSort = (clickedElement: HTMLButtonElement, sortValue: string) => {
			if (clickedElement.classList.contains('active')) {
				sortAsc.value = !sortAsc.value;
			} else {
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
			titleRef,
			relevanceRef,
			timeRef,
			addTestDataEnrichment,
			getAscOrDesc,
			activeSort,
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
}
.sort button {
	display: flex;
	flex-direction: row;
	margin-left: 0px;
	margin-right: 0px;
}
.sort button p {
	position: relative;
}

.sort .active p {
	border-bottom: 2px solid #002e70;
	box-sizing: border-box;
}

.sort > button > .material-icons {
	color: rgba(71, 71, 71, 0);
}

.sort .active .material-icons {
	color: #002e70;
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
	height: 20px;
}

.sort-options button {
	font-size: 16px;
	cursor: pointer;
	border: 0px;
	background-color: white;
	height: 20px;
	text-align: center;
	position: relative;
	top: 1px;
	padding: 0px;
	border-bottom: 2px solid transparent;
	padding-right: 5px;
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
