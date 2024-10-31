<template>
	<div class="spell-check-box">
		<div
			v-for="(collation, index) in spellCheck?.collations"
			:key="collation"
			class="spell-check-query"
		>
			<div
				v-if="index % 2 !== 0"
				class="spell-check-collations"
			>
				<router-link
					:to="{ name: 'Search', query: { q: spellCheck?.collations[index].collationQuery, start: 0 } }"
					:data-testid="addTestDataEnrichment('link', 'SpellChecker', 'link-to-search-suggestion', index - 1)"
				>
					<div class="spell-check-suggestion">
						{{ `"${spellCheck?.collations[index].collationQuery}"` }}
					</div>
					<div class="spell-check-suggestion">
						{{ $t('search.didYouMeanCount', { spellCheckHits: spellCheck?.collations[index].hits.toString() }) }}
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SpellCheckType } from '@/types/SpellCheckType';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'SpellChecker',
	methods: { addTestDataEnrichment },
	props: {
		spellCheck: {
			type: Object as PropType<SpellCheckType>,
			default() {
				return {};
			},
		},
	},
});
</script>

<style scoped>
.spell-check-query a {
	color: #002e70;
	font-weight: bold;
}

.spell-check-collations {
	margin-top: 10px;
}

.spell-check-box {
	padding: 20px;
	margin-top: 20px;
	margin-bottom: 50px;
}

.spell-check-suggestion {
	display: inline-flex;
	margin-right: 30px;
}
</style>
