<template>
	<div
		ref="foldableRef"
		class="foldable-container"
	>
		<div
			:style="`background-color:${bg}`"
			:class="left ? 'edge top left' : 'edge top'"
		></div>
		<div
			ref="contentRef"
			:style="`background-color:${bg}; color:${text}`"
			:class="alwaysExpand ? 'content' : 'content hide'"
		>
			<button
				class="mobile-title"
				:data-testid="addTestDataEnrichment('button', 'skewed-foldable', `btn-toggle-${title}`, 0)"
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
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import gsap from 'gsap';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

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
	},
	setup(props) {
		const foldableRef = ref<HTMLElement | null>(null);
		const contentRef = ref<HTMLElement | null>(null);
		const slotRef = ref<HTMLElement | null>(null);

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

		return { foldableRef, contentRef, toggleContent, slotRef, getBottomClasses, addTestDataEnrichment };
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
	z-index: 1;
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
	margin: 15px 0px;
}

.icon .material-icons {
	font-size: 48px;
}

.content .responsive-title {
	border: 0px;
	background-color: transparent;
	width: 100%;
	align-items: center;
	margin: 15px 0px;
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

@media (min-width: 990px) {
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
</style>
