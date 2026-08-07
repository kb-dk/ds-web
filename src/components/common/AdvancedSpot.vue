<template>
	<simple-spot
		:spot-size="spotSize"
		:color="color"
		:icon-name="iconName"
	>
		<TransitionGroup name="fade">
			<div
				v-show="authStore.currentArchiveProgress !== 0"
				class="process-bar"
			>
				<div
					v-for="i in 20"
					:key="i"
					:class="progress(i)"
				></div>
			</div>
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
				</div>
			</div>
		</TransitionGroup>
	</simple-spot>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, TransitionGroup, watch } from 'vue';
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
	display: flex;
	box-sizing: border-box;
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
	height: 40px;
	display: flex;
	width: calc(100% + 1px);
	position: absolute;
	left: 0px;
	top: -40px;
	background-color: var(--bg-default);
}

.step {
	width: 5%;
	height: 100%;
	box-sizing: border-box;
	border-left: 1px solid var(--bg-main);
	transition: all 0.15s ease-in-out 0s;
	position: relative;
	z-index: 1;
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
	z-index: 5;
	height: calc(100% + 2px);
	margin-top: -1px;
}

.step.grey {
	background-color: var(--bg-main);
	opacity: 0.75;
	z-index: 5;
	height: calc(100% + 2px);
	margin-top: -1px;
}

.step.lightgrey {
	background-color: var(--bg-main);
	opacity: 0.7;
	z-index: 5;
	height: calc(100% + 2px);
	margin-top: -1px;
}

.step.white {
	background-color: var(--bg-default);
	border-color: transparent;
	z-index: 5;
	height: calc(100% + 2px);
	margin-top: -2px;
}
</style>
