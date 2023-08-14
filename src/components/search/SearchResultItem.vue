<template>
	<div class="hit-data">
		<!-- <div class="hit-title">
			<span>
				<router-link :to="{ name: 'Record', params: { id: searchItemData.id } }">
					{{ searchItemData.solr_summary_record.title[0] }}
				</router-link>
			</span>
		</div>
		<div>
			<span v-if="searchItemData.solr_summary_record.creator">
				{{ searchItemData.solr_summary_record.creator[0] }}
			</span>
			<span v-else-if="!searchItemData.solr_summary_record.creator">Creator Unknown</span>
		</div>
		<div>
			<span
				v-for="(description, index) in searchItemData.solr_summary_record.description"
				:key="index"
			>
				{{ description }}
			</span>
		</div> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GenericSearchResult } from '../../types/GenericSearchResult';

export default defineComponent({
	name: 'SearchResultItem',
	props: {
		searchItemData: {
			type: Object as PropType<GenericSearchResult>,
			required: true,
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.hit-data {
	width: 83%;
	float: right;
}

.hit-title {
	font-weight: bold;
}
</style>
