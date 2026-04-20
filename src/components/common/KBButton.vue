<template>
	<button
		v-if="!isRouterLink"
		v-bind="attrs"
		class="btn"
		:class="buttonType"
	>
		<span
			v-if="leftIconName"
			class="material-icons"
		>
			{{ leftIconName }}
		</span>
		{{ buttonText }}
		<span
			v-if="rightIconName"
			class="material-icons"
		>
			{{ rightIconName }}
		</span>
	</button>
	<router-link
		v-if="isRouterLink && attrs.to"
		v-bind="attrs"
		class="btn"
		:class="buttonType"
		:to="attrs.to"
	>
		<span
			v-if="leftIconName"
			class="material-icons"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
		<span
			v-if="rightIconName"
			class="material-icons"
		>
			{{ rightIconName }}
		</span>
	</router-link>
</template>

<script lang="ts">
import { defineComponent, PropType, useAttrs } from 'vue';

type ButtonType = 'btn-cta-medium' | 'btn-cta-default' | 'btn-main' | 'btn-label';

export default defineComponent({
	name: 'KBButton',
	props: {
		buttonType: {
			type: String as PropType<ButtonType>,
			required: true,
		},
		isRouterLink: {
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
		rightIconName: {
			type: String,
			default() {
				return '';
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
	display: flex;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	box-sizing: border-box;
	height: fit-content;
}
.btn:disabled {
	background-color: var(--bg-disabled);
	cursor: default;
}

/* Call to action buttons */
.btn-cta-medium {
	background-color: var(--bg-cta);
	color: var(--color-main);
	padding: var(--padding-medium) var(--padding-1);
	gap: var(--padding-01);
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
}
.btn-cta-medium .btn-text {
	border-bottom: 1px solid transparent;
	margin-bottom: -1px;
	transition: 200ms;
}
.btn-cta-medium:hover {
	transition: all 5s ease 0s;
	.btn-text {
		border-color: var(--color-main);
	}
}
.btn-cta-medium .material-icons {
	font-size: calc(var(--fs-md) + 8px);
}
.btn-cta-default {
	background-color: var(--bg-cta);
	color: var(--color-main);
	padding: var(--padding-medium) var(--padding-1);
	gap: var(--padding-01);
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
	box-sizing: border-box;
}
.btn-cta-default .btn-text {
	border-bottom: 1px solid transparent;
	margin-bottom: -1px;
	transition: 200ms;
}
.btn-cta-default:hover {
	transition: all 5s ease 0s;
	.btn-text {
		border-color: var(--color-main);
	}
}
.btn-cta-default .material-icons {
	font-size: calc(+ 8px);
}
</style>
