<template>
	<div>
		<div
			class=""
			v-for="rec in recordStore.record"
			:key="rec.id"
		>
			<RecordItem :record-item-data="rec" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecordStore } from '@/store/record';
import RecordItem from '@/components/records/recordItem.vue';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		//ImageItem,
		RecordItem,
	},

	setup() {
		const recordStore = useRecordStore();
		onMounted(() => {
			const route = useRoute();
			const id = route.params.id;
			//TODO check if id is present and handle array of ids
			if (typeof id === 'string') {
				recordStore.getRecord(id);
			}
		});
		return { recordStore };
	},
});
</script>
