<template>
	<div class="select-container">
		<div class="line"></div>
		<select
			v-model="selected"
			@change="updated($event)"
		>
			<option
				value=""
				disabled
				selected
				hidden
			>
				1992
			</option>
			<option
				v-for="(item, index) in listItems"
				:key="index"
				class="single-entry"
			>
				{{ item }}
			</option>
		</select>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue';

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
	},
	emits: ['updateSelected'],

	setup(props, { emit }) {
		const selected = ref('');

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

		return { selected, updated };
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

.line {
	display: block;
	width: 1px;
	height: 16px;
	position: absolute;
	background-color: lightgrey;
	left: 63px;
	top: 7px;
}

select option {
	font-family: noway, sans-serif;
	padding: 5px;
}

.single-entry {
	padding: 5px 10px;
}
</style>
