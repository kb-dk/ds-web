<template>
	<li
		:class="notification.userClose ? 'single-notification user' : 'single-notification passing'"
		@mouseenter="pauseAnimation"
		@mouseleave="resumeAnimation"
	>
		<h3>
			<span class="title-span">
				<span class="material-icons">check</span>
				{{ notification.key ? $t(notification.title) : notification.title }}
			</span>
			<button
				v-if="notification.userClose"
				class="close"
				:aria-label="$t('notification.close')"
				@click="close(notification)"
			>
				&times;
				<div class="close-border"></div>
			</button>
		</h3>
		<p>{{ notification.key ? $t(notification.desc) : notification.desc }}</p>
		<div class="timer-max">
			<div
				v-if="!notification.userClose"
				ref="countdown"
				class="timer"
			></div>
			<span class="material-icons">pause</span>
		</div>
	</li>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'NotificationItem',

	props: {
		notification: { type: Object, required: true },
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

		return { t, countdown, pauseAnimation, resumeAnimation };
	},
});
</script>

<style lang="scss" scoped>
.single-notification {
	pointer-events: all;
	display: flex;
	flex-direction: column;
	background-color: #49da87;
	width: 330px;
	max-width: 330px;
	height: auto;
	min-height: 100px;
	margin-top: 15px;
	margin-right: 15px;
	padding-top: 10px;
	padding-left: 10px;
	padding-right: 10px;
	font-size: 20px;
	color: #002e70;
	border: 1px solid #002e70;
	white-space: nowrap;
	box-shadow: 0 5px 15px -7px rgba(30, 30, 30, 0.6);
	box-sizing: border-box;
	justify-content: space-between;
}
.title-span {
	font: normal normal normal 26px/28px Noway;
}
.title-span span {
	font-size: 30px;
	vertical-align: text-bottom;
}

.single-notification:hover .timer-max {
	background-color: #17171780;
}
.timer-max span {
	display: none;
}
.single-notification:hover .timer-max span {
	display: block;
	position: absolute;
	float: right;
	right: 0;
	color: rgba(255, 255, 255, 0.8);
	font-size: 26px;
}

.timer {
	width: 100%;
	height: 24px;
	background-color: #002e70;
	position: relative;
}

.timer-max {
	background-color: #1717172e;
	border-top: 1px solid #002e70;
	margin-left: -10px;
	width: calc(100% + 20px);
	display: flex;
	flex-direction: row;
}

.close {
	position: relative;
	float: right;
	border: 0;
	background-color: #fff6c4;
	font-size: 25px;
	top: -5px;
	margin-right: -5px;
	cursor: pointer;
	transition: all 0.3s ease-in-out 0s;
	width: 30px;
	height: 30px;
	padding: 0;
	z-index: 2;
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
	background-color: #fff6c4;
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
}
</style>
