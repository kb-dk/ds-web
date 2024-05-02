<template>
	<div
		ref="resultContainer"
		class="search-results fullwidth"
	>
		<TransitionGroup name="result">
			<div
				v-for="(res, index) in resultNr"
				:key="index"
				:class="searchResultStore.loading ? 'hit-box' : 'hit-box data'"
			>
				<ResultItem
					:resultdata="searchResults[index]"
					:duration="searchResults[index] ? getDuration(searchResults[index]) : ''"
					:starttime="searchResults[index] ? getStartTime(searchResults[index]) : ''"
					:placeholder="getPlaceholderImage()"
				></ResultItem>
			</div>
		</TransitionGroup>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted, toRaw } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { formatDuration, getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';
import ResultItem from '@/components/search/ResultItem.vue';
import { useI18n } from 'vue-i18n';

import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'SearchResults',
	components: {
		ResultItem,
	},
	props: {
		searchResults: { type: Object as PropType<GenericSearchResultType[]>, required: true },
		numFound: { type: Number, required: true },
	},

	setup(props) {
		const { t, locale } = useI18n();
		const currentResults = ref([] as GenericSearchResultType[]);
		const resultNr = ref(0);
		const lastUpdate = ref(0);
		const searchResultStore = useSearchResultStore();
		const resultContainer = ref<HTMLElement | null>(null);

		const getDuration = (resultItem: GenericSearchResultType) => {
			return resultItem ? formatDuration(resultItem.duration, resultItem.startTime, resultItem.endTime, t) : '';
		};

		const getStartTime = (resultItem: GenericSearchResultType) => {
			return resultItem.startTime !== undefined
				? `${getBroadcastDate(resultItem.startTime as string, locale.value)} 
				${t('record.timestamp')}${getBroadcastTime(resultItem.startTime as string)}`
				: t('record.noBroadcastData');
		};

		const getPlaceholderImage = () => {
			return new URL(`@/assets/images/No-Image-Placeholder.svg.png`, import.meta.url).href;
		};
		const getAltTxt = () => {
			return 'license';
		};

		watch(
			() => searchResultStore.showFacets,
			() => {
				toggleFacets();
			},
		);

		const toggleFacets = () => {
			if (searchResultStore.showFacets) {
				resultContainer.value?.classList.add('fullwidth');
			} else {
				resultContainer.value?.classList.remove('fullwidth');
			}
		};

		onMounted(() => {
			currentResults.value = toRaw(props.searchResults);
			resultNr.value = currentResults.value.length ? Math.min(currentResults.value.length, 10) : 10;

			watch(
				() => props.searchResults,
				(newResults: GenericSearchResultType[], prevResults: GenericSearchResultType[]) => {
					currentResults.value = [];
					if (newResults !== prevResults) {
						resultNr.value = newResults.length;
						currentResults.value = newResults;
						lastUpdate.value = new Date().getTime();
					}
				},
			);
		});

		return {
			formatDuration,
			getBroadcastDate,
			getBroadcastTime,
			getPlaceholderImage,
			getDuration,
			getStartTime,
			getAltTxt,
			resultContainer,
			currentResults,
			lastUpdate,
			t,
			locale,
			resultNr,
			searchResultStore,
		};
	},
});
</script>

<style scoped>
.hit-box {
	position: relative;
	padding: 0 0 0 0;
	box-sizing: border-box;
	width: 100%;
	margin-bottom: 20px;
	transition: all 0.3s ease-in-out 0s;
}

.hit-box.data:hover:after,
.hit-box.data:hover:before {
	background-color: transparent;
	transform: translate(-50%, 0) scale3d(1.9, 1.9, 1.9);
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0s;
}

.hit-box:after,
.hit-box:before {
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0.2s;
}

.hit-box:after {
	content: '•';
	position: absolute;
	height: 10px;
	text-align: center;
	color: #002e70;
	transform: translate(-50%, -0%) scale3d(1.2, 1.2, 1.2);
	left: 50%;
	width: 20px;
	line-height: 0.5;
	margin-top: -5px;
	transform-origin: center;
	will-change: transform;
	background-color: white;
}

.hit-box:before {
	content: '•';
	content: '•';
	position: absolute;
	height: 16px;
	text-align: center;
	color: #002e70;
	transform: translate(-50%, -0%) scale3d(1.2, 1.2, 1.2);
	top: 50%;
	width: 10px;
	line-height: 0.75;
	margin-top: -5px;
	left: 0px;
	display: none;
	background: white;
}

.search-results {
	position: relative;
	max-width: 100%;
	transition: all 0.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
}

/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.fullwidth {
		max-width: calc(100%);
	}
}
@media (min-width: 800px) {
	.search-results {
		max-width: 100%;
		width: 100%;
	}
	.hit-box:before {
		display: block;
	}

	.fullwidth {
		max-width: calc(100% - 330px);
	}
}
</style>
