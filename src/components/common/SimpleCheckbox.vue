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
			class="label"
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
				v-if="svg"
				:class="[
					'display-image svg',
					santizeAndSimplify(svg),
					{ disabled: (amount === '0' && !checked) || (disabled && !checked) },
				]"
			></span>
			<span
				v-if="channel"
				:style="`background-image:url(${getFilterThumbnail(channel)})`"
				:class="['display-image channel', { disabled: (amount === '0' && !checked) || (disabled && !checked) }]"
			></span>
			<span class="title label-small">{{ title }}</span>
			<Transition
				mode="out-in"
				name="result"
			>
				<span
					v-if="!loading"
					class="tag-number label-small"
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
		svg: {
			type: String,
			required: false,
			default() {
				return '';
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

.display-image.svg {
	background-image: url('@/assets/icons/blue/diverse-blue.svg');
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
	margin: 2px 5px;
	padding: 2px 5px;
	text-align: left;
	border: 1px solid transparent;
	transition: all 0.2s linear 0s;
}

.checkbox-container:hover,
.checkbox-container.checked {
	background-color: #c4f0fd;
	border: 1px solid #86e2fb;
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
	color: rgb(177, 177, 177) !important;
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
	background-color: rgb(177, 177, 177) !important;
	opacity: 0.5;
}

.title {
	text-overflow: ellipsis;
	max-width: calc(100% - 95px);
	white-space: nowrap;
	overflow: clip;
	text-transform: uppercase;
	color: #002e70;
	display: inline-block;
}

.loading .checkbox:after {
	border: 2px solid rgba(170, 170, 170, 1) !important;
	background-color: rgb(255, 255, 255) !important;
	cursor: default;
}

.loading .checkbox:checked:after {
	background-color: rgba(170, 170, 170, 1) !important;
}

/* .loading .checkbox:hover:before {
	cursor: default !important;
	border-color: white !important;
} */

.checkbox:disabled {
	cursor: default;
}

.checkbox:disabled:hover {
	cursor: default;
}

/* .checkbox:disabled:hover:after {
	background-color: transparent;
	cursor: default;
} */

/* .checkbox:disabled:hover:after {
	cursor: default;
	background-color: #002e70;
} */

/* .checkbox:hover:after {
	background-color: #caf0fe;
} */

/* .checkbox:checked:hover:before {
	border-color: #002e70;
	cursor: pointer;
} */
/* .checkbox:checked:hover:after {
	border-color: rgba(170, 170, 170, 1);
	background-color: white;
} */

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
	top: 1px;
	left: 7px;
	box-sizing: border-box;
	transform-origin: center;
	transform: rotateZ(45deg);
}

.svg.diverse {
	background-image: url('@/assets/icons/blue/diverse-blue.svg');
}
.svg.dokumentar {
	background-image: url('@/assets/icons/blue/dokumentar-blue.svg');
}
.svg.film-og-serier {
	background-image: url('@/assets/icons/blue/fiktion-blue.svg');
}
.svg.kultur-og-oplysning {
	background-image: url('@/assets/icons/blue/kultur-blue.svg');
}
.svg.livsstil {
	background-image: url('@/assets/icons/blue/livsstil-blue.svg');
}
.svg.musik {
	background-image: url('@/assets/icons/blue/musik-blue.svg');
}
.svg.nyheder-politik-og-samfund {
	background-image: url('@/assets/icons/blue/nyheder-blue.svg');
}
.svg.sport {
	background-image: url('@/assets/icons/blue/sport-blue.svg');
}
.svg.humor-quiz-og-underholdning {
	background-image: url('@/assets/icons/blue/underholdning-blue.svg');
}
.svg.natur-og-videnskab {
	background-image: url('@/assets/icons/blue/videnskab-blue.svg');
}
.svg.brn-og-unge {
	background-image: url('@/assets/icons/blue/born-blue.svg');
}
.label {
	cursor: pointer;
}
</style>
