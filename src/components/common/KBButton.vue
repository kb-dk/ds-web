<template>
	<button
		v-if="!isRouterLink"
		v-bind="attrs"
		class="btn"
		:class="`${buttonType} ${buttonIsActive ? 'active' : ''}`"
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
		:class="`${buttonType} ${buttonIsActive ? 'active' : ''}`"
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
		:class="`${buttonType} ${buttonIsActive ? 'active' : ''}`"
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
	| 'btn-cta-medium'
	| 'btn-cta-default'
	| 'btn-main-default'
	| 'btn-main-medium'
	| 'btn-dropdown-default'
	| 'btn-tag-primary'
	| 'btn-tag-sub'
	| 'btn-tag-reset';

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
	font-size: calc(var(--fs-lead) + 8px);
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
	font-size: calc(var(--fs-base) + 8px);
}

/* Dropdown buttons */
.btn-dropdown-default {
	background-color: var(--bg-transparent);
	color: var(--color-main);
	padding: var(--padding-00) var(--padding-medium);
	gap: var(--padding-02);
	box-sizing: border-box;
	border: 1px solid transparent;
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
.btn-tag-primary {
	padding: var(--padding-02) var(--padding-01);
	gap: var(--padding-small);
	color: var(--color-default);
	border-radius: var(--rounded-medium);
	border: 1px solid var(--color-border-active);
	background: var(--bg-main);
}
.btn-tag-primary .material-icons {
	font-size: calc(var(--fs-meta) + 2px);
}
.btn-tag-primary:hover {
	border: 1px solid var(--color-border-golden);
	background: var(--bg-golden);
	color: var(--color-main);
}
.btn-tag-reset {
	padding: var(--padding-02) var(--padding-01);
	gap: var(--padding-small);
	color: var(--color-main);
	border-radius: var(--rounded-medium);
	border: 1px solid var(--color-border-golden);
	background: var(--bg-golden);
}
.btn-tag-reset .material-icons {
	font-size: calc(var(--fs-meta) + 2px);
}
</style>
