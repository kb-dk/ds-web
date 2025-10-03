<template>
	<div class="record-container">
		<div class="container top-offset">
			<div class="record-data">
				<!-- TODO handle empty response scenario -->
				<div v-if="!loading && recordData !== null">
					<div v-if="recordType === 'VideoObject' || recordType === 'MediaObject'">
						<BroadcastVideoRecordMetadataView
							:back-link="backLink"
							:more-like-this-records="moreLikeThisRecords"
							:record-data="recordData as BroadcastRecordType"
							:records-for-the-day="recordsForTheDay"
						/>
					</div>
					<div v-if="recordType === 'AudioObject'">
						<BroadcastAudioRecordMetadataView
							:back-link="backLink"
							:more-like-this-records="moreLikeThisRecords"
							:record-data="recordData as BroadcastRecordType"
							:records-for-the-day="recordsForTheDay"
						/>
					</div>
					<div
						v-if="
							!loading &&
							recordData !== null &&
							recordType !== 'VideoObject' &&
							recordType !== 'MediaObject' &&
							recordType !== 'AudioObject'
						"
					>
						<GenericRecordMetadataView :record-data="recordData as GenericRecordType" />
					</div>
				</div>
				<div v-if="!loading && recordData === null && contentNotAllowed">
					<NotAllowedRecord :back-link="backLink" />
				</div>
				<div v-if="recordType === null && backendError && !loading && !contentNotAllowed">
					<UnavailableRecord />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { APIService } from '@/api/api-service';
import GenericRecordMetadataView from '@/components/records/GenericRecord.vue';
import GenericRecord from '@/components/records/GenericRecord.vue';
import BroadcastVideoRecordMetadataView from '@/components/records/BroadcastVideoRecord.vue';
import BroadcastAudioRecordMetadataView from '@/components/records/BroadcastAudioRecord.vue';
import { useI18n } from 'vue-i18n';
import { AxiosError } from 'axios'; //Types
import { BroadcastRecordType } from '@/types/BroadcastRecordType';
import { GenericRecordType } from '@/types/GenericRecordTypes';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { Priority, Severity } from '@/types/NotificationType';
import { useSpinnerStore } from '@/store/spinnerStore';
import { useAuthStore } from '@/store/authStore';
import NotAllowedRecord from '@/components/records/NotAllowedRecord.vue';
import UnavailableRecord from '@/components/records/UnavailableRecord.vue';

