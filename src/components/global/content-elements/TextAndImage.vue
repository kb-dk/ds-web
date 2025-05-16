<template>
	<div class="imageAndTextContainer">
		<div class="con"><slot name="text"></slot></div>
		<div :class="`con ${hideImageOnMobile ? 'hide-image' : ''}`"><slot name="image"></slot></div>
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
	flex-direction: column;
	justify-content: space-around;
	margin-bottom: 30px;
}
.imageAndTextContainer .con {
	width: 100%;
	display: flex;
	align-content: center;
	justify-content: center;
	flex-wrap: wrap;
}
.imageAndTextContainer .con .li {
	font-size: 50px;
}

.hide-image {
	display: none !important;
}

@media (min-width: 450px) {
	.imageAndTextContainer {
		flex-direction: column;
	}
	.imageAndTextContainer .con {
		width: 100%;
	}
	.imageAndTextContainer .con ul {
		color: lime;
		display: block;
		background: pink;
	}
}

@media (min-width: 840px) {
	.hide-image {
		display: flex !important;
	}
}

@media (min-width: 840px) {
	.imageAndTextContainer {
		flex-direction: row;
	}
}
</style>
