<template>
	<div class="daily-program">
		<div class="extra-features">
			<button
				:class="dailyProgramExpanded ? 'guide-button active' : 'guide-button'"
				:title="`${$t('search.programGuide')} - ${creator} ${startDate}`"
				:data-testid="addTestDataEnrichment('button', 'program-guide', `show-programguide`, 0)"
				@click="showThumbnails()"
			>
				{{ `${creator} ${startDate}` }}
				<span :class="dailyProgramExpanded ? 'material-icons expand-icon turned' : 'material-icons expand-icon'">
					expand_more
				</span>
			</button>
		</div>
		<div
			ref="extraContentRef"
			class="extra-content"
		>
			<ItemSlider
				ref="programSliderRef"
				:padding="true"
				bg="#f0fbff"
				item-class="extra-thumbnail"
				:display-slider-arrows="true"
				:visible="dailyProgramExpanded"
				:current-element="extraContentCurrentRef"
			>
				<template #default="slotProps">
					<div class="hour-display">
						<div
							v-for="hour in 25"
							:key="hour"
						>
							{{ `| ${hour - 1}:00` }}
						</div>
					</div>
					<div class="program-display">
						<div
							v-for="(item, index) in recordsForTheDay"
							:key="item.id"
							class="extra-thumbnail"
						>
							<div
								v-if="index === 0"
								class="between-program"
								:style="{ width: `${calcMinutesBetween(item, null) * 6 - 2}px` }"
							></div>
							<router-link
								v-if="
									index === recordsForTheDay.length - 1 ||
									(index < recordsForTheDay.length - 1 && item.startTime !== recordsForTheDay[index + 1].startTime)
								"
								v-bind="slotProps"
								:ref="`${currentRecordIndex === index ? 'extraContentCurrentRef' : ''}`"
								:class="{ 'programs-current': currentRecordIndex === index }"
								draggable="false"
								:to="{ name: 'Record', params: { id: item.id }, query: { autoplay: true } }"
								role="link"
								:title="item.title[0]"
								class="programs"
								:style="{ width: `${calcProgramDurationMinutes(item) * 6 - 2}px` }"
								:replace="router.currentRoute.value.name === 'Record' ? true : false"
								:data-testid="
									addTestDataEnrichment('link', 'additional-info', `individual-thumbnail-${'item.id'}`, index)
								"
							>
								{{ item.title[0] }}
							</router-link>
							<div
								v-if="index === recordsForTheDay.length - 1"
								class="between-program test"
								:style="{ width: `${calcProgramGuideEnd(item) * 6 - 2}px` }"
							></div>
							<div
								v-if="index < recordsForTheDay.length - 1"
								class="between-program"
								:style="{ width: `${calcMinutesBetween(item, recordsForTheDay[index + 1]) * 6 - 2}px` }"
							></div>
						</div>
					</div>
				</template>
			</ItemSlider>
		</div>
	</div>
</template>

<script lang="ts">
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ComponentPublicInstance, computed, defineComponent, onUnmounted, PropType, ref, watch } from 'vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import gsap from 'gsap';
import ItemSlider from '@/components/search/ItemSlider.vue';
import { useRouter } from 'vue-router';
export default defineComponent({
	name: 'ProgramGuide',
	components: {
		ItemSlider,
	},
	props: {
		recordsForTheDay: {
			type: Array as PropType<GenericSearchResultType[]>,
			required: false,
			default() {
				return [];
			},
		},
		currentRecordIndex: {
			type: Number,
			required: false,
			default() {
				return -1;
			},
		},
		startDate: {
			type: String,
			required: true,
		},
		creator: {
			type: String,
			required: true,
		},
	},
	setup() {
		const dailyProgramExpanded = ref(false);
		const extraContentRef = ref<HTMLElement | null>(null);
		const extraContentCurrentRef = ref<Array<ComponentPublicInstance<HTMLElement> | null>>([]);
		const programSliderRef = ref<HTMLElement | null>(null);
		const router = useRouter();
		const showThumbnails = () => {
			dailyProgramExpanded.value = !dailyProgramExpanded.value;
			if (dailyProgramExpanded.value === true) {
				gsap.set(extraContentRef.value, {
					display: 'flex',
				});
			}

			gsap.to(extraContentRef.value, {
				height: dailyProgramExpanded.value ? 'auto' : '0px',
				opacity: dailyProgramExpanded.value ? '1' : '0',
				marginBottom: dailyProgramExpanded.value ? '20px' : '0px',
				duration: 0.2,
				onComplete: () => {
					if (dailyProgramExpanded.value === false) {
						gsap.set(extraContentRef.value, {
							display: 'none',
						});
					}
				},
			});
		};
		const calcMinutesBetween = (p1: GenericSearchResultType, p2: GenericSearchResultType | null) => {
			if (p2 === null) {
				return calcProgramMinutes(p1.temporal_start_time_da_string);
			} else {
				const minutesBetween =
					calcProgramMinutes(p2.temporal_start_time_da_string) - calcProgramMinutes(p1.temporal_end_time_da_string);
				return minutesBetween;
			}
		};
		const calcProgramMinutes = (programTime: string) => {
			const time = programTime.split(':').map((v) => {
				return Number(v);
			});
			const minutes = (time[time.length - 1] >= 50 ? 1 : 0) + time[1] + time[0] * 60;
			return minutes;
		};
		const calcProgramDurationMinutes = (program: GenericSearchResultType) => {
			const durationMinutes = Number(program.duration_ms) / 1000 / 60;
			return Math.round(durationMinutes);
		};
		const calcProgramGuideEnd = (program: GenericSearchResultType) => {
			const minutesBetween = calcProgramMinutes('23:59:59') - calcProgramMinutes(program.temporal_end_time_da_string);
			return minutesBetween;
		};
		onUnmounted(() => {
			dailyProgramExpanded.value = false;
		});
		const timelapseImage = computed(() => {
			return new URL(`@/assets/images/timegoes.svg`, import.meta.url).href;
		});

		return {
			dailyProgramExpanded,
			calcProgramDurationMinutes,
			extraContentRef,
			router,
			showThumbnails,
			timelapseImage,
			addTestDataEnrichment,
			calcMinutesBetween,
			extraContentCurrentRef,
			programSliderRef,
			calcProgramGuideEnd,
		};
	},
});
</script>

