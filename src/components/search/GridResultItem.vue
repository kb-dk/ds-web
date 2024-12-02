<template>
	<div
		ref="gridContainer"
		draggable="false"
		class="grid-result-item"
	>
		<Transition
			name="result"
			mode="out-in"
		>
			<div
				v-if="resultdata != null && !loading"
				class="data"
			>
				<router-link
					:to="{ name: 'Record', params: { id: resultdata.id } }"
					draggable="false"
					class="link-title"
					role="link"
					:data-testid="addTestDataEnrichment('link', 'grid-result-item', `link`, index)"
				>
					<div class="thumb-container">
						<kb-imagecomponent
							v-if="resultdata.origin.split('.')[1] === 'tv'"
							:imagedata="imageData"
						></kb-imagecomponent>
						<SoundThumbnail v-else></SoundThumbnail>
					</div>
					<div class="date">
						<span class="material-icons">play_circle_filled</span>
						{{ resultdata.creator_affiliation + ', ' }}
						{{ getStartTime(resultdata) }}
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
						<!-- &nbsp;-&nbsp;
						<span style="font-style: italic; opacity: 0.5">
							{{ resultdata.temporal_start_day_da }}
						</span> -->
					</div>

					<div class="title">
						{{ resultdata.title[0] }}
					</div>
					<div class="summary">{{ resultdata.description }}</div>
				</router-link>
			</div>
			<div
				v-else
				class="loading-placeholder"
			>
				<div
					v-if="loading"
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div>
				<div class="thumb-container loading-color">
					<span
						v-if="!loading"
						class="material-icons"
					>
						warning
					</span>
					<p>Indlæsning fejlede</p>
				</div>
				<div class="material-icons loading-icon">play_circle_filled</div>
				<div
					:style="`width:${Math.random() * 30 + 40}%`"
					class="date loading"
				></div>
				<div class="date-loading-container">
					<div class="material-icons loading-icon">schedule</div>
					<div
						:style="`width:${Math.random() * 20 + 20}%`"
						class="date loading"
					></div>
					<div
						:style="`width:${Math.random() * 20 + 20}%`"
						class="date loading"
					></div>
				</div>
				<div
					:style="`width:${Math.random() * 30 + 50}%`"
					class="title loading"
				></div>
				<div class="summary loading">
					<div
						class="word"
						:style="`width:100%`"
					></div>
					<div
						class="word"
						:style="`width:100%`"
					></div>
					<div
						class="word"
						:style="`width:80%`"
					></div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, PropType, ref, watch } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';
import { ImageComponentType } from '@/types/ImageComponentType';
import { APIService } from '@/api/api-service';
import { useTimeSearchStore } from '@/store/timeSearchStore';
import { useSearchResultStore } from '@/store/searchResultStore';
import SoundThumbnail from '@/components/search/SoundThumbnail.vue';
import { populateImageDataWithPlaceholder } from '@/utils/placeholder-utils';
import Duration from '@/components/common/Duration.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useI18n } from 'vue-i18n';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';

export default defineComponent({
	name: 'GridResultItem',
	components: {
		SoundThumbnail,
		Duration,
	},
	props: {
		resultdata: {
			type: Object as PropType<GenericSearchResultType>,
			required: false,
			default: undefined,
		},
		starttime: {
			type: String,
			default() {
				return '';
			},
		},
		index: {
			type: Number as PropType<number>,
			required: true,
		},
		loading: { type: Boolean as PropType<boolean>, required: true },
		background: { type: String as PropType<string>, required: false, default: '#ffffff' },
		fullPostUrl: {
			type: Boolean as PropType<boolean>,
			default() {
				return false;
			},
		},
	},

	setup(props) {
		const gridContainer = ref<HTMLDivElement | null>(null);
		const { t, locale } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const timeSearchStore = useTimeSearchStore();
		const searchResultStore = useSearchResultStore();
		const imageData = ref(
			JSON.stringify({
				imgSrc: '',
				altText: '',
				imgTitle: '',
				placeholder: undefined,
			} as ImageComponentType),
		);

		const getStartTime = (resultItem: GenericSearchResultType) => {
			return resultItem.startTime !== undefined
				? `${getBroadcastDate(resultItem.startTime as string, locale.value)}
				${t('record.timestamp')}${getBroadcastTime(resultItem.startTime as string)}`
				: t('record.noBroadcastData');
		};

		const getImageData = () => {
			const imageDataObj = {} as ImageComponentType;
			imageDataObj.altText = t('search.recordThumbnail', { title: props.resultdata?.title[0] });
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
						errorManager.submitCustomError(
							'thumbnails-error',
							t('error.title'),
							t('error.thumbnails.notResponsive'),
							Severity.INFO,
							false,
							Priority.LOW,
						);
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
			if (gridContainer.value) {
				gridContainer.value.style.setProperty('--bg-color', props.background);
			}

			getImageData();
		});
		return {
			gridContainer,
			getBroadcastDate,
			imageData,
			timeSearchStore,
			searchResultStore,
			addTestDataEnrichment,
			getStartTime,
			errorManager,
		};
	},
});
</script>

<style scoped>
.grid-result-item {
	--bg-color: #ffffff;
	width: 100%;
	max-width: 100%;
	border-bottom: 1px solid rgba(230, 230, 230, 1);
	padding-bottom: 20px;
	margin-bottom: 10px;
	position: relative;
	color: #323232;
	background-color: var(--bg-color);
}

.grid-result-item:hover:after {
	transform: translate(-50%, -0%) scale3d(1.9, 1.9, 1.9);
}

.link-title {
	font-size: 14px;
	text-decoration: none;
	color: black;
	display: grid;
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
}

.thumb-container {
	width: 100%;
	aspect-ratio: 4/2;
	text-align: center;
	align-content: center;
	color: #b30018;
}

.thumb-container span {
	font-size: 36px;
}

.loading-color {
	background-color: rgba(170, 170, 170, 1);
}

.date-loading-container {
	display: flex;
	align-items: flex-end;
	flex-direction: row;
	margin-top: -10px;
}

.duration {
	display: flex;
}

.loading-icon {
	display: inline-block;
	margin-right: 5px;
	font-size: 20px;
	position: relative;
	top: -4px;
}

.date {
	display: flex;
	padding-top: 12px;
	padding-bottom: 5px;
}

.date.loading {
	margin-right: 5px;
	display: inline-block;
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
	background-color: #002e70;
	border-radius: 10px;
	margin-top: 15px;
}

.shimmer {
	animation: loading 3s ease-in-out 0s infinite;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		117deg,
		rgba(255, 255, 255, 0) 44%,
		rgba(255, 255, 255, 0.7455357142857143) 64%,
		rgba(255, 255, 255, 0) 77%
	);
	position: absolute;
	width: 100%;
	height: 100%;
	mix-blend-mode: soft-light;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 200% center;
}

@keyframes loading {
	0% {
		background-position: 200% center;
	}
	20% {
		background-position: 200% center;
	}
	80% {
		background-position: 0% center;
	}
	100% {
		background-position: 0% center;
	}
}

.summary.loading {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}

.summary .word {
	background-color: rgba(170, 170, 170, 1);
	height: 12px;
	border-radius: 10px;
	margin-top: 4px;
	margin-right: 5px;
	margin-bottom: 5px;
}

.date.loading {
	margin-top: 10px;
	margin-bottom: 5px;
	background-color: rgba(170, 170, 170, 1);
	height: 0px;
	border-radius: 15px;
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
