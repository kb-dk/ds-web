<template>
	<div :class="getStyles()">
		<label
			:title="title"
			class="label"
		>
			<span class="title">{{ title }}</span>
			<div
				v-if="checked"
				class="small-checkbox"
			></div>
			<Transition
				mode="out-in"
				name="result"
			>
				<span
					v-if="!loading"
					class="number"
				>
					{{ displayAmount(amount) }}
				</span>
				<span
					v-else
					class="number loading"
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
				:disabled="amount === '0' && !checked"
				:checked="checked"
				:data-testid="addTestDataEnrichment('input', 'genre-checkbox', title, number)"
				@change="updateSelection(!checked, title, fqkey)"
			/>
		</label>
		<span :class="`category-image ${santizeAndSimplify(title)}`"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
import { SelectorData } from '@/types/TimeSearchTypes';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'GenreCheckbox',
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
	},
	setup(props) {
		const searchResultStore = useSearchResultStore();
		const getStyles = () => {
			let classes = 'category-item';
			if (props.checked) {
				classes += ' checked';
			}
			if (props.amount === '0') {
				classes += ' disabled';
			}
			return classes;
		};

		const displayAmount = (value: string | undefined) => {
			return value ? `${Number(value).toLocaleString('de-DE')}` : '0';
		};

		const updateSelection = (checked: boolean, title: string | undefined, key: string | undefined) => {
			props.update(props.parentArray, props.number, checked, title, key, searchResultStore.categoryFilters);
		};

		return { updateSelection, displayAmount, addTestDataEnrichment, santizeAndSimplify, getStyles };
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

label {
	width: 100%;
	height: 100%;
	padding: 10px 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
}

.category-item.disabled label {
	cursor: default;
}

.number.loading {
	height: 15px;
}

.disabled .number.loading .text {
	background-color: white;
}

.text {
	display: inline-block;
	height: 12px;
	margin-top: 1px;
	border-radius: 3px;
	background-color: #002e70;
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
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: -1;
}

input:focus {
	outline: solid 5px #caf0fe;
	box-shadow:
		rgba(6, 24, 44, 0.4) 0px 0px 0px 5px,
		rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
		rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
	border-radius: 5px;
}

.checked {
	background-color: #c4f1ed !important;
	color: #002e70 !important;
	border: 2px solid #002e70 !important;
}

.checked .number {
	border-color: #002e70 !important;
}

.disabled {
	background-color: #6e6e6e !important;
	cursor: default;
}

.category-item {
	background: #002e70 0% 0% no-repeat padding-box;
	box-shadow: 2px 2px 4px #75757500;
	border: 2px solid #ffffff;
	border-radius: 4px;
	color: white;
	width: 100%;
	box-sizing: border-box;
	height: 75px;
	border: 2px solid #002e7026;
	border-radius: 4px;
	position: relative;
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	transition: all 0.3s linear 0s;
}

.category-item .number {
	position: absolute;
	bottom: -16px;
	right: 8px;
	font-size: 12px !important;
	padding: 5px;
	background: #c4f1ed 0% 0% no-repeat padding-box;
	border: 2px solid white;
	border-radius: 4px;
	color: #002e70;
}

.disabled .number {
	background: #6e6e6e 0% 0% no-repeat padding-box;
	color: white;
}

.category-image {
	transition: all 0.25s linear 0s;
	color: #c4f1ed;
	position: absolute;
	width: 24px;
	height: 24px;
	z-index: 20;
	top: -23px;
	left: -1px;
	background-image: url('@/assets/icons/blue/diverse-blue.svg');
	filter: hue-rotate(5deg);
}

.disabled .category-image {
	background-image: url('@/assets/icons/gray/diverse-gray.svg');
}

.category-item:hover .category-image {
	transform: rotateZ(25deg);
}

.category-item.disabled .category-image {
	transform: rotateZ(0deg);
}

.small-checkbox {
	width: 15px;
	height: 15px;
	background-color: #002e70;
	position: absolute;
	top: 0px;
	right: 0px;
	margin: 1px;
	border-radius: 3px;
}

.small-checkbox:before {
	content: '';
	display: block;
	background-color: white;
	width: 7px;
	height: 2px;
	position: absolute;
	transform: rotateZ(45deg);
	top: 9px;
}

.small-checkbox:after {
	content: '';
	display: block;
	background-color: white;
	width: 13px;
	height: 2px;
	position: absolute;
	transform: rotateZ(-45deg);
	top: 7px;
	left: 3px;
}

.diverse {
	background-image: url('@/assets/icons/blue/diverse-blue.svg');
}
.dokumentar {
	background-image: url('@/assets/icons/blue/dokumentar-blue.svg');
}
.film-og-serier {
	background-image: url('@/assets/icons/blue/fiktion-blue.svg');
}
.kultur-og-oplysning {
	background-image: url('@/assets/icons/blue/kultur-blue.svg');
}
.livsstil {
	background-image: url('@/assets/icons/blue/livsstil-blue.svg');
}
.musik {
	background-image: url('@/assets/icons/blue/musik-blue.svg');
}
.nyheder-politik-og-samfund {
	background-image: url('@/assets/icons/blue/nyheder-blue.svg');
}
.sport {
	background-image: url('@/assets/icons/blue/sport-blue.svg');
}
.humor-quiz-og-underholdning {
	background-image: url('@/assets/icons/blue/underholdning-blue.svg');
}
.natur-og-videnskab {
	background-image: url('@/assets/icons/blue/videnskab-blue.svg');
}
.brn-og-unge {
	background-image: url('@/assets/icons/blue/born-blue.svg');
}

.disabled .diverse {
	background-image: url('@/assets/icons/gray/diverse-gray.svg');
}
.disabled .dokumentar {
	background-image: url('@/assets/icons/gray/dokumentar-gray.svg');
}
.disabled .film-og-serier {
	background-image: url('@/assets/icons/gray/fiktion-gray.svg');
}
.disabled .kultur-og-oplysning {
	background-image: url('@/assets/icons/gray/kultur-gray.svg');
}
.disabled .livsstil {
	background-image: url('@/assets/icons/gray/livsstil-gray.svg');
}
.disabled .musik {
	background-image: url('@/assets/icons/gray/musik-gray.svg');
}
.disabled .nyheder-politik-og-samfund {
	background-image: url('@/assets/icons/gray/nyheder-gray.svg');
}
.disabled .sport {
	background-image: url('@/assets/icons/gray/sport-gray.svg');
}
.disabled .humor-quiz-og-underholdning {
	background-image: url('@/assets/icons/gray/underholdning-gray.svg');
}
.disabled .natur-og-videnskab {
	background-image: url('@/assets/icons/gray/videnskab-gray.svg');
}
.disabled .brn-og-unge {
	background-image: url('@/assets/icons/gray/born-gray.svg');
}
</style>
