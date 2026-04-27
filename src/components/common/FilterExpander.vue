<template>
	<div :class="expanderOpen ? 'expand-container open' : 'expand-container'">
		<h3
			ref="headlineRef"
			class="headline"
			role="button"
			@click="toggleExpander($event)"
		>
			<span class="material-icons">{{ icon }}</span>
			{{ headline }}
		</h3>
		<div
			ref="expandContainer"
			:class="fade ? 'expander' : 'expander'"
		>
			<slot></slot>
		</div>
		<div class="expander-toggle">
			<button
				:class="expanderOpen ? 'toggle-button open' : 'toggle-button closed'"
				:data-testid="addTestDataEnrichment('button', 'custom-expander', `${headline}-status-toggle`, 0)"
				:title="expanderOpen ? 'Close' : 'Open'"
				:aria-expanded="expanderOpen"
				@click="toggleExpander($event)"
			>
				{{ expanderOpen ? '-' : '+' }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import gsap from 'gsap';
import { SelectorData } from '@/types/TimeSearchTypes';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'FilterExpander',
	components: {},
	props: {
		headline: {
			type: String as PropType<string>,
			required: true,
		},
		filterNameCutoff: {
			type: Number as PropType<number>,
			required: false,
			default() {
				return 3;
			},
		},
		icon: {
			type: String as PropType<string>,
			required: true,
		},
		subline: {
			type: String as PropType<string>,
			required: true,
		},
		fade: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: false,
		},
		itemArray: {
			type: Array as PropType<SelectorData[]>,
			required: false,
			default() {
				return [] as SelectorData[];
			},
		},
		facetType: {
			type: String as PropType<string>,
			required: false,
			default() {
				return '';
			},
		},
		updateEntity: {
			type: Function,
			default() {
				return null;
			},
		},
		useHeadlineTranslation: {
			type: Boolean,
			required: false,
			default() {
				return true;
			},
		},
	},

	setup(props) {
		const expanderOpen = ref(false);
		const expandContainer = ref<HTMLElement | null>(null);
		const headlineRef = ref();
		const passAlongUpdate = (parent: SelectorData[], index: number, val: boolean) => {
			props.updateEntity(parent, index, val, props.facetType);
		};

		const toggleExpander = (e: Event) => {
			e.stopPropagation();
			if (expanderOpen.value) {
				gsap.to(expandContainer.value, {
					height: '0px',
					duration: 0.35,
					overwrite: true,
					paddingBottom: '0px',
					backgroundColor: 'transparent',
					opacity: 0,
					onComplete: () => {
						gsap.set(expandContainer.value, {
							display: props.fade ? 'block' : 'none',
							overwrite: true,
						});
					},
				});
			} else {
				gsap.set(expandContainer.value, {
					display: 'block',
					overwrite: true,
					backgroundColor: '#CAF0FE1A',
					onComplete: () => {
						console.log(headlineRef.value);
						headlineRef.value.focus();
						gsap.to(expandContainer.value, {
							height: 'auto',
							duration: 0.35,
							overwrite: true,
							paddingBottom: '10px',
							opacity: 1,
						});
					},
				});
			}
			expanderOpen.value = !expanderOpen.value;
		};

		return { expanderOpen, toggleExpander, expandContainer, passAlongUpdate, addTestDataEnrichment, headlineRef };
	},
});
</script>
<style scoped>
.expand-container {
	z-index: 1;
	position: relative;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	transition: all 0.15s linear 0s;
	border-top: 1px solid #caf0fe;
	border-bottom: 1px solid #caf0fe;
	color: #0a2e70;
	box-sizing: border-box;
	height: auto;
	background-color: transparent;
}

.headline {
	width: 100%;
	padding: 0px;
	margin: 0px;
	height: 64px;
	display: flex;
	align-items: center;
	cursor: pointer;
	transition: all 0.5s linear 0s;
}

.headline:hover {
	transition: all 0.5s linear 0s;
	background-color: #caf0fe1a;
}

.expander {
	overflow: hidden;
	height: 0px;
	width: 100%;
	opacity: 0;
	display: none;
	position: relative;
}

.expand-container .expander.fade:before {
	pointer-events: none;
	content: '';
	display: block;
	width: 100%;
	height: 30px;
	background: linear-gradient(0deg, rgba(250, 250, 250, 1) 20%, rgba(255, 255, 255, 0) 100%);
	position: absolute;
	margin-top: 35px;
	z-index: 1;
	transition: all 0.1s linear 0.3s;
	opacity: 1;
}

.toggle-button:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 12px solid transparent;
	border-right: 12px solid transparent;
	border-bottom: 10px solid #0a2e70;
	position: relative;
	transition: all 0.15s ease-in-out 0s;
	transform: scaleY(0);
	transform-origin: bottom;
	top: -17px;
	left: 16px;
}

.expand-container.open {
	background-color: white;
}

.expand-container.open .expander {
	background-color: white;
}

.toggle-button.open:before {
	transform: scaleY(1);
}

.toggle-button:after {
	position: absolute;
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 12px solid transparent;
	border-right: 12px solid transparent;
	border-top: 10px solid #0a2e70;
	position: relative;
	transform: scaleY(0);
	transform-origin: top;
	transition: all 0.15s ease-in-out 0s;
	top: 17px;
	left: -18px;
}

.toggle-button.closed:after {
	transform: scaleY(1);
}

.expand-container.open .expander.fade:before {
	opacity: 0;
	transition: all 0.1s linear 0s;
}

.expander-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	height: 0px;
	left: 50%;
	position: relative;
	transform: translate(-30px, 0px);
}

.expander {
	overflow: hidden;
	height: 0px;
	width: 100%;
	opacity: 0;
	display: none;
	position: relative;
	background-color: transparent;
}

.toggle-button {
	z-index: 5;
	border: 0px solid transparent;
	cursor: pointer;
	background-color: transparent;
	padding: 10px 5px;
	width: 24px;
	height: 24px;
	background-color: #0a2e70;
	color: white;
	font-size: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	transition: all 0.15s linear 0s;
}
</style>
