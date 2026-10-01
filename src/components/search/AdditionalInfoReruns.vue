<template>
	<div class="extra-content-container">
		<div
			ref="extraContentRef"
			class="extra-content"
		>
			<div
				v-for="(item, index) in reruns"
				:key="index"
				class="rerun"
			>
				<router-link
					:to="{ path: 'post/' + item.id }"
					class="title"
					:data-testid="addTestDataEnrichment('link', 'addition-info-reruns', `top-link`, index)"
					:title="`${item.title} ${t('record.aired')} ${getStartTime(item)}`"
				>
					<p class="label-regular">
						<span
							:aria-label="t('search.rerun', 1)"
							role="image"
							class="material-icons rerun-icon"
						>
							content_copy
						</span>
						<span class="when">{{ getStartTime(item) }}</span>

						<span>
							<span
								class="material-icons arrow"
								aria-hidden="true"
							>
								keyboard_arrow_right
							</span>
						</span>
					</p>
					<div class="subtitle">
						<div class="subtitle-metadata">
							<span
								role="img"
								:class="`icons schedule material-icons ${item.origin.split('.')[1] === 'tv' ? 'playSVG' : 'volumeSVG'}`"
								:aria-label="`${item.origin.split('.')[1] === 'tv' ? t('record.tvChannel') : t('record.radioChannel')}`"
							>
								{{ item.origin.split('.')[1] === 'tv' ? 'play_circle' : 'volume_up' }}
							</span>
							<p class="label-small">
								<span class="where">{{ item.creator_affiliation + ',' }}</span>
								<span class="broadcast-title">{{ item.title ? item.title[0] : t('app.titles.unknown') }}</span>
							</p>
						</div>
						<div class="subtitle-metadata">
							<div
								role="img"
								class="material-icons icons schedule timeSVG"
								:aria-label="t('app.a11y.broadcastDuration')"
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
								class="material-icons episode-split-icon"
								aria-hidden="true"
							>
								segment
							</span>
							<p class="label-small">
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
				</router-link>
			</div>
			<div
				v-if="reruns.length > 5"
				class="rerun-info"
			>
				<p>{{ t('search.rerunInfo', { rerunCount: reruns.length }) }}</p>
			</div>
		</div>
		<div
			class="vert-dot"
			:class="{ visible: open }"
			aria-hidden="true"
		>
			•
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref, watch } from 'vue';
import gsap from 'gsap';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { convertSecondstoShow } from '@/utils/time-utils';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { type GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { formatDuration, getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';

export default defineComponent({
	name: 'AdditionalInfoReruns',
	props: {
		id: { type: String, required: true },
		fileId: { type: String, required: true },
		open: { type: Boolean, required: true },
		reruns: { type: Array as PropType<GenericSearchResultType[]>, required: true },
	},
	setup(props) {
		const { t, locale } = useI18n();
		const errorManager = inject('errorManager') as ErrorManagerType;
		const rerunsData = ref([] as GenericSearchResultType[]);
		const router = useRouter();
		const extraContentRef = ref<HTMLElement | null>(null);
		const thumbnailRefs = ref<HTMLAnchorElement[]>([]);
		const showReruns = () => {
			if (props.open) {
				gsap.set(extraContentRef.value, {
					display: 'block',
				});
			}
			gsap.to(extraContentRef.value, {
				height: props.open ? 'auto' : '0px',
				opacity: props.open ? '1' : '0',
				marginBottom: props.open ? '20px' : '0px',
				duration: 0.2,
				onComplete: () => {
					if (!props.open) {
						gsap.set(extraContentRef.value, {
							display: 'none',
						});
					}
				},
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
		watch(
			() => props.open,
			() => {
				showReruns();
			},
		);
		return {
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
.rerun:hover {
	transition: background-color 0.3s linear;
	background-color: var(--bg-main-light-20);
}
.rerun:hover .arrow {
	opacity: 1;
}
.extra-content-container {
	position: relative;
}
.extra-content-container:hover .vert-dot {
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
	color: var(--bg-default);
	transform: translate(-50%, -0%) scale3d(1.2, 1.2, 1.2);
	top: 50%;
	width: 11px;
	line-height: 1;
	margin-top: -5px;
	left: 0px;
	display: none;
	background: var(--bg-backdrop);
	z-index: 1;
}
.title {
	text-decoration: none;
	margin-top: 0;
	display: block;
}
.title > .label-regular {
	transition: all 0.5s ease-in-out 0s;
	color: var(--color-default);
	text-overflow: ellipsis;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	margin-top: 5px;
	position: relative;
	display: block;
	margin-bottom: 3px;
}
.title > .label-regular .rerun-icon {
	font-size: var(--fs-meta);
}
.extra-content {
	height: 0px;
	margin-bottom: 0px;
	overflow: hidden;
	display: none;
	position: relative;
	border-left: 1px solid rgba(230, 230, 230, 1);
	padding-bottom: 15px;
	padding-left: 10px;
	padding-top: 5px;
	box-shadow: inset 0 0 5px rgba(230, 230, 230, 1);
}

.rerun {
	padding: 5px 5px 15px 5px;
	box-sizing: border-box;
	border-bottom: 1px solid transparent;
}
.subtitle {
	color: var(--color-default);
	display: flex;
	flex-direction: column;
}
.subtitle-metadata {
	border-bottom: 1px solid transparent;
	display: flex;
}
.subtitle-metadata > .label-small,
.subtitle-metadata > .label-small-bold {
	margin: 0;
}
.duration,
.broadcast-title {
	padding-right: 10px;
	text-overflow: ellipsis;
}
.when,
.where {
	padding-right: 5px;
	text-overflow: ellipsis;
}
.when,
.rerun-info {
	padding-left: 5px;
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
