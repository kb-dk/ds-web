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
						<h2
							v-if="query !== ''"
							:data-testid="addTestDataEnrichment('span', 'hitcount', `hitcount-display`, 0)"
						>
							{{ hitCountText }}
						</h2>
						<p v-if="query !== '' && collapsedResult">
							{{ $t('search.rerunCount', { rerunCount: formatNumber(rerunCount) }, rerunCount) }}
						</p>
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
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSearchResultStore } from '@/store/searchResultStore';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'HitCount',
	props: {
		collapsedResult: { type: Boolean, required: true },
		hitCount: { type: Number, required: true },
		hitCountWithoutReruns: { type: Number, required: true },
		query: { type: String || undefined, required: true },
		noHits: { type: Boolean, required: true },
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();
		const formatNumber = (n: number) => new Intl.NumberFormat('de-DE').format(n);

		const displayedCount = computed(() => (props.collapsedResult ? props.hitCountWithoutReruns : props.hitCount));
		const rerunCount = computed(() => props.hitCountWithoutReruns - props.hitCount);

		const hitCountText = computed(() => {
			const count = formatNumber(displayedCount.value);
			return props.query === '*:*'
				? `${count} ${t('search.filterSearch', displayedCount.value)}`
				: `${count} ${t('search.hitcount', displayedCount.value)} "${props.query}"`;
		});

		return { searchResultStore, addTestDataEnrichment, hitCountText, rerunCount, formatNumber };
	},
});
</script>

<style scoped>
.hitcount-con {
	width: 100%;
}
.hit-count {
	font-size: 24px;
	position: relative;
	z-index: 0;
}
.hit-count h2 {
	margin-bottom: 0;
}
.hit-count p {
	margin: 0;
}
.loading-placeholder {
	display: flex;
	gap: 10px;
	height: 105px;
	align-items: center;
}

.loading-placeholder .loading-count {
	border-radius: 15px;
	background-color: rgba(170, 170, 170, 1);
	height: 30px;
}
</style>
