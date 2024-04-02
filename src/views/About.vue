<template>
	<div class="about">
		<div class="about-content">
			<h1>This is an about page</h1>
			<p>Gotta be a loooot of stuff here later i reckon!</p>
			<router-link to="/">Go to start</router-link>
		</div>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '@/components/global/nav/Footer.vue';

export default defineComponent({
	name: 'App',
	components: {
		Footer,
	},
	setup() {
		return {
		};
	},
});
</script>

<style scoped>
.about {
	display:flex;
	flex-direction: column;
}
.about-content {
	width: 100%;
	min-height: 50vh;
}
</style>
