<template>
	<div class="edge-content">
		<h3>{{ title }}</h3>
		<div
			ref="top"
			class="top-edge"
		></div>
		<div
			ref="content"
			class="full-width"
		>
			<div class="container">HEJHEJHEJ</div>
		</div>
		<div
			ref="bottom"
			class="bottom-edge"
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
	},

	setup(props) {
		const top = ref<HTMLDivElement>();
		const content = ref<HTMLDivElement>();
		const bottom = ref<HTMLDivElement>();

		onMounted(() => {
			if (top.value) top.value.style.backgroundColor = props.backgroundColor;
			if (content.value) content.value.style.backgroundColor = props.backgroundColor;
			if (bottom.value) bottom.value.style.backgroundColor = props.backgroundColor;
		});

		return { top, content, bottom };
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

.edge-content {
	display: flex;
	width: 100%;
	align-items: center;
	padding: 50px 0px;
	flex-direction: column;
	color: white;
}

.full-width {
	width: calc(100% + 24px);
	height: 200px;
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
