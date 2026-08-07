<template>
	<div class="portal-container container">
		<SpotContainer></SpotContainer>
		<div class="time-search">
			<TimeSearchComponent
				:title="$t('timeSearch.timeMachine')"
				text="var(--color-main)"
			></TimeSearchComponent>
		</div>
		<div class="title">
			<h2 class="heading-display">
				{{ t('frontpage.fromTheArchive', { month: new Date().toLocaleDateString(currentLocale, { month: 'long' }) }) }}
			</h2>
		</div>

		<div class="container">
			<div class="container-backdrop">
				<ContainerSplitBar :is-top="true"></ContainerSplitBar>
				<ContainerSplitBar :is-top="false"></ContainerSplitBar>
			</div>

			<GridDisplay
				:spot-nr="searchResultStore.rotationalResult.length === 0 ? 4 : searchResultStore.rotationalResult.length"
				:row-nr="4"
				:draggable="true"
				:spots="searchResultStore.rotationalResult"
				:loaded="dataLoaded"
				:data-testid="addTestDataEnrichment('container', 'PortalContent', 'through-time-container', 0)"
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
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { APIService } from '@/api/api-service';
import { APISearchResponseType } from '@/types/APIResponseTypes';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { CuratedItemsType } from '@/types/CuratedItemsType';
import SpotContainer from '@/components/common/SpotContainer.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';

export default defineComponent({
	name: 'PortalContent',
	components: {
		GridDisplay,
		TimeSearchComponent,
		SpotContainer,
		ContainerSplitBar,
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
					() => searchResultStore.firstBackendFetchExecuted,
					(newVal: boolean) => {
						if (newVal && Object.keys(searchResultStore.rotationalResult).length === 0) {
							getCuratedItemFromMonth(searchResultStore.curatedContent);
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
.title {
	width: 100%;
	color: var(--color-main);
	margin-bottom: 20px;
}
.time-search {
	background-color: var(--bg-default);
	width: 100%;
	position: relative;
	z-index: 1;
	margin-bottom: 20px !important;
}

.portal-container {
	position: relative;
	/* margin-top: -110px !important; */
	align-items: center;
}

.container {
	background-color: var(--bg-secondary-light-20);
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}
.container-backdrop {
	position: absolute;
	height: 100%;
	width: 100vw;
	background-color: var(--bg-backdrop);
	justify-content: space-between;
	display: flex;
	flex-direction: column;
}

.categories {
	/* z-index: 3; */
}
.date-picker {
	z-index: 2;
}

@media (min-width: 990px) {
	.categories,
	.date-picker,
	.time-search {
		width: 100%;
		margin-left: 0px;
	}
}
</style>
