<template>
	<div class="bar-container">
		<TransitionGroup name="linefade">
			<div
				v-if="showBars"
				key="1"
				class="bar"
				:class="`${isTop ? 'bar-1' : 'bar-2'}`"
			></div>
			<div
				v-if="showBars"
				key="2"
				class="bar"
				:class="`${isTop ? 'bar-2' : 'bar-1'}`"
			></div>
		</TransitionGroup>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ContainerSplitBar',
	props: {
		isTop: { type: Boolean, required: true },
		showBars: {
			type: Boolean,
			default() {
				return true;
			},
		},
	},
});
</script>
<style scoped>
.linefade-enter-active,
.linefade-leave-active {
	transition:
		opacity 500ms ease 0.5s,
		height 500ms ease 0.5s;
	overflow: hidden;
}

.linefade-enter-from,
.linefade-leave-to {
	transition:
		opacity 150ms ease 0s,
		height 150ms ease 0s;
	opacity: 0;
	height: 0;
}

.linefade-enter-to,
.linefade-leave-from {
	opacity: 1;
	height: 20px;
}
.bar {
	height: 17px;
	width: 100%;
}
.bar-1 {
	background-color: var(--bg-main-2);
}
.bar-2 {
	background-color: var(--bg-main-3);
}
</style>
