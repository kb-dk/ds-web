<template>
	<simple-spot
		:spot-size="spotSize"
		:color="color"
		:icon-name="iconName"
	>
		<transition name="fade">
			<div
				v-show="authStore.currentArchiveProgress !== 0"
				class="hero-info"
			>
				<div class="info">
					<div class="progress-headline">
						<h2>{{ t('hero.progress', { index: Math.round(currentProgress) }) }}</h2>
						<p>
							{{ t('hero.explanation') }}
						</p>
					</div>
					<div class="process-bar">
						<div
							v-for="i in 20"
							:key="i"
							:class="progress(i)"
						></div>
					</div>
				</div>
			</div>
		</transition>
	</simple-spot>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import SimpleSpot from '@/components/common/SimpleSpot.vue';
import { useAuthStore } from '@/store/authStore';
import gsap from 'gsap';
import { useI18n } from 'vue-i18n';
type SpotSizeType = 'small' | 'medium' | 'large' | 'max';
type ColorType = 'main' | 'light';
export default defineComponent({
	name: 'AdvancedSpot',
	components: { SimpleSpot },
	props: {
		spotSize: {
			type: String as PropType<SpotSizeType>,
			required: true,
		},
		color: {
			type: String as PropType<ColorType>,
			default() {
				return 'main';
			},
		},
		iconName: {
			type: String,
			default() {
				return '';
			},
		},
	},
	setup() {
		const currentProgress = ref();
		const authStore = useAuthStore();
		const { t } = useI18n();
		onMounted(() => {
			if (authStore.currentArchiveProgress !== 0) {
				currentProgress.value = authStore.currentArchiveProgress;
			}
		});

		const progress = (index: number) => {
			const maxRange = 20;
			let pt = Math.round((maxRange / 100) * currentProgress.value);
			if (index < pt) return 'step darkblue';
			if (index === pt) return 'step darkblue';
			if (index === pt + 1) return 'step blue';
			if (index === pt + 2) return 'step lightblue';
			if (index === pt + 3) return 'step grey';
			if (index === pt + 4) return 'step lightgrey';
			if (index > pt + 4) return 'step white';
		};

		watch(
			() => authStore.currentArchiveProgress,
			(newVal: number) => {
				if (newVal !== 0) {
					gsap.to(currentProgress, {
						value: authStore.currentArchiveProgress,
						duration: 2,
						ease: 'power2.out',
						snap: { value: 1 },
					});
				}
			},
		);
		return { authStore, progress, currentProgress, t };
	},
});
</script>

<style scoped>
.progress-headline > * {
	margin: 0;
}

.hero-info {
	max-width: 100%;
	/* position: relative; */
	z-index: 0;
	display: flex;
	box-sizing: border-box;
	height: 150px;
	justify-content: flex-start;
}

.info {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.hero-info .link-container {
	font-weight: 100;
}

.process-bar {
	height: 34px;
	display: flex;
	position: absolute;
	width: 100%;
	left: 0px;
	bottom: 0px;
	background-color: var(--bg-default);
}

.step {
	width: 5%;
	height: 100%;
	box-sizing: border-box;
	border-left: 1px solid rgba(255, 255, 255, 0.05);
	transition: all 0.15s ease-in-out 0s;
}

.step.darkblue {
	background-color: var(--bg-main);
}
.step.blue {
	background-color: var(--bg-main);
	opacity: 0.95;
}

.step.lightblue {
	background-color: var(--bg-main);
	opacity: 0.85;
}

.step.grey {
	background-color: var(--bg-main);
	opacity: 0.75;
}

.step.lightgrey {
	background-color: var(--bg-main);
	opacity: 0.7;
}

.step.white {
	background-color: transparent;
	border-color: transparent;
}
</style>
