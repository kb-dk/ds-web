<template>
	<div class="hit-data">
		<div class="hit-title">
			<span
				v-for="(title, index) in searchItemData.solr_summary_record.title"
				:key="index"
			>
				<router-link :to="{ name: 'Record', params: { id: searchItemData.id } }">{{ title }}</router-link>
			</span>
		</div>
		<div>
			<span
				v-for="(creator, index) in searchItemData.solr_summary_record.creator"
				:key="index"
			>
				{{ creator }}
			</span>
		</div>
		<div>
			<span
				v-for="(description, index) in searchItemData.solr_summary_record.description"
				:key="index"
			>
				{{ description }}
			</span>
		</div>
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
