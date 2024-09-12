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
			class="content"
		>
			<button
				class="mobile-title"
				@click="toggleContent()"
			>
				<div clas="icon">
					<span class="material-icons">{{ icon }}</span>
				</div>
				<div class="headline">
					<h2>{{ title }}</h2>
					<span>{{ subtitle }}</span>
				</div>
			</button>
			<div :class="fullwidth ? 'responsive-title fullw' : 'responsive-title'">
				<div clas="icon">
					<span class="material-icons">{{ icon }}</span>
				</div>
				<div class="headline">
					<h2>{{ title }}</h2>
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
			:class="left ? 'edge bottom left' : 'edge bottom'"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import gsap from 'gsap';

export default defineComponent({
	name: 'SkewedFoldable',
	props: {
		bg: { type: String, default: 'white' },
		text: { type: String, default: 'black' },
		title: { type: String, default: 'Title' },
		subtitle: { type: String, default: '' },
		icon: { type: String, default: 'schedule' },
		fullwidth: { type: Boolean, default: false },
		left: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const foldableRef = ref<HTMLElement | null>(null);
		const contentRef = ref<HTMLElement | null>(null);
		const slotRef = ref<HTMLElement | null>(null);

		const foldableOpen = ref(false);

		const toggleContent = () => {
			if (foldableOpen.value) {
				gsap.to(contentRef.value, {
					duration: 0.5,
					height: '70px',
					overwrite: true,
					ease: 'none',
					onComplete: () => {
						gsap.set(slotRef.value, {
							overwrite: true,
							display: 'none',
						});
					},
				});
			} else {
				gsap.set(slotRef.value, {
					display: 'flex',
					overwrite: true,
					onComplete: () => {
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

		return { foldableRef, contentRef, toggleContent, slotRef };
	},
});
</script>
<style scoped>
.content {
	height: 70px;
	overflow-y: hidden;
	box-sizing: border-box;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-direction: column;
	overflow-x: hidden;
}

.slot {
	display: none;
	width: 100%;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.foldable-container {
	max-width: 100vw;
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

.content .headline h2 {
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
}

.content .responsive-title {
	border: 0px;
	background-color: transparent;
	width: 100%;
	align-items: center;
}

.edge.top {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(0 0, 0% 100%, 100% 100%);
	z-index: 3;
	height: 15px;
	top: 1px;
}

.edge.top.left {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0% 100%, 100% 100%);
	z-index: 3;
	height: 15px;
	top: 1px;
}

.edge.bottom {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0 0, 0 100%);
	z-index: 3;
	height: 15px;
	top: -1px;
}
.edge.bottom.left {
	width: 100%;
	position: relative;
	background-color: #caf0fe;
	clip-path: polygon(100% 0, 0 0, 100% 100%);
	z-index: 3;
	height: 15px;
	top: -1px;
}
@media (min-width: 990px) {
	.content {
		height: auto !important;
		align-items: center;
	}
	.slot {
		display: flex !important;
	}
	.content .mobile-title {
		display: none;
	}
	.content .responsive-title {
		display: flex;
		max-width: 1150px;
		padding-left: 12px;
		padding-right: 12px;
	}
	.content .responsive-title.fullw {
		width: calc(100% - 24px);
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.content .responsive-title {
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
