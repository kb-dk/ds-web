<template>
	<Transition
		name="result"
		mode="out-in"
	>
		<div v-if="searchResultStore.searchResult.length > 0">
			<div v-if="!searchResultStore.loading">
				<div
					v-if="hitCount > 0 || noHits"
					class="hit-count"
				>
					<span v-if="query !== ''">
						{{ new Intl.NumberFormat('de-DE').format(hitCount) }} {{ $t('search.hitcount', hitCount) }} "{{ query }}"
					</span>
					<span v-else></span>
				</div>
			</div>
			<div
				v-else
				class="loading-placeholder"
			></div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'HitCount',
	props: {
		hitCount: { type: Number, required: true },
		query: { type: String || undefined, required: true },
		noHits: { type: Boolean, required: true },
	},

	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},
});
</script>

<style scoped>
.hit-count {
	font-size: 36px;
}

.loading-placeholder {
	height: 47px;
}
</style>
