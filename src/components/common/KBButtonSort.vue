<template>
	<button
		v-bind="attrs"
		class="btn"
		:class="{ active: active }"
	>
		<span
			v-if="leftIconName"
			class="material-icons"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
		<div
			v-if="hasArrowIcons"
			class="sort-arrows"
		>
			<span
				class="material-icons"
				:class="{ 'arrow-active': isAscSort && active }"
			>
				keyboard_arrow_up
			</span>
			<span
				class="material-icons"
				:class="{ 'arrow-active': isDescSort && active }"
			>
				keyboard_arrow_down
			</span>
		</div>
	</button>
</template>

<script lang="ts">
import { defineComponent, useAttrs } from 'vue';

export default defineComponent({
	name: 'KBButtonSort',
	props: {
		hasArrowIcons: {
			type: Boolean,
			default() {
				return false;
			},
		},
		leftIconName: {
			type: String,
			default() {
				return '';
			},
		},
		active: {
			type: Boolean,
			default() {
				return false;
			},
		},
		isAscSort: {
			type: Boolean,
			default() {
				return false;
			},
		},
		isDescSort: {
			type: Boolean,
			default() {
				return false;
			},
		},
		buttonText: {
			type: String,
			default() {
				return '';
			},
		},
	},
	setup() {
		const attrs = useAttrs();
		return { attrs };
	},
});
</script>

<style scoped>
.btn {
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	box-sizing: border-box;
	height: fit-content;
	max-height: 44px;
	padding: var(--padding-00, 10px) var(--padding-medium);
	border-radius: var(--rounded-medium) var(--rounded-medium) 0 0;
	gap: var(--padding-02);
	background-color: var(--color-default);
	color: var(--color-main);
	border: none;
	border-bottom: 1px solid transparent;
}
.btn:disabled {
	background-color: var(--bg-disabled);
	cursor: default;
}
.btn.active {
	border-bottom: 1px solid var(--Colors-Borders-active, #002e70);
}
.sort-arrows {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-items: center;
	text-align: center;
}
.sort-arrows span {
	display: flex;
	height: 10px;
	align-items: center;
	color: var(--bg-disabled);
}
.sort-arrows .arrow-active {
	color: var(--color-main);
}
</style>
