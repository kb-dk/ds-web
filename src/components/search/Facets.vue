<template>
	<div
		class="facet-box"
		v-for="(facet, index) in facetResults"
		:key="index"
	>
		<kb-checkboxcomponent
			:title="JSON.stringify(facet)"
			:value="false"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import './search-component';

export default defineComponent({
	name: 'Facets',
	data() {
		return {
			searchQuery: '',
		};
	},
	props: {
		facetResults: { type: Object, required: true },
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
