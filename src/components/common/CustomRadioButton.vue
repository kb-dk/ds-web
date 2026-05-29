<template>
	<label :class="['radio-option', { checked }]">
		<input
			:id="`${santizeAndSimplify(title)}-${index}`"
			type="radio"
			:name="name"
			:value="value"
			:checked="checked"
			@change="onChange"
		/>
		<div class="outer-dot">
			<Transition name="fade-dot">
				<span
					v-if="checked"
					class="dot"
				></span>
			</Transition>
		</div>
		<span
			v-if="icon"
			class="material-icons radio-icon"
		>
			{{ icon }}
		</span>
		<span>{{ title }}</span>
	</label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { santizeAndSimplify } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'CustomRadioButton',

	props: {
		value: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, default: '' },
		index: { type: Number, default: 0 },
		checked: { type: Boolean, default: false },
		name: { type: String, required: true },
		icon: { type: String, required: false, default: undefined },
	},

	emits: ['select'],

	setup(props, { emit }) {
		const onChange = () => {
			emit('select', props.value);
		};

		return { onChange, santizeAndSimplify };
	},
});
</script>

<style scoped>
.radio-option {
	display: flex;
	align-items: center;
	height: 36px;
	cursor: pointer;
	background-color: rgba(255, 255, 255, 0.5);
	border-radius: 4px;
	transition: all 0.25s linear 0s;
	border: 1px solid rgba(255, 255, 255, 0.5);
	position: relative;
}

.radio-option.checked {
	background-color: #c4f0fd;
	border: 1px solid #86e2fb;
	border-radius: 4px;
}

.radio-option:hover {
	background-color: #c4f0fd;
	border: 1px solid #86e2fb;
	border-radius: 4px;
}

.radio-option label {
	display: flex;
	align-items: center;
	text-align: center;
	height: 100%;
	width: 100%;
	cursor: pointer;
}

.radio-icon {
	color: #0a2e70;
	margin-right: 5px;
}

.radio-option input[type='radio'] {
	position: absolute;
	opacity: 0;
}

.outer-dot {
	position: relative;
	display: inline-block;
	width: 24px;
	height: 24px;
	border: 2px solid #0a2e70;
	border-radius: 50%;
	background: white;
	margin-right: 5px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-left: 10px;
}

.radio-option .dot {
	width: 10px;
	height: 10px;
	background: #0a2e70;
	border-radius: 50%;
}

.radio-title {
	padding-left: 5px;
}

.radio-title .fade-dot-enter-active,
.fade-dot-leave-active {
	transition:
		opacity 0.2s ease,
		transform 0.2s ease;
}

.fade-dot-enter-from,
.fade-dot-leave-to {
	opacity: 0;
}

.fade-dot-enter-to,
.fade-dot-leave-from {
	opacity: 1;
}
</style>
