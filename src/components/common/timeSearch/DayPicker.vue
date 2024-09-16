<template>
	<div class="day-picker container">
		<div class="picker-container">
			<VueDatePicker
				ref="singleDatePicker"
				v-model="selectedDate"
				:inline="{ input: true }"
				:enable-time-picker="false"
				auto-apply
				no-today
				text-input
				:format="format"
				six-weeks="fair"
				:month-change-on-scroll="false"
				:min-date="startYear"
				:max-date="endYear"
				prevent-min-max-navigation
				:year-range="[startYear.getFullYear(), endYear.getFullYear()]"
				@update:model-value="updateSeeMoreLink()"
			></VueDatePicker>
		</div>
		<div class="time-container">
			<div class="time">
				{{ format(selectedDate) /*date2.toISOString()*/ }}
			</div>
			<router-link
				class="single-day-link"
				:data-testid="addTestDataEnrichment('link', 'day-picker', `see-more-link`, 0)"
				:to="specificDayLink"
			>
				<span>Vis indhold</span>
				<div class="link-arrow"></div>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import { startYear, endYear } from '@/components/common/timeSearch/TimeSearchInitValues';
import type { DatePickerInstance } from '@vuepic/vue-datepicker';
import { RouteLocationRaw } from 'vue-router';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'DayPicker',
	components: {
		VueDatePicker,
	},
	setup() {
		const { t } = useI18n();
		const singleDatePicker = ref<DatePickerInstance>();
		const selectedDate = ref(new Date(1992, 0, 1, 0, 0, 0));

		const singleDayStartDate = ref<Date>(new Date(1992, 0, 1, 0, 0, 0)); // January 1, 1992, 00:00:00
		const singleDayEndDate = ref<Date>(new Date(1992, 0, 1, 23, 59, 59)); // January 1, 1992, 23:59:59

		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day} / ${month} / ${year}`;
		};

		const specificDayLink = ref<RouteLocationRaw>({
			name: 'Home',
			query: {
				q: '*:*',
				start: 0,
				rows: 10,
				fq: [],
			},
		});

		const updateSeeMoreLink = () => {
			singleDayStartDate.value.setFullYear(selectedDate.value.getFullYear());
			singleDayStartDate.value.setMonth(selectedDate.value.getMonth());
			singleDayStartDate.value.setDate(selectedDate.value.getDate());

			singleDayEndDate.value.setFullYear(selectedDate.value.getFullYear());
			singleDayEndDate.value.setMonth(selectedDate.value.getMonth());
			singleDayEndDate.value.setDate(selectedDate.value.getDate());
			const fqArray = [];

			fqArray.push(
				encodeURIComponent(
					`startTime:[${singleDayStartDate.value.toISOString() + ' TO ' + singleDayEndDate.value.toISOString()}]`,
				),
			);

			specificDayLink.value = {
				name: 'Home',
				query: {
					q: '*:*',
					start: 0,
					rows: 10,
					fq: fqArray,
				},
			};
		};

		return {
			singleDatePicker,
			startYear,
			endYear,
			format,
			selectedDate,
			specificDayLink,
			addTestDataEnrichment,
			updateSeeMoreLink,
		};
	},
});
</script>
<style scoped>
.day-picker {
	display: flex;
	width: calc(100vw - 14px);
	flex-direction: column;
}

.single-day-link {
	background-color: #002e70;
	color: white;
	display: flex;
	text-decoration: none;
	padding: 2px 5px;
	flex-direction: row-reverse;
	font-size: 16px;
	width: 261px;
	box-sizing: border-box;
}

.single-day-link span {
	display: block;
	text-align: center;
	width: 100%;
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

.time {
	background: #ffffff 0% 0% no-repeat padding-box;
	border: 1px solid #d9d8d8;
	border-radius: 2px;
	height: 48px;
	width: 110px;
	margin: 0px 16px 16px 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.time-container {
	display: flex;
	justify-content: space-around;
	flex-direction: column;
	align-items: center;
	padding-top: 20px;
}

.container {
	width: 100%;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}

	.day-picker {
		flex-direction: row;
		gap: 25px;
		justify-content: flex-end;
		padding-right: 50px;
		padding-top: 30px;
	}

	.time-container {
		justify-content: flex-end;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
	.full-width {
		width: 100vw;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
