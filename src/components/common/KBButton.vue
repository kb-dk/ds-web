<template>
	<button
		v-if="!isRouterLink"
		v-bind="attrs"
		class="btn"
		:class="buttonType"
		:style="customStyle"
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
	<a
		v-if="isRouterLink && attrs.href"
		v-bind="attrs"
		class="btn"
		:class="buttonType"
		:href="attrs.href.toString()"
		:style="customStyle"
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
	</a>
	<router-link
		v-if="isRouterLink && attrs.to"
		v-bind="attrs"
		class="btn"
		:class="buttonType"
		:to="attrs.to"
		:style="customStyle"
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

type ButtonType =
	| 'btn-cta-medium'
	| 'btn-cta-default'
	| 'btn-main-default'
	| 'btn-main-medium'
	| 'btn-dropdown-default'
	| 'btn-label';

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
		customStyle: {
			type: Object,
			default() {
				return {};
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
	width: fit-content;
}
.btn:disabled {
	background-color: var(--bg-disabled);
	cursor: default;
}

/* Primary buttons */
.btn-main-medium {
	padding: var(--padding-medium) var(--padding-1);
	gap: var(--padding-01);
	background-color: var(--bg-main);
	color: var(--color-default);
	border: 1px solid var(--color-border-active);
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
}
.btn-main-medium:hover {
	background-color: var(--bg-main-hover);
	color: var(--color-main);
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
		border-color: var(--color-border-active);
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
		border-color: var(--color-border-active);
	}
}
.btn-cta-default .material-icons {
	font-size: calc(+ 8px);
}

/* Dropdown buttons */
.btn-dropdown-default {
	background-color: var(--bg-default);
	color: var(--color-main);
	padding: var(--padding-00) var(--padding-medium);
	gap: var(--padding-02);
	border-radius: var(--rounded-medium);
	box-sizing: border-box;
	border: 1px solid transparent;
}
.btn-dropdown-default:hover {
	background-color: var(--bg-main-hover);
	border-color: var(--color-border-active);
}
</style>
