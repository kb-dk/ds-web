<template>
	<div class="appliedFilters">
		<TransitionGroup name="fade">
			<span
				v-if="filtersActive"
				key="1"
			>
				{{ $t('search.selected') }}:
			</span>
			<button
				v-if="searchResultStore.channelFilters.length !== 0"
				key="2"
				@click="removeFilterAndSearch('creator_affiliation_facet')"
			>
				<span>
					{{
						`${searchResultStore.channelFilters.length} ${t(
							'facets.channels',
							searchResultStore.channelFilters.length,
						)}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="searchResultStore.categoryFilters.length !== 0"
				key="3"
				@click="removeFilterAndSearch('genre')"
			>
				<span>
					{{
						`${searchResultStore.categoryFilters.length} ${t(
							'facets.genres',
							searchResultStore.categoryFilters.length,
						)}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="months.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
				@click="resetTimeValueAndSearch(months, 'temporal_start_month')"
			>
				<span>
					{{
						`${months.filter((entity) => entity.selected === true).length} ${t(
							'timeSearch.month',
							months.filter((entity) => entity.selected === true).length,
						)}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="days.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
				@click="resetTimeValueAndSearch(days, 'temporal_start_day_da')"
			>
				<span>
					{{
						`${days.filter((entity) => entity.selected === true).length} ${t(
							'timeSearch.day',
							days.filter((entity) => entity.selected === true).length,
						)}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="timeslots.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
				@click="resetTimeValueAndSearch(timeslots, 'temporal_start_hour_da')"
			>
				<span>
					{{
						`${timeslots.filter((entity) => entity.selected === true).length} ${t(
							'timeSearch.timePeriods',
							timeslots.filter((entity) => entity.selected === true).length,
						)}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="
					((startDate !== null &&
						(startDate as unknown as string) !== '' &&
						startDate.getTime() !== startYear.getTime()) ||
						(endDate !== null && (endDate as unknown as string) !== '' && endDate.getTime() !== endYear.getTime())) &&
					!timeSearchStore.newSearchReqMet
				"
				@click="resetYearsAndSearch('startTime')"
			>
				<span>
					{{ presentDateSpan() }}
					{{ calculatedYearSpan() }}
				</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="searchResultStore.preliminaryFilter !== ''"
				key="5"
				@click="removePreliminaryFilterAndSearch()"
			>
				<span>
					{{
						`${decodeURIComponent(searchResultStore.preliminaryFilter).split(':')[1].replaceAll('"', '').split('.')[1]}`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<span
				v-if="filtersActive"
				key="6"
				class="seperator"
			>
				|
			</span>
			<button
				v-if="filtersActive"
				key="7"
				class="resetFilters"
				@click="resetAllFilters"
			>
				<span>{{ `${t('facets.reset')}` }}</span>
				<span class="material-icons">close</span>
			</button>
		</TransitionGroup>
	</div>
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
import { SelectorData } from '@/types/TimeSearchTypes';
import { cloneRouteQuery, normalizeFq } from '@/utils/filter-utils';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'CurrentFilters',

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
					(days.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
						months.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
						timeslots.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
						searchResultStore.categoryFilters.length !== 0 ||
						searchResultStore.channelFilters.length !== 0 ||
						startDate.value.getTime() !== startYear.value.getTime() ||
						endDate.value.getTime() !== endYear.value.getTime() ||
						searchResultStore.preliminaryFilter !== '') &&
					!timeSearchStore.newSearchReqMet
				) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		});

		const resetTimeValueAndSearch = (resetArray: SelectorData[], facet: string) => {
			resetAllSelectorValues(resetArray);
			removeFilterAndSearch(facet);
		};

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

		const resetAllFilters = () => {
			const routeQueries = cloneRouteQuery(route);
			searchResultStore.resetFilters();
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			resetAllSelectorValues(months.value);
			if (startDate.value !== null && endDate.value !== null) {
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			} else {
				startDate.value = new Date();
				endDate.value = new Date();
				startDate.value.setTime(startYear.value.getTime());
				endDate.value.setTime(endYear.value.getTime());
			}
			router.push({
				name: 'Search',
				query: {
					q: routeQueries.q,
				},
			});
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

		const calculatedYearSpan = () => {
			if (
				startDate.value !== null &&
				endDate.value !== null &&
				(startDate.value as unknown as string) !== '' &&
				(endDate.value as unknown as string) !== ''
			) {
				return `(${endDate.value.getFullYear() - startDate.value.getFullYear() + 1}~ ${t(
					'timeSearch.year',
					endDate.value.getFullYear() - startDate.value.getFullYear() + 1,
				)})`;
			} else {
				return '';
			}
		};

		return {
			searchResultStore,
			timeSearchStore,
			filtersActive,
			days,
			months,
			timeslots,
			resetTimeValueAndSearch,
			resetAllFilters,
			removeFilterAndSearch,
			resetYearsAndSearch,
			removePreliminaryFilterAndSearch,
			startDate,
			endDate,
			startYear,
			endYear,
			t,
			presentDateSpan,
			calculatedYearSpan,
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

button {
	height: 20px;
	background-color: #caf0fe;
	border-radius: 4px;
	border: 0px;
	text-align: center;
	display: flex;
	align-items: center;
	cursor: pointer;
	color: #002e70;
	transition: all 0.25s linear 0s;
}

button:hover {
	background-color: #002e70;
	color: white;
}

.seperator {
	color: #002e70;
}

.appliedFilters {
	color: #002e70;
}

.resetFilters {
	background-color: #f7ae3b;
	text-transform: capitalize;
	box-sizing: border-box;
	border: 1px solid #f7ae3b;
}

.resetFilters:hover {
	background-color: #f7ae3b;
	color: #002e70;
	border: 1px solid #002e70;
	box-sizing: border-box;
}

.material-icons {
	padding-left: 5px;
	font-size: 14px;
}
</style>
