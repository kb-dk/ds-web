<template>
	<div class="select-container">
		<select
			v-model="selected"
			@change="updated($event)"
		>
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
	name: 'SelectComponent',
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
	background-color: #fafafa;
}

select option {
	font-family: noway, sans-serif;
	padding: 5px;
}

.single-entry {
	padding: 5px 10px;
}
</style>
