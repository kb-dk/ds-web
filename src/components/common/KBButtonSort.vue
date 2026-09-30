<template>
	<button
		v-bind="attrs"
		class="btn"
		:class="{ active: active, 'relevance-btn': !hasArrowIcons }"
		:aria-pressed="hasArrowIcons ? active : undefined"
		:aria-label="accessibleLabel"
	>
		<span
			v-if="leftIconName"
			class="material-icons"
			aria-hidden="true"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
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
import { computed, defineComponent, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
export default defineComponent({
	name: 'KBButtonSort',
	props: {
		hasArrowIcons: { type: Boolean, default: false },
		leftIconName: { type: String, default: '' },
		active: { type: Boolean, default: false },
		isAscSort: { type: Boolean, default: false },
		isDescSort: { type: Boolean, default: false },
		buttonText: { type: String, default: '' },
	},
	setup(props) {
		const attrs = useAttrs();
		const { t } = useI18n();
		const accessibleLabel = computed(() => {
			if (!props.hasArrowIcons) {
				return props.active ? `${props.buttonText}, ${t('search.currentSort')}` : props.buttonText;
			}
			if (props.active) {
				const currentDirection = props.isAscSort ? t('search.sortedAsc') : t('search.sortedDesc');
				const nextDirection = props.isAscSort ? t('search.sortDescending') : t('search.sortAscending');
				return `${props.buttonText}, ${t('search.currentSort')}, ${currentDirection}. ${nextDirection}`;
			}
			return `${props.buttonText}. ${props.isAscSort ? t('search.sortAscending') : t('search.sortDescending')}`;
		});
		return { attrs, accessibleLabel };
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
