<template>
	<div
		:class="open ? 'headline-container open' : 'headline-container'"
		@click="dispatchClick()"
	>
		<div class="material-icons icon">
			{{ icon }}
		</div>
		<div class="headline">
			<h3>{{ headline }}</h3>
			<span>{{ subline }}</span>
		</div>
		<div class="selected-items">
			<button
				v-for="(item, index) in selectedItems"
				:key="`${index}-${item.name}`"
				class="selected-entity"
				@click="handleTimeFacetRemoval(item.index, $event)"
			>
				<span class="entity-name">{{ formatStringForTime(t(item.name).substring(0, filterCuttof)) }}</span>
				<span class="close">×</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SelectorData } from '@/types/TimeSearchTypes';

export default defineComponent({
	name: 'TimelineHeadline',
	props: {
		open: {
			type: Boolean as PropType<boolean>,
			required: true,
		},
		headline: {
			type: String as PropType<string>,
			required: true,
		},
		icon: {
			type: String as PropType<string>,
			required: true,
		},
		subline: {
			type: String as PropType<string>,
			required: true,
		},
		click: {
			type: Function,
			default() {
				return null;
			},
		},
		itemArray: {
			type: Array as PropType<SelectorData[]>,
			required: false,
			default() {
				return [] as SelectorData[];
			},
		},
		passUpdate: {
			type: Function,
			default() {
				return null;
			},
		},
		filterCuttof: {
			type: Number as PropType<number>,
			required: false,
			default() {
				return 3;
			},
		},
	},

	setup(props) {
		const { t } = useI18n();

		const dispatchClick = () => {
			props.click !== undefined ? props.click() : null;
		};

		const selectedItems = computed(() => {
			return props.itemArray.filter((item: SelectorData) => item.selected);
		});

		const handleTimeFacetRemoval = (index: number, e: Event) => {
			e.stopPropagation();
			props.passUpdate(props.itemArray, index, false);
			console.log('headline part', index);
		};

		const formatStringForTime = (val: string) => {
			/* 
			if our cutoff is set to 13, we remove the .00 after the numbers, so we just get 13 - 14.
			This is because of space issues in the design - this was the best way to solve this nicely.
			*/
			if (props.filterCuttof === 13) {
				return val.replace(/.00/g, '');
			} else {
				return val;
			}
		};

		return { t, dispatchClick, selectedItems, handleTimeFacetRemoval, formatStringForTime };
	},
});
</script>

<style scoped>
.icon {
	height: 60px;
	width: 60px;
	font-size: 60px;
	overflow: hidden;
	color: #002e70;
	padding-right: 10px;
}

h3 {
	padding: 0;
	margin: 0;
	height: 20px;
	font-size: 20px;
	font-weight: 100;
	color: #002e70;
	height: auto;
}

.headline span {
	padding: 0;
	margin: 0;
	height: 20px;
	font-size: 14px;
	font-weight: 700;
	color: #002e70;
	background-color: #d9f5fe;
	border: 1px solid #d9f5fe;
	border-radius: 4px;
	width: fit-content;
	padding-left: 3px;
	padding-right: 3px;
}

.headline {
	display: flex;
	flex-direction: column;
	gap: 0px;
}

.headline-container {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	flex-direction: row;
	align-content: flex-start;
	height: 50px;
	width: 100%;
	transition: all 0.15s linear 0s;
	align-items: flex-start;
	padding-top: 5px;
	flex-wrap: nowrap;
}

.headline-container.open:hover {
	cursor: pointer;
	height: 50px !important;
}

.headline-container:hover {
	cursor: pointer;
	height: 55px;
}

.headline-container h3,
.headline-container span,
.headline-container div {
	cursor: pointer;
}

.selected-items {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-left: auto;
	max-width: 40%;
	gap: 5px;
	justify-content: flex-end;
}

.selected-entity {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 0px;
	border-radius: 15px;
	background-color: #002e70;
	color: white;
	cursor: pointer;
	position: relative;
	z-index: 5;
	white-space: pre;
}

.selected-entity .entity-name {
	text-transform: capitalize;
	padding-right: 5px;
}

.selected-entity .close {
	font-size: 20px;
}
</style>
