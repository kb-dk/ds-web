<template>TextAndImage</template>

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

	setup(props) {
		return {};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped></style>
