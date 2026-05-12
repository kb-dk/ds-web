<template>
	<fieldset class="radio-set">
		<legend class="sr-only">Choose option</legend>
		<CustomRadioButton
			v-for="(obj, index) in options"
			:key="obj.value"
			:index="index"
			:name="name"
			:icon="obj.icon"
			:value="obj.value"
			:title="obj.title"
			:description="obj.description"
			:checked="modelValue === obj.value"
			@select="updateSelected"
		/>
	</fieldset>
</template>

<script lang="ts">
export interface RadioButtonOption {
	value: string;
	title: string;
	icon?: string;
	description?: string;
}
import { defineComponent } from 'vue';
import CustomRadioButton from '@/components/common/CustomRadioButton.vue';

export default defineComponent({
	components: { CustomRadioButton },

	props: {
		modelValue: { type: String, required: true },
		name: { type: String, required: true },
		options: {
			type: Array<RadioButtonOption>,
			required: true,
		},
	},

	emits: ['update:modelValue'],

	setup(props, { emit }) {
		const updateSelected = (value: string) => {
			emit('update:modelValue', value);
		};

		return { updateSelected };
	},
});
</script>

<style scoped>
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
.radio-set {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-bottom: 35px;
	padding: 8px 16px;
	background-color: rgba(255, 255, 255, 0.25);
	border: 2px solid transparent;
	padding: 12px;
	transition:
		border-color 120ms ease,
		box-shadow 120ms ease;
}

.radio-set:has(input:focus-visible) {
	border-radius: 8px;
	border-color: #0a2e70;
	box-shadow: 0 0 0 3px rgba(10, 46, 112, 0.15);
}
</style>
