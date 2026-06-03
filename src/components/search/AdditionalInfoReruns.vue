<template>
	<div class="extra-content-container">
		<div
			ref="extraContentRef"
			class="extra-content"
		>
			<div
				v-for="(item, index) in rerunsData"
				:key="index"
				role="link"
				class="rerun"
				:replace="router.currentRoute.value.name === 'Record' ? true : false"
			>
				<router-link
					:to="{ path: 'post/' + item.id }"
					class="title"
					role="link"
					:data-testid="addTestDataEnrichment('link', 'addition-info-reruns', `top-link`, index)"
					:title="item.title"
				>
					<p class="label-regular-bold">
						{{ item.title[0] }}
						<span>
							<div
								role="img"
								class="material-icons arrow"
								:aria-label="t('app.a11y.goToPost')"
							>
								keyboard_arrow_right
							</div>
						</span>
					</p>
				</router-link>

				<div class="subtitle">
					<div class="subtitle-metadata">
						<span
							role="img"
							:class="`icons schedule material-icons ${item.origin.split('.')[1] === 'tv' ? 'playSVG' : 'volumeSVG'}`"
							:aria-label="t('app.a11y.broadcastTimeAndPlace')"
						>
							{{ item.origin.split('.')[1] === 'tv' ? 'play_circle_filled' : 'volume_up' }}
						</span>
						<p class="label-small">
							<span class="where">{{ item.creator_affiliation + ',' }}</span>
							<span class="when">{{ getStartTime(item) }}</span>
						</p>
					</div>
					<div class="subtitle-metadata">
						<div
							role="img"
							class="material-icons icons schedule timeSVG"
							:aria-label="t('app.a11y.broadcastDuration')"
							aria-hidden="true"
						>
							schedule
						</div>
						<p class="label-small">
							<span class="duration">{{ getDuration(item) }}</span>
						</p>
					</div>
					<div
						v-if="item.episode"
						class="episode subtitle-metadata"
					>
						<span
							role="img"
							class="material-icons episode-split-icon"
						>
							segment
						</span>
						<p class="label-small-bold">
							<span class="episode-text">
								{{ `${t('search.episode')} ${item.episode}` }}
							</span>
							<span
								v-if="item.number_of_episodes"
								class="episode-text"
							>
								{{ `:${item.number_of_episodes}` }}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div
			class="vert-dot"
			:class="{ visible: open }"
		>
			•
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { APIService } from '@/api/api-service';
import gsap from 'gsap';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { convertSecondstoShow } from '@/utils/time-utils';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { type GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { formatDuration, getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';
export default defineComponent({
	name: 'AdditionalInfoReruns',
	props: {
		id: { type: String, required: true },
		fileId: { type: String, required: true },
		open: { type: Boolean },
	},
	setup(props) {
		const { t, locale } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const extraContentShown = ref(false);
		const rerunsData = ref([] as GenericSearchResultType[]);
		const router = useRouter();

		const extraContentRef = ref<HTMLElement | null>(null);
		const thumbnailRefs = ref<HTMLAnchorElement[]>([]);

		const showReruns = () => {
			console.log('WORKING?');

			extraContentShown.value = !extraContentShown.value;
			if (props.fileId && extraContentShown.value) {
				if (rerunsData.value.length === 0) {
					requestExtraReruns();
				}
			}
			if (extraContentShown.value === true) {
				gsap.set(extraContentRef.value, {
					display: 'block',
				});
			}
			gsap.to(extraContentRef.value, {
				height: extraContentShown.value ? 'auto' : '0px',
				opacity: extraContentShown.value ? '1' : '0',
				marginBottom: extraContentShown.value ? '20px' : '0px',
				duration: 0.2,
				onComplete: () => {
					if (extraContentShown.value === false) {
						gsap.set(extraContentRef.value, {
							display: 'none',
						});
					}
				},
			});
		};

		const requestExtraReruns = () => {
			APIService.getMoreLikeThisRecords(props.id)
				.then((moreLikeThis) => {
					rerunsData.value = moreLikeThis.data.response.docs;
				})
				.catch(() => {
					errorManager.submitCustomError(
						'reruns-error',
						t('error.infoError.title'),
						t('error.infoError.thumbnails'),
						Severity.INFO,
						false,
						Priority.LOW,
					);
				});
		};
		const getStartTime = (resultItem: GenericSearchResultType) => {
			return resultItem.startTime !== undefined
				? `${getBroadcastDate(resultItem.startTime as string, locale.value)} 
				${t('record.timestamp')}${getBroadcastTime(resultItem.startTime as string)}`
				: t('record.noBroadcastData');
		};
		const getDuration = (resultItem: GenericSearchResultType) => {
			return resultItem ? formatDuration(resultItem.duration, resultItem.startTime, resultItem.endTime, t) : '';
		};
		onMounted(() => {
			watch(
				() => props.id,
				(newVal: string, oldVal: string) => {
					if (newVal !== oldVal) {
						rerunsData.value = [];
						extraContentShown.value = false;
					}
				},
			);

			if (props.open) {
				showReruns();
			}
		});
		watch(
			() => props.open,
			() => {
				showReruns();
			},
		);
		return {
			extraContentShown,
			showReruns,
			extraContentRef,
			thumbnailRefs,
			convertSecondstoShow,
			router,
			t,
			errorManager,
			addTestDataEnrichment,
			rerunsData,
			getStartTime,
			getDuration,
		};
	},
});
</script>
<style scoped>
.icons {
	font-size: 16px;
	padding-right: 3px;
	position: relative;
	top: 3px;
}
.arrow {
	font-weight: bold !important;
	top: 3px;
	position: relative;
	transition: opacity 0.1s linear 0s;
	font-size: 16px;
	opacity: 0;
}
.rerun:hover .arrow {
	opacity: 1;
}
.extra-content-container {
	position: relative;
}
.extra-content-container:hover .vert-dot {
	background-color: transparent;
	transform: translate(-50%, 0) scale3d(1.9, 1.9, 1.9);
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0s;
}
.vert-dot.visible {
	display: block;
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0.2s;
}
.vert-dot {
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
	background: transparent;
	z-index: 1;
}
.title {
	text-decoration: none;
	margin-top: 0;
}
.title > .label-regular-bold {
	transition: all 0.5s ease-in-out 0s;
	color: #002e70;
	text-overflow: ellipsis;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	margin-top: 5px;
	position: relative;
	display: block;
	margin-bottom: 3px;
	color: #002e70;
}
.extra-content {
	height: 0px;
	margin-bottom: 0px;
	overflow: hidden;
	display: none;
	background-color: #f3f3f3;
	position: relative;
	border-left: 1px solid rgba(230, 230, 230, 1);
	padding-bottom: 5px;
	padding-left: 10px;
}

.rerun {
	padding: 5px;
}
.subtitle {
	display: flex;
	flex-direction: column;
}
.subtitle-metadata {
	display: flex;
}
.subtitle-metadata > .label-small,
.subtitle-metadata > .label-small-bold {
	margin: 0;
}
.where,
.when,
.duration {
	padding-right: 5px;
	text-overflow: ellipsis;
}
.when {
	padding-right: 20px;
}

.duration {
	padding-right: 20px;
}
.episode-text {
	color: #002e70;
}
.episode-split-icon {
	padding-right: 3px;
	position: relative;
	top: 2px;
	font-size: 16px;
}
@media (min-width: 640px) {
	.subtitle {
		display: flex;
		flex-direction: row;
	}
}
</style>
