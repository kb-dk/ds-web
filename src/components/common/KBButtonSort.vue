<template>
	<button
		v-bind="attrs"
		class="btn"
		:class="{ active: active, 'relevance-btn': !hasArrowIcons }"
		:aria-label="`${t('search.sortBy')} ${buttonText.toLowerCase()}${
			active ? `, ${isAscSort ? t('search.sortedAsc') : t('search.sortedDesc')}` : ''
		}`"
	>
		<span
			v-if="leftIconName"
			class="material-icons"
			aria-hidden="true"
		>
			{{ leftIconName }}
		</span>

		<span class="btn-text">
			{{ buttonText }}
		</span>

		<span
			v-if="hasArrowIcons && active"
			class="sr-only"
		>
			{{ isAscSort ? t('search.sortedAsc') : t('search.sortedDesc') }}
		</span>

		<div
			v-if="hasArrowIcons"
			class="sort-arrows"
			aria-hidden="true"
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
import { useI18n } from 'vue-i18n';

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
		const { t } = useI18n();

		return { attrs, t };
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
	background-color: var(--bg-transparent);
	color: var(--color-default);
	border: none;
	border-bottom: 1px solid transparent;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.btn:disabled {
	background-color: var(--bg-disabled);
	cursor: default;
}
.btn.active {
	border-bottom: 1px solid var(--color-border-active);
}
.relevance-btn.active {
	cursor: default;
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
	color: var(--color-disabled-sort);
}
.sort-arrows .arrow-active {
	color: var(--color-default);
}
</style>
