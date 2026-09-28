<template>
	<div
		class="header"
		:style="`color: ${text}`"
	>
		<h2>{{ title }}</h2>
		<p>
			<span>{{ subtitle }}</span>
		</p>
	</div>
	<TimeSearchFilters
		:timeline="true"
		:init="true"
		@new-search="fetchNewTimeResults()"
	></TimeSearchFilters>

	<div class="result-container">
		<div class="container-backdrop">
			<ContainerSplitBar :is-top="true"></ContainerSplitBar>
			<ContainerSplitBar :is-top="false"></ContainerSplitBar>
		</div>
		<div class="time-results">
			<ItemSlider
				:padding="false"
				bg="var(--bg-backdrop)"
				item-class="time-result"
				bg-scroll-blue="true"
			>
				<template #default="slotProps">
					<div
						v-for="(item, index) in timeSearchStore.timeResults"
						:key="index"
						class="time-result-item"
					>
						<GridResultItem
							:loading="timeSearchStore.loading"
							:resultdata="item"
							:index="index"
							background="var(--bg-backdrop)"
							:slot-props="slotProps"
						></GridResultItem>
					</div>
				</template>
			</ItemSlider>
			<div class="result-header-container">
				<div class="result-header">
					<KBButton
						class="btn-medium"
						:to="timeSearchLink"
						:data-testid="addTestDataEnrichment('link', 'time-search-component', `top-more-link`, 0)"
						button-type="btn-cta"
						button-color="cta"
						button-size="medium"
						:is-router-link="true"
						right-icon-name="arrow_forward_ios"
						:button-text="`${$t('facets.seeResults', {
							count: Number(new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound)),
							resultCount: new Intl.NumberFormat('de-DE').format(timeSearchStore.numFound),
						})} (${getYears(timeSliderValues)} ${$t('timeSearch.year', getYears(timeSliderValues))})`"
						@click="timeSearchBehavior()"
					></KBButton>
				</div>
			</div>
		</div>
	</div>
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
// import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
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
import KBButton from '@/components/common/KBButton.vue';
import ItemSlider from '@/components/search/ItemSlider.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';
export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		GridResultItem,
		TimeSearchFilters,
		KBButton,
		ItemSlider,
		ContainerSplitBar,
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
				/* sort: `random_${Date.now()} ASC`, */
			},
		});

		const timeSearchBehavior = () => {
			timeSearchStore.timeFacetsOpen = true;
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		};

		const fetchNewTimeResults = () => {
			updateLink();
			getTimeResults(true, `random_${Date.now()} ASC`);
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
			if (startDate.value !== null && endDate.value !== null) {
				fqArray.push(
					encodeURIComponent(`startTime:[${startDate.value.toISOString() + ' TO ' + endDate.value.toISOString()}]`),
				);
			}
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
					/* sort: `random_${Date.now()} ASC`, */
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
			timeSearchBehavior,
		};
	},
});
</script>

<style scoped>
h2 {
	color: var(--color-main);
}
.result-container {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	margin-bottom: 112px;
}
.container-backdrop {
	position: absolute;
	height: 100%;
	width: 100vw;
	background-color: var(--bg-backdrop);
	justify-content: space-between;
	display: flex;
	flex-direction: column;
	margin-top: 5px;
}
.result-header-container {
	width: 100vw;
	display: flex;
	max-width: 1256px;
	position: relative;
	margin-left: auto;
	margin-right: auto;
}
.result-header {
	display: flex;
	/* weird padding to equal 56 in total */
	padding-top: 41px;
	justify-content: end;
	width: 100%;
}

.selection-header {
	color: var(--color-main);
}

.time-results {
	position: relative;
	margin-top: 56px;
	margin-bottom: 90px;
	gap: 15px;
	width: 98vw;
	max-width: 2400px;
	height: 100%;
}

.time-result-item {
	flex: 0 0 70%;
	box-sizing: border-box;
	background-color: var(--bg-backdrop);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	user-drag: none;
}

.header {
	margin: 0;
	position: relative;
	padding-bottom: 38px;
	padding-left: 20px;
	text-align: left;
	max-width: 1280px;
	width: 100%;
	box-sizing: border-box;
}

.header h2 {
	text-transform: none;
	margin: 0;
}

.header span {
	margin: 0;
	display: block;
	margin-top: 4px;
	max-width: 720px;
}
.header p {
	margin: 0;
}
@media (min-width: 640px) {
	.container-backdrop {
		margin-top: 0;
	}
	.time-result-item {
		flex: 0 0 400px;
	}
	.time-results {
		margin-bottom: 72px;
	}
}
</style>
