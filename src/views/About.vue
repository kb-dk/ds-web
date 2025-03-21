<template>
	<div class="about">
		<div class="about-content">
			<h1>This is an about page</h1>
			<p>Gotta be a loooot of stuff here later i reckon!</p>
			<router-link to="/">Go to start</router-link>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'About',
	components: {},
	setup() {
		return {};
	},
});
</script>

<style scoped>
.about {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.about-content {
	width: 100%;
	padding-left: 10vw;
	padding-right: 10vw;
	box-sizing: border-box;
	min-height: 50vh;
}
</style>
