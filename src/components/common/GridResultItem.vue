<template>
	<div class="grid-result-item">
		<Transition
			name="result"
			mode="out-in"
		>
			<div v-if="resultdata && !timeSearchStore.loading">
				<router-link
					:to="{ path: 'record/' + resultdata.id }"
					class="title"
					role="link"
				>
					<div class="thumb-container">
						<kb-imagecomponent
							v-if="resultdata.origin.split('.')[1] === 'tv'"
							:imagedata="imageData"
						></kb-imagecomponent>
						<SoundThumbnail v-else></SoundThumbnail>
					</div>
					<div class="title">
						{{ resultdata.title[0] }}
					</div>
				</router-link>
				<div class="date">
					{{ resultdata.startTime ? getBroadcastDate(resultdata.startTime, 'da') : '' }} ({{
						resultdata.temporal_start_day_da
					}}) - kl. {{ resultdata.temporal_start_hour_da }}
				</div>
				<div class="summary">{{ resultdata.description }}</div>
			</div>
			<div
				v-else
				class="loading-placeholder"
			>
				<div class="thumb-container loading-color"></div>
				<div
					:style="`width:${Math.random() * 30 + 30}%`"
					class="title loading"
				></div>
				<div
					:style="`width:${Math.random() * 20 + 20}%`"
					class="date loading"
				></div>
				<div class="summary loading">
					<div
						v-for="(placeholder, index) in 15"
						:key="`${index}-${placeholder}`"
						class="word"
						:style="`width:${Math.random() * 10 + 10}%`"
					></div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref, watch, onMounted } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { getBroadcastDate } from '@/utils/time-utils';
import { ImageComponentType } from '@/types/ImageComponentType';
import { APIService } from '@/api/api-service';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import SoundThumbnail from '@/components/search/SoundThumbnail.vue';

export default defineComponent({
	name: 'GridResultItem',
	components: {
		SoundThumbnail,
	},
	props: {
		resultdata: { type: Object as PropType<GenericSearchResultType>, required: true },
	},

	setup(props) {
		const timeSearchStore = useTimeSearchStore();

		const imageData = ref(
			JSON.stringify({
				imgSrc: '',
				altText: '',
				imgTitle: '',
				placeholder: undefined,
			} as ImageComponentType),
		);

		const getImageData = () => {
			const imageDataObj = {} as ImageComponentType;
			imageDataObj.altText = props.resultdata?.title;
			imageDataObj.imgTitle = props.resultdata?.title;

			if (props.resultdata?.file_id) {
				APIService.getThumbnail(props.resultdata.file_id)
					.then((thumbServiceResponse) => {
						imageDataObj.imgSrc = thumbServiceResponse.data.default;
						imageDataObj.placeholder = undefined;
						imageDataObj.imgOption = 'cover';
						imageDataObj.icon = 'play_circle_filled';
						imageDataObj.iconColor = 'white';
						imageData.value = JSON.stringify(imageDataObj);
					})
					//Just in case the service fail - we fail silently and swoop in with the placeholder
					.catch(() => {
						imageDataObj.imgOption = 'contain';
						imageDataObj.imgSrc = undefined;
						imageDataObj.placeholder = new URL('@/assets/images/No-Image-Placeholder.svg.png', import.meta.url).href;
						imageData.value = JSON.stringify(imageDataObj);
					});
			} else {
				imageDataObj.imgOption = 'contain';
				imageDataObj.imgSrc = undefined;
				imageDataObj.placeholder = new URL('@/assets/images/No-Image-Placeholder.svg.png', import.meta.url).href;
				imageData.value = JSON.stringify(imageDataObj);
			}
		};

		//We need to watch the search result to trigger re-render of thumbmails
		watch(
			() => props.resultdata,
			(newVal, oldVal) => {
				if (newVal !== oldVal) {
					getImageData();
				}
			},
		);

		onMounted(() => {
			getImageData();
		});
		return { getBroadcastDate, imageData, timeSearchStore };
	},
});
</script>

<style scoped>
.grid-result-item {
	width: 100%;
	max-width: 100%;
}
.thumb-container {
	width: 100%;
	aspect-ratio: 4/2;
}

.loading-color {
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
}

.title {
	margin-top: 5px;
	font-size: 16px;
	font-weight: bold;
	color: #002e70;
	margin-bottom: 5px;
	max-width: 100%;
	color: #002e70;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	text-transform: uppercase;
	text-decoration: none;
	position: relative;
}

.title.loading {
	background-color: rgba(170, 170, 170, 1);
	height: 20px;
	border-radius: 10px;
}

.summary.loading {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.summary .word {
	background-color: rgba(170, 170, 170, 1);
	height: 16px;
	border-radius: 10px;
	margin-top: 4px;
	margin-right: 5px;
}

.date.loading {
	margin-bottom: 5px;
	background-color: rgba(170, 170, 170, 1);
	height: 20px;
	border-radius: 10px;
}

.summary {
	transition: all 0.5s ease-in-out 0s;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	line-height: 20px; /* fallback for firefox */
	max-height: calc(20px * 3); /* fallback for firefox */
	min-height: calc(20px * 3); /* fallback for firefox */
}
</style>
