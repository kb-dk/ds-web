<template>
	<figure class="image-wrapper">
		<img
			class="image-item"
			:src="imgSrc"
			:alt="altTxt"
		/>
	</figure>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ImageItem',
	props: {
		imgSrc: String,
		altTxt: String,
	},
});
</script>
