<template>
	<div>
		<div>
			<ImageItem
				:img-src="'https://kb-images.kb.dk/online_master_arkiv_7/non-archival/Letters/judsam/2010/jan/dsa/eaa-ejc/dsa_eaa-ejc_0865/full/!1050,650/0/native.jpg'"
			/>
		</div>
		{{ recordStore.record }}
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecordStore } from '@/store/record';
import ImageItem from '@/components/search/ImageItem.vue';
//import HitCount from "@/components/search/HitCount.vue"

export default defineComponent({
	name: 'ShowRecord',
	components: {
		ImageItem,
	},

	setup() {
		const recordStore = useRecordStore();
		onMounted(() => {
			const route = useRoute();
			const id = route.params.id;
			console.log(typeof id);
			//TODO check if id is present and handle array of ids
			if (typeof id === 'string') {
				recordStore.getRecord(id);
			}
		});
		return { recordStore };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped></style>
