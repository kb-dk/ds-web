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
				</router-link>
				<div class="date">
					<span class="material-icons">play_circle_filled</span>
					{{ resultdata.creator_affiliation + ', ' }}
					{{ resultdata.startTime ? getBroadcastDate(resultdata.startTime, 'da') : '' }}
				</div>
				<div class="duration">
					<span class="material-icons">schedule</span>
					<span>{{ $t('record.duration') }}:&nbsp;</span>
					<Duration
						:start-date="resultdata.startTime"
						:end-date="resultdata.endTime"
						:iso-duration="resultdata.duration"
						:parenthesis="false"
					></Duration>
					&nbsp; - kl. {{ resultdata.temporal_start_hour_da }}
				</div>
				<router-link
					:to="{ path: 'record/' + resultdata.id }"
					class="title"
					role="link"
				>
					<div class="title">
						{{ resultdata.title[0] }}
					</div>
				</router-link>
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
import { populateImageDataWithPlaceholder } from '@/utils/placeholder-utils';
import Duration from './Duration.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'GridResultItem',
	components: {
		SoundThumbnail,
		Duration,
	},
	props: {
		resultdata: { type: Object as PropType<GenericSearchResultType>, required: true },
	},

	setup(props) {
		const { t } = useI18n();
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
						populateImageDataWithPlaceholder(imageDataObj);
						imageData.value = JSON.stringify(imageDataObj);
					});
			} else {
				populateImageDataWithPlaceholder(imageDataObj);
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
	border-bottom: 1px solid rgba(230, 230, 230, 1);
	padding-bottom: 20px;
	margin-bottom: 10px;
	position: relative;
	color: #323232;
}

.grid-result-item:hover:after {
	transform: translate(-50%, -0%) scale3d(1.9, 1.9, 1.9);
}

.grid-result-item:after {
	transition: all 0.3s linear 0s;
	content: '•';
	position: absolute;
	height: 10px;
	text-align: center;
	color: #002e70;
	transform: translate(-50%, -0%) scale3d(1.2, 1.2, 1.2);
	left: 50%;
	width: 20px;
	line-height: 0.5;
	margin-top: 15px;
	transform-origin: center;
	will-change: transform;
	background-color: #fafafa;
}

.thumb-container {
	width: 100%;
	aspect-ratio: 4/2;
}

.loading-color {
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
}

.duration {
	display: flex;
}

.date {
	display: flex;
	padding-top: 20px;
	padding-bottom: 5px;
}

.date .material-icons,
.duration .material-icons {
	font-size: 20px;
}

.title {
	font-size: 20px;
	font-weight: bold;
	color: #002e70;
	margin-bottom: 10px;
	max-width: 100%;
	color: #002e70;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	text-decoration: none;
	position: relative;
	padding-top: 15px;
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

@media (min-width: 480px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
@media (min-width: 800px) {
	.search-resultset {
		display: flex;
		flex-direction: row;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.mobile-edge {
		display: none;
	}
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.intro {
		width: 75%;
	}
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