<style scoped>
.guide-button {
	cursor: pointer;
	border: 1px solid rgba(230, 230, 230, 1);
	border-radius: 0px;
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #002e70;
	transition:
		all 0.3s ease-in-out 0s,
		margin-bottom 0s linear 0s;
	top: 1px;
	position: relative;
	padding: 5px 15px;
	width: fit-content;
	font-size: 18px;
}
.daily-program-expanded {
	overflow-y: hidden;
	width: 100%;
	max-height: 20em;
	animation: expand-programs 0.8s none;
}
.daily-program-expanded > * > * {
	flex-wrap: nowrap;
	width: 100%;
}
.daily-program-expanded > * > * > * {
	max-width: 13em;
}
.daily-program-closed {
	animation: close-programs 0.5s none;
}
.expand-icon {
	transition: all 0.3s ease-in-out 0s;
	padding-right: 5px;
}
.expand-icon.turned {
	transform: rotateZ(180deg);
}
.programs {
	margin-top: 15px;
	height: 3em;
	background-color: #0a2e70;
	border: 1px solid white;
	box-sizing: border-box;
	word-break: keep-all;
	overflow: hidden;
	color: white;
	text-align: center;
	text-decoration: none;
	margin-left: 1px;
	transition: all 0.25s linear 0s;
	margin-right: 1px;
}
.programs:hover {
	background-color: #c4f1ed;
	color: #0a2e70;
	border: 1px solid #0a2e70;
}
.programs-current {
	background-color: #c4f1ed;
	color: #0a2e70;
	border: 1px solid #0a2e70;
}
.between-program {
	height: 2em;
}

.time-slider {
	flex-direction: column;
	align-items: flex-start;
}

.extra-content {
	height: 0px;
	margin-bottom: 0px;
	overflow: hidden;
	display: none;
	padding-bottom: 10px;
	background-color: #f0fbff;
	position: relative;
	border: 1px solid #0a2e70;
	box-sizing: border-box;
}
.extra-content:after {
	z-index: 1;
	display: block;
	content: '';
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	pointer-events: none;
}
.extra-thumbnail {
	position: relative;
	z-index: 1;
	object-fit: none;
	display: flex;
	pointer-events: all;
	text-decoration: none;
	color: #002e70;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	-webkit-user-drag: none;
	-moz-user-drag: none;
	-ms-user-drag: none;
	-o-user-drag: none;
	user-drag: none;
}
.program-display {
	display: flex;
	flex-direction: row;
}
.same-time-program {
	display: flex;
	flex-direction: column;
}
.extra-thumbnail.disabled {
	pointer-events: none;
}

.extra-thumbnail .img-wrap {
	margin-bottom: 10px;
	height: 105px;
	margin-top: 20px;
}

.extra-thumbnail .img-stamp {
	text-align: center;
	font-size: 12px;
	color: white;
	height: 15px;
	position: relative;
}
.extra-thumbnail:hover .link-arrow {
	opacity: 1;
	transform: translateX(5px);
}
.hour-display {
	height: 1.5em;
	display: flex;
	flex-direction: row;
	color: #002e70;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
}
.hour-display > * {
	font-size: clamp(1rem, 2vw, 2em);
	font-size: 16px;
	width: 360px;
}
.hour-display > *:last-child {
	width: 50px;
}

@keyframes expand-programs {
	0% {
		max-height: 0em;
	}
	100% {
		max-height: 20em;
	}
}
@keyframes close-programs {
	0% {
		height: 20em;
	}
	100% {
		height: 0em;
	}
}
@media (min-width: 800px) {
	.thumbnail-button {
		width: auto;
		margin-bottom: 0px;
	}
	.thumbnail-button.active {
		margin-bottom: 0px;
	}
	.extra-content {
		width: calc(100% - 20px);
	}
}

@media (min-width: 1340px) {
	.extra-content {
		width: 100%;
	}
}
</style>
