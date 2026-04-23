<template>
	<Transition name="underlay">
		<div
			v-if="searchResultStore.showFacets"
			class="underlay"
			@click="searchResultStore.toggleShowFacets(false)"
		></div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'Facets',
	components: {},

	setup() {
		const searchResultStore = useSearchResultStore();

		return {
			searchResultStore,
		};
	},
});
</script>

<style lang="scss" scoped>
.underlay-enter-active,
.underlay-leave-active {
	transition: opacity 0.5s ease;
}

.underlay-enter-from,
.underlay-leave-to {
	opacity: 0;
}

.underlay {
	width: 100%;
	position: fixed;
	height: 100%;
	background-color: #4444449d;
	z-index: 6;
	top: 0px;
	left: 0px;
}
</style>
