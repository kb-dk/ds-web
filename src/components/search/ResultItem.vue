<template>
	<div :class="searchResultStore.loading ? 'result-item-wrapper' : 'result-item-wrapper data'">
		<div class="backfade"></div>
		<Transition
			name="result"
			mode="out-in"
		>
			<div
				v-if="!searchResultStore.loading && resultdata"
				class="outer-container"
			>
				<div class="container">
					<div class="information">
						<router-link
							:to="{ path: 'post/' + resultdata.id }"
							class="title"
							role="link"
							:data-testid="addTestDataEnrichment('link', 'result-item', `top-link`, index)"
							:title="resultdata.title"
						>
							{{ resultdata.title[0] }}
							<div
								role="img"
								class="material-icons arrow"
								aria-label="Go to post"
							>
								keyboard_arrow_right
							</div>
						</router-link>
						<div class="subtitle">
							<span
								role="img"
								:class="`icons schedule ${resultdata.origin.split('.')[1] === 'tv' ? 'playSVG' : 'volumeSVG'}`"
								aria-label="Broadcast time and place"
							></span>
							<span class="where">{{ resultdata.creator_affiliation + ',' }}</span>
							<span class="when">{{ starttime }}</span>
							<div
								role="img"
								class="icons schedule timeSVG"
								aria-label="Duration for broadcast"
							></div>
							<span class="duration">{{ duration }}</span>
						</div>
						<div class="summary">{{ resultdata.description }}</div>
					</div>
					<router-link
						:to="{ path: 'post/' + resultdata.id }"
						class="result-image-wrapper"
						role="link"
						:data-testid="addTestDataEnrichment('link', 'result-item', `image-link`, index)"
					>
						<ImageComponent
							v-if="resultdata.origin.split('.')[1] === 'tv'"
							:image-data="imageData"
						></ImageComponent>

						<SoundThumbnail
							v-else
							:result-title="resultdata.title[0]"
						></SoundThumbnail>
					</router-link>
				</div>

				<AdditionalInfo
					:id="resultdata.id"
					:type="resultdata.origin.split('.')[1]"
					:file-id="resultdata.file_id ? resultdata.file_id : ''"
					:duration="Number(resultdata.duration_ms)"
					:nr="index"
				></AdditionalInfo>
			</div>
			<div
				v-else
				class="loading container"
			>
				<!-- <div
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div> -->
				<div class="information">
					<div
						ref="placeholderTitleRef"
						class="placeholder-t"
						:style="`width:${Math.random() * 20 + 20 + '%'}`"
					></div>
					<div class="placeholder-w">
						<div
							role="img"
							aria-label="Play time and channel"
							class="material-icons ph-icon"
						>
							play_circle_filled
						</div>
						<div
							class="line"
							:style="`width:${Math.random() * 10 + 10 + '%'}`"
						></div>
						<div
							role="img"
							class="material-icons ph-icon"
							title="Duration of broadcast"
						>
							schedule
						</div>
						<div
							class="line"
							:style="`width:${Math.random() * 10 + 5 + '%'}`"
						></div>
						<div
							class="line"
							:style="`width:${Math.random() * 10 + 5 + '%'}`"
						></div>
					</div>
					<div class="placeholder-s">
						<div>
							<div
								class="ph-span"
								:style="`width:${Math.random() * 5 + 70 + '%'}`"
							></div>
						</div>
						<div>
							<div
								class="ph-span"
								:style="`width:${Math.random() * 5 + 60 + '%'}`"
							></div>
						</div>
					</div>
				</div>
				<div class="placeholder-extra">
					<div class="material-icons ph-icon">collections</div>
					<div class="line"></div>
					<div class="material-icons ph-icon">expand_more</div>
				</div>
				<div class="result-image-wrapper skeleton"></div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, PropType, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ImageComponentType } from '@/types/ImageComponentType';
import { APIService } from '@/api/api-service';
import SoundThumbnail from '@/components/search/SoundThumbnail.vue';
import AdditionalInfo from '@/components/search/AdditionalInfo.vue';
import { populateImageDataWithPlaceholder } from '@/utils/placeholder-utils';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import ImageComponent from '@/components/common/ImageComponent.vue';

