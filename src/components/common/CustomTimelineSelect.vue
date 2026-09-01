<template>
	<div class="select-container">
		<label
			class="label-big"
			:style="{ color: labelColor }"
		>
			{{ label }}:
			<select
				v-model="selected"
				:data-testid="addTestDataEnrichment('select', 'timeline-select', `${label}-select`, 0)"
				:name="label"
				class="btn-medium"
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
		<div class="line">
			<span
				aria-hidden="true"
				class="material-icons"
			>
				keyboard_arrow_down
			</span>
		</div>
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
			type: Array as PropType<string[] | number[]>,
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
		labelColor: {
			type: String,
			default() {
				return 'var(--color-default)';
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
	position: relative;
	display: inline-block;
	width: auto;
	background-color: transparent;
}

.select-container select {
	border: 0px;
	border: 1px solid var(--color-main);
	border-radius: 4px;
	padding: 4px 50px 5px 8px;
	color: var(--color-main);
	-webkit-appearance: none;
	-moz-appearance: none;
	color: var(--color-default);
	background-color: var(--bg-main);
	width: 118px;
	box-sizing: border-box;
	height: 48px;
}

.select-container:hover select {
	border: 1px solid var(--bg-main-3);
	cursor: pointer;
	transition: all 0.3s ease 0s;
	background-color: var(--bg-main-2);
	border-color: var(--color-border-light);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0);
}

label {
	padding-right: 10px;
	display: flex;
	gap: 5px;
	align-items: center;
}
.line {
	display: block;
	width: 1px;
	height: 100%;
	background-color: var(--bg-default);
	top: 0;
	right: 0px;
	position: absolute;
	display: flex;
	justify-content: start;
	align-items: center;
	margin-right: 52px;
	pointer-events: none;
}
.line span {
	color: var(--color-default);
	font-size: var(--fs-xl);
	margin-left: 5px;
}

select option {
	padding: 5px;
}
.single-entry {
	padding: 5px 10px;
}
</style>
