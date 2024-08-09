<template>
	<!-- <button @click="resetDays()">reset</button>-->
	<div class="date-pickers">
		<VueDatePicker
			v-model="date1"
			:inline="{ input: true }"
			:enable-time-picker="false"
			auto-apply
			no-today
			:highlight="highlightedDays"
			text-input
			:format="format"
			:max-date="date2"
			six-weeks="fair"
		></VueDatePicker>
		<VueDatePicker
			v-model="date2"
			:inline="{ input: true }"
			:enable-time-picker="false"
			auto-apply
			no-today
			:highlight="highlightedDays"
			text-input
			:format="format"
			:min-date="date1"
			six-weeks="fair"
		></VueDatePicker>
		<div class="from-to-display">
			<div class="container">
				<span>Fra:</span>
				<div class="time">
					{{ format(date1) }}
				</div>
			</div>
			<div class="container">
				<span>Til:</span>
				<div class="time">
					{{ format(date2) /*date2.toISOString()*/ }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import '@/components/common/TimeSearch/custom-datepicker.css';
import { addDays } from 'date-fns/addDays';

export default defineComponent({
	name: 'DatePicker',
	components: {
		VueDatePicker,
	},
	setup() {
		const { t } = useI18n();

		const date1 = ref(new Date());
		const date2 = ref(new Date());

		const format = (date: Date) => {
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();

			return `${day} / ${month} / ${year}`;
		};

		onMounted(() => {
			resetDays();
		});

		const highlightedDays = computed((): Date[] => {
			const timeDifference = date2.value.getTime() - date1.value.getTime();
			const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
			const highlights = [];
			for (let i = 0; i < days; i++) {
				highlights.push(addDays(date1.value, i));
			}
			return highlights;
		});

		const resetDays = () => {
			date1.value = new Date();
			date1.value.setHours(0, 0, 0, 0);
			date2.value = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
			date2.value.setHours(23, 59, 59, 999);
		};

		return {
			date1,
			date2,
			format,
			highlightedDays,
			resetDays,
		};
	},
});
</script>

<style scoped>
.date-pickers {
	padding-top: 40px;
	padding-bottom: 40px;
	display: flex;
	padding-left: 0px;
	padding-right: 0px;
	box-sizing: border-box;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.date-pickers > div {
	width: 50%;
}

.from-to-display {
	display: flex;
	align-items: center;
	justify-content: space-around;
	flex-direction: row;
	gap: 15px;
	width: 100% !important;
	padding-top: 20px;
}

.from-to-display .container {
	background: #fafafa 0% 0% no-repeat padding-box;
	box-shadow: 1px 1px 2px #00000029;
	border: 1px solid #d9d8d8;
	color: #757575;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: 5px;
}

.container span {
	padding-left: 16px;
}

.from-to-display .container .time {
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

@media (min-width: 640px) {
	.date-pickers {
		align-items: initial;
		flex-direction: row;
		padding-left: 30px;
		padding-right: 30px;
		gap: 0px;
	}
}

@media (min-width: 990px) {
	.date-pickers > div {
		width: 33.33%;
	}
	.from-to-display {
		width: 33.33% !important;
		justify-content: center;
		flex-direction: column;
		padding-top: 0px;
	}
}
</style>
