<template>
	<div class="not-found">
		<div class="not-found-content">
			<h1>404</h1>
			<p>Whoooops!</p>
			<router-link to="/">Go to start</router-link>
		</div>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Footer from '@/components/global/nav/Footer.vue';

export default defineComponent({
	name: '404',
	components: {
		Footer,
	},
	setup() {
		return {};
	},
});
</script>

<style scoped>
.not-found {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.not-found-content {
	width: 100%;
	padding-left: 10vw;
	padding-right: 10vw;
	box-sizing: border-box;
	min-height: 50vh;
}
</style>
