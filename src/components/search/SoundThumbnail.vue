<template>
	<div class="sound-thumbnail-container">
		<div class="thumb">
			<div
				v-for="(line, index) in lines"
				:key="index"
				class="line"
				:style="`height:${Math.random() * 50 + 10}%;`"
			></div>
		</div>
		<span class="material-icons play">play_circle_filled</span>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'SoundThumbnail',

	setup() {
		const lines = ref(90);
		return { lines };
	},
});
</script>

<style scoped>
.sound-thumbnail-container {
	position: relative;
	width: 100%;
	height: 100%;
	background: linear-gradient(139deg, rgba(232, 232, 232, 1) 4%, rgba(217, 217, 217, 1) 100%);
}
.thumb {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	align-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	height: 100%;
	gap: 1px;
	justify-content: center;
	box-sizing: border-box;
}

.play {
	font-size: 64px !important;
	color: white;
	transform: translate(-50%, -50%);
	position: absolute;
	top: 50%;
	left: 50%;
}

.line {
	border-radius: 25px;
	background: #002e70;
	width: 1px;
}

.thumb:after {
	content: '';
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	left: 0px;
	opacity: 0.4;
	mix-blend-mode: hard-light;
	background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(0, 46, 112, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
}
</style>
