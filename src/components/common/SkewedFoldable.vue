<template>
	<div
		ref="foldableRef"
		class="foldable-container"
	>
		<div
			:style="`background-color:${bg}`"
			:class="getTopClasses()"
		></div>
		<div
			:id="santizeAndSimplify(`foldable-${title}-${subtitle}`)"
			ref="contentRef"
			:style="`background-color:${bg}; color:${text}`"
			:class="alwaysExpand ? 'content' : 'content hide'"
		>
			<button
				ref="primaryButtonRef"
				class="mobile-title"
				:data-testid="addTestDataEnrichment('button', 'skewed-foldable', `btn-toggle-${title}`, 0)"
				:aria-label="title"
				:aria-expanded="foldableOpen"
				:aria-controls="santizeAndSimplify(`foldable-${title}-${subtitle}`)"
				@click="toggleContent()"
			>
				<div class="icon">
					<span
						:style="`color:${text}`"
						class="material-icons"
					>
						{{ icon }}
					</span>
				</div>
				<div
					:style="`color:${text}`"
					class="headline"
				>
					<h1>{{ title }}</h1>
					<span>{{ subtitle }}</span>
				</div>
			</button>
			<div :class="fullwidth ? 'responsive-title fullw' : 'responsive-title'">
				<div class="icon">
					<span class="material-icons">{{ icon }}</span>
				</div>
				<div class="headline">
					<h1>{{ title }}</h1>
					<span>{{ subtitle }}</span>
				</div>
			</div>
			<div
				ref="slotRef"
				class="slot"
			>
				<slot></slot>
			</div>
		</div>
		<div
			:style="`background-color:${bg}`"
			:class="getBottomClasses()"
		></div>
		<div class="foldable-toggle">
			<button
				:class="foldableOpen ? 'toggle-button open' : 'toggle-button closed'"
				:data-testid="addTestDataEnrichment('button', 'skewed-foldable', `${title}-status-toggle`, 0)"
				:title="foldableOpen ? 'Close' : 'Open'"
				:aria-controls="santizeAndSimplify(`foldable-${title}-${subtitle}`)"
				:aria-expanded="foldableOpen"
				@click="toggleContent()"
			>
				{{ foldableOpen ? '-' : '+' }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import gsap from 'gsap';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'SkewedFoldable',
	props: {
		bg: { type: String, default: 'white' },
		text: { type: String, default: 'black' },
		title: { type: String, default: 'Title' },
		subtitle: { type: String, default: '' },
		icon: { type: String, default: 'schedule' },
		fullwidth: { type: Boolean, default: false },
		alwaysExpand: { type: Boolean, default: false },
		left: { type: Boolean, default: false },
		showHeadlineInDesktop: { type: Boolean, default: true },
		dashedBottom: { type: Boolean, default: false },
		shadowBottom: { type: Boolean, default: false },
		shadowTop: { type: Boolean, default: false },
	},
	setup(props) {
		const foldableRef = ref<HTMLElement | null>(null);
		const contentRef = ref<HTMLElement | null>(null);
		const slotRef = ref<HTMLElement | null>(null);
		const primaryButtonRef = ref<HTMLButtonElement | null>(null);

		const foldableOpen = ref(false);

		const getBottomClasses = () => {
			let classes = 'edge bottom';
			if (props.left) {
				classes += ' left';
			}
			if (props.dashedBottom) {
				classes += ' dotted';
			}
			if (props.shadowBottom) {
				classes += ' shadow';
			}
			return classes;
		};

		const getTopClasses = () => {
			let classes = 'edge top';
			if (props.left) {
				classes += ' left';
			}
			if (props.shadowTop) {
				classes += ' shadow';
			}
			return classes;
		};

		const toggleContent = () => {
			if (foldableOpen.value) {
				gsap.to(slotRef.value, {
					duration: 0.5,
					opacity: 0,
					onComplete: () => {
						gsap.set(slotRef.value, {
							overwrite: true,
							display: 'none',
						});
					},
				});
				gsap.to(contentRef.value, {
					duration: 0.5,
					height: '90px',
					overwrite: true,
					ease: 'none',
				});
			} else {
				if (primaryButtonRef.value !== null) {
					primaryButtonRef.value.focus();
				}
				gsap.set(slotRef.value, {
					display: 'flex',
					overwrite: true,
					onComplete: () => {
						gsap.to(slotRef.value, {
							opacity: 1,
							duration: 0.5,
						});
						//contentRef.value.$el.focus();
						gsap.to(contentRef.value, {
							height: 'auto',
							duration: 0.5,
							overwrite: true,
							ease: 'none',
						});
					},
				});
			}
			foldableOpen.value = !foldableOpen.value;
		};

		return {
			foldableRef,
			contentRef,
			toggleContent,
			slotRef,
			getBottomClasses,
			addTestDataEnrichment,
			foldableOpen,
			primaryButtonRef,
			santizeAndSimplify,
			getTopClasses,
		};
	},
});
</script>
<style scoped>
.content {
	height: 90px;
	overflow-y: hidden;
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;
	overflow-x: hidden;
	z-index: 4;
	padding-bottom: 25px;
}

.dotted {
	border-bottom: 1px dashed rgb(160, 160, 160);
}

