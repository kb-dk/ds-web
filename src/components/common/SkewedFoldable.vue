<template>
	<div
		ref="foldableRef"
		class="foldable-container"
	>
		<div
			:style="`background-color:${bg}`"
			:class="left ? 'edge top left' : 'edge top'"
		></div>
		<div
			:style="`background-color:${bg}`"
			class="content"
		>
			<slot></slot>
		</div>
		<div
			:style="`background-color:${bg}`"
			:class="left ? 'edge bottom left' : 'edge bottom'"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'SkewedFoldable',
	props: {
		bg: { type: String, default: 'white' },
		left: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const foldableRef = ref<HTMLElement | null>(null);

		return { foldableRef };
	},
});
</script>
<style scoped>
.content {
	height: 60px;
	overflow: hidden;
}

.content:hover {
	height: auto;
}
.edge.top {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(0 0, 0% 100%, 100% 100%);
	z-index: 3;
	height: 15px;
	top: 1px;
}

.edge.top.left {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0% 100%, 100% 100%);
	z-index: 3;
	height: 15px;
	top: 1px;
}

.edge.bottom {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0 0, 0 100%);
	z-index: 3;
	height: 15px;
	top: -1px;
}
.edge.bottom.left {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0 0, 100% 100%);
	z-index: 3;
	height: 15px;
	top: -1px;
}
</style>
