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
			></VueSlider>
		</div>
		{{ values }}
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VueSlider from 'vue-3-slider-component';

export default defineComponent({
	name: 'TimeSearchComponent',
	components: {
		VueSlider,
	},
	setup() {
		const values = ref([2019, 2023]);
		const maxValue = 1992;
		const minValue = 2022;

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

		const moveFullSlider = ref(false);
		const lastXValue = ref(null as number | null);

		onMounted(() => {
			const slider = document.getElementsByClassName('vue-slider-process')[0];
			console.log(slider);
			slider.addEventListener('touchstart', overtakeMouseDown);
			slider.addEventListener('touchend', overtakeMouseUp);
			slider.addEventListener('mousedown', overtakeMouseDown);
			slider.addEventListener('mouseup', overtakeMouseUp);
			slider.addEventListener('mouseleave', overtakeMouseUp);
			slider.addEventListener('mousemove', changeSlider);
			slider.addEventListener('touchmove', changeSlider);
		});

		const overtakeMouseDown = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
			moveFullSlider.value = true;
			values.value[0] += Math.floor(Math.random() * 6 - 3);
			console.log('down taken!');
		};

		const overtakeMouseUp = (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
			moveFullSlider.value = false;
			console.log('up taken!');
		};

		const minusSliderValues = () => {
			/* if (sliderMin.value > minValue) {
				sliderMax.value = sliderMax.value - 1;
				sliderMin.value = sliderMin.value - 1;
			} */
		};

		const plusSliderValues = () => {
			/* if (sliderMax.value < maxValue) {
				sliderMax.value = sliderMax.value + 1;
				sliderMin.value = sliderMin.value + 1;
			} */
		};

		const changeSlider = (e: Event) => {
			//console.log(e);
			if (moveFullSlider.value === true) {
				console.log(e instanceof MouseEvent);
				if (e instanceof MouseEvent) {
					console.log('HELLO');
					if (lastXValue.value !== null) {
						e.clientX < lastXValue.value ? minusSliderValues() : plusSliderValues();
					}
					lastXValue.value = e.clientX;
					//mouse
				} else if (e instanceof TouchEvent) {
					//touch
				}

				console.log('changing slider');
			}
		};

		return { values, data };
	},
});
</script>

<style scroped>
.slider-container {
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
</style>
