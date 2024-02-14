<template>
	<Transition name="fade">
		<div>
			<div
				class="hit-box"
				v-for="(res, index) in searchResults"
				:key="index"
			>
				<ResultItem
					:resultdata="res"
					:duration="getDuration(res)"
					:starttime="getStartTime(res)"
					:placeholder="getPlaceholderImage()"
				></ResultItem>
			</div>
		</div>
	</Transition>
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
		const resultNr = ref(10);
		const lastUpdate = ref(0);
		const searchResultStore = useSearchResultStore();

		const getDuration = (resultItem: GenericSearchResultType) => {
			return resultItem
				? t('record.duration') + ': ' + formatDuration(resultItem.duration, resultItem.startTime, resultItem.endTime, t)
				: '';
		};

		const getStartTime = (resultItem: GenericSearchResultType) => {
			return resultItem.startTime !== undefined
				? `${getBroadcastDate(resultItem.startTime as string, locale.value)} 
				${t('record.timestamp')}${getBroadcastTime(resultItem.startTime as string)}`
				: t('record.noBroadcastData');
		};

		const getPlaceholderImage = () => {
			return require('@/assets/images/No-Image-Placeholder.svg.png');
		};
		const getAltTxt = () => {
			return 'license';
		};

		onMounted(() => {
			currentResults.value = toRaw(props.searchResults);
			resultNr.value = 10;

			watch(
				() => props.searchResults,
				(newResults: GenericSearchResultType[], prevResults: GenericSearchResultType[]) => {
					currentResults.value = [];
					console.log('results updated because of the watcher in searchResults.vue');
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
	padding: 0 0 10px 0;
	box-sizing: border-box;
	width: 100%;
}
</style>
