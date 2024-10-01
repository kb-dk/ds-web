<template>
	<div :class="lines ? 'edge-content lines' : 'edge-content'">
		<h3 :class="reverse ? 'reverse' : ''">{{ title }}</h3>
		<div
			ref="top"
			:class="getClasses('top')"
		></div>
		<div
			ref="content"
			class="full-width"
		>
			<div class="container"><slot name="content"></slot></div>
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
	},

	setup(props) {
		const top = ref<HTMLDivElement>();
		const content = ref<HTMLDivElement>();
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
			if (bottom.value) bottom.value.style.backgroundColor = props.backgroundColor;
		});

		return { top, content, bottom, getClasses };
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
	padding: 50px 0px;
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
	width: calc(100% + 24px);
	min-height: 200px;
	z-index: 5;
	position: relative;
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
	line-height: -25px;
	color: #002e70;
	font-size: 49px;
	text-transform: uppercase;
	top: calc(2.5vw + 5px);
	position: relative;
	transform: matrix(1, 0.03, -0.03, 1, 0, 0);
}

h3.reverse {
	transform: matrix(1, -0.03, 0.03, 1, 0, 0);
}

.container {
	text-align: left;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
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
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
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
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
