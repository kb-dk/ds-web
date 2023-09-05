<template>
	<div>
		<!-- TODO handle empty response scenario -->
		<div v-if="recordData">
			<div v-if="recordType === 'BroadcastEvent'">
				<BroadcastRecordMetadataView :record-data="(recordData as BroadcastRecord)" />
			</div>
			<div v-else>
				<GenericRecordMetadataView :record-data="(recordData as GenericRecord)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { APIService } from '@/api/api-service';
import GenericRecordMetadataView from '@/components/records/GenericRecord.vue';
import BroadcastRecordMetadataView from '@/components/records/BroadcastRecord.vue';
import { ErrorManager } from '@/error-handling/error-manager';
//Types
import { BroadcastRecord } from '@/types/BroadcastRecord';
import { GenericRecord } from '@/types/GenericRecord';
import { AxiosError } from 'axios';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		GenericRecordMetadataView,
		BroadcastRecordMetadataView,
	},

	setup() {
		const recordData = ref<BroadcastRecord | GenericRecord | null>(null);
		const recordType = ref<string | null>(null);
		const errorManager = new ErrorManager();

		const getRecord = async (id: string) => {
			try {
				return await APIService.getRecord(id);
			} catch (err) {
				console.log('Axios error sent to error manager from full record', err);
				errorManager.submitError(err as AxiosError);
			}
		};

		onMounted(async () => {
			const route = useRoute();
			const id = route.params.id;
			//TODO handle array of ids if needed
			const idStr = id as string;
			const recordResp = await getRecord(idStr);
			if (recordResp) {
				recordType.value = recordResp.data['@type'];
				recordData.value = recordResp.data;
			} else {
				console.log('No reasonable response from record service');
			}
		});

		return { recordData, recordType };
	},
});
</script>
