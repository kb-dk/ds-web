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
	props: {
		spellCheck: {
			type: Object as PropType<SpellCheckType>,
			default() {
				return {};
			},
		},
	},
	methods: { addTestDataEnrichment },
});
</script>

<style scoped>
.spell-check-query {
	font-family: noway, sans-serif;
}
.spell-check-query a {
	color: #002e70;
}

.spell-check-collations {
	margin-top: 10px;
}

.spell-check-box {
	margin-top: 20px;
	font-size: 26px;
	font-family: noway, sans-serif;
}
.spell-check-suggestion {
	display: inline-flex;
}
.spell-check-suggestion:nth-child(odd) {
	color: #002e70;
	margin-right: 50px;
}
.spell-check-suggestion:nth-child(odd):hover {
	text-decoration: underline;
}
.spell-check-suggestion:nth-child(even) {
	color: black;
	font-size: 16px;
}
</style>
