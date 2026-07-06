<template>
	<div class="bar-container">
		<div
			class="bar"
			:class="`${isTop ? 'bar-1' : 'bar-2'}`"
		></div>
		<div
			class="bar"
			:class="`${isTop ? 'bar-2' : 'bar-1'}`"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ContainerSplitBar',
	props: {
		isTop: { type: Boolean, required: true },
	},
});
</script>
<style scoped>
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
