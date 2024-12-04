<template>
	<div class="portal-container container">
		<div class="categories">
			<SkewedFoldable
				:title="$t('timeSearch.searchCategories')"
				:left="false"
				bg="#002e70"
				text="white"
				icon="category"
				:fullwidth="true"
				:shadow-bottom="true"
				:shadow-top="true"
				:subtitle="$t('timeSearch.searchCategoriesSubtitle')"
			>
				<MainCategories
					:title="$t('timeSearch.searchCategories')"
					text="white"
					:subtitle="$t('timeSearch.searchCategoriesSubtitle')"
				></MainCategories>
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
				<TimeSearchComponent
					:title="$t('timeSearch.timeMachine')"
					:subtitle="$t('timeSearch.timeMachineSubtitle')"
					text="#0a2e70"
				></TimeSearchComponent>
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
				:loaded="dataLoaded"
			></GridDisplay>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
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
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { CuratedItemsType } from '@/types/CuratedItemsType';

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
		const curatedItems = ref([] as Array<string>);
		const dataLoaded = ref(false);
		const searchResultStore = useSearchResultStore();
		const currentLocale = ref('da-dk');
		const { locale, t } = useI18n({ useScope: 'global' });
		const errorManager = inject('errorManager') as ErrorManagerType;

		watch(
			() => locale.value,
			(newVal: string) => {
				currentLocale.value = newVal === 'da' ? 'da-dk' : 'en-uk';
			},
		);
		const getCuratedItemFromMonth = (items: CuratedItemsType) => {
			let currentMonth = new Date().toLocaleString('da-DK', { month: 'long' });
			currentMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
			curatedItems.value = items[currentMonth];
		};
		const scrambleArray = (list: Array<GenericSearchResultType>) => {
			return list
				.map((value) => ({ value, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ value }) => value);
		};
		onMounted(() => {
			if (searchResultStore.firstBackendFetchExecuted) {
				getRotationalResult();
			} else {
				watch(
					() => searchResultStore.curatedContent,
					(newVal: CuratedItemsType) => {
						if (newVal && Object.keys(searchResultStore.rotationalResult).length === 0) {
							getCuratedItemFromMonth(newVal);
							if (curatedItems.value.length > 0) {
								getRotationalResult();
							} else {
								dataLoaded.value = true;
							}
						}
					},
				);
			}
		});

		const handleAPIResponse = (response: APISearchResponseType) => {
			const typedResponse = response as APISearchResponseType;
			let itemsForMonth = typedResponse.data.response.docs;
			if (itemsForMonth.length > 7) {
				itemsForMonth = scrambleArray(itemsForMonth).splice(0, 8);
			}
			searchResultStore.setRotationalResult(itemsForMonth);
		};

		const getRotationalResult = () => {
			getCuratedItemFromMonth(searchResultStore.curatedContent);

			// api call to get the items
			const curatedItemsAPICall = APIService.getFeatureItems(curatedItems.value);
			// timeout promise for long responsetimes. (7 seconds pt.)
			let curatedItemsAPICallFurfilled = false;
			const maximumWaitTime = new Promise<void>((resolve) => {
				setTimeout(() => {
					// if the api promise was not furfilled yet, we tell people to wait a bit longer
					if (!curatedItemsAPICallFurfilled) {
						errorManager.submitCustomError(
							'long-response',
							t('facets.slowResponse.title'),
							t('facets.slowResponse.text'),
							Severity.INFO,
							false,
							Priority.MEDIUM,
						);
					}
					resolve();
				}, 7000);
			});

			Promise.race([curatedItemsAPICall, maximumWaitTime])
				.then((response) => {
					if (response) {
						handleAPIResponse(response);
						curatedItemsAPICallFurfilled = true;
					}
					return curatedItemsAPICall;
				})
				.then((response) => {
					if (!curatedItemsAPICallFurfilled) {
						handleAPIResponse(response);
						curatedItemsAPICallFurfilled = true;
					}
				})
				.catch(() => {
					errorManager.submitCustomError(
						'thumbnails-error',
						t('error.infoError.title'),
						t('error.infoError.featuredContent'),
						Severity.INFO,
						false,
						Priority.LOW,
					);
				})
				.finally(() => {
					dataLoaded.value = true;
				});
		};

		return {
			searchResultStore,
			currentMonth,
			currentLocale,
			curatedItems,
			getCuratedItemFromMonth,
			addTestDataEnrichment,
			scrambleArray,
			t,
			dataLoaded,
			errorManager,
		};
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
