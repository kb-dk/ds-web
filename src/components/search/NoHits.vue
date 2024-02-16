<template>
	<Transition
		name="fade"
		mode="out-in"
	>
		<div>
			<div class="no-hits-heading">{{ $t('search.nohit', { query: searchResultStore.lastSearchQuery }) }}</div>
			<div class="no-hits">
				<SpellChecker :spell-check="searchResultStore.spellCheck" />
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import SpellChecker from '@/components/search/SpellChecker.vue';

export default defineComponent({
	name: 'NoHits',
	components: {
		SpellChecker,
	},
	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
	},
});
</script>
<style scoped>
.no-hits {
	background-color: #e8e8e8;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
}

.no-hits-heading {
	font-size: 36px;
}
</style>
