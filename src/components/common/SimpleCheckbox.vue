<template>
	<div :class="getClassStyle()">
		<label
			:title="title"
			class="label"
		>
			<span class="title">{{ title }}</span>
			<Transition
				mode="out-in"
				name="result"
			>
				<span
					v-if="!loading"
					class="tag-number"
				>
					{{ displayAmount(amount) }}
				</span>
				<span
					v-else
					class="tag-number loading"
				>
					<div
						:style="`animation-delay:${Math.random() * 2}s`"
						class="shimmer"
					></div>
					<span
						:style="`width:${Math.random() * 15 + 10}px`"
						class="text"
					></span>
				</span>
			</Transition>
			<input
				role="checkbox"
				type="checkbox"
				class="checkbox"
				:name="title"
				:disabled="(amount === '0' && !checked) || (disabled && !checked)"
				:checked="checked"
				:data-testid="addTestDataEnrichment('input', 'simple-checkbox', title, number)"
				@change="updateSelection(!checked, title, fqkey)"
			/>
			<div class="underline"></div>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SelectorData } from '@/types/TimeSearchTypes';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'SimpleCheckbox',
	props: {
		fqkey: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		title: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		amount: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		number: {
			type: Number,
			required: true,
		},
		checked: { type: Boolean, required: false },
		loading: { type: Boolean, required: true },
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
		const searchResultStore = useSearchResultStore();

		const displayAmount = (value: string | undefined) => {
			return value ? `(${value})` : '';
		};

		const updateSelection = (checked: boolean, title: string | undefined, key: string | undefined) => {
			props.update(props.parentArray, props.number, checked, title, key, searchResultStore.channelFilters);
		};
		const getClassStyle = () => {
			return { 'checkbox-container': true, disabled: props.amount === '0' || (props.disabled && !props.checked) };
		};
		return { displayAmount, addTestDataEnrichment, updateSelection, getClassStyle };
	},
});
</script>

<style scoped>
:host {
	display: block;
	transition: all 0.3s linear;
	height: 25px;
	width: 100%;
	margin-right: 5px;
}

.loading {
	flex-direction: row;
	height: 25px;
	justify-content: space-between;
	display: flex;
}

.shimmer {
	animation: loading 3s ease-in-out 0s infinite;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		117deg,
		rgba(255, 255, 255, 0) 44%,
		rgba(255, 255, 255, 0.7455357142857143) 64%,
		rgba(255, 255, 255, 0) 77%
	);
	position: absolute;
	width: 100%;
	height: 25px;
	mix-blend-mode: overlay;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 160% center;
	opacity: 0.5;
}

.name {
	height: 100%;
	display: flex;
	gap: 5px;
}

.loading label {
	color: transparent;
	user-select: none;
}

.text {
	margin: 5px 0px;
	margin-left: 5px;
	border-radius: 5px;
	background-color: rgba(170, 170, 170, 1);
	height: 12px;
	display: inline-block;
}

@keyframes loading {
	0% {
		background-position: 160% center;
	}
	20% {
		background-position: 160% center;
	}
	80% {
		background-position: -20% center;
	}
	100% {
		background-position: -20% center;
	}
}

.checkbox-container {
	max-height: 24px;
	padding: 0px 5px;
	text-align: left;
}

.checkbox-container.disabled .label {
	cursor: default;
}

.label:hover .underline {
	width: calc(100% - 3px);
}

.label {
	position: relative;
}

.underline {
	height: 1px;
	background-color: #002e70;
	width: 0px;
	transition: all 0.3s ease-in-out 0s;
	position: absolute;
}

.checkbox-container.disabled .title,
.checkbox-container.disabled .tag-number {
	color: rgb(177, 177, 177) !important;
	font-weight: normal;
}

.tag-number {
	font-size: 10px;
	color: #383838;
	display: inline-block;
	padding-left: 5px;
	vertical-align: bottom;
	line-height: 24px;
	height: 100%;
}

.loading.tag-number {
	height: 24px;
	overflow: hidden;
	position: relative;
}

.checkbox-container.disabled .loading.tag-number .text {
	background-color: rgb(177, 177, 177) !important;
	opacity: 0.5;
}

.title {
	font-size: 14px;
	text-overflow: ellipsis;
	max-width: calc(100% - 85px);
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	text-transform: uppercase;
	color: #002e70;
	font-weight: bold;
}

.loading .checkbox:after {
	border: 1px solid rgba(170, 170, 170, 1) !important;
	background-color: rgb(255, 255, 255) !important;
	cursor: default;
}

.loading .checkbox:checked:after {
	background-color: rgba(170, 170, 170, 1) !important;
}

.loading .checkbox:hover:before {
	cursor: default !important;
	border-color: white !important;
}

.checkbox:disabled {
	cursor: default;
}

.checkbox:disabled:hover {
	cursor: default;
}

.checkbox:disabled:hover:after {
	background-color: transparent;
	cursor: default;
}

.checkbox:disabled:hover:after {
	cursor: default;
	background-color: #002e70;
}

.checkbox:hover:after {
	background-color: #caf0fe;
}

.checkbox:checked:hover:before {
	border-color: #002e70;
	cursor: pointer;
}
.checkbox:checked:hover:after {
	border-color: rgba(170, 170, 170, 1);
	background-color: white;
}

input:focus {
	box-shadow: 0 0 0 2px rgba(39, 94, 254, 0.5);
}

.checkbox {
	-webkit-appearance: none;
	-moz-appearance: none;
	outline: none;
	position: relative;
	float: right;
}

.checkbox-container.disabled .checkbox:after {
	border: 1px solid rgb(145, 145, 145);
}

.checkbox-container.disabled .checkbox:hover:after {
	cursor: default;
	background-color: rgb(255, 255, 255);
}

.checkbox:after {
	cursor: pointer;
	transition: all 0.15s linear 0s;
	content: '';
	display: block;
	width: 15px;
	height: 15px;
	border: 1px solid #002e70;
}

.checkbox:checked:after {
	background-color: #002e70;
}

.checkbox:checked:before {
	content: '';
	display: block;
	width: 7px;
	height: 12px;
	border-bottom: 2px solid white;
	border-right: 2px solid white;
	position: absolute;
	top: 1px;
	left: 5px;
	box-sizing: border-box;
	transform-origin: center;
	transform: rotateZ(45deg);
}

.label {
	cursor: pointer;
	display: block;
}
</style>
