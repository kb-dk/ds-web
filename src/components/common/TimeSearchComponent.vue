<template>
	<div>
		<div class="slider-container">
			<VueSlider
				v-model="values"
				:clickable="true"
				:drag-on-click="true"
				:data="data"
				data-label="key"
				tooltip="always"
				@drag-end="getTimeResults()"
			></VueSlider>
		</div>
		<div>
			<h3>results</h3>
			<div class="time-results">
				<div
					v-for="(item, index) in timeSearchStore.timeResults"
					:key="index"
					class="time-result-item"
				>
					<GridResultItem :resultdata="item"></GridResultItem>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueSlider from 'vue-3-slider-component';
import GridResultItem from '@/components/common/GridResultItem.vue';
import { useTimeSearchStore } from '@/store/timeSearchStore';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
		GridResultItem,
	},
	setup() {
		const timeSearchStore = useTimeSearchStore();
		const values = ref([2019, 2023]);

		const data = [
			{ value: 2006, key: 2006 },
			{ value: 2007, key: 2007 },
			{ value: 2008, key: 2008 },
			{ value: 2009, key: 2009 },
			{ value: 2010, key: 2010 },
			{ value: 2011, key: 2011 },
			{ value: 2012, key: 2012 },
			{ value: 2013, key: 2013 },
			{ value: 2014, key: 2014 },
			{ value: 2015, key: 2015 },
			{ value: 2016, key: 2016 },
			{ value: 2017, key: 2017 },
			{ value: 2018, key: 2018 },
			{ value: 2019, key: 2019 },
			{ value: 2020, key: 2020 },
			{ value: 2021, key: 2021 },
			{ value: 2022, key: 2022 },
			{ value: 2023, key: 2023 },
			{ value: 2024, key: 2024 },
		];

		onMounted(() => {
			const slider = document.getElementsByClassName('vue-slider-process')[0];
			timeSearchStore.getTimeSearchResults(values.value[0].toString(), values.value[1].toString());

			console.log(slider);
		});

		const getTimeResults = () => {
			console.log('new results please');
			timeSearchStore.getTimeSearchResults(values.value[0].toString(), values.value[1].toString());
		};

		return { values, data, getTimeResults, timeSearchStore };
	},
});
</script>

<style scroped>
.slider-container {
	padding-top: 40px;
	padding-bottom: 20px;
}
.vue-slider-rail {
	background-color: #002e70 !important;
	border-radius: 0px !important;
}

.vue-slider {
	height: 40px !important;
}
.vue-slider-process {
	border-radius: 0px !important;
	background-color: #caf0fe !important;
}

.vue-slider-mark-step {
	border-radius: 0px !important;
}

.vue-slider-mark {
	width: 2px !important;
	height: 40% !important;
	background-color: #caf0fe !important;
	margin-bottom: 20px;
}

.vue-slider-mark-label {
	padding-top: 5px;
}

.vue-slider-dot-tooltip-inner {
	background-color: #fff6c4 !important;
	color: black !important;
}

.vue-slider-dot-tooltip-inner-bottom:after,
.vue-slider-dot-tooltip-inner-top:after {
	border-top-color: #fff6c4 !important;
	color: black !important;
}

.time-results {
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	gap: 20px;
	flex-wrap: wrap;
}

.time-result-item {
	flex: 1 1 calc(25% - 20px);
	max-width: calc(25% - 10px);
	box-sizing: border-box;
}
</style>
