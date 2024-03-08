<template>
	<li
		@mouseenter="pauseAnimation"
		@mouseleave="resumeAnimation"
		:class="notification.userClose ? 'single-notification user' : 'single-notification passing'"
	>
		<h3>
			<span class="title-span">{{ notification.key ? $t(notification.title) : notification.title }}</span>
			<button
				class="close"
				v-if="notification.userClose"
				@click="close(notification)"
				:aria-label="$t('notification.close')"
			>
				&times;
				<div class="close-border"></div>
			</button>
		</h3>
		<p>{{ notification.key ? $t(notification.desc) : notification.desc }}</p>
		<div
			ref="countdown"
			v-if="!notification.userClose"
			class="timer"
		></div>
	</li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { gsap } from 'gsap';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'NotificationItem',
	data: () => ({
		duration: { time: 2, delay: 0 },
		notificationAnimation: null as null | GSAPTween,
	}),

	props: {
		notification: { type: Object, required: true },
		close: { type: Function, required: true },
	},
	setup() {
		const { t } = useI18n();
		return { t };
	},
	mounted() {
		const countdown: HTMLDivElement = this.$refs.countdown as HTMLDivElement;

		if (!this.notification.userClose) {
			this.notificationAnimation = gsap.to(countdown, {
				duration: this.duration.time,
				width: '0%',
				ease: 'linear',
				onComplete: () => {
					this.close(this.notification);
					console.log('removing notification!', this.notification);
				},
			});
		}
	},
	methods: {
		pauseAnimation() {
			if (this.notificationAnimation) {
				this.notificationAnimation.pause();
			}
		},

		resumeAnimation() {
			if (this.notificationAnimation) {
				this.notificationAnimation.play();
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.single-notification {
	pointer-events: all;
	background-color: #fff6c4;
	width: 300px;
	max-width: 300px;
	height: auto;
	min-height: 100px;
	margin-top: 15px;
	padding: 10px;
	box-shadow: 0px 5px 15px -7px rgba(30, 30, 30, 0.6);
	box-sizing: border-box;
}

.timer {
	width: calc(100% + 20px);
	margin-left: -10px;
	height: 4px;
	background-color: #002e70;
	position: relative;
	top: 10px;
}

.close {
	position: relative;
	float: right;
	border: 0px;
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
	top: 0px;
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
	top: 0px;
}

h3 {
	margin: 0;
}

.title-span {
	max-width: 90%;
}
</style>
