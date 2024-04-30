<template>
	<div :class="searchResultStore.loading ? 'result-item-wrapper' : 'result-item-wrapper data'">
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
							:to="{ path: 'record/' + resultdata.id }"
							class="title"
							role="link"
						>
							{{ resultdata.title[0] }}
							<span class="material-icons arrow">keyboard_arrow_right</span>
						</router-link>
						<div class="subtitle">
							<span class="material-icons icons schedule">{{ resultdata.origin.split('.')[1] }}</span>
							<span class="where">{{ resultdata.creator_affiliation[0] + ',' }}</span>
							<span class="when">{{ starttime }}</span>
							<span class="material-icons icons schedule">schedule</span>
							<span class="duration">{{ duration }}</span>
						</div>
						<div class="summary">{{ resultdata.description }}</div>
					</div>
					<router-link
						:to="{ path: 'record/' + resultdata.id }"
						class="result-image-wrapper"
						role="link"
					>
						<kb-imagecomponent :imagedata="imageData"></kb-imagecomponent>
					</router-link>
				</div>
				<AdditionalInfo
					:id="resultdata.id"
					:file-id="resultdata.file_id ? resultdata.file_id : ''"
					:duration="Number(resultdata.duration_ms)"
				></AdditionalInfo>
			</div>
			<div
				v-else
				class="loading container"
			>
				<div
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div>
				<div class="information">
					<div
						ref="placeholderTitleRef"
						class="placeholder-t"
						:style="`width:${Math.random() * 30 + 30 + '%'}`"
					></div>
					<div class="placeholder-w">
						<span
							v-for="n in 2"
							ref="placeholderSubtitleRefs"
							:key="n"
							:style="`width:${Math.random() * 10 + 10 + '%'}`"
						></span>
					</div>
					<div class="placeholder-s">
						<span
							v-for="n in 15"
							:key="n"
							ref="placeholderSummaryRefs"
							:style="`width:${Math.random() * 10 + 10 + '%'}`"
						></span>
					</div>
				</div>
				<div class="result-image-wrapper skeleton"></div>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ImageComponentType } from '@/types/ImageComponentType';
import { APIService } from '@/api/api-service';
import AdditionalInfo from '@/components/search/AdditionalInfo.vue';
import '@/components/common/wc-image-item';

export default defineComponent({
	name: 'ResultItem',
	components: {
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
		//Default imageData obj to prevent render issues
		const imageData = ref(
			JSON.stringify({
				imgSrc: '',
				altText: '',
				imgTitle: '',
				placeholder: undefined,
			} as ImageComponentType),
		);
		const placeholderSummaryRefs = ref<HTMLElement | []>([]);
		const placeholderSubtitleRefs = ref<HTMLElement | []>([]);
		const placeholderTitleRef = ref<HTMLElement | null>(null);

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

		return {
			searchResultStore,
			imageData,
			placeholderSubtitleRefs,
			placeholderSummaryRefs,
			placeholderTitleRef,
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
	border-bottom: 1px solid rgba(230, 230, 230, 1);
}

.arrow {
	font-weight: bold !important;
	top: 2px;
	position: relative;
	opacity: 0;
	transition: opacity 0.1s linear 0s;
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
.icons {
	padding-right: 3px;
	position: relative;
	top: 3px;
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
	flex-direction: row;
	height: 105px;
	justify-content: space-between;
	gap: 30px;
	width: 100%;
}

.information {
	text-overflow: ellipsis;
	width: calc(100% - (200px + 30px));
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

.result-image-wrapper {
	width: 200px;
}

.where,
.when,
.duration {
	padding-right: 5px;
	text-overflow: ellipsis;
	font-size: 14px;
}

.loading {
	width: 100vw;
	max-width: 100%;
	height: 105px;
	flex-direction: row;
	height: 105px;
	justify-content: space-between;
	gap: 30px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(230, 230, 230, 1);
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
	max-width: 97%;
	height: 105px;
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
	background-color: rgba(170, 170, 170, 1);
	height: 20px;
	margin-bottom: 7px;
}

.placeholder-w span {
	display: inline-block;
	border-radius: 10px;
	background-color: rgba(170, 170, 170, 1);
	width: 30px;
	height: 16px;
	width: 25%;
}

.placeholder-w span:first-of-type {
	margin-right: 5px;
}

.placeholder-s {
	height: 60px;
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 5px 0px;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
	margin-left: -3px;
}

.placeholder-s span {
	margin: 0px 3px;
}

.result-image-wrapper.skeleton {
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
}

.placeholder-s span {
	display: inline-block;
	border-radius: 10px;
	background-color: rgba(170, 170, 170, 1);
	height: 14px;
	line-height: 20px; /* fallback for firefox */
	max-height: calc(20px); /* fallback for firefox */
	width: 90%;
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
}

@media (min-width: 800px) {
	.title {
		max-width: calc(100% - (200px - 60px));
	}

	.result-image-wrapper {
		position: relative;
		left: -20px;
	}

	.result-item-wrapper {
		padding: 20px 0px 0px 20px;
		border-left: 1px solid rgba(230, 230, 230, 1);
	}

	.result-item-wrapper.data:before {
		transition: all 0.3s ease-in-out 0s;
		content: '';
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
	}

	.result-item-wrapper.data:hover:before {
		opacity: 1;
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

	.result-item-wrapper.data:before {
		left: 0px;
		width: calc(100%);
		width: calc(100% + 20px);
		box-shadow:
			rgba(0, 0, 0, 0.09) 0px 2px 1px,
			rgba(0, 0, 0, 0.09) 0px 4px 2px,
			rgba(0, 0, 0, 0.09) 0px 8px 4px,
			rgba(0, 0, 0, 0.09) 0px 16px 8px,
			rgba(0, 0, 0, 0.09) 0px 32px 16px;
	}
}
</style>
