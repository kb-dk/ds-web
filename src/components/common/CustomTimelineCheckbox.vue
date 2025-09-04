<template>
	<input
		:id="name + '-checkbox-' + index"
		ref="checkboxRef"
		:name="name"
		type="checkbox"
		autocomplete="off"
		:checked="val"
		:disabled="disabled && !val"
		:data-testid="addTestDataEnrichment('input', 'timeline-checkbox', name, index)"
		@change="updateSelection($event)"
	/>
	<label
		:title="$t(name)"
		:class="getClassStyle(false)"
		:for="name + '-checkbox-' + index"
	>
		<span class="checkbox-title">{{ $t(name) }}</span>
		<span :class="getClassStyle(true)">
			<span class="checkbox-checkmark"></span>
		</span>
	</label>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue';
import { SelectorData } from '@/types/TimeSearchTypes';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'CustomTimelineCheckbox',
	props: {
		val: {
			type: Boolean,
			default() {
				return true;
			},
		},
		tilted: {
			type: Boolean,
			default() {
				return false;
			},
		},
		name: {
			type: String,
			default() {
				return '';
			},
		},
		index: {
			type: Number,
			default() {
				return 0;
			},
		},
		update: {
			type: Function,
			default() {
				return null;
			},
		},
		parentArray: {
			type: Array as PropType<SelectorData[]>,
			default() {
				return [] as SelectorData[];
			},
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const checkboxRef = ref<HTMLInputElement | null>(null);
		const checkboxLabelRef = ref<HTMLLabelElement | null>(null);

		const getClassStyle = (isCheckbox: boolean) => {
			return { 'checkbox-square': isCheckbox, tilted: props.tilted, 'checkbox-disabled': props.disabled && !props.val };
		};

		watch(
			() => props.val,
			(newVal: boolean) => {
				checkboxRef.value !== null ? (checkboxRef.value.checked = newVal) : null;
			},
		);

		const updateSelection = (e: Event) => {
			e.stopPropagation();
			const target = e.target as HTMLInputElement;
			props.update(props.parentArray, props.index, target.checked);
		};

		return { updateSelection, checkboxRef, checkboxLabelRef, addTestDataEnrichment, getClassStyle };
	},
});
</script>

<style scoped>
.checkbox input {
	position: absolute;
	clip: rect(1px, 1px, 1px, 1px);
	padding: 0;
	border: 0;
	height: 1px;
	width: 1px;
	overflow: hidden;
	z-index: 1;
}

.checkbox input:focus + label {
	outline: solid 5px #caf0fe;
	box-shadow:
		rgba(6, 24, 44, 0.4) 0px 0px 0px 5px,
		rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
		rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
}

.checkbox.all label {
	width: 100px;
}

.checkbox.all {
	width: 100px;
}

.checkbox label {
	background-color: #ffffff;
	color: #002e70;
	user-select: none;
	transition: all 0.3s ease-in-out 0s;
	font-size: 20px;
	text-transform: capitalize;
	border-radius: 15px;
	padding: 3px 10px;
	display: inline-flex;
	align-items: center;
	border: 1px solid #002e7033;
	box-sizing: border-box;
	width: auto;
	transform-origin: right;
	cursor: pointer;
	white-space: nowrap;
	z-index: 1;
}

.tilted {
	transform: rotateZ(-35deg);
}

.checkbox input:checked ~ label {
	background-color: white;
	color: #002e70;
	border: 1px solid #002e70;
	box-sizing: border-box;
}

.checkbox label:hover {
	border: 1px solid #002e70;
}

.checkbox label .checkbox-square {
	transition: all 0.3s ease-in-out 0s;
	width: 20px;
	height: 20px;
	background-color: white;
	display: inline-block;
	border: 2px solid #002e70;
	border-radius: 3px;
	box-sizing: border-box;
	margin-left: 5px;
}

.checkbox label .checkbox-square.tilted {
	transform: rotateZ(35deg);
}

.checkbox-title {
	padding-right: 5px;
}

.checkbox input:checked ~ label .checkbox-square {
	width: 20px;
	height: 20px;
	background-color: #002e70;
	display: inline-block;
	box-sizing: border-box;
}

.checkbox input:checked ~ label .checkbox-checkmark {
	border-left: 2px solid white;
	border-bottom: 2px solid white;
	height: 8px;
	width: 13px;
	display: inline-block;
	position: relative;
	border-bottom-left-radius: 2px;
	left: 10px;
	top: -14px;
	transform: rotateZ(-52deg) translate(-50%, -50%);
}

.checkbox-disabled {
	cursor: default !important;
	border-color: rgb(177, 177, 177) !important;
	color: rgb(177, 177, 177) !important;
}
</style>
