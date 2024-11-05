<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
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
	z-index: 4;
}

.home .edge.top {
	box-shadow: rgba(0, 0, 0, 0.45) 0px 14px 8px -11px;
}

@media (min-width: 2000px) {
	.edge.top {
		height: 4vw;
		top: -2vw;
		transform: rotateZ(-1deg) !important;
	}
}
@media (min-width: 4000px) {
	.edge.top {
		top: -1vw;
		height: 2vw;
		transform: rotateZ(0deg) !important;
	}
}
</style>
