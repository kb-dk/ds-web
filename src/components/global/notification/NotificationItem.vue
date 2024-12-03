<template>
	<li
		ref="notificationBox"
		:class="[
			notification.userClose ? 'single-notification user' : 'single-notification passing',
			notification.severity === Severity.ERROR
				? 'high-severity'
				: notification.severity === Severity.SUCCESS
				  ? 'low-severity'
				  : 'info-severity',
		]"
		@mouseenter="pauseAnimation"
		@mouseleave="resumeAnimation"
	>
		<h3>
			<span class="title-span">
				<span
					v-if="notification.severity === Severity.SUCCESS"
					class="material-icons"
				>
					check
				</span>
				<span
					v-if="notification.severity === Severity.ERROR"
					class="material-icons"
				>
					warning
				</span>
				<span
					v-if="notification.severity === Severity.INFO"
					class="material-icons"
				>
					info
				</span>
				{{ notification.key ? $t(notification.title) : notification.title }}
			</span>
			<span
				v-if="notification.userClose"
				class="material-icons close"
				:aria-label="$t('notification.close')"
				@click="close(notification)"
			>
				close
			</span>
		</h3>
		<p>{{ notification.key ? $t(notification.desc) : notification.desc }}</p>
		<div
			v-if="!notification.userClose"
			class="timer-max"
		>
			<div
				ref="countdown"
				class="timer"
			></div>
			<span class="material-icons">pause</span>
		</div>
	</li>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
import { NotificationType, Severity } from '@/types/NotificationType';

export default defineComponent({
	name: 'NotificationItem',

	props: {
		notification: { type: Object as PropType<NotificationType>, required: true },
		close: { type: Function, required: true },
	},
	setup(props) {
		const { t } = useI18n();
		const duration = { time: 2 };
		const countdown = ref<HTMLDivElement | null>(null);

		let notificationAnimation: null | gsap.core.Tween;

		onMounted(() => {
			if (!props.notification.userClose) {
				notificationAnimation = gsap.to(countdown.value, {
					duration: duration.time,
					width: '0%',
					ease: 'linear',
					onComplete: () => {
						props.close(props.notification);
					},
				});
			}
		});

		const pauseAnimation = () => {
			if (notificationAnimation) {
				notificationAnimation.pause();
			}
		};

		const resumeAnimation = () => {
			if (notificationAnimation) {
				notificationAnimation.play();
			}
		};

		return { t, countdown, pauseAnimation, resumeAnimation, Severity };
	},
});
</script>

<style lang="scss" scoped>
.single-notification {
	pointer-events: all;
	display: flex;
	flex-direction: column;
	height: auto;
	min-height: 100px;
	margin-top: 15px;
	margin-right: 15px;
	padding-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 18px;
	box-shadow: 0 5px 15px -7px rgba(30, 30, 30, 0.6);
	box-sizing: border-box;
	justify-content: space-between;
	width: 100%;
}

.single-notification p {
	white-space: break-spaces;
}

.title-span {
	font: normal normal normal 26px/28px Noway;
	white-space: nowrap;
}
.title-span span {
	font-size: 30px;
	vertical-align: text-bottom;
}

.single-notification:hover .timer-max {
	background-color: #17171780;
	transition: all 0.3s ease 0s;
}
.timer-max span {
	opacity: 0;
	display: block;
	position: absolute;
	float: right;
	right: 0;
}
.single-notification:hover .timer-max span {
	opacity: 100%;
	color: rgba(255, 255, 255, 0.8);
	font-size: 26px;
	-webkit-text-stroke-width: 1px;
	-webkit-text-stroke-color: #17171780;
	transition: opacity 0.4s;
}

.timer {
	width: 100%;
	height: 24px;
	position: relative;
}

.timer-max {
	background-color: #1717172e;
	margin-left: -10px;
	width: calc(100% + 20px);
	display: flex;
	flex-direction: row;
}

.close {
	position: relative;
	float: right;
	border: 0;
	font-size: 30px;
	cursor: pointer;
	transition: all 0.3s ease-in-out 0s;
	width: 30px;
	height: 30px;
	padding: 0;
	z-index: 100;
	vertical-align: text-bottom;
}

.close-border {
	background-color: #002e70;
	position: absolute;
	width: 32px;
	height: 32px;
	z-index: -2;
	margin-left: -1px;
	margin-top: -1px;
	top: 0;
	transform: scale(0);
	transition: all 0.1s cubic-bezier(0.09, 0.77, 0.94, 0.58) 0s;
	transform-origin: bottom left;
}

.close:hover .close-border {
	transform: scale(1);
}

.close:before {
	content: '';
	display: block;
	position: absolute;
	width: 28px;
	height: 28px;
	z-index: -1;
	margin-left: 1px;
	margin-top: 1px;
	top: 0;
}

h3 {
	margin: 0;
}

.title-span {
	max-width: 90%;
	z-index: 90;
}
.low-severity {
	background-color: #49da87;
	color: #002e70;
	border: 1px solid #002e70;
}
.high-severity {
	background-color: #b30018;
	color: white;
	border: 1px solid white;
}

.info-severity {
	background-color: white;
	color: #002e70;
	border: 1px solid #002e70;
}

.high-severity .close {
	color: white;
}

.high-severity .close:before {
	background-color: #b30018;
}

.timer-max {
	border-top: 1px solid #002e70;
}

.high-severity .timer-max {
	border-top: 1px solid white;
}

.timer {
	background-color: #002e70;
}

.high-severity .timer {
	background-color: white;
}
</style>
