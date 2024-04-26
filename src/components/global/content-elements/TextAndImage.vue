<template>
	<div class="imageAndTextContainer">
		<div class="con"><slot name="text"></slot></div>
		<div class="con"><slot name="image"></slot></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'TextAndImage',
	props: {
		imageFirst: {
			type: Boolean as PropType<boolean>,
			default() {
				return true;
			},
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.imageAndTextContainer {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
.imageAndTextContainer .con {
	width: 50%;
	display: flex;
	align-content: center;
	justify-content: center;
	flex-wrap: wrap;
}
</style>
