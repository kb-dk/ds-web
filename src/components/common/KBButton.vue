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

type ButtonType = 'btn-cta' | 'btn-cta-small' | 'btn-main' | 'btn-label';

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
		console.log(attrs);
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
.btn-main {
	padding: var(--padding-0) var(--padding-4);
	gap: var(--padding-00);
	background-color: var(--bg-main);
	color: var(--color-default);
	border: 1px solid var(--color-border-active);
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
}
.btn-main:hover {
	background-color: var(--bg-main-hover);
	color: var(--color-main);
}

/* Call to action buttons */
.btn-cta {
	background-color: var(--bg-cta);
	color: var(--color-main);
	padding: var(--padding-01) var(--padding-large);
	gap: var(--padding-medium);
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
.btn-cta .material-icons {
	font-size: calc(var(--fs-md) + 8px);
}
.btn-cta-small {
	background-color: var(--bg-cta);
	color: var(--color-main);
	padding: var(--padding-02) var(--padding-1);
	gap: var(--padding-medium);
	border-radius: var(--rounded-medium);
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.15);
	box-sizing: border-box;
}
.btn-cta-small .btn-text {
	border-bottom: 1px solid transparent;
	margin-bottom: -1px;
	transition: 200ms;
}
.btn-cta-small:hover {
	transition: all 5s ease 0s;
	.btn-text {
		border-color: var(--color-border-active);
	}
}
.btn-cta-small .material-icons {
	font-size: calc(var(--fs-md) + 8px);
}
</style>
