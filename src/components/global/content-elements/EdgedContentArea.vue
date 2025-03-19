<template>
	<div :class="[lines ? 'edge-content lines' : 'edge-content', !linePadding ? 'no-padding' : '']">
		<h3
			v-if="title"
			:class="reverse ? 'reverse' : ''"
		>
			{{ title }}
		</h3>
		<div
			ref="top"
			:class="getClasses('top')"
		></div>
		<div
			ref="content"
			class="full-width"
		>
			<div
				ref="container"
				class="container"
			>
				<slot name="content"></slot>
			</div>
		</div>
		<div
			ref="bottom"
			:class="getClasses('bottom')"
		></div>
	</div>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import { defineComponent, PropType, ref } from 'vue';

export default defineComponent({
	name: 'EdgedContentArea',
	props: {
		title: {
			type: String as PropType<string>,
			default() {
				return '';
			},
		},
		backgroundColor: {
			type: String as PropType<string>,
			default() {
				return '#002e70';
			},
		},
		dottedEdges: {
			type: Boolean as PropType<boolean>,
			default() {
				return true;
			},
		},
		reverse: {
			type: Boolean as PropType<boolean>,
			default() {
				return false;
			},
		},
		lines: {
			type: Boolean as PropType<boolean>,
			default() {
				return false;
			},
		},
		linePadding: {
			type: Boolean as PropType<boolean>,
			default() {
				return true;
			},
		},
		alignItems: {
			type: String as PropType<string>,
			default() {
				return 'center';
			},
		},
	},

	setup(props) {
		const top = ref<HTMLDivElement>();
		const content = ref<HTMLDivElement>();
		const container = ref<HTMLDivElement>();
		const bottom = ref<HTMLDivElement>();

		const getClasses = (prefix: string) => {
			let classes = `${prefix}-edge`;
			if (props.reverse) classes = classes + ` reverse`;
			if (props.dottedEdges) classes = classes + ` ${prefix}-dotted-border`;
			if (!props.lines) classes = classes + ` removed`;
			return classes;
		};

		onMounted(() => {
			if (top.value) top.value.style.backgroundColor = props.backgroundColor;
			if (content.value) content.value.style.backgroundColor = props.backgroundColor;
			if (container.value) container.value.style.alignItems = props.alignItems;
			if (bottom.value) bottom.value.style.backgroundColor = props.backgroundColor;
		});

		return { top, content, container, bottom, getClasses };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style lang="scss" scoped>
.top-edge {
	height: 5vw;
	width: 120vw;
	left: 0px;
	z-index: 3;
	position: relative;
	transform: matrix(1, 0.03, -0.03, 1, 0, 0) translate(0%, 50%);
}

.removed {
	display: none;
}

.top-edge.reverse {
	transform: matrix(1, -0.03, 0.03, 1, 0, 0) translate(0%, 50%);
}

.edge-content {
	display: flex;
	width: 100%;
	align-items: center;
	padding: 0px 0px;
	flex-direction: column;
}

.edge-content.lines {
	padding: 0px 0px;
}
.edge-content.lines .full-width {
	min-height: 100px;
}
.edge-content.lines .full-width .bottom-edge {
	bottom: 20px;
}
.top-dotted-border {
	box-sizing: border-box;
	border-top: 2px dashed #002e7059;
}

.bottom-dotted-border {
	box-sizing: border-box;
	border-bottom: 2px dashed #002e7059;
}

.full-width {
	min-height: 200px;
	z-index: 5;
	position: relative;
	width: 100vw;
}

.no-padding {
	padding: 0px !important;
}

.bottom-edge {
	height: 5vw;
	width: 120vw;
	left: 0px;
	z-index: 3;
	transform: matrix(1, -0.03, 0.03, 1, 0, 0) translate(0%, -50%);
	position: relative;
}

.bottom-edge.reverse {
	transform: matrix(1, 0.03, -0.03, 1, 0, 0) translate(0%, -50%);
}

h3 {
	margin: 0px;
	padding: 0;
	text-align: center;
	font: normal normal normal 49px/68px Libre Baskerville;
	letter-spacing: 1.15px;
	color: #002e70;
	font-size: 32px;
	top: calc(2.5vw + 2px);
	position: relative;
	transform: matrix(1, 0.03, -0.03, 1, 0, 0);
	line-height: 1.2;
}

h3.reverse {
	transform: matrix(1, -0.03, 0.03, 1, 0, 0);
}
h3:first-letter {
	text-transform: uppercase;
}
.container {
	text-align: left;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100vw;
}
.time-search .container {
	padding-left: 24px;
	padding-right: 24px;
}
/* MEDIA QUERY 450 */
@media (min-width: 450px) {
	h3 {
	}
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
	h3 {
		font-size: 36px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	h3 {
		font-size: 40px;
	}
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
	.edge-content.lines {
		padding: 50px 0px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
	.full-width {
		width: 100vw;
	}
	.time-search .container {
		padding-left: 18px;
		padding-right: 18px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.time-search .container {
		/* padding-right: 0;
		padding-left: 0; */
	}
}
@media (min-width: 4000px) {
	.top-edge {
		transform: rotateZ(0deg) !important;
		top: 0.75vw;
		height: 3vw;
		z-index: -1;
	}

	.bottom-edge {
		transform: rotateZ(0deg) !important;
		top: -0.75vw;
		height: 3vw;
		z-index: -1;
	}
}
</style>
