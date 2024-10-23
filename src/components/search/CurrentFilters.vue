<template>
	<div class="appliedFilters">
		<TransitionGroup name="fade">
			<span
				v-if="filtersActive"
				key="1"
			>
				Udvalgt:
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
					(startDate.getTime() !== startYear.getTime() || endDate.getTime() !== endYear.getTime()) &&
					!timeSearchStore.newSearchReqMet
				"
				@click="resetYearsAndSearch('startTime')"
			>
				<span>
					{{
						`${startDate.getDate()}/${startDate.getMonth() + 1}-${startDate.getFullYear()} - ${endDate.getDate()}/${
							endDate.getMonth() + 1
						}-${endDate.getFullYear()}`
					}}
					{{
						`(${endDate.getFullYear() - startDate.getFullYear() + 1}~ ${t(
							'timeSearch.year',
							endDate.getFullYear() - startDate.getFullYear() + 1,
						)})`
					}}
				</span>
				<span class="material-icons">close</span>
			</button>
			<span
				v-if="filtersActive"
				key="5"
				class="seperator"
			>
				|
			</span>
			<button
				v-if="filtersActive"
				key="6"
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
import { defineComponent, computed } from 'vue';
import {
	days,
	months,
	timeslots,
	startYear,
	endYear,
	startDate,
	endDate,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { SelectorData } from '@/types/TimeSearchTypes';
import { cloneRouteQuery, normalizeFq } from '@/utils/filter-utils';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
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
				(days.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
					months.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
					timeslots.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
					searchResultStore.categoryFilters.length !== 0 ||
					searchResultStore.channelFilters.length !== 0 ||
					startDate.value.getTime() !== startYear.value.getTime() ||
					endDate.value.getTime() !== endYear.value.getTime()) &&
				!timeSearchStore.newSearchReqMet
			) {
				return true;
			} else {
				return false;
			}
		});

		const resetTimeValueAndSearch = (resetArray: SelectorData[], facet: string) => {
			resetAllSelectorValues(resetArray);
			removeFilterAndSearch(facet);
		};

		const resetYearsAndSearch = (facet: string) => {
			startDate.value.setTime(startYear.value.getTime());
			endDate.value.setTime(endYear.value.getTime());
			removeFilterAndSearch(facet);
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
			searchResultStore.resetFilters();
			resetAllSelectorValues(days.value);
			resetAllSelectorValues(timeslots.value);
			resetAllSelectorValues(months.value);
			startDate.value.setTime(startYear.value.getTime());
			endDate.value.setTime(endYear.value.getTime());
			router.push({
				name: 'Search',
				query: { q: searchResultStore.currentQuery },
			});
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
			startDate,
			endDate,
			startYear,
			endYear,
			t,
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
