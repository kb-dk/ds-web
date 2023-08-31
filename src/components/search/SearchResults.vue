<template>
	<div
		class="hit-box"
		v-for="(res, index) in (currentResults as PropType<GenericSearchResult[]>)"
		:key="res.id + '-' + lastUpdate"
	>
		<kb-resultcomponent
			:number="index"
			:data="JSON.stringify(res)"
			:show="showResults"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GenericSearchResult } from '../../types/GenericSearchResult';
import './result-component';

export default defineComponent({
	name: 'SearchResults',

	data: () => ({
		showResults: false,
		currentResults: [],
		lastUpdate: 0,
	}),

	props: {
		searchResults: { type: Object as PropType<GenericSearchResult[]>, required: true },
	},

	created() {
		this.$watch(
			() => this.searchResults,
			(newResults: Array<never>, prevResults: Array<never>) => {
				if (newResults !== prevResults) {
					this.showResults = false;
					setTimeout(
						() => {
							this.currentResults = newResults;
							this.lastUpdate = new Date().getTime();
							this.showResults = true;
						},
						prevResults.length === 0 ? 0 : 600,
					);
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
	box-sizing: border-box;
	width: 100%;
}

.hit-img {
	width: 10%;
}
</style>
