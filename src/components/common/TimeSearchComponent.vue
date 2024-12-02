<template>
	<EdgedContentArea background-color="#FAFAFA">
		<template #content>
			<div
				class="header"
				:style="`color: ${text}`"
			>
				<h1>{{ title }}</h1>
				<span>{{ subtitle }}</span>
			</div>
			<TimeSearchFilters
				:timeline="true"
				:init="true"
				@new-search="fetchNewTimeResults()"
			></TimeSearchFilters>
			<div class="result-container">
				<div class="result-header">
					<span class="selection-header">{{ t('timeSearch.selection') }}:</span>
					<router-link
						class="link"
						:to="timeSearchLink"
						:data-testid="addTestDataEnrichment('link', 'time-search-component', `top-more-link`, 0)"
					>
						<div class="hits">
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
							:index="index"
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
						:data-testid="addTestDataEnrichment('link', 'time-search-component', `bottom-more-link`, 0)"
					>
						<div class="further-results">
							<div class="hits">
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SelectorData } from '@/types/TimeSearchTypes';
import {
	days,
	endDate,
	months,
	startDate,
	timeSliderValues,
	timeslots,
} from '@/components/common/timeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import GridResultItem from '@/components/search/GridResultItem.vue';
import TimeSearchFilters from '@/components/common/timeSearch/TimeSearchFilters.vue';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
import {
	getSublineForDays,
	getSublineForMonths,
	getSublineForTimeslots,
	getTimeResults,
	getYears,
} from '@/utils/time-search-utils';
import { RouteLocationRaw } from 'vue-router';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

import '@/assets/styles/vue-slider-styles.css';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		GridResultItem,
		EdgedContentArea,
		TimeSearchFilters,
	},
	props: {
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
		text: { type: String, default: 'black' },
	},
	setup() {
		const { t } = useI18n();
		const timeSearchStore = useTimeSearchStore();
		const timeSearchLink = ref<RouteLocationRaw>({
			name: 'Search',
			query: {
				q: '*:*',
				start: 0,
				rows: 10,
				fq: [],
			},
		});

		const fetchNewTimeResults = () => {
			updateLink();
			getTimeResults(true);
		};

		onMounted(() => {
			updateLink();
		});

		watch(
			[months, days, timeslots],
			() => {
				updateLink();
			},
			{ deep: true },
		);

		const updateLink = () => {
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
				encodeURIComponent(`startTime:[${startDate.value.toISOString() + ' TO ' + endDate.value.toISOString()}]`),
			);
			dayString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_day_da:(${dayString})`)) : null;
			monthString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_month:(${monthString})`)) : null;
			timeslotString !== '' ? fqArray.push(encodeURIComponent(`temporal_start_hour_da:(${timeslotString})`)) : null;

			timeSearchLink.value = {
				name: 'Search',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: fqArray,
				},
			};
		};

		return {
			days,
			months,
			timeslots,
			startDate,
			endDate,
			timeSearchLink,
			t,
			timeSearchStore,
			timeSliderValues,
			getYears,
			fetchNewTimeResults,
			getSublineForDays,
			getSublineForMonths,
			getSublineForTimeslots,
			addTestDataEnrichment,
		};
	},
});
</script>

<style scoped>
h1 {
	font-family: 'LibreBaskerville';
	font-weight: 100;

	color: #002e70;
	font-size: 32px;
}

.result-container {
	width: 100%;
	padding-top: 25px;
}

.result-header {
	display: flex;
	justify-content: space-between;
	padding-bottom: 20px;
}

.further-link a:visited {
}

.selection-header {
	color: #002e70;
	font-size: 26px;
	padding-top: 4px;
}

.link {
	color: #002e70;
	background-color: #49da87;
	display: flex;
	text-decoration: none;
	padding: 8px 10px 12px 14px;
	flex-direction: row-reverse;
	font-size: 26px;
	position: relative;
	left: -10px;
	height: 25px;
	border-radius: 4px;
	align-items: center;
	box-shadow: 0 0px 2px rgb(0 0 0 / 0.3);
}

.link .link-arrow {
	display: block;
	width: 0;
	height: 0;
	border-bottom: 23px solid transparent;
	border-top: 23px solid transparent;
	border-left: 20px solid #49da87;
	margin-left: 5px;
	position: absolute;
	margin-right: -28px;
	margin-top: 5px;
	transition: all 0.15s ease-in-out 0s;
}

.further-recap {
	width: 100%;
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

.header {
	margin: 0;
	position: relative;
	padding-bottom: 25px;
	text-align: left;
	max-width: 1280px;
	width: 100%;
	display: none;
}

.header h1 {
	font-family: 'LibreBaskerville';
	font-weight: 100;
	text-transform: none;
	font-size: 32px;
	margin: 0;
}

.header span {
	margin: 0;
	font-size: 16px;
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
	.header {
		display: block;
	}
	.link:hover {
		text-decoration: underline;
		left: 2px;
	}
	.link:hover .link-arrow {
		border-left: 21px solid #49da87;
		margin-right: -30px;
	}
}

@media (min-width: 1280px) {
	.link {
		left: 0px;
	}
}
</style>
