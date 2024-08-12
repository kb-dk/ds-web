<template>
	<Transition
		name="result"
		mode="out-in"
	>
		<div
			v-if="searchResultStore.searchResult.length > 0"
			class="hitcount-con"
		>
			<Transition
				mode="out-in"
				name="fade"
			>
				<div
					v-if="!searchResultStore.loading"
					class="loading-check"
				>
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
				>
					<div
						v-for="(i, index) in 5"
						:key="index"
						:style="`width:${Math.random() * 70 + 50}px`"
						class="loading-count"
					></div>
				</div>
			</Transition>
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
.hitcount-con {
	width: 100%;
}
.hit-count {
	font-size: 36px;
}

.loading-placeholder {
	display: flex;
	gap: 10px;
	height: 47px;
	align-items: center;
}

.loading-placeholder .loading-count {
	border-radius: 15px;
	background-color: rgba(170, 170, 170, 1);
	height: 30px;
}
</style>
