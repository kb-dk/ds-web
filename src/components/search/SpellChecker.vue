<template>
	<div class="spell-check-box">
		<div
			v-if="spellCheck?.collations && spellCheck.collations.length > 0"
			class="spell-check-query"
		>
			<router-link :to="{ name: 'Home', query: { q: spellCheck?.collations[1].collationQuery, start: 0 } }">
				{{ $t('search.didYouMean', { spellCheckQuery: spellCheck?.collations[1].collationQuery }) }}
				{{ $t('search.didYouMeanCount', { spellCheckHits: spellCheck?.collations[1].hits.toString() }) }}
			</router-link>
		</div>
		<div class="spell-check-caption">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
			magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
			consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SpellCheckType } from '@/types/SpellCheckType';

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
});
</script>

<style scoped>
.spell-check-query a {
	color: #002e70;
	font-weight: bold;
}

.spell-check-caption {
	margin-top: 10px;
}

.spell-check-box {
	padding: 20px;
	margin-top: 20px;
}
</style>
