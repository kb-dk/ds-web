<template>
	<div :class="expanderOpen ? 'expand-container open' : 'expand-container'">
		<TimelineHeadline
			:headline="headline"
			:icon="icon"
			:subline="subline"
			:click="toggleExpander"
		></TimelineHeadline>
		<div
			ref="expandContainer"
			class="expander"
		>
			<slot></slot>
		</div>
		<div class="expander-toggle">
			<button
				:class="expanderOpen ? 'toggle-button open' : 'toggle-button closed'"
				@click="toggleExpander()"
			>
				{{ expanderOpen ? '-' : '+' }}
			</button>
		</div>
		<div class="dotted-line"></div>
	</div>
</template>

<script lang="ts">
import { onUnmounted } from 'vue';
import { defineComponent, onMounted, ref, PropType } from 'vue';
import gsap from 'gsap';
import TimelineHeadline from '@/components/common/TimelineHeadline.vue';

export default defineComponent({
	name: 'CustomExpander',
	components: {
		TimelineHeadline,
	},
	props: {
		headline: {
			type: String as PropType<string>,
			required: true,
		},
		icon: {
			type: String as PropType<string>,
			required: true,
		},
		subline: {
			type: String as PropType<string>,
			required: true,
		},
	},

	setup() {
		const expanderOpen = ref(false);
		const expandContainer = ref<HTMLElement | null>(null);

		const toggleExpander = () => {
			if (expanderOpen.value) {
				gsap.to(expandContainer.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
					paddingBottom: '0px',
					opacity: 0,
					onComplete: () => {
						gsap.set(expandContainer.value, {
							display: 'none',
							overwrite: true,
						});
					},
				});
			} else {
				gsap.set(expandContainer.value, {
					display: 'block',
					overwrite: true,
					onComplete: () => {
						gsap.to(expandContainer.value, {
							height: 'auto',
							duration: 0.5,
							overwrite: true,
							paddingBottom: '10px',
							opacity: 1,
						});
					},
				});
			}
			expanderOpen.value = !expanderOpen.value;
		};

		onMounted(() => {
			console.log('mounted');
		});

		onUnmounted(() => {
			console.log('unmounted');
		});

		return { expanderOpen, toggleExpander, expandContainer };
	},
});
</script>
<style scoped>
@property --showWhite {
	syntax: '<color>';
	initial-value: rgba(255, 255, 255, 0);
	inherits: false;
}

.expand-container {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	border-bottom: 2px dashed rgba(0, 46, 112, 0.3490196078);
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		var(--showWhite) 5%,
		var(--showWhite) 95%,
		rgba(255, 255, 255, 0) 100%
	);
	transition: --showWhite 0.5s;
}
.expand-container.open {
	--showWhite: rgba(255, 255, 255, 1);
}

.dotted-line {
	z-index: 1;
	display: block;
	width: 100%;
	height: 2px;
	position: relative;
	top: 12px;
	background: linear-gradient(
		90deg,
		rgba(250, 250, 250, 1) 0%,
		rgba(255, 255, 255, 0) 5%,
		rgba(255, 255, 255, 0) 95%,
		rgba(250, 250, 250, 1) 100%
	);
}

.expand-container:before {
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(10, 46, 112, 1) 5%,
		rgba(10, 46, 112, 1) 95%,
		rgba(255, 255, 255, 0) 100%
	);
	content: '';
	display: block;
	width: 100%;
	height: 1px;
}

.expand-container:after {
	transition: all 0.2s ease-in 0s;
	width: 100%;
	content: '';
	display: block;
	position: relative;
	bottom: 0px;
	height: 10px;
	opacity: 1;
	z-index: -1;
	background: radial-gradient(ellipse at bottom, #b6b5b5b0 0%, #dfdfdfb0 40%, #ffffff00 70%);
}

.expand-container.open:after {
	transition: all 0.2s ease-in 0s;
	opacity: 0;
}

.expander {
	overflow: hidden;
	height: 0px;
	width: 100%;
	opacity: 0;
	display: none;
}

.expander-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	height: 0px;

	left: 50vw;
	position: relative;
	transform: translate(-30px, 0px);
}

.toggle-button {
	border: 0px solid transparent;
	cursor: pointer;
	background-color: transparent;
	padding: 10px 5px;
	width: 30px;
	height: 30px;
	background-color: #0a2e70;
	color: white;
	font-size: 24px;
	display: grid;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin-top: 30px;
}

.toggle-button:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-bottom: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: -40px;
	transition: all 0.15s ease-in-out 0s;
	transform: scaleY(0);
	transform-origin: bottom;
}

.toggle-button.open:before {
	transform: scaleY(1);
}

.toggle-button:after {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-top: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: 40px;
	transform: scaleY(0);
	transform-origin: top;
	transition: all 0.15s ease-in-out 0s;
}

.toggle-button.closed:after {
	transform: scaleY(1);
}

/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.expander-toggle {
		left: initial;
		position: initial;
		transform: initial;
	}
	.expand-container {
		justify-content: center;
	}
}
</style>
