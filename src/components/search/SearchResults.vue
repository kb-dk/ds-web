<template>
	<Transition name="fade">
		<div>
			<div
				class="hit-box"
				v-for="(res, index) in resultNr as unknown as GenericSearchResultType[]"
				:key="index"
			>
				<kb-resultcomponent
					:vueRouting="true"
					:content="!searchResultStore.loading"
					:number="index"
					:resultdata="JSON.stringify(currentResults[index])"
					:placeholder="getPlaceholderImage()"
					:duration="
						currentResults[index]
							? t('record.duration') +
							  ': ' +
							  formatDuration(
									currentResults[index].duration,
									currentResults[index].startTime,
									currentResults[index].endTime,
									t,
							  )
							: ''
					"
					:starttime="
						currentResults[index]
							? currentResults[index].startTime !== undefined
								? getBroadcastDate(currentResults[index].startTime as string, locale) +
								  ' ' +
								  t('record.timestamp') +
								  getBroadcastTime(currentResults[index].startTime as string)
								: t('record.noBroadcastData')
							: ''
					"
				/>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted, toRaw } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { formatDuration, getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';
import { useI18n } from 'vue-i18n';

import '@/components/search/wc-result-item';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'SearchResults',
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

		const getPlaceholderImage = () => {
			return require('@/assets/images/No-Image-Placeholder.svg.png');
			// return res.pages && res.pages.length > 0
			//	? res.pages[0].replace(/.info.json$/, '/full/!250,150/0/native.jpg')
			//	: require('@/assets/images/No-Image-Placeholder.svg.png');
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

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.hit-box {
	padding: 0 0 10px 0;
	box-sizing: border-box;
	width: 100%;
}

.hit-img {
	width: 10%;
}
</style>
