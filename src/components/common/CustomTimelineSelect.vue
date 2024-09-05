<template>
	<div class="select-container">
		<label>
			{{ label }}:
			<select
				v-model="selected"
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
import { initStartDate } from './TimeSearch/TimeSearchInitValues';

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

		return { selected, updated, startTime };
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
	font-size: 20px;
	border: 0px;
	background-color: transparent;
	font-family: noway, sans-serif;
	background-color: white;
	border: 1px solid #002e70;
	border-radius: 4px;
	padding: 0px 5px;
	color: #002e70;
	padding-right: 10px;
}

label {
	padding-right: 10px;
}

.line {
	display: block;
	width: 1px;
	height: 16px;
	background-color: lightgrey;
	top: 7px;
	right: 0px;
	position: absolute;
	margin-right: 32px;
}

select option {
	font-family: noway, sans-serif;
	padding: 5px;
}

.single-entry {
	padding: 5px 10px;
}
</style>
