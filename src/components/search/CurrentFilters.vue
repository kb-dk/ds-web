<template>
	<div class="appliedFilters">
		<TransitionGroup name="fade">
			<span v-if="filtersActive">Udvalgt:</span>
			<button
				v-if="searchResultStore.channelFilters.length !== 0"
				@click="removeFilterAndSearch('creator_affiliation_facet')"
			>
				<span>{{ `${searchResultStore.channelFilters.length} kanaler` }}</span>
				<span class="material-icons">close</span>
			</button>
			<button
				v-if="searchResultStore.categoryFilters.length !== 0"
				@click="removeFilterAndSearch('genre')"
			>
				<span>{{ `${searchResultStore.categoryFilters.length} kategorier` }}</span>
				<span class="material-icons">close</span>
			</button>
			<div v-if="timeSearchStore.timeFacetsOpen">
				<button
					v-if="months.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
					@click="resetTimeValueAndSearch(months)"
				>
					<span>{{ `${months.filter((entity) => entity.selected === true).length} måneder` }}</span>
					<span class="material-icons">close</span>
				</button>
				<button
					v-if="days.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
					@click="resetTimeValueAndSearch(days)"
				>
					<span>{{ `${days.filter((entity) => entity.selected === true).length} dage` }}</span>
					<span class="material-icons">close</span>
				</button>
				<button
					v-if="timeslots.filter((entity) => entity.selected === true).length > 0 && !timeSearchStore.newSearchReqMet"
					@click="resetTimeValueAndSearch(timeslots)"
				>
					<span>{{ `${timeslots.filter((entity) => entity.selected === true).length} tidspunkter` }}</span>
					<span class="material-icons">close</span>
				</button>
			</div>
			<button
				v-if="filtersActive"
				@click="resetAllFilters"
			>
				<span>{{ `nulstil` }}</span>
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
	initEndDate,
	initStartDate,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { resetAllSelectorValues } from '@/utils/time-search-utils';
import { SelectorData } from '@/types/TimeSearchTypes';
import { cloneRouteQuery, normalizeFq, removeFilter } from '@/utils/filter-utils';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'CurrentFilters',

	setup() {
		const searchResultStore = useSearchResultStore();
		const timeSearchStore = useTimeSearchStore();
		const router = useRouter();
		const route = useRoute();
		const filtersActive = computed(() => {
			if (
				days.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
				months.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
				timeslots.value.filter((entity: SelectorData) => entity.selected === true).length > 0 ||
				searchResultStore.categoryFilters.length !== 0 ||
				searchResultStore.channelFilters.length !== 0
			) {
				return true;
			} else {
				return false;
			}
		});

		const resetTimeValueAndSearch = (resetArray: SelectorData[]) => {
			resetAllSelectorValues(resetArray);
			executeNewSearch();
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

		const executeNewSearch = () => {
			console.log('search!');
		};

		const resetAllFilters = () => {
			searchResultStore.resetFilters();
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
			startYear,
			endYear,
			resetTimeValueAndSearch,
			resetAllFilters,
			removeFilterAndSearch,
		};
	},
});
</script>
<style scoped>
.appliedFilters {
	height: 25px;
	display: flex;
	align-items: center;
	gap: 5px;
}

button {
	height: 25px;
	background-color: #caf0fe;
	border-radius: 4px;
	border: 0px;
	text-align: center;
	display: flex;
	align-items: center;
	cursor: pointer;
}
</style>