.slot {
	opacity: 0;
	display: none;
	width: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.foldable-container {
	font-family: noway, sans-serif;
	max-width: 100vw;
}

h1 {
	font-family: noway, sans-serif;
	font-weight: 100;
}

.content .responsive-title {
	display: none;
}

.content .headline {
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	justify-content: flex-start;
}

.content .headline h1 {
	padding: 0px;
	margin: 0px;
}

.content .mobile-title {
	border: 0px;
	background-color: transparent;
	width: 100%;
	display: flex;
	align-items: center;
	cursor: pointer;
	margin: 15px 12px;
}

.icon .material-icons {
	font-size: 48px;
	padding-right: 10px;
}

.content .responsive-title {
	border: 0px;
	background-color: transparent;
	width: 100%;
	align-items: center;
	margin: 15px 0px;
}

.edge.top.shadow {
	box-shadow: rgba(0, 0, 0, 0.45) 0px -14px 8px -11px;
}

.edge.top {
	width: 110%;
	position: relative;
	background-color: #caf0fe;
	z-index: 0;
	height: 6vw;
	left: -5%;
	top: 3vw;
	transform: rotateZ(2deg);
	transform-origin: center bottom;
	z-index: 3;
}

.edge.top.left {
	width: 110%;
	position: relative;
	background-color: #caf0fe;
	z-index: 0;
	height: 6vw;
	left: -5%;
	top: 3vw;
	transform: rotateZ(-2deg);
	transform-origin: center bottom;
}

.edge.bottom {
	width: 110%;
	position: relative;
	background-color: #caf0fe;
	z-index: 0;
	height: 6vw;
	left: -5%;
	top: -3vw;
	transform: rotateZ(-2deg);
	transform-origin: center top;
	z-index: 3;
}
.edge.bottom.left {
	width: 110%;
	position: relative;
	background-color: #caf0fe;
	z-index: 0;
	height: 6vw;
	left: -5%;
	top: -3vw;
	transform: rotateZ(2deg);
	transform-origin: center top;
}

.edge.bottom.shadow {
	box-sizing: border-box;
	box-shadow:
		rgba(0, 0, 0, 0.16) 0px 3px 6px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.foldable-toggle {
	position: absolute;
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: -55px;
}

.toggle-button {
	z-index: 5;
	border: 0px solid transparent;
	cursor: pointer;
	background-color: transparent;
	padding: 10px 5px;
	width: 16px;
	height: 16px;
	background-color: #0a2e70;
	color: white;
	font-size: 16px;
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
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-bottom: 6px solid #0a2e70;
	position: relative;
	transition: all 0.15s ease-in-out 0s;
	transform: scaleY(0);
	transform-origin: bottom;
	top: -1px;
}

.toggle-button.open:before {
	transform: scaleY(1);
}

.toggle-button:after {
	left: 0px;
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-top: 6px solid #0a2e70;
	position: relative;
	transform: scaleY(0);
	transform-origin: top;
	transition: all 0.15s ease-in-out 0s;
	top: 0px;
}

.toggle-button.closed:after {
	transform: scaleY(1);
}

@media (min-width: 990px) {
	.toggle-button {
		display: none;
	}

	h1 {
		font-family: 'LibreBaskerville';
		font-weight: 100;
		text-transform: uppercase;
		font-size: 32px;
	}
	.content.hide {
		height: auto !important;
		align-items: center;
	}
	.content {
		align-items: center;
	}
	.hide .slot {
		opacity: 1 !important;
	}
	.slot {
		opacity: 0;
		display: flex !important;
		width: calc(100vw - 14px);
	}
	.hide .responsive-title {
		display: none !important;
	}

	.content .headline {
		padding: 0px 4px;
	}
	.content .mobile-title {
		padding: 0;
		max-width: 1150px;
		align-items: center;
		flex-direction: row-reverse;
		justify-content: space-between;
	}

	.content .mobile-title .icon {
		width: 50%;
	}

	.content .mobile-title .icon .material-icons {
		position: absolute;
		font-size: 85px;
		top: 0px;
	}

	.content.hide .mobile-title {
		display: none;
	}
	.content .responsive-title {
		display: none;
	}
	.content .responsive-title.fullw {
	}
	.content.hide .responsive-title {
		display: flex;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.content .responsive-title {
		max-width: 1280px;
	}
	.content .mobile-title {
		max-width: 1280px;
	}
}

/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.content .responsive-title {
		/* padding-right: 0;
		padding-left: 0; */
	}
}
@media (min-width: 2000px) {
	.edge.top {
		transform: rotateZ(1deg) !important;
		top: 1.5vw;
		height: 4vw;
	}

	.edge.top.left {
		transform: rotateZ(-1deg) !important;
		top: 1.5vw;
		height: 4vw;
	}

	.edge.bottom {
		transform: rotateZ(-1deg) !important;
		top: -1.5vw;
		height: 4vw;
	}
	.edge.bottom.left {
		transform: rotateZ(1deg) !important;
		top: -1.5vw;
		height: 4vw;
	}
}
@media (min-width: 4000px) {
	.edge.top {
		transform: rotateZ(0deg) !important;
		top: 0.75vw;
		height: 2vw;
	}

	.edge.top.left {
		transform: rotateZ(0deg) !important;
		top: 0.75vw;
		height: 2vw;
	}

	.edge.bottom {
		transform: rotateZ(0deg) !important;
		top: -0.75vw;
		height: 2vw;
	}
	.edge.bottom.left {
		transform: rotateZ(0deg) !important;
		top: -0.75vw;
		height: 2vw;
	}
}
</style>
