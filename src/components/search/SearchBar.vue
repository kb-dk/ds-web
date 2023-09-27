<template>
	<kb-searchbar :background="getBackgroundImage()"></kb-searchbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './search-component';

export default defineComponent({
	name: 'SearchBar',
	data() {
		return {
			searchQuery: '',
		};
	},
	created: function () {
		window.addEventListener('query-update', this.updateWrapper);
		window.addEventListener('query-search', this.search);
	},
	beforeUnmount() {
		window.removeEventListener('query-update', this.updateWrapper);
		window.removeEventListener('query-search', this.search);
	},
	methods: {
		updateWrapper(e: Event) {
			this.updateQuery(e as CustomEvent);
		},
		getBackgroundImage() {
			return require('@/assets/images/_Den_Sorte_Diamant-Laura_Stamer-min.jpg');
			/* return res.pages && res.pages.length > 0
				? res.pages[0].replace(/.info.json$/, '/full/!250,150/0/native.jpg')
				: require('@/assets/images/No-Image-Placeholder.svg.png'); */
		},
		updateQuery(e: CustomEvent) {
			e.stopPropagation();
			e.preventDefault();
			//console.log('query: ', e.detail.query);
			this.searchQuery = e.detail.query;
		},
		search: function () {
			if (this.searchQuery) {
				this.$router.push({ name: 'Home', query: { q: this.searchQuery } });
			}
		},
	},
});
</script>

<style lang="scss" scoped></style>
