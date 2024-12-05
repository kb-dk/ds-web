<template>
	<div class="select-container">
		<label>
			{{ label }}:
			<select
				v-model="selected"
				:data-testid="addTestDataEnrichment('select', 'timeline-select', `${label}-select`, 0)"
				:name="label"
				@change="updated($event)"
			>
				<option
					:value="startTime"
					disabled
					selected
					hidden
				>
					{{ startTime }}
				</option>
				<option
					v-for="(item, index) in listItems"
					:key="index"
					class="single-entry"
					:value="item"
				>
					{{ item }}
				</option>
			</select>
		</label>
		<div class="line"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { initStartDate } from '@/components/common/timeSearch/TimeSearchInitValues';

export default defineComponent({
	name: 'CustomTimelineSelect',
	props: {
		listItems: {
			type: Array as PropType<string[]>,
			default() {
				return [];
			},
		},
		currentSelected: {
			type: Number,
			default() {
				return 0;
			},
		},
		label: {
			type: String,
			default() {
				return '';
			},
		},
	},
	emits: ['updateSelected'],

	setup(props, { emit }) {
		const selected = ref('');
		const startTime = initStartDate.value.getFullYear();
		const updated = (e: Event | null) => {
			if (e && e.target instanceof HTMLSelectElement) {
				emit('updateSelected', e.target.value);
			}
		};

		onMounted(() => {
			selected.value = props.currentSelected.toString();
		});

		watch(
			() => props.currentSelected,
			(newVal: number) => {
				selected.value = newVal.toString();
			},
		);

		return { selected, updated, addTestDataEnrichment, startTime };
	},
});
</script>

<style scoped>
.select-container {
	font-family: noway, sans-serif;
	position: relative;
	display: inline-block;
	width: auto;
	background-color: transparent;
}

.select-container select {
	font-size: 26px;
	border: 0px;
	font-family: noway, sans-serif;
	background-color: white;
	border: 1px solid #dadada;
	border-radius: 4px;
	padding: 4px 50px 5px 8px;
	color: #002e70;
	-webkit-appearance: none;
	-moz-appearance: none;
	background-color: white;
	background: url('@/assets/icons/blue/dd-arrow-blue.svg') white;
	background-repeat: no-repeat;
	background-position-x: 85px;
	background-position-y: 16px;
}
.select-container:hover select {
	border: 1px solid #002e70;
	cursor: pointer;
}

label {
	padding-right: 10px;
	color: black;
}

.line {
	display: block;
	width: 1px;
	height: 24px;
	background-color: lightgrey;
	top: 10px;
	right: 0px;
	position: absolute;
	margin-right: 52px;
}

select option {
	font-family: noway, sans-serif;
	padding: 5px;
}

.single-entry {
	padding: 5px 10px;
}
</style>