export default defineComponent({
	name: 'ResultItem',
	components: {
		ImageComponent,
		SoundThumbnail,
		AdditionalInfo,
	},
	props: {
		resultdata: {
			type: Object as PropType<GenericSearchResultType>,
			default() {
				return {};
			},
		},
		duration: {
			type: String,
			default() {
				return '';
			},
		},
		index: {
			type: Number,
			required: true,
		},
		starttime: {
			type: String,
			default() {
				return '';
			},
		},
		placeholder: {
			type: String,
			default() {
				return '';
			},
		},
	},
	setup(props) {
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		//Default imageData obj to prevent render issues
		const imageData = ref(
			JSON.stringify({
				imgSrc: '',
				altText: '',
				imgTitle: '',
				placeholder: undefined,
			} as ImageComponentType),
		);
		const placeholderTitleRef = ref<HTMLElement | null>(null);

		const getImageData = () => {
			const imageDataObj = {} as ImageComponentType;
			imageDataObj.altText = t('search.recordThumbnail', { title: props.resultdata?.title[0] });
			imageDataObj.imgTitle = props.resultdata?.title ? props.resultdata.title : t('record.seeMaterial');

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
							t('error.infoError.title'),
							t('error.infoError.thumbnail'),
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
					if (props.resultdata.origin.split('.')[1] === 'tv') {
						getImageData();
					}
				}
			},
		);

		onMounted(() => {
			if (props.resultdata.origin && props.resultdata.origin.split('.')[1] === 'tv') {
				getImageData();
			}
		});

		return {
			searchResultStore,
			imageData,
			placeholderTitleRef,
			t,
			addTestDataEnrichment,
			errorManager,
		};
	},
});
</script>
<style scoped>
.result-item-wrapper {
	transition: all 0.3s linear;
	overflow: hidden;
	box-sizing: border-box;
	padding: 0;
}

.result-item-wrapper:hover .arrow {
	opacity: 1;
}

