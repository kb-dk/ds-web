<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
		<HeaderMenu
			:search-bar-open="searchBarOpen"
			@toggle-search-bar="toggleSearchBar"
		></HeaderMenu>
		<div class="container">
			<router-link :to="{ name: 'Home' }">
				<h1 :aria-label="`${t('hero.title')}`">
					<span class="headline heading-display">
						<span class="text">{{ t('hero.title') }}</span>
					</span>
				</h1>
			</router-link>
			<SearchBar></SearchBar>
		</div>
		<!-- <SearchBar :search-bar-open="searchBarOpen"></SearchBar> -->
		<!-- <Breadcrumb /> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HeaderMenu from '@/components/global/nav/HeaderMenu.vue';
import { useI18n } from 'vue-i18n';
import SearchBar from '@/components/search/SearchBar.vue';
// import Breadcrumb from '@/components/global/nav/Breadcrumb.vue';
export default defineComponent({
	name: 'Header',
	components: { HeaderMenu, SearchBar },
	props: {
		locale: { type: String, required: true },
	},
	setup() {
		const searchBarOpen = ref(true);
		const { t } = useI18n();
		const toggleSearchBar = () => {
			searchBarOpen.value = !searchBarOpen.value;
		};

		return { searchBarOpen, toggleSearchBar, t };
	},
});
</script>
<style scoped>
.header-container {
	justify-content: center;
	display: flex;
	position: relative;
}
.container {
	position: absolute;
	display: flex;
	flex-direction: column;
	z-index: 4;
	width: 100%;
	max-width: 1280px;
	top: 100%;
	/* align-items: baseline; */
}
.container > a {
	text-decoration: none;
}
h1 .headline {
	display: block;
	background-color: transparent;
	width: fit-content;
	padding: 0px 0px;
	pointer-events: all;
	position: relative;
	z-index: 1;
	pointer-events: none;
	text-transform: uppercase;
	letter-spacing: 1.15px;
	color: var(--color-main);
}
h1 {
	margin: 0;
	margin-bottom: 25px;
}
</style>
