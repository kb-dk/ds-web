<template>
	<button
		v-bind="attrs"
		class="btn"
	>
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { defineComponent, useAttrs } from 'vue';

export default defineComponent({
	name: 'KBButton',
	setup() {
		const attrs = useAttrs();
		return { attrs };
	},
});
</script>

<style scoped>
.btn {
	background-color: var(--neutral-btn);
	border: none;
	color: var(--primary-button-text);
	padding: 0.5rem 1rem;
	border-radius: 6px;
	cursor: pointer;
	font-size: 18px;
	transition: background-color 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 40px;
	margin: 5px 5px;
}

.btn:hover {
	background-color: var(--neutral-btn-hover);
	color: var(--primary);
	box-shadow:
		inset 0 0 0 2px rgba(255, 255, 255, 0.1),
		0 2px 6px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
	background-color: rgb(175, 175, 175);
	cursor: default;
}
.btn:disabled:hover {
	color: var(--primary-button-text);
	box-shadow: none;
}
</style>
