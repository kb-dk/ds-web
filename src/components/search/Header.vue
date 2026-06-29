<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
		<HeaderMenu
			:search-bar-open="searchBarOpen"
			@toggle-search-bar="toggleSearchBar"
		></HeaderMenu>
		<!-- <SearchBar :search-bar-open="searchBarOpen"></SearchBar> -->
		<!-- <Breadcrumb /> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HeaderMenu from '@/components/global/nav/HeaderMenu.vue';
// import SearchBar from '@components/search/SearchBar.vue';
// import Breadcrumb from '@/components/global/nav/Breadcrumb.vue';
export default defineComponent({
	name: 'Header',
	components: { HeaderMenu },
	props: {
		locale: { type: String, required: true },
	},
	setup() {
		const searchBarOpen = ref(true);
		const toggleSearchBar = () => {
			searchBarOpen.value = !searchBarOpen.value;
		};

		return { searchBarOpen, toggleSearchBar };
	},
});
</script>
<style scoped>
.home {
}
</style>