.outer-container {
	z-index: 1;
	position: relative;
	border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.arrow {
	font-weight: bold !important;
	top: 2px;
	position: relative;
	opacity: 0;
	transition: opacity 0.1s linear 0s;
}

.timeSVG {
	background-image: url('@/assets/website/schedule_000000.svg');
}

.volumeSVG {
	background-image: url('@/assets/website/volume_up_000000.svg');
}

.playSVG {
	background-image: url('@/assets/website/play_circle_filled_000000.svg');
}

.playSVG,
.timeSVG,
.volumeSVG {
	width: 15px;
	height: 15px;
	display: inline-block;
	background-size: contain;
	background-repeat: no-repeat;
}

.material-icons {
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 16px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	font-feature-settings: 'liga';
	-webkit-font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
}

.icons,
.arrow {
	z-index: 1;
	position: relative;
}

.icons {
	padding-right: 3px;
	position: relative;
	top: 3px;
	color: black !important;
	background-color: white !important;
}
.schedule {
	transition: all 0.5s ease-in-out 0s;
}
.summary span {
	height: 15px;
	display: block;
	border-radius: 15px;
	margin-top: 5px;
	transition: all 0.5s ease-in-out 0s;
}

.container {
	display: flex;
	flex-direction: column-reverse;
	justify-content: space-between;
	gap: 0px;
	width: 100%;
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
	position: relative;
	margin-top: 10px;
}

.result-image-wrapper {
	width: 100%;
	height: 150px;
}

@media (min-width: 400px) {
	.container {
		gap: 30px;
		height: 175px;
		flex-direction: row;
	}
	.information {
		width: calc(100% - (120px + 30px));
	}

	.summary {
		position: absolute;
		top: 110px;
	}
	.result-image-wrapper {
		width: 200px;
		height: 105px;
	}
}

.information {
	text-overflow: ellipsis;
	width: 100%;
	overflow: hidden;
	max-width: 100%;
}

.title {
	transition: all 0.5s ease-in-out 0s;
	font-weight: bold;
	color: #002e70;
	text-overflow: ellipsis;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	width: 75ch;
	text-transform: uppercase;
	text-decoration: none;
	height: 18px;
	position: relative;
	display: block;
	margin-bottom: 7px;
	color: #002e70;
}

.where,
.when,
.duration {
	padding-right: 5px;
	text-overflow: ellipsis;
	font-size: 14px;
}
.when {
	padding-right: 20px;
}

.loading {
	width: 100vw;
	max-width: 100%;
	height: 120px;
	flex-direction: row;
	justify-content: space-between;
	gap: 30px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(230, 230, 230, 1);
}

/* .shimmer {
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
	max-width: 97%;
	height: 120px;
	mix-blend-mode: soft-light;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 160% center;
	display: none;
} */

.placeholder-t:before,
.placeholder-w .line:before,
.placeholder-s .ph-span:before {
	content: '';
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
	max-width: 100%;
	height: 100%;
	mix-blend-mode: soft-light;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 160% center;
}

@keyframes loading {
	0% {
		background-position: 160% center;
	}
	20% {
		background-position: 160% center;
	}
	80% {
		background-position: -20% center;
	}
	100% {
		background-position: -20% center;
	}
}

.placeholder-t {
	border-radius: 105px;
	background-color: #002e70;
	height: 14px;
	margin-bottom: 15px;
	position: relative;
}

.placeholder-extra {
	position: absolute;
	bottom: 0px;
	padding: 3px 5px;
	border-top: 1px solid rgba(230, 230, 230, 1);
	border-left: 1px solid rgba(230, 230, 230, 1);
	border-right: 1px solid rgba(230, 230, 230, 1);
	color: rgba(230, 230, 230, 1);
}

.placeholder-extra .ph-icon {
	color: #757575;
	font-size: 16px;
}

.placeholder-extra .line {
	display: inline-block;
	width: 50px;
	height: 14px;
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
	margin-left: 5px;
	margin-right: 5px;
}

.placeholder-w {
	margin-bottom: 14px;
	position: relative;
}

.placeholder-w .line {
	display: inline-block;
	border-radius: 10px;
	background-color: rgba(170, 170, 170, 1);
	width: 30px;
	height: 14px;
	width: 25%;
	margin-right: 10px;
}

.placeholder-w span:first-of-type {
	margin-right: 5px;
}

.ph-icon {
	font-size: 14px;
	padding-right: 5px;
	background-color: white;
}

.placeholder-s {
	height: 60px;
	width: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 10px 0px;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
	margin-left: -3px;
	position: relative;
}

.result-image-wrapper.skeleton {
	background-color: rgba(170, 170, 170, 1);
}

.placeholder-s > div {
	display: block;
	height: 14px;
	margin: 0px 3px;
	width: 100%;
}

.ph-span {
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
	display: inline-block;
	height: 14px;
	position: relative;
}

@media (min-width: 640px) {
	.information {
		text-overflow: ellipsis;
		width: calc(100% - (200px + 30px));
		overflow: hidden;
		max-width: 100%;
	}
}

@media (min-width: 800px) {
	.container {
		height: 120px;
	}
	.result-image-wrapper {
		height: initial;
	}
	.summary {
		position: initial;
		top: 0px;
	}
	.title {
		max-width: calc(100% - (200px - 60px));
	}

	.result-image-wrapper {
		position: relative;
		left: -20px;
	}

	.result-item-wrapper {
		padding: 00px 0px 0px 20px;
		border-left: 1px solid rgba(230, 230, 230, 1);
	}

	.backfade {
		background: white;
		z-index: 0;
		opacity: 0;
		box-shadow:
			rgba(0, 0, 0, 0.05) 0px 2px 1px,
			rgba(0, 0, 0, 0.04) 0px 4px 2px,
			rgba(0, 0, 0, 0.03) 0px 8px 4px,
			rgba(0, 0, 0, 0.02) 0px 16px 8px,
			rgba(0, 0, 0, 0.01) 0px 32px 16px;
		position: absolute;
		top: 0px;
		left: 0px;
		width: calc(100%);
		height: calc(100%);
		pointer-events: none;
		visibility: hidden; /* Initially hidden */
		transition:
			opacity 0.3s ease-in-out,
			visibility 0s linear 0.3s; /* Delay visibility hiding */
	}

	.result-item-wrapper.data:hover .backfade {
		opacity: 0.6;
		visibility: visible; /* Show immediately */

		transition:
			opacity 0.3s ease-in-out,
			visibility 0s linear 0s; /* Make visible immediately */
	}
}

@media (min-width: 1340px) {
	.result-item-wrapper {
		padding-right: 0px;
	}
	.result-image-wrapper {
		position: relative;
		left: 0px;
	}

	.backfade {
		left: 0px;
		width: calc(100%);
		width: calc(100% + 20px);
		box-shadow:
			rgba(0, 0, 0, 0.05) 0px 2px 1px,
			rgba(0, 0, 0, 0.04) 0px 4px 2px,
			rgba(0, 0, 0, 0.03) 0px 8px 4px,
			rgba(0, 0, 0, 0.02) 0px 16px 8px,
			rgba(0, 0, 0, 0.01) 0px 32px 16px;
	}
}
</style>
