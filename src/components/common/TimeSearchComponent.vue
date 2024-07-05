<template>
	<EdgedContentArea background-color="#FAFAFA">
		<template #content>
			<h1>{{ $t('timeSearch.timeMachine') }}</h1>
			<TimeSearchFilters></TimeSearchFilters>
			<div class="result-container">
				<h3>
					{{ $t('timeSearch.timeHits') }}
					<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
					{{ $t('timeSearch.result', timeSearchStore.numFound) }}
				</h3>
				<div class="time-results">
					<div
						v-for="(item, index) in timeSearchStore.timeResults"
						:key="index"
						class="time-result-item"
					>
						<GridResultItem
							:loading="timeSearchStore.loading"
							:resultdata="item"
							background="#fafafa"
						></GridResultItem>
					</div>
				</div>
			</div>
			<div class="further-link">
				<router-link
					class="link"
					:to="timeSearchLink"
				>
					<div class="further-results">
						<div class="recap">{{ selectionSummary(timeSliderValues, months, days, t) }}</div>
						<div class="hits">
							{{ $t('timeSearch.timeHits') }}
							<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
							{{ $t('timeSearch.result', timeSearchStore.numFound) }}
						</div>
					</div>
					<div class="material-icons">navigate_next</div>
				</router-link>
			</div>
		</template>
	</EdgedContentArea>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SelectorData } from '@/types/TimeSearchTypes';
import { timeSliderValues, months, days, timeslots } from '@/components/common/TimeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { selectionSummary } from '@/utils/time-search-utils';
import GridResultItem from '@/components/search/GridResultItem.vue';
import TimeSearchFilters from '@/components/common/TimeSearch/TimeSearchFilters.vue';
import EdgedContentArea from '../global/content-elements/EdgedContentArea.vue';
import { getTimeResults } from '@/utils/time-search-utils';

import '@/assets/styles/vue-slider-styles.css';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		GridResultItem,
		EdgedContentArea,
		TimeSearchFilters,
	},
	setup() {
		const { t } = useI18n();
		const timeSearchStore = useTimeSearchStore();

		const timeSearchLink = computed(() => {
			const dayString = days.value
				.filter((day: SelectorData) => day.selected)
				.map((day: SelectorData) => day.value)
				.join(' OR ');

			const monthString = months.value
				.filter((month: SelectorData) => month.selected)
				.map((month: SelectorData) => month.value)
				.join(' OR ');

			const timeslotString = timeslots.value
				.filter((timeslot: SelectorData) => timeslot.selected)
				.map((timeslot: SelectorData) => timeslot.value)
				.join(' OR ');

			return {
				name: 'Home',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: [
						encodeURIComponent(
							`temporal_start_year:[${timeSliderValues.value[0] + ' TO ' + timeSliderValues.value[1]}]`,
						),
						encodeURIComponent(`temporal_start_day_da:(${dayString})`),
						encodeURIComponent(`temporal_start_month:(${monthString})`),
						encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`),
					],
				},
			};
		});

		watch(
			[months, days, timeslots],
			([newMonths, newDays, newTimeslots]) => {
				getTimeResults(newMonths, newDays, newTimeslots, timeSliderValues.value);
			},
			{ deep: true },
		);

		return {
			days,
			months,
			timeslots,
			timeSearchLink,
			t,
			timeSearchStore,
			selectionSummary,
			timeSliderValues,
		};
	},
});
</script>

<style scoped>
h1 {
	font-family: 'LibreBaskerville';
	font-weight: 100;
	text-transform: uppercase;
	color: #002e70;
	font-size: 32px;
}

.result-container {
	padding-top: 25px;
}

.further-link a:visited {
	color: #002e70;
}

.link {
	color: #002e70;
	display: flex;
	text-decoration: none;
}

.further-link {
	display: flex;
	justify-content: flex-end;
	margin-right: -50px;
}

.link:hover .material-icons {
	transform: translateX(10px);
}

.link .material-icons {
	transition: all 0.15s ease-in-out 0s;
	display: flex;
	align-items: center;
	font-size: 60px;
}

.further-results {
	display: flex;
	align-items: flex-end;
	flex-direction: column;
	justify-content: center;
}

.time-results {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 20px;
	flex-wrap: wrap;
	padding-bottom: 20px;
}

.time-result-item {
	flex: 1 1 calc(100%);
	max-width: calc(100%);
	box-sizing: border-box;
}

@media (max-width: 480px) {
	.time-result-item:nth-child(n + 3) {
		display: none;
	}
}

@media (max-width: 990px) {
	.time-result-item:nth-child(n + 5) {
		display: none;
	}
}

@media (min-width: 480px) {
	.time-result-item {
		flex: 1 1 calc(50% - 20px);
		max-width: calc(50% - 15px);
		box-sizing: border-box;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.figures {
		top: 0px;
	}
	.time-result-item {
		flex: 1 1 calc(25% - 20px);
		max-width: calc(25% - 15px);
		box-sizing: border-box;
	}
}
</style>
