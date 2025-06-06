<template>
	<div :class="expanderOpen ? 'expand-container open' : 'expand-container'">
		<TimelineHeadline
			ref="headlineRef"
			:headline="headline"
			:icon="icon"
			:subline="subline"
			:click="toggleExpander"
			:open="expanderOpen"
			:item-array="itemArray"
			:pass-update="passAlongUpdate"
			:filter-cuttof="filterNameCutoff"
			:use-translation="useHeadlineTranslation"
		></TimelineHeadline>
		<div
			ref="expandContainer"
			:class="fade ? 'expander fade' : 'expander'"
		>
			<slot></slot>
		</div>
		<div class="expander-toggle">
			<button
				:class="expanderOpen ? 'toggle-button open' : 'toggle-button closed'"
				:data-testid="addTestDataEnrichment('button', 'custom-expander', `${headline}-status-toggle`, 0)"
				:title="expanderOpen ? 'Close options' : 'Open options'"
				:aria-expanded="expanderOpen"
				@click="toggleExpander($event)"
			>
				{{ expanderOpen ? '-' : '+' }}
			</button>
		</div>
		<div class="dotted-line"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from 'vue';
import gsap from 'gsap';
import TimelineHeadline from '@/components/common/TimelineHeadline.vue';
import { SelectorData } from '@/types/TimeSearchTypes';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

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
					height: props.fade ? '65px' : '0px',
					duration: 0.5,
					overwrite: true,
					paddingBottom: '0px',
					opacity: props.fade ? 1 : 0,
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
					onComplete: () => {
						headlineRef.value.$el.focus();
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
			if (expandContainer.value !== null) {
				props.fade ? (expandContainer.value.style.opacity = '1') : null;
				props.fade ? (expandContainer.value.style.height = '65px') : null;
				props.fade ? (expandContainer.value.style.display = 'block') : null;
			}
		});

		return { expanderOpen, toggleExpander, expandContainer, passAlongUpdate, addTestDataEnrichment, headlineRef };
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
	z-index: 1;
	position: relative;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	/* border-bottom: 2px dashed rgba(0, 46, 112, 0.3490196078); */
	background-color: var(--showWhite);
	background: linear-gradient(
		90deg,
		rgba(250, 250, 250, 1) 0%,
		rgba(255, 255, 255, 1) 15%,
		rgba(255, 255, 255, 1) 50%,
		rgba(255, 255, 255, 1) 85%,
		rgba(250, 250, 250, 1) 100%
	);
	transition: all 0.15s linear 0s;
}
.time-facets .container div.expand-container {
	background: linear-gradient(
		90deg,
		rgba(217, 245, 254, 1) 0%,
		rgba(217, 245, 254, 1) 15%,
		rgba(217, 245, 254, 1) 50%,
		rgba(217, 245, 254, 1) 85%,
		rgba(217, 245, 254, 1) 100%
	);
}
.time-facets .container div.expand-container:hover {
	background: linear-gradient(
		90deg,
		rgba(217, 245, 254, 1) 0%,
		rgba(255, 255, 255, 1) 15%,
		rgba(255, 255, 255, 1) 50%,
		rgba(255, 255, 255, 1) 85%,
		rgba(217, 245, 254, 1) 100%
	);
}
.time-facets .container div.expand-container.open {
	background: linear-gradient(
		90deg,
		rgba(217, 245, 254, 1) 0%,
		rgba(255, 255, 255, 1) 15%,
		rgba(255, 255, 255, 1) 50%,
		rgba(255, 255, 255, 1) 85%,
		rgba(217, 245, 254, 1) 100%
	);
}

.expand-container.open {
	background: linear-gradient(
		90deg,
		rgba(250, 250, 250, 1) 0%,
		rgba(255, 255, 255, 1) 15%,
		rgba(255, 255, 255, 1) 50%,
		rgba(255, 255, 255, 1) 85%,
		rgba(250, 250, 250, 1) 100%
	);
}
.expand-container.open .dotted-line {
	opacity: 1;
}
.expand-container.open:before {
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(10, 46, 112, 1) 25%,
		rgba(10, 46, 112, 1) 75%,
		rgba(255, 255, 255, 0) 100%
	);
	height: 2px;
	opacity: 0.9;
}

.dotted-line {
	z-index: -1;
	border-top: 1px dashed rgb(250, 250, 250);
	display: block;
	width: 100%;
	height: 1px;
	position: relative;
	top: 12px;
	background: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(10, 46, 112, 1) 25%,
		rgba(10, 46, 112, 1) 75%,
		rgba(255, 255, 255, 0) 100%
	);
	opacity: 0.2;
	transition: all 0.15s linear 0s;
}
/*Blue-border-top*/
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
	height: 2px;
	opacity: 0.55;
}
/*Shadow*/
.expand-container:after {
	transition: all 0.2s ease-in 0s;
	width: 100%;
	content: '';
	display: block;
	position: relative;
	bottom: 0px;
	height: 10px;
	opacity: 0.5;
	z-index: -1;
	background: radial-gradient(ellipse at bottom, #b6b5b5b0 0%, #dfdfdfb0 40%, #ffffff00 70%);
}

.expand-container.open:after {
	transition: all 0.2s ease-in 0s;
	opacity: 0.4;
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

	left: 50vw;
	position: relative;
	transform: translate(-30px, 0px);
}

.toggle-button {
	z-index: 5;
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
	margin-top: 45px;
	transition: all 0.15s linear 0s;
}

.toggle-button:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-bottom: 10px solid #0a2e70;
	position: relative;
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
	position: relative;
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
		background: linear-gradient(
			90deg,
			rgba(250, 250, 250, 1) 0%,
			rgba(255, 255, 255, 0) 35%,
			rgba(255, 255, 255, 0) 50%,
			rgba(255, 255, 255, 0) 65%,
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
		opacity: 0.3;
	}
	.expand-container:hover {
		background: linear-gradient(
			90deg,
			rgba(250, 250, 250, 1) 0%,
			rgba(255, 255, 255, 1) 15%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 1) 85%,
			rgba(250, 250, 250, 1) 100%
		);
	}
	.expand-container:hover:before {
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(10, 46, 112, 1) 25%,
			rgba(10, 46, 112, 1) 75%,
			rgba(255, 255, 255, 0) 100%
		);
		height: 2px;
		opacity: 0.9;
	}
	.expand-container:hover:after {
		opacity: 0.4;
	}
	.expand-container:hover .dotted-line {
		opacity: 0.4;
	}
	.expand-container.open .toggle-button:hover {
		margin-top: 41px;
	}
	.expand-container.open .dotted-line {
		opacity: 1;
	}
	.dotted-line {
		opacity: 0;
	}
}
</style>
