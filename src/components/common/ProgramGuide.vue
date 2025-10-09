<template>
	<div class="daily-program">
		<div class="extra-features">
			<button
				:class="dailyProgramExpanded ? 'guide-button active' : 'guide-button'"
				:title="`${$t('search.programGuide')} - ${creator} ${startDate}`"
				:data-testid="addTestDataEnrichment('button', 'program-guide', `show-programguide`, 0)"
				@click="showProgramGuide()"
			>
				<span class="material-icons calendar-view-icon">view_day</span>
				{{ `${$t('search.programGuide')} - ${creator}, ${startDate}` }}
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
				bg="transparent"
				item-class="extra-program"
				:display-slider-arrows="true"
				:visible="dailyProgramExpanded"
				:current-element="extraContentCurrentRef"
				bg-scroll-blue="true"
			>
				<template #default="slotProps">
					<div class="hour-display">
						<div
							v-for="hour in 24"
							:key="hour"
							class="hour"
							:style="{ width: `${calcProgramMinutes('1:00:00')}px` }"
						>
							{{ `| ${hour - 1 < 10 ? `0${hour - 1}` : hour - 1}:00` }}
						</div>
						<div class="hour">| 24:00</div>
					</div>
					<div class="program-display">
						<div
							v-for="(item, index) in recordsForTheDay"
							:key="item.id"
							class="extra-program"
						>
							<div
								v-if="index === 0"
								:title="$t('search.noGuideContent')"
								class="between-program"
								:style="{
									width: `${getProgramWidth(`first-between-programs`) - 8}px`,
									marginRight: getProgramWidth(`first-between-programs`) > 0 ? '8px' : '0px',
								}"
							>
								<div class="between-program-content">
									<span class="material-icons">remove</span>
									{{ `${getProgramWidth(`first-between-programs`) > 60 ? $t('search.noGuideContent') : ''} ` }}
								</div>
							</div>
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
								:title="`${$t('search.title')} - ${item.title[0]}\n${$t('search.startTime')} - ${
									item.temporal_start_time_da_string
								}`"
								class="programs"
								:style="{ width: `${getProgramWidth(`programs${index}`) - 8}px` }"
								:data-testid="addTestDataEnrichment('link', 'additional-info', `individual-program-${item.id}`, index)"
							>
								<div class="program-text">
									<span class="material-icons">
										{{ item.origin.split('.')[1] === 'tv' ? 'play_circle_filled' : 'volume_up' }}
									</span>
									{{ item.title[0] }}
								</div>
								<div class="program-text">
									<span class="material-icons">schedule</span>
									{{ item.temporal_start_time_da_string.slice(0, 5) }}
								</div>
							</router-link>
							<div
								v-if="index === recordsForTheDay.length - 1"
								class="between-program test"
								:style="{
									width: `${getProgramWidth(`between-programs${index}`) - 8}px`,
									marginRight: getProgramWidth(`between-programs${index}`) > 0 ? '8px' : '0px',
								}"
							>
								<div
									:title="$t('search.noGuideContent')"
									class="between-program-content"
								>
									<span class="material-icons">remove</span>
									{{ `${getProgramWidth(`between-programs${index}`) > 60 ? $t('search.noGuideContent') : ''} ` }}
								</div>
							</div>
							<div
								v-if="index < recordsForTheDay.length - 1"
								:title="$t('search.noGuideContent')"
								class="between-program"
								:style="{
									width: `${getProgramWidth(`between-programs${index}`) - 8}px`,
									marginRight: getProgramWidth(`between-programs${index}`) > 0 ? '8px' : '0px',
								}"
							>
								<div class="between-program-content">
									<span class="material-icons">remove</span>
									{{ `${getProgramWidth(`between-programs${index}`) > 60 ? $t('search.noGuideContent') : ''} ` }}
								</div>
							</div>
						</div>
						<div
							v-if="recordsForTheDay.length === 0"
							class="extra-program"
						>
							<div
								class="between-program"
								:style="{ width: '8640px' }"
							>
								<div class="between-program-content">
									<span class="material-icons">remove</span>
									{{ $t('error.infoError.programGuide') }}
								</div>
							</div>
						</div>
					</div>
				</template>
			</ItemSlider>
		</div>
		<div class="hors-dot">•</div>
	</div>
</template>

<script lang="ts">
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ComponentPublicInstance, defineComponent, onUnmounted, PropType, ref, watch } from 'vue';
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
	setup(props) {
		const dailyProgramExpanded = ref(false);
		const extraContentRef = ref<HTMLElement | null>(null);
		const extraContentCurrentRef = ref<Array<ComponentPublicInstance<HTMLElement> | null>>([]);
		const programSliderRef = ref<HTMLElement | null>(null);
		const router = useRouter();
		const shortPrograms = ref<Array<number>>([]);
		const programWidth = ref<Map<string, number>>(new Map());
		const showProgramGuide = () => {
			dailyProgramExpanded.value = !dailyProgramExpanded.value;
			if (dailyProgramExpanded.value === true) {
				gsap.set(extraContentRef.value, {
					display: 'flex',
				});
			}

			gsap.to(extraContentRef.value, {
				height: dailyProgramExpanded.value ? '175px' : '0px',
				opacity: dailyProgramExpanded.value ? '1' : '0',
				paddingTop: dailyProgramExpanded.value ? '20px' : '0px',
				paddingBottom: dailyProgramExpanded.value ? '12px' : '0px',
				duration: 0.5,
				ease: 'expo.inOut',
				onComplete: () => {
					if (dailyProgramExpanded.value === false) {
						gsap.set(extraContentRef.value, {
							display: 'none',
						});
					}
				},
			});
		};
		//We make exceptions for 38. 38 would be what anything below 5 minutes.
		//Each minutes is 6 pixels. And then we have a padding of 8 pixels.
		const calcMinutesBetween = (p1: GenericSearchResultType, p2: GenericSearchResultType | null, key: string) => {
			if (p2 === null) {
				let minutesBetween = calcProgramMinutes(p1.temporal_start_time_da_string);

				if (minutesBetween < 38 && minutesBetween > 0) {
					const addedAmount = 38 - minutesBetween;
					minutesBetween += addedAmount;
					shortPrograms.value.push(addedAmount);
				}
				programWidth.value.set(key, minutesBetween - checkIfProgramReduction(minutesBetween));
			} else {
				let minutesBetween =
					calcProgramMinutes(p2.temporal_start_time_da_string) - calcProgramMinutes(p1.temporal_end_time_da_string);
				if (minutesBetween < 38 && minutesBetween > 0) {
					const addedAmount = 38 - minutesBetween;
					minutesBetween += addedAmount;
					shortPrograms.value.push(addedAmount);
				}
				programWidth.value.set(key, minutesBetween - checkIfProgramReduction(minutesBetween));
			}
		};
		//We calculate how many minutes for a timestamp hh:MM:ss. we round up from 30 seconds.
		//We wish for the length of the programs are so each minute is 6 pixels.
		const calcProgramMinutes = (programTime: string) => {
			const time = programTime.split(':').map((v) => {
				return Number(v);
			});
			const minutes = (time[time.length - 1] >= 30 ? 1 : 0) + time[1] + time[0] * 60;
			return minutes * 6;
		};
		//We get the duration in ms. So we calculate it to minutes.
		const calcProgramDurationMinutes = (program: GenericSearchResultType, key: string) => {
			const durationMinutes = Number(program.duration_ms) / 1000 / 60;
			let durationWidth = Math.round(durationMinutes) * 6;
			if (durationWidth < 38) {
				const addedAmount = 38 - durationWidth;
				durationWidth += addedAmount;
				shortPrograms.value.push(addedAmount);
			}
			programWidth.value.set(key, durationWidth - checkIfProgramReduction(durationWidth));
		};
		const calcProgramGuideEnd = (program: GenericSearchResultType, key: string) => {
			const latestTime = calcProgramMinutes(program.temporal_end_time_da_string);
			const endTime = calcProgramMinutes('23:59:59');
			let minutesBetween = 0;

			if (latestTime < endTime) {
				if (endTime - latestTime > 0) {
					minutesBetween = endTime - latestTime;
					minutesBetween -= checkIfProgramReduction(minutesBetween);
				}
			}

			programWidth.value.set(key, minutesBetween);
		};
		const checkIfProgramReduction = (currentWidth: number) => {
			if (currentWidth > 65) {
				if (shortPrograms.value[0]) {
					const reduceBy = shortPrograms.value[0];
					shortPrograms.value.shift();
					return reduceBy;
				}
			}
			return 0;
		};
		const getProgramWidth = (key: string) => {
			const width = programWidth.value.get(key);

			return width ? width : 0;
		};
		watch(
			() => props.recordsForTheDay,
			() => {
				for (let i = 0; i < props.recordsForTheDay.length; i++) {
					if (i === 0) {
						calcMinutesBetween(props.recordsForTheDay[i], null, `first-between-programs`);
					}
					calcProgramDurationMinutes(props.recordsForTheDay[i], `programs${i}`);
					if (
						i === props.recordsForTheDay.length - 1 &&
						props.recordsForTheDay[i].temporal_end_time_da_string !== '00:00:00'
					) {
						calcProgramGuideEnd(props.recordsForTheDay[i], `between-programs${i}`);
					} else {
						calcMinutesBetween(props.recordsForTheDay[i], props.recordsForTheDay[i + 1], `between-programs${i}`);
					}
				}
			},
		);
		onUnmounted(() => {
			dailyProgramExpanded.value = false;
		});

		return {
			dailyProgramExpanded,
			calcProgramDurationMinutes,
			extraContentRef,
			router,
			showProgramGuide,
			addTestDataEnrichment,
			calcMinutesBetween,
			extraContentCurrentRef,
			programSliderRef,
			calcProgramGuideEnd,
			calcProgramMinutes,
			shortPrograms,
			programWidth,
			getProgramWidth,
		};
	},
});
</script>

<style scoped>
.guide-button {
	cursor: pointer;
	border: 1px solid rgba(230, 230, 230, 1);
	border-radius: 0px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #002e70;
	transition:
		all 0.3s ease-in-out 0s,
		margin-bottom 0s linear 0s;
	top: 1px;
	position: relative;
	padding: 10px 5px 11px 15px;
	width: fit-content;
	font-size: 18px;
	border-radius: var(--Rounded-md, 4px) var(--Rounded-md, 4px) 0 0;
	border: 1px solid #002e70;
	background-color: #f0fbff;
}
.guide-button.active {
	background-color: #00255a;
	color: white;
}
.guide-button:hover {
	background-color: #c4f1ed;
	color: #0a2e70;
}
.daily-program {
	--bg-color: #ffffff;

	color: #323232;
	border-bottom: 1px solid rgba(230, 230, 230, 1);
	margin-bottom: 10px;
	margin-left: 20px;
	margin-right: 20px;
	background-color: transparent;
}

.daily-program button {
	font-family: noway, sans-serif;
}
.daily-program:hover .hors-dot {
	transform: translate(-50%, 0) scale3d(1.9, 1.9, 1.9);
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0s;
}
.hors-dot {
	position: absolute;
	height: 10px;
	text-align: center;
	color: #002e70;
	transform: translate(-50%, -0%) scale3d(1.2, 1.2, 1.2);
	left: 50%;
	width: 20px;
	line-height: 0.5;
	margin-top: -3px;
	transform-origin: center;
	will-change: transform;
	background-color: transparent;
	z-index: 1;
	transition:
		transform 0.3s ease-in-out 0s,
		background-color 0.1s ease-in-out 0.2s;
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
	position: relative;
	padding-right: 5px;
}
.expand-icon.turned {
	transform: rotateX(0.5turn);
}
.programs {
	margin-top: 15px;
	height: 60px;
	border: 1px solid white;
	box-sizing: border-box;
	word-break: keep-all;
	overflow: hidden;
	background-color: white;
	color: #0a2e70;
	text-align: center;
	text-decoration: none;
	margin-left: 1px;
	transition: all 0.25s linear 0s;
	padding: 2px 2px 2px 8px;
	margin-right: 8px;
	font-size: 18px;
	border-radius: 4px;
	white-space: nowrap;
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
	width: 0px;
	margin-top: 15px;
	height: 60px;
	background-color: rgb(196, 196, 196);
	border-radius: 4px;
}
.between-program-content {
	font-size: 18px;
	max-width: 100%;
	width: fit-content;
	height: 100%;
	position: -webkit-sticky;
	position: sticky;
	left: 30px;
	overflow: hidden;
	white-space: nowrap;
	text-decoration: none;
	word-break: keep-all;
	justify-content: center;
	display: flex;
	align-items: center;
	color: #757575;
	box-sizing: border-box;
}
.between-program-content > .material-icons {
	text-align: center;
	margin-left: auto;
	margin-right: auto;
	color: #002e70;
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
	background-color: #f3f3f3;
	position: relative;
	box-sizing: border-box;
	padding: 20px 0px 12px 0px;
	box-shadow: 0 0 14px 0 rgba(153, 153, 153, 0.34) inset;
}

.extra-program {
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
	user-drag: none;
	overflow: visible;
}
.program-display {
	display: flex;
	flex-direction: row;
	align-items: start;
}
.program-text {
	display: flex;
	align-items: center;
	text-align: left;
}
.program-text > .material-icons {
	font-size: 18px;
	margin-right: 2px;
	justify-content: center;
}
.calendar-view-icon {
	font-size: 18px;
	margin-right: 6px;
}
.same-time-program {
	display: flex;
	flex-direction: column;
}
.extra-program.disabled {
	pointer-events: none;
}

.extra-program .img-wrap {
	margin-bottom: 10px;
	height: 105px;
	margin-top: 20px;
}

.extra-program .img-stamp {
	text-align: center;
	font-size: 12px;
	color: white;
	height: 15px;
	position: relative;
}
.extra-program:hover .link-arrow {
	opacity: 1;
	transform: translateX(5px);
}
.hour-display {
	height: 1.5em;
	display: flex;
	flex-direction: row;
	color: #002e70;
	user-select: none;
}
.hour-display > * {
	font-size: clamp(1rem, 2vw, 2em);
	font-size: 16px;
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

@media (min-width: 640px) {
	.daily-program {
		margin-left: 0px;
		margin-right: 0px;
	}
}

@media (min-width: 800px) {
	.program-button {
		width: auto;
		margin-bottom: 0px;
	}
	.program-button.active {
		margin-bottom: 0px;
	}
}
</style>
