<template>
	<EdgedContentArea background-color="#FAFAFA">
		<template #content>
			<h1>{{ $t('timeSearch.timeMachine') }}</h1>
			<TimeSearchFilters
				:init="true"
				@new-search="getTimeResults(months, days, timeslots, timeSliderValues)"
			></TimeSearchFilters>
			<div class="result-container">
				<div class="result-header">
					<span class="selection-header">{{ t('timeSearch.selection') }}:</span>
					<router-link
						class="link"
						:to="timeSearchLink"
					>
						<div class="hits">
							{{ $t('timeSearch.timeHits') }}
							<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
							{{ $t('timeSearch.result', timeSearchStore.numFound) }}
						</div>
						<div class="link-arrow"></div>
					</router-link>
				</div>
				<div class="time-results">
					<div
						v-for="(item, index) in timeSearchStore.timeResults"
						:key="index"
						class="time-result-item"
					>
						<GridResultItem
							:loading="timeSearchStore.loading"
							:resultdata="item"
							background="#ffffff"
						></GridResultItem>
					</div>
				</div>
			</div>
			<div class="further-recap">
				<div class="further-link">
					<div class="recap">
						<span>{{ `${getYears(timeSliderValues)} ${t('timeSearch.year', getYears(timeSliderValues))}` }}</span>
						/
						<span>{{ getSublineForMonths(months, t) }}</span>
						/
						<span>{{ getSublineForDays(days, t) }}</span>
						/
						<span>{{ getSublineForTimeslots(timeslots, t) }}</span>
					</div>
					<router-link
						class="link"
						:to="timeSearchLink"
					>
						<div class="further-results">
							<div class="hits">
								{{ $t('timeSearch.timeHits') }}
								<span class="bold">{{ new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound) }}</span>
								{{ $t('timeSearch.result', timeSearchStore.numFound) }}
							</div>
						</div>
						<div class="link-arrow"></div>
					</router-link>
				</div>
			</div>
		</template>
	</EdgedContentArea>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SelectorData } from '@/types/TimeSearchTypes';
import { timeSliderValues, months, days, timeslots } from '@/components/common/TimeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import GridResultItem from '@/components/search/GridResultItem.vue';
import TimeSearchFilters from '@/components/common/TimeSearch/TimeSearchFilters.vue';
import EdgedContentArea from '../global/content-elements/EdgedContentArea.vue';
import {
	getTimeResults,
	getSublineForDays,
	getSublineForMonths,
	getSublineForTimeslots,
	getYears,
} from '@/utils/time-search-utils';

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

			const fqArray = [];
			fqArray.push(
				encodeURIComponent(`temporal_start_year:[${timeSliderValues.value[0] + ' TO ' + timeSliderValues.value[1]}]`),
			);
			dayString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_day_da:(${dayString})`)) : null;
			monthString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_month:(${monthString})`)) : null;
			timeslotString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`)) : null;

			return {
				name: 'Home',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: fqArray,
				},
			};
		});

		return {
			days,
			months,
			timeslots,
			timeSearchLink,
			t,
			timeSearchStore,
			timeSliderValues,
			getYears,
			getTimeResults,
			getSublineForDays,
			getSublineForMonths,
			getSublineForTimeslots,
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

.result-header {
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
}

.further-link a:visited {
	color: white;
}

.selection-header {
	color: #002e70;
	font-size: 20px;
}

.link {
	background-color: #002e70;
	color: white;
	display: flex;
	text-decoration: none;
	padding: 2px 5px;
	flex-direction: row-reverse;
	font-size: 16px;
}

.link-arrow {
	display: block;
	width: 0;
	height: 0;
	border-bottom: 12px solid transparent;
	border-top: 12px solid transparent;
	border-left: 8px solid #0a2e70;
	margin-left: 5px;
	position: absolute;
	margin-right: -13px;
	margin-top: -2px;
}

.further-recap {
	display: flex;
	justify-content: flex-end;
}

.recap {
	padding-bottom: 10px;
}

.recap span {
	background-color: #d9f5fe;
	color: #002e70;
	border-radius: 4px;
	width: fit-content;
	padding-left: 3px;
	padding-right: 3px;
	font-weight: 700;
	font-size: 16px;
}

.further-link {
	display: flex;
	align-items: flex-end;
	flex-direction: column;
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