export default defineComponent({
	name: 'ShowRecord',
	components: {
		NotAllowedRecord,
		GenericRecordMetadataView,
		BroadcastVideoRecordMetadataView,
		BroadcastAudioRecordMetadataView,
		UnavailableRecord,
	},

	setup() {
		const recordData = ref<BroadcastRecordType | GenericRecordType | null>(null);
		const recordType = ref<string | null>(null);
		const errorManager = inject('errorManager') as ErrorManagerType;
		const moreLikeThisRecords = ref<Array<GenericSearchResultType>>([]);
		const { t } = useI18n();
		const spinnerStore = useSpinnerStore();
		const authStore = useAuthStore();
		const route = useRoute();
		const router = useRouter();
		const loading = ref(true);
		const contentNotAllowed = ref(false);
		const backLink = ref('');
		const backendError = ref(false);
		const recordsForTheDay = ref<Array<GenericSearchResultType>>([]);
		onMounted(async () => {
			let back = router.options.history.state.back as string;
			if (back && back.substring(0, 5) === '/find') {
				backLink.value = router.options.history.state.back as string;
			} else {
				backLink.value = '/';
			}
			window.scrollTo({ top: 0, behavior: 'smooth' });

			if (authStore.firstAuthDone) {
				buildContentFromReponse();
			} else {
				watch(
					() => authStore.firstAuthDone,
					(newVal: boolean) => {
						if (newVal) {
							buildContentFromReponse();
						}
					},
				);
			}
		});

		const getRecord = async (id: string) => {
			backendError.value = false;
			spinnerStore.toggleSpinner(true);
			try {
				return await APIService.getRecord(id);
			} catch (err) {
				handleShowRecordError(err as AxiosError, 'recordCall');
				backendError.value = true;
			} finally {
				loading.value = false;
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
		const getMoreLikeThisDate = async (start: string, end: string, id: string) => {
			try {
				return await APIService.getTimeStartEndResults(start, end, id);
			} catch (err) {
				handleShowRecordError(err as AxiosError, 'moreLikeThisCall');
			}
		};
		const getMoreRecordsThisDayAndCreator = async () => {
			if (recordData.value as BroadcastRecordType) {
				try {
					const creator = (recordData.value as BroadcastRecordType).publication.publishedOn.alternateName;
					const url = URL.createObjectURL(new Blob());
					const currentSearchUUID = url.toString().split('/').reverse()[0];
					const recordTime = (recordData.value as BroadcastRecordType).startTime;
					const startTimeDate = new Date(recordTime);
					startTimeDate.setMinutes(startTimeDate.getMinutes() - startTimeDate.getTimezoneOffset());

					//Offset Timezone because backend will add the timezone as well.
					//So with this we start at midnight and end on the last minute of the day.
					startTimeDate.setUTCHours(23 + startTimeDate.getTimezoneOffset() / 60, 59, 59, 0);
					const endTime = startTimeDate.toISOString();
					startTimeDate.setDate(startTimeDate.getDate() - 1);
					startTimeDate.setUTCHours(24 + startTimeDate.getTimezoneOffset() / 60, 0, 0, 0);
					const startTime = startTimeDate.toISOString();
					//Some of the special characters does not need to be encoded.
					//This gives the same result as adding creator and a single day with facets.
					return await APIService.getSearchResults(
						'*:*',
						encodeURIComponent(`&fq=startTime:[${startTime} TO ${endTime}]&fq=(creator_affiliation_facet:"${creator}")`)
							.replace(/%26/g, '&')
							.replace(/%3D/g, '='),
						'10',
						'',
						'&sort=startTime asc',
						currentSearchUUID,
					);
				} catch (err) {
					handleShowRecordError(err as AxiosError, 'programGuideCall');
				}
			}
		};
		const handleShowRecordError = (err: AxiosError, type: string) => {
			switch (type) {
				case 'recordCall': {
					let errorMsg = '';
					if (err.response?.status === 403) {
						authStore.isAllowedToDisplayContent = false;
						errorMsg = t('error.record.notAllowed');
						contentNotAllowed.value = true;
					} else if (err.response?.status !== 404) {
						errorMsg = t('error.record.loadingFailed');
						errorManager.submitCustomError(
							'record-error',
							t('error.infoError.title'),
							errorMsg,
							Severity.ERROR,
							true,
							Priority.MEDIUM,
						);
					}
					break;
				}
				case 'moreLikeThisCall':
					errorManager.submitCustomError(
						'related-content-error',
						t('error.infoError.title'),
						t('error.infoError.relatedContent'),
						Severity.INFO,
						false,
						Priority.MEDIUM,
					);
					break;
				case 'programGuideCall':
					errorManager.submitCustomError(
						'program-guide-error',
						t('error.infoError.title'),
						t('error.infoError.programGuide'),
						Severity.INFO,
						false,
						Priority.MEDIUM,
					);
			}
		};

		const buildContentFromReponse = async () => {
			moreLikeThisRecords.value = [];
			const id = route.params.id;
			const idStr = id as string;
			const recordResp = await getRecord(idStr);
			if (recordResp) {
				const moreLikeThis = await getMoreLikeThisRecords(idStr);
				recordType.value = recordResp.data['@type'];
				recordData.value = recordResp.data;
				document.title = (recordData.value['name'] + t('app.titles.frontpage.archive.suffix')) as string;
				if (moreLikeThis) {
					moreLikeThisRecords.value = moreLikeThis.data.response.docs;
				}
			} else {
				document.title = `${t('app.titles.unknown')} ${t('app.titles.frontpage.archive.suffix')}` as string;
			}
			if (moreLikeThisRecords.value.length === 0) {
				const startAndEnd = getStartAndEndFromStartTime();

				if (startAndEnd.length > 0) {
					const moreLikeThisDate = await getMoreLikeThisDate(startAndEnd[0], startAndEnd[1], idStr);
					if (moreLikeThisDate) moreLikeThisRecords.value = moreLikeThisDate.data.response.docs;
				}
			}
		};

		const getStartAndEndFromStartTime = (): string[] => {
			let startEnd: string[] = [];
			if (recordData.value as BroadcastRecordType) {
				const startTime = (recordData.value as BroadcastRecordType).startTime;
				startEnd[0] = startTime.replace(/T(.*)/, 'T00:00:00Z');
				startEnd[1] = startTime.replace(/T(.*)/, 'T23:59:59Z');
			}
			return startEnd;
		};
		watch(
			() => route.params.id,
			() => {
				contentNotAllowed.value = false;
				buildContentFromReponse().then(() => {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});
			},
		);
		watch(
			() => recordData.value,
			async () => {
				getMoreRecordsThisDayAndCreator().then((records) => {
					if (records) {
						recordsForTheDay.value = records.data.response.docs;
					}
				});
			},
		);
		onUnmounted(() => {
			recordsForTheDay.value = [];
		});
		return {
			recordData,
			recordType,
			moreLikeThisRecords,
			loading,
			contentNotAllowed,
			backLink,
			backendError,
			recordsForTheDay,
		};
	},
	computed: {
		GenericRecord() {
			return GenericRecord;
		},
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
	padding-top: 25px 25px 25px 25px;
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
		padding: 25px 25px 25px 25px;
	}
	.container {
		max-width: 990px;
	}
	.top-offset {
		top: -40px;
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
		top: -60px;
		margin-left: 24px;
		margin-right: 24px;
		z-index: 4;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
	.top-offset {
		top: calc(-6vw + 10px);
	}
	/* MEDIA QUERY 1280 */
	@media (min-width: 1280px) {
		.container {
			padding-right: 0;
			padding-left: 0;
			width: 100%;
		}
	}
	@media (min-width: 2000px) {
		.top-offset {
			top: calc(-4vw + 10px);
		}
	}

	@media (min-width: 4000px) {
		.top-offset {
			top: calc(-2vw + 10px);
		}
	}
}
</style>
