<template>
	<div>
		We're at the full record post at least.
		<div
			class=""
			v-for="rec in recordStore.record"
			:key="rec.id"
		>
			{{ rec }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecordStore } from '@/store/record';
//import RecordItem from '@/components/records/recordItem.vue';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		//ImageItem,
		//RecordItem,
	},
	data: () => ({
		record: {},
	}),

	methods: {
		getId() {
			const route = useRoute();
			const id = route.params.id;
			const recordStore = useRecordStore();
			console.log(recordStore.getRecord(id as string));
			console.log(recordStore.record);
			return id as string;
		},
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

		console.log(recordStore);
		return { recordStore };
	},
});
</script>
