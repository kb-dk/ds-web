<template>
	<div class="sort">
		<span class="material-icons">sort</span>
		<p class="sort-by">{{ t('search.sortBy') }}:</p>
		<button
			ref="relevanceRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-relevance`, 0)"
			@click="newSort('score desc')"
		>
			{{ t('search.relevance') }}
		</button>
		<button
			ref="titleRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-title`, 0)"
			@click="newSort('title_sort_da asc')"
		>
			{{ t('search.title') }}
		</button>
		<button
			ref="timeRef"
			:data-testid="addTestDataEnrichment('button', 'sort', `sort-time`, 0)"
			@click="newSort('startTime asc')"
		>
			{{ t('search.date') }}
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Sort',
	setup() {
		const showSortingOptions = ref(false);
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();

		const titleRef = ref<HTMLElement | null>();
		const relevanceRef = ref<HTMLElement | null>();
		const timeRef = ref<HTMLElement | null>();

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
				decodeURIComponent(active) === 'title_sort_da asc'
					? titleRef.value?.classList.add('active')
					: titleRef.value?.classList.remove('active');
				decodeURIComponent(active) === 'score desc'
					? relevanceRef.value?.classList.add('active')
					: relevanceRef.value?.classList.remove('active');
				decodeURIComponent(active) === 'startTime asc'
					? timeRef.value?.classList.add('active')
					: timeRef.value?.classList.remove('active');
			} else {
				relevanceRef.value?.classList.add('active');
			}
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
			searchResultStore,
			t,
			titleRef,
			relevanceRef,
			timeRef,
			addTestDataEnrichment,
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

.sort .active {
	border-bottom: 2px solid #002e70;
	box-sizing: border-box;
}

.sort .material-icons {
	color: #002e70;
}

.sort-by {
	margin-right: auto !important;
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
	margin: 0px 7px;
	background-color: white;
	height: 20px;
	text-align: center;
	position: relative;
	top: 1px;
	padding: 0px;
	border-bottom: 2px solid transparent;
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
