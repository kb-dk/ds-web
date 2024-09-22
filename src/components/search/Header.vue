<template>
	<div>
		<kb-menu
			:routing="true"
			:locale="locale"
			:page="$route.name"
		></kb-menu>
		<SearchBar />
		<Breadcrumb />
		<div class="edge top"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/components/global/nav/wc-header-menu';
import SearchBar from '@/components/search/SearchBar.vue';
import Breadcrumb from '@/components/global/nav/Breadcrumb.vue';
export default defineComponent({
	name: 'Header',
	components: {
		SearchBar,
		Breadcrumb,
	},
	props: {
		locale: { type: String, required: true },
	},
	setup() {
		return {};
	},
});
</script>
<style scoped>
.edge.top {
	width: 110%;
	position: relative;
	background-color: #caf0fe;
	z-index: 0;
	height: 6vw;
	left: -5%;
	transform: rotateZ(-2deg);
	transform-origin: center bottom;
	top: calc(-4vw);
	z-index: 1;
}
</style>
