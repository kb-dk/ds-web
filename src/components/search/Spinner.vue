<template>
	<div>
		<transition name="fade">
			<div
				v-if="spinnerStore.spinner"
				class="spinner"
			>
				<div class="spinner-cube"></div>
				<div class="spinner-cube-shadow"></div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSpinnerStore } from '@/store/spinner';

export default defineComponent({
	name: 'Spinner',

	setup() {
		const spinnerStore = useSpinnerStore();
		return { spinnerStore };
	},
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.spinner {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	background-color: rgba(30, 30, 30, 0.6);
	z-index: 70;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
}

.spinner-cube {
	width: 30px;
	height: 30px;
	background-color: white;
	border-radius: 3px;
	animation-timing-function: cubic-bezier(0.88, 0.88, 0.24, 0.24);
	animation: bounce 2500ms infinite;
	z-index: 5;
}

.spinner-cube-shadow {
	width: 50px;
	height: 50px;
	background-color: rgba(30, 30, 30, 1);
	opacity: 0.5;
	position: absolute;
	border-radius: 250px;
	margin-top: 35px;
	transform: perspective(100px) rotateX(75deg);
	animation-timing-function: cubic-bezier(0.88, 0.88, 0.24, 0.24);
	animation: shadow-bounce 2500ms infinite;
}

@keyframes shadow-bounce {
	0% {
		transform: perspective(100px) rotateX(75deg) scale(1);
	}
	20% {
		transform: perspective(100px) rotateX(75deg) scale(1.1);
	}
	30% {
		transform: perspective(100px) rotateX(75deg) scale(0.6);
	}
	75% {
		transform: perspective(100px) rotateX(75deg) scale(1);
	}
	90% {
		transform: perspective(100px) rotateX(75deg) scale(1);
	}
}

@keyframes bounce {
	0% {
		transform: translateY(0px) rotateZ(0deg) scaleY(1) scaleX(1);
		transform-origin: center bottom;
	}
	20% {
		transform: translateY(0px) rotateZ(0deg) scaleY(0.6) scaleX(1.1);
		transform-origin: center bottom;
	}
	30% {
		transform: translateY(-50px) rotateZ(45deg) scaleY(1) scaleX(1);
		transform-origin: center center;
	}
	75% {
		transform: translateY(0px) rotateZ(90deg) scaleY(1) scaleX(1);
		transform-origin: center center;
	}
	75.001% {
		transform: translateY(0px) rotateZ(0deg) scaleY(1) scaleX(1);
	}
	/* 80% {
		transform: translateY(0px) rotateZ(0deg) scaleX(1.2) scaleY(0.8);
		animation-timing-function: linear;
	} */
	90% {
		transform: translateY(0px) rotateZ(0deg) scaleZ(1) scaleY(1);
		transform-origin: center bottom;
	}
}
</style>
