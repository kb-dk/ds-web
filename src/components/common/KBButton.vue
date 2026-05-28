<template>
	<button
		v-if="!isRouterLink"
		v-bind="attrs"
		class="btn"
		:class="`${buttonType} ${buttonColor} ${buttonSize} ${buttonIsActive ? 'active' : ''} ${
			buttonText ? 'btn-with-text' : ''
		}`"
		:style="customStyle"
	>
		<span
			v-if="leftIconName"
			class="material-icons left"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
		<span
			v-if="rightIconName"
			class="material-icons right"
		>
			{{ rightIconName }}
		</span>
	</button>
	<a
		v-if="isRouterLink && attrs.href"
		v-bind="attrs"
		class="btn"
		:class="`${buttonType} ${buttonColor} ${buttonSize} ${buttonIsActive ? 'active' : ''} ${
			buttonText ? 'btn-with-text' : ''
		}`"
		:href="attrs.href.toString()"
		:style="customStyle"
	>
		<span
			v-if="leftIconName"
			class="material-icons left"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
		<span
			v-if="rightIconName"
			class="material-icons right"
		>
			{{ rightIconName }}
		</span>
	</a>
	<router-link
		v-if="isRouterLink && attrs.to"
		v-bind="attrs"
		class="btn"
		:class="`${buttonType} ${buttonColor} ${buttonSize} ${buttonIsActive ? 'active' : ''} ${
			buttonText ? 'btn-with-text' : ''
		}`"
		:to="attrs.to"
		:style="customStyle"
	>
		<span
			v-if="leftIconName"
			class="material-icons left"
		>
			{{ leftIconName }}
		</span>
		<span class="btn-text">{{ buttonText }}</span>
		<span
			v-if="rightIconName"
			class="material-icons right"
		>
			{{ rightIconName }}
		</span>
	</router-link>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, useAttrs, watch } from 'vue';

type ButtonType =
	| 'btn-cta'
	| 'btn-main-default'
	| 'btn-main-medium'
	| 'btn-main-small'
	| 'btn-dropdown-default'
	| 'btn-tag';
type ButtonSize = 'medium' | 'default' | 'small';
type ButtonColor = 'light' | 'main' | 'cta' | 'transparent' | 'reset' | 'inverted';
export default defineComponent({
	name: 'KBButton',
	props: {
		buttonType: {
			type: String as PropType<ButtonType>,
			required: true,
		},
		buttonSize: {
			type: String as PropType<ButtonSize>,
			required: true,
		},
		buttonColor: {
			type: String as PropType<ButtonColor>,
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
		buttonIsActive: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	setup(props) {
		const attrs = useAttrs();
		const text = ref(props.buttonText);
		watch(
			() => props.buttonText,
			(newVal: string) => {
				text.value = newVal;
			},
		);

		return { attrs, text };
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
	min-height: 34px;
	line-height: 1;
}
.btn:disabled {
	background-color: var(--bg-disabled);
	cursor: default;
}
.btn-with-text .material-icons {
	line-height: 0;
}
/* Button sizes */
.medium {
	padding: var(--padding-0, 14px) var(--padding-4, 22px);
	gap: var(--padding-00, 10px);
}
.default {
	padding: var(--padding-medium, 12px) var(--padding-1, 16px);
	gap: var(--padding-01, 8px);
}
.small {
	padding: var(--padding-01, 8px) var(--padding-0, 14px);
	gap: var(--padding-02, 6px);
}

/* Button color */
.light {
	background-color: var(--bg-light);
	color: var(--color-main);
	border: 1px solid var(--color-border-light);
}
.main {
	background-color: var(--bg-main);
	color: var(--color-default);
	border: 1px solid var(--color-border-active);
}
.cta {
	background-color: var(--bg-cta);
	color: var(--color-main);
	border: 1px solid var(--color-border-success);
}
.reset {
	background: var(--bg-golden);
	color: var(--color-main);
	border: 1px solid var(--color-border-golden);
}
.transparent {
	background-color: var(--bg-transparent);
	color: var(--color-main);
	border: 1px solid var(--color-border-transparent);
}
.inverted {
	background-color: var(--bg-default);
	color: var(--color-main);
	border: 1px solid var(--color-border-active);
}
/* Primary buttons */
.btn-main-medium {
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
}
.btn-main-medium:hover {
	background-color: var(--bg-main-hover);
	color: var(--color-main);
}
.btn-main-small {
	border-radius: var(--rounded-medium);
}
.btn-main-small:hover {
	background-color: var(--bg-main-hover);
	color: var(--color-main);
}
/* Call to action buttons */
.btn-cta {
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
}
.btn-cta .btn-text {
	border-bottom: 1px solid transparent;
	margin-bottom: -1px;
	transition: 200ms;
}
.btn-cta:hover {
	transition: all 5s ease 0s;
	.btn-text {
		border-color: var(--color-border-active);
	}
}
.btn-cta.medium .material-icons {
	font-size: calc(var(--fs-lead) + 8px);
}
.btn-cta.default .material-icons {
	font-size: calc(var(--fs-base) + 8px);
}
/* Dropdown buttons */
.btn-dropdown-default {
	box-sizing: border-box;
	border-radius: var(--rounded-medium);
}
.btn-dropdown-default:disabled {
	background-color: var(--bg-transparent);
	color: var(--color-disabled);
}
.btn-dropdown-default:disabled:hover {
	background-color: var(--bg-transparent);
	color: var(--color-disabled);
	border-color: var(--bg-transparent);
}
.btn-dropdown-default.active {
	background-color: var(--bg-main);
	color: var(--color-default);
	border-radius: var(--rounded-medium) var(--rounded-medium) 0 0;
}
.btn-dropdown-default .right {
	transition: all 0.3s ease-in-out 0s;
}
.btn-dropdown-default.active .right {
	transform: rotateX(180deg);
}
.btn-dropdown-default:hover {
	background-color: var(--bg-main-hover);
	color: var(--color-main);
	border-color: var(--color-border-active);
}
.btn-dropdown-default .btn-text {
	display: none;
}
@media (min-width: 640px) {
	.btn-dropdown-default .btn-text {
		display: inline-block;
	}
}

/* Tag buttons */
.btn-tag {
	border-radius: var(--rounded-medium);
}
.btn-tag .material-icons {
	font-size: calc(var(--fs-meta) + 2px);
}
.btn-tag:hover {
	border: 1px solid var(--color-border-golden);
	background: var(--bg-golden);
	color: var(--color-main);
}
</style>
