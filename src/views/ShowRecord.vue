<template>
	<div class="container top-offset">
		<div class="record-data">
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
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { APIService } from '@/api/api-service';
import GenericRecordMetadataView from '@/components/records/GenericRecord.vue';
import BroadcastRecordMetadataView from '@/components/records/BroadcastRecord.vue';
//Types
import { BroadcastRecord } from '@/types/BroadcastRecord';
import { GenericRecord } from '@/types/GenericRecord';
import { AxiosError } from 'axios';
import { ErrorManagerType } from '@/types/ErrorManagerType';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		GenericRecordMetadataView,
		BroadcastRecordMetadataView,
	},

	setup() {
		const recordData = ref<BroadcastRecord | GenericRecord | null>(null);
		const recordType = ref<string | null>(null);
		const errorManager = inject('errorManager') as ErrorManagerType;

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
			}
		});

		return { recordData, recordType };
	},
});
</script>

<style scoped>
.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
}

.record-data {
	padding-top: 25px;
}

.top-offset {
	position: relative;
	background: white;
	top: -20px;
	z-index: 3;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.record-data {
		padding: 25px;
	}
	.container {
		padding-right: 12px;
		padding-left: 12px;
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
	.top-offset {
		margin-left: 24px;
		margin-right: 24px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
