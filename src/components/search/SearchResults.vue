<template>
	<div
		class="hit-box"
		v-for="(res, i) in (currentResults as PropType<GenericSearchResult[]>)"
		:key="res.id"
	>
		<kb-resultcomponent
			:data="JSON.stringify(res)"
			:number="i"
			:hide="flushResults"
		></kb-resultcomponent>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GenericSearchResult } from '../../types/GenericSearchResult';
import './result-component';

export default defineComponent({
	name: 'SearchResults',

	data: () => ({
		flushResults: false,
		currentResults: [],
	}),

	props: {
		searchResults: { type: Object as PropType<GenericSearchResult[]>, required: true },
	},

	created() {
		this.flushResults = false;
		this.$watch(
			() => this.searchResults,
			(newResults: Array<never>, prevResults: Array<never>) => {
				if (newResults !== prevResults) {
					this.flushResults = true;
					setTimeout(() => {
						this.flushResults = false;
						this.currentResults = newResults;
					}, 600);
				}
			},
		);
	},

	methods: {
		getImgServerSrcURL(res: GenericSearchResult) {
			return require('@/assets/images/No-Image-Placeholder.svg.png');
			/* return res.pages && res.pages.length > 0
				? res.pages[0].replace(/.info.json$/, '/full/!250,150/0/native.jpg')
				: require('@/assets/images/No-Image-Placeholder.svg.png'); */
		},
		getAltTxt(res: GenericSearchResult) {
			return 'license';
			//return res.pages && res.pages.length > 0 ? 'Cover image' : 'Ranjithsiji, CC BY-SA 4.0 - via Wikimedia Commons';
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.hit-box {
	padding: 0 0 10px 0;
}

.hit-img {
	width: 10%;
}
</style>
