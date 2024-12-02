<template>
	<EdgedContentArea background-color="rgb(202, 240, 254)">
		<template #content>
			<p>NO CONTENT</p>
		</template>
	</EdgedContentArea>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';

export default defineComponent({
	name: 'NoFacetContent',
	components: { EdgedContentArea },
	props: {
		imageFirst: {
			type: Boolean as PropType<boolean>,
			default() {
				return true;
			},
		},
		hideImageOnMobile: {
			type: Boolean as PropType<boolean>,
			default() {
				return false;
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
	justify-content: space-around;
}
.imageAndTextContainer .con {
	width: 50%;
	display: flex;
	align-content: center;
	justify-content: center;
	flex-wrap: wrap;
}
@media (min-width: 450px) {
	.imageAndTextContainer {
		flex-direction: column;
	}
	.imageAndTextContainer .con {
		width: 100%;
	}
}
@media (min-width: 840px) {
	.imageAndTextContainer {
		flex-direction: row;
	}
}
</style>
