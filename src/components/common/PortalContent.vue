<template>
	<div class="portal-container container">
		<div class="categories">
			<SkewedFoldable
				:left="false"
				:title="$t('facets.genres', 2)"
				bg="#002e70"
				text="white"
				icon="category"
				:fullwidth="true"
				:shadow-bottom="true"
				:shadow-top="true"
				:subtitle="$t('facets.genresSubtitle')"
			>
				<MainCategories />
			</SkewedFoldable>
		</div>
		<div class="date-picker">
			<SkewedFoldable
				:title="$t('timeSearch.searchDate')"
				:left="true"
				bg="#caf0fe"
				icon="event"
				:subtitle="$t('timeSearch.dateSubtitle')"
				:fullwidth="true"
				text="#0a2e70"
				:always-expand="true"
				:dashed-bottom="true"
				:shadow-bottom="true"
				:hover-effect="true"
			>
				<DayPicker />
			</SkewedFoldable>
		</div>
		<div class="time-search">
			<SkewedFoldable
				:title="$t('timeSearch.timeMachine')"
				:left="false"
				bg="#fafafa"
				text="#0a2e70"
				icon="schedule"
				:subtitle="$t('timeSearch.timeMachineSubtitle')"
				:fullwidth="true"
				:dashed-bottom="true"
				:shadow-bottom="false"
			>
				<TimeSearchComponent />
			</SkewedFoldable>
		</div>
		<TiltedDivider
			:right="false"
			:title="
				$t('frontpage.fromTheArchive', {
					month: new Date().toLocaleString(currentLocale, { month: 'long' }),
				})
			"
		></TiltedDivider>
		<div class="container">
			<GridDisplay
				:spot-nr="searchResultStore.rotationalResult.length === 0 ? 4 : searchResultStore.rotationalResult.length"
				:row-nr="4"
				:draggable="true"
				:spots="searchResultStore.rotationalResult"
				:loading="dataLoaded"
			></GridDisplay>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import GridDisplay from '@/components/common/GridDisplay.vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import TimeSearchComponent from '@/components/common/TimeSearchComponent.vue';
import TiltedDivider from '../global/content-elements/TiltedDivider.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import DayPicker from '@/components/common/timeSearch/DayPicker.vue';
import MainCategories from '@/components/common/MainCategories.vue';
import SkewedFoldable from '@/components/common/SkewedFoldable.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { APIService } from '@/api/api-service';
import { APISearchResponseType } from '@/types/APIResponseTypes';

export default defineComponent({
	name: 'PortalContent',
	components: {
		GridDisplay,
		TimeSearchComponent,
		TiltedDivider,
		DayPicker,
		MainCategories,
		SkewedFoldable,
	},

	setup() {
		const currentMonth = ref([] as GenericSearchResultType[]);
		// november test data
		const testItems = [
			'ds.tv:oai:io:47578244-da4a-48ca-8ab0-cceef12f23aa',
			'ds.tv:oai:io:4b252da6-7a71-4cdb-a7d8-9c6e9318e565',
			'ds.tv:oai:io:e5724c9b-b9c4-4212-95ff-9edf715a5f84',
			'ds.tv:oai:io:ddc4dc00-8530-4f94-ad11-fcb979fb9f8b',
			'ds.radio:oai:io:6a93f74e-66a0-4386-9f6b-c24b3f92025c',
			'ds.radio:oai:io:5cd51b8c-944c-401b-a80d-0105ffaaede7',
			'ds.tv:oai:io:99ab2820-9d2a-4007-8bb8-873e1911ab61',
			'ds.tv:oai:io:248a7e6a-0834-4928-8099-d562f53a36ff',
		];
		const dataLoaded = ref(false);
		const searchResultStore = useSearchResultStore();
		const currentLocale = ref('da-dk');
		const { locale, t } = useI18n({ useScope: 'global' });
		watch(
			() => locale.value,
			(newVal: string) => {
				currentLocale.value = newVal === 'da' ? 'da-dk' : 'en-uk';
			},
		);

		onMounted(() => {
			if (searchResultStore.firstBackendFetchExecuted && Object.keys(searchResultStore.rotationalResult).length === 0) {
				getRotationalResult();
			} else {
				watch(
					() => searchResultStore.firstBackendFetchExecuted,
					(newVal: boolean) => {
						if (newVal && Object.keys(searchResultStore.rotationalResult).length === 0) {
							getRotationalResult();
						} else {
							/* TODO: NEEDS TRANSLATIONS AND EXPLANATION */
							const customEvent = new CustomEvent('notify-user', {
								detail: {
									title: 'Backend svarer ikke.',
									message:
										'De bagvedliggende applikationer svarer ikke, så det er ikke muligt at søge pt. \n \n Prøv igen senere.',
									key: false,
									severity: 'low',
									userClose: true,
								},
							});
							window.dispatchEvent(customEvent);
						}
					},
				);
			}
		});

		const getRotationalResult = () => {
			Promise.race([
				APIService.getFeatureItems(testItems),
				new Promise((_, reject) => setTimeout(() => reject(), 5000)),
			])
				.then((response) => {
					const typedResponse = response as APISearchResponseType; // Assert the correct type
					searchResultStore.setRotationalResult(typedResponse.data.response.docs);
				})
				.catch(() => {
					/* some sort of error */
				})
				.finally(() => {
					dataLoaded.value = true;
				});
		};

		return { searchResultStore, currentMonth, currentLocale, addTestDataEnrichment, t, dataLoaded };
	},
	methods: {
		useRoute,
		router() {
			return router;
		},
	},
});
</script>

<style scoped>
.time-search {
	margin-bottom: -70px;
}

.portal-container {
	position: relative;
	margin-top: -110px !important;
	align-items: center;
}

.categories,
.date-picker,
.time-search {
	position: relative;
	margin-top: -6.1vw;
	width: calc(100% + 24px);
	margin-left: -12px;
}

.container {
	width: 100%;
}

.categories {
	/* z-index: 3; */
}
.date-picker {
	z-index: 2;
}
.time-search {
	z-index: 1;
	margin-bottom: 40px !important;
}

@media (min-width: 990px) {
	.categories,
	.date-picker,
	.time-search {
		width: 100%;
		margin-left: 0px;
	}

	.time-search,
	.categories,
	.date-picker {
		display: grid;
		justify-content: center;
	}
}

@media (min-width: 2000px) {
	.date-picker,
	.time-search {
		margin-top: -3vw;
	}
}
@media (min-width: 4000px) {
	.date-picker,
	.time-search {
		margin-top: -1.5vw;
	}
}
</style>
