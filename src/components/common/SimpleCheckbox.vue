<template>
	<div
		:class="[
			'checkbox-container',
			{
				disabled: amount === '0' || (disabled && !checked),
				checked: checked === true,
			},
		]"
	>
		<label
			:title="title"
			class="label label-regular"
		>
			<input
				role="checkbox"
				type="checkbox"
				class="checkbox"
				autocomplete="off"
				:name="title"
				:disabled="(amount === '0' && !checked) || (disabled && !checked)"
				:checked="checked"
				:data-testid="addTestDataEnrichment('input', 'simple-checkbox', title, number)"
				@change="updateSelection(!checked, title, fqkey)"
			/>
			<span
				v-if="icon"
				:class="[
					'display-image material-icons',
					{ disabled: (amount === '0' && !checked) || (disabled && !checked), outline: iconFilled },
				]"
			>
				{{ icon }}
			</span>
			<span
				v-if="channel"
				:style="`background-image:url(${getFilterThumbnail(channel)})`"
				:class="['display-image channel', { disabled: (amount === '0' && !checked) || (disabled && !checked) }]"
			></span>
			<span class="title label-regular label">{{ title }}</span>
			<Transition
				mode="out-in"
				name="result"
			>
				<span
					v-if="!loading"
					class="tag-number label-regular label"
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
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SelectorData } from '@/types/TimeSearchTypes';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
import { getFilterThumbnail } from '@/utils/record-utils';
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
		icon: {
			type: String,
			required: false,
			default() {
				return '';
			},
		},
		iconFilled: {
			type: Boolean,
			required: false,
			default() {
				return false;
			},
		},
		channel: {
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
		filterArray: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	setup(props) {
		const displayAmount = (value: string | undefined) => {
			return value ? `(${value})` : '';
		};

		const updateSelection = (checked: boolean, title: string | undefined, key: string | undefined) => {
			props.update(props.parentArray, props.number, checked, title, key, props.filterArray);
		};
		return {
			displayAmount,
			addTestDataEnrichment,
			updateSelection,
			santizeAndSimplify,
			getFilterThumbnail,
		};
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

.display-image {
	width: 30px;
	height: 30px;
	padding: 0px 5px;
	background-repeat: no-repeat;
	background-position: center center;
}

.display-image.disabled {
	filter: grayscale(100%) brightness(4);
}

.display-image.channel {
	background-size: contain;
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
	background-color: var(--color-disabled-font);
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
	margin: 2px 5px;
	padding: 2px 5px;
	text-align: left;
	border: 1px solid transparent;
	transition: all 0.2s linear 0s;
}

.checkbox-container:hover {
	background-color: var(--bg-secondary-light-20);
	border: 1px solid var(--color-border-light-focused);
	border-radius: 4px;
}

.checkbox-container.checked {
	background-color: var(--bg-secondary-light);
	border: 1px solid var(--color-borders-light);
	border-radius: 4px;
}

.checkbox-container.disabled .label {
	cursor: default;
}

.label:hover .underline {
	width: calc(100% - 3px);
}

.label {
	position: relative;
	display: flex;
	cursor: pointer;
	height: 24px;
	align-items: center;
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
	color: var(--color-disabled-font);
	font-weight: normal;
}

.tag-number {
	color: #383838;
	display: inline-block;
	padding-left: 5px;
	height: 100%;
	margin-left: auto;
	order: 2;
}

.loading.tag-number {
	height: 24px;
	overflow: hidden;
	position: relative;
	display: inherit;
}
.loading .text {
	margin: 0 0 0 5px;
}
.checkbox-container.disabled .loading.tag-number .text {
	background-color: var(--color-disabled-font);
	opacity: 1;
}

.title {
	text-overflow: ellipsis;
	max-width: calc(100% - 95px);
	white-space: nowrap;
	overflow: clip;
	color: #002e70;
	display: inline-block;
}

.loading .checkbox:after {
	border: 2px solid var(--color-disabled-font);
	background-color: rgb(255, 255, 255) !important;
	cursor: default;
}

.loading .checkbox:checked:after {
	background-color: var(--color-disabled-font);
}

.checkbox:disabled {
	cursor: default;
}

.checkbox:disabled:hover {
	cursor: default;
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
	border: 3px solid rgb(145, 145, 145);
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
	width: 20px;
	height: 20px;
	border: 3px solid #002e70;
	border-radius: 4px;
}

.checkbox:checked:after {
	background-color: #002e70;
}

.checkbox:checked:before {
	content: '';
	display: block;
	width: 9px;
	height: 16px;
	border-bottom: 2px solid white;
	border-right: 2px solid white;
	position: absolute;
	top: 3px;
	left: 8px;
	box-sizing: border-box;
	transform-origin: center;
	transform: rotateZ(45deg);
}
.label {
	cursor: pointer;
}
</style>
