<template>
	<kb-searchbar></kb-searchbar>
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
		window.addEventListener('query-update', (event) => {
			this.updateQuery(event as CustomEvent);
			event.stopPropagation();
			event.preventDefault();
		});
		window.addEventListener('query-search', () => {
			this.search();
		});
	},
	methods: {
		updateQuery: function (e: CustomEvent) {
			console.log('query: ', e.detail.query);
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
