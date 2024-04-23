<template>
	<div class="record-container">
		<div class="container top-offset">
			<div class="record-data">
				<!-- TODO handle empty response scenario -->
				<div v-if="recordData">
					<div v-if="recordType === 'VideoObject' || recordType === 'MediaObject'">
						<BroadcastVideoRecordMetadataView
							:more-like-this-records="moreLikeThisRecords"
							:record-data="recordData as BroadcastRecordType"
						/>
					</div>
					<div v-if="recordType === 'AudioObject'">
						<BroadcastAudioRecordMetadataView
							:more-like-this-records="moreLikeThisRecords"
							:record-data="recordData as BroadcastRecordType"
						/>
					</div>
					<div v-else>
						<GenericRecordMetadataView :record-data="recordData as GenericRecordType" />
					</div>
				</div>
			</div>
		</div>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue';
import { useRoute } from 'vue-router';
import { APIService } from '@/api/api-service';
import GenericRecordMetadataView from '@/components/records/GenericRecord.vue';
import BroadcastVideoRecordMetadataView from '@/components/records/BroadcastVideoRecord.vue';
import BroadcastAudioRecordMetadataView from '@/components/records/BroadcastAudioRecord.vue';
import Footer from '@/components/global/nav/Footer.vue';
import { useI18n } from 'vue-i18n';
import { AxiosError } from 'axios';

//Types
import { BroadcastRecordType } from '@/types/BroadcastRecordType';
import { GenericRecordType } from '@/types/GenericRecordTypes';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { useSpinnerStore } from '@/store/spinnerStore';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		GenericRecordMetadataView,
		BroadcastVideoRecordMetadataView,
		BroadcastAudioRecordMetadataView,
		Footer,
	},

	setup() {
		const recordData = ref<BroadcastRecordType | GenericRecordType | null>(null);
		const recordType = ref<string | null>(null);
		const errorManager = inject('errorManager') as ErrorManagerType;
		const moreLikeThisRecords = ref<Array<GenericSearchResultType>>([]);
		const { t } = useI18n();
		const spinnerStore = useSpinnerStore();

		const getRecord = async (id: string) => {
			spinnerStore.toggleSpinner(true);
			try {
				return await APIService.getRecord(id);
			} catch (err) {
				handleShowRecordError(err as AxiosError, 'recordCall');
			} finally {
				spinnerStore.toggleSpinner(false);
			}
		};

		const getMoreLikeThisRecords = async (id: string) => {
			try {
				return await APIService.getMoreLikeThisRecords(id);
			} catch (err) {
				handleShowRecordError(err as AxiosError, 'moreLikeThisCall');
			}
		};

		const handleShowRecordError = (err: AxiosError, type: string) => {
			switch (type) {
				case 'recordCall': {
					const errorMsg =
						err.response?.status === 403 ? t('error.record.notAllowed') : t('error.record.loadingFailed');
					errorManager.submitError(err, errorMsg);
					break;
				}
				case 'moreLikeThisCall':
					errorManager.submitError(err, t('error.getrelatedrecordsfailed'));
					break;
			}
		};

		onMounted(async () => {
			window.scrollTo({ top: 0, behavior: 'smooth' });

			const route = useRoute();
			const id = route.params.id;
			const idStr = id as string;
			const recordResp = await getRecord(idStr);
			const moreLikeThis = await getMoreLikeThisRecords(idStr);
			if (recordResp) {
				recordType.value = recordResp.data['@type'];
				recordData.value = recordResp.data;
				document.title = (recordData.value['name'] + t('app.titles.frontpage.archive.suffix')) as string;
			}
			if (moreLikeThis) {
				moreLikeThisRecords.value = moreLikeThis.data.response.docs;
			}
		});

		return { recordData, recordType, moreLikeThisRecords };
	},
});
</script>

<style scoped>
.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	min-height: 100vh;
	width: 100%;
}

.record-container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
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
		width: 100%;
	}
}
</style>
