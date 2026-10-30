<template>
	<div
		class="time-container"
		role="region"
		aria-labelledby="time-container-heading"
		:style="`color: ${text}`"
	>
		<h2 id="time-container-heading">{{ title }}</h2>
		<p>
			<span>{{ subtitle }}</span>
		</p>

		<TimeSearchFilters
			:timeline="true"
			:init="true"
			@new-search="fetchNewTimeResults()"
		></TimeSearchFilters>

		<div class="result-container">
			<div class="bar-container">
				<div
					key="1"
					class="bar bar-1"
				></div>
				<div
					key="2"
					class="bar bar-2"
				></div>
			</div>

			<div class="time-results">
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
							:button-text="buttonText"
							@click="timeSearchBehavior()"
						></KBButton>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { endDate, startDate, timeSliderValues } from '@/components/common/timeSearch/TimeSearchInitValues';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import TimeSearchFilters from '@/components/common/timeSearch/TimeSearchFilters.vue';
import {
	getSublineForDays,
	getSublineForMonths,
	getSublineForTimeslots,
	getTimeResults,
	getYears,
} from '@/utils/time-search-utils';
import { RouteLocationRaw } from 'vue-router';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import '@/assets/styles/vue-slider-styles.css';
import KBButton from '@/components/common/KBButton.vue';
export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		TimeSearchFilters,
		KBButton,
	},
	props: {
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
		text: { type: String, default: 'black' },
	},
	setup() {
		gsap.registerPlugin(TextPlugin);
		const { t } = useI18n();
		const timeSearchStore = useTimeSearchStore();
		const displayCount = ref(0);
		const buttonText = computed(() => {
			const formatted = new Intl.NumberFormat('de-DE').format(displayCount.value);
			const years = getYears(timeSliderValues.value);
			return `${t('facets.seeResults', { count: displayCount.value, resultCount: formatted })} (${years} ${t(
				'timeSearch.year',
				years,
			)})`;
		});
		const timeSearchLink = ref<RouteLocationRaw>({
			name: 'Search',
			query: {
				q: '*:*',
				start: 0,
				rows: 10,
				fq: [],
				// /* sort: `random_${Date.now()} ASC`, */
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
			getTimeResults(true);
		};

		onMounted(() => {
			updateLink();
		});

		const updateLink = () => {
			const fqArray = [];
			if (startDate.value !== null && endDate.value !== null) {
				fqArray.push(
					encodeURIComponent(`startTime:[${startDate.value.toISOString() + ' TO ' + endDate.value.toISOString()}]`),
				);
			}

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
		watch(
			() => timeSearchStore.numFound,
			(newVal) => {
				gsap.to(displayCount, { value: newVal, duration: 0.3, ease: 'power2.out', snap: { value: 1 } });
			},
			{ immediate: true },
		);
		return {
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
			buttonText,
		};
	},
});
</script>

<style scoped>
h2 {
	color: var(--color-main);
	padding-left: 20px;
}
.result-container {
	width: 100%;
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
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
	justify-content: end;
	width: 100%;
}

.result-header .btn-cta {
	transition: all 0.2s ease;
}

.selection-header {
	color: var(--color-main);
}

.time-results {
	position: relative;
	margin-top: 56px;
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

.time-container {
	margin: 0;
	position: relative;
	/* padding-left: 20px; */
	text-align: left;
	max-width: 1280px;
	width: 100%;
	box-sizing: border-box;
}

.time-container h2 {
	text-transform: none;
	margin: 0;
}

.time-container span {
	margin: 0;
	display: block;
	margin-top: 4px;
	max-width: 720px;
}
.time-container p {
	margin: 0;
}
.bar-container {
	height: fit-content;
	width: 100vw;
	position: absolute;
}
.bar {
	height: 17px;
	width: 100%;
}
.bar-1 {
	background-color: var(--bg-main-2);
}
.bar-2 {
	background-color: var(--bg-secondary-light);
}
@media (min-width: 640px) {
	.container-backdrop {
		margin-top: 0;
	}
	.time-result-item {
		flex: 0 0 400px;
	}
}
</style>
