<template>
	<div v-if="query !== ''">
		<div
			class="hit-count"
			v-if="hitCount > 0 || noHits"
		>
			{{ $t('search.hitcount', hitCount) }} "{{ query }}"
		</div>
	</div>
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
