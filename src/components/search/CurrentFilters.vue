<template>
	<Transition name="fade">
		<div
			v-if="filtersActive"
			class="appliedFilters"
		>
			<TransitionGroup name="fade">
				<span
					v-if="filtersActive"
					key="1"
					class="label-regular"
				>
					{{ $t('search.selected') }}:
				</span>
				<div
					key="2"
					class="filter-group"
				>
					<div v-if="searchResultStore.channelFilters.length !== 0">
						<KBButton
							v-for="(channel, index) in searchResultStore.channelFilters"
							:key="index"
							class="label-regular"
							:button-text="`${extractFilterText(channel)}`"
							button-type="btn-tag"
							button-color="main"
							button-size="small"
							right-icon-name="close"
							@click="removeSingleFilterAndSearch(channel)"
						></KBButton>
						|
					</div>

					<div v-if="searchResultStore.categoryFilters.length !== 0">
						<KBButton
							v-for="(category, index) in searchResultStore.categoryFilters"
							:key="index"
							class="label-regular"
							:button-text="`${extractFilterText(category)}`"
							button-type="btn-tag"
							button-color="main"
							button-size="small"
							right-icon-name="close"
							@click="removeSingleFilterAndSearch(category)"
						></KBButton>
						|
					</div>
					<div
						v-if="
							(startDate !== null &&
								(startDate as unknown as string) !== '' &&
								startDate.getTime() !== startYear.getTime()) ||
							(endDate !== null && (endDate as unknown as string) !== '' && endDate.getTime() !== endYear.getTime())
						"
					>
						<KBButton
							class="label-regular"
							:button-text="`${presentDateSpan()} ${approxTimeDifference()}`"
							button-type="btn-tag"
							button-color="main"
							button-size="small"
							right-icon-name="close"
							@click="resetYearsAndSearch('startTime')"
						></KBButton>
						|
					</div>
					<div v-if="searchResultStore.preliminarySearchMethod !== 'all'">
						<KBButton
							class="label-regular"
							:button-text="`${t('facets.searchingIn')} ${t(`facets.${searchResultStore.preliminarySearchMethod}`)}`"
							button-type="btn-tag"
							button-color="main"
							button-size="small"
							right-icon-name="close"
							@click="searchResultStore.preliminarySearchMethod = 'all'"
						></KBButton>
					</div>
					<div v-if="searchResultStore.preliminaryFilter !== ''">
						<KBButton
							class="label-regular"
							:button-text="`${t('facets.searchingIn')} ${preliminaryFilterText}`"
							button-type="btn-tag"
							button-color="main"
							button-size="small"
							right-icon-name="close"
							@click="removePreliminaryFilterAndSearch()"
						></KBButton>
						|
					</div>
				</div>
				<div
					v-if="filtersActive"
					key="8"
				>
					<KBButton
						class="label-regular"
						:button-text="`${t('facets.reset')}`"
						button-type="btn-tag"
						button-color="reset"
						button-size="small"
						right-icon-name="close"
						@click="resetAllFilters"
					></KBButton>
				</div>
			</TransitionGroup>
		</div>
	</Transition>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import {
	days,
	endDate,
	endYear,
	months,
	startDate,
	startYear,
	timeslots,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { cloneRouteQuery, normalizeFq } from '@/utils/filter-utils';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import KBButton from '@/components/common/KBButton.vue';
import { removeChannelOrCategoryFilter } from '@/utils/filter-utils';
export default defineComponent({
	name: 'CurrentFilters',
	components: { KBButton },
	setup() {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const router = useRouter();
		const route = useRoute();
		const { t } = useI18n();

		const filtersActive = computed(() => {
			if (
				startDate.value !== null &&
				(startDate.value as unknown as string) !== '' &&
				endDate.value !== null &&
				(endDate.value as unknown as string) !== ''
			) {
				if (
					searchResultStore.categoryFilters.length !== 0 ||
					searchResultStore.channelFilters.length !== 0 ||
					startDate.value.getTime() !== startYear.value.getTime() ||
					endDate.value.getTime() !== endYear.value.getTime() ||
					searchResultStore.preliminarySearchMethod !== 'all' ||
					searchResultStore.preliminaryFilter !== ''
				) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		});

		const resetYearsAndSearch = (facet: string) => {
			if (startDate.value !== null && endDate.value !== null) {
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
				removeFilterAndSearch(facet);
			}
		};

		const removePreliminaryFilterAndSearch = () => {
			searchResultStore.preliminaryFilter = '';
			const routeQueries = cloneRouteQuery(route);
			let fq = normalizeFq(routeQueries.fq);
			fq = fq.filter((query) => !query.includes('origin'));
			routeQueries.fq = fq;
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const removeFilterAndSearch = (facet: string) => {
			const routeQueries = cloneRouteQuery(route);
			let fq = normalizeFq(routeQueries.fq);
			fq = fq.filter((query) => !query.includes(facet));
			routeQueries.fq = fq;
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const removeSingleFilterAndSearch = (facet: string) => {
			const routeQueries = removeChannelOrCategoryFilter(route, decodeURIComponent(facet), true, facet);
			routeQueries.start = 0;
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const resetAllFilters = () => {
			const routeQueries = cloneRouteQuery(route);
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			resetAllSelectorValues(months.value);
			searchResultStore.queryLimitReached = false;
			if (startDate.value !== null && endDate.value !== null) {
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			} else {
				startDate.value = new Date();
				endDate.value = new Date();
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			}

			if (routeQueries.q === '*:*') {
				delete routeQueries.q;
			} else {
				if (
					searchResultStore.currentQuery.includes('title:') ||
					searchResultStore.currentQuery.includes('description:')
				) {
					routeQueries.q = searchResultStore.currentQuery.split(':')[1].replaceAll('"', '');
				}
			}

			delete routeQueries.start;
			delete routeQueries.fq;
			delete routeQueries.sort;
			window.scrollTo({ top: 0, behavior: 'smooth' });
			router.push({
				name: 'Search',
				query: routeQueries,
			});
		};

		const approxTimeDifference = () => {
			if (endDate.value && startDate.value) {
				const diff: number = Math.abs(endDate.value.valueOf() - startDate.value.valueOf()); //The difference in milliseconds
				const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1; // calculate to days +1 to account for filtering the same date
				const yearDifference: number = Math.floor(diffDays / 365);
				const monthDifference: number = Math.floor(diffDays / 30);

				if (yearDifference === 0) {
					if (monthDifference === 0) {
						if (diffDays >= 7) {
							return `(${Math.floor(diffDays / 7)}~ ${t('timeSearch.week', Math.floor(diffDays / 7))})`;
						} else {
							return `(${diffDays}~ ${t('timeSearch.day', diffDays)})`;
						}
					} else {
						return `(${monthDifference}~ ${t('timeSearch.month', monthDifference)})`;
					}
				} else {
					return `(${yearDifference}~ ${t('timeSearch.year', yearDifference)})`;
				}
			}
		};
		const presentDateSpan = () => {
			if (
				startDate.value !== null &&
				endDate.value !== null &&
				(startDate.value as unknown as string) !== '' &&
				(endDate.value as unknown as string) !== ''
			) {
				return `${startDate.value.getDate()}/${
					startDate.value.getMonth() + 1
				}-${startDate.value.getFullYear()} - ${endDate.value.getDate()}/${
					endDate.value.getMonth() + 1
				}-${endDate.value.getFullYear()}`;
			} else {
				return '';
			}
		};

		const preliminaryFilterText = computed(() => {
			return searchResultStore.preliminaryFilter !== ''
				? decodeURIComponent(searchResultStore.preliminaryFilter).split(':')[1].replaceAll('"', '').split('.')[1]
				: '';
		});

		const extractFilterText = (filter: string) => {
			const splitText = decodeURIComponent(filter).split('"')[1];
			return splitText.substring(0, splitText.length);
		};
		return {
			searchResultStore,
			timeSearchStore,
			filtersActive,
			days,
			months,
			timeslots,
			resetAllFilters,
			removeFilterAndSearch,
			resetYearsAndSearch,
			removePreliminaryFilterAndSearch,
			startDate,
			endDate,
			startYear,
			endYear,
			approxTimeDifference,
			t,
			presentDateSpan,
			preliminaryFilterText,
			router,
			route,
			extractFilterText,
			removeSingleFilterAndSearch,
		};
	},
});
</script>
<style scoped>
.appliedFilters {
	height: auto;
	display: flex;
	align-items: center;
	gap: 5px;
	flex-wrap: wrap;
}
.filter-group {
	display: contents;
}
.filter-group > div {
	display: contents;
}
.filter-group > :not(:first-child) {
	margin-left: 5px;
}
</style>
