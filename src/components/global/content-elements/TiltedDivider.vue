<template>
	<div
		ref="dividerRef"
		class="divider"
	>
		<h2>{{ title }}</h2>
		<div class="bar"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from 'vue';

export default defineComponent({
	name: 'TiltedDivider',
	props: {
		right: {
			type: Boolean as PropType<boolean>,
			default() {
				return true;
			},
		},
		title: {
			type: String as PropType<string>,
			default() {
				return '';
			},
		},
	},

	setup(props) {
		const dividerRef = ref<HTMLDivElement | null>(null);

		onMounted(() => {
			if (dividerRef.value) {
				if (props.right) {
					dividerRef.value.style.transform = 'matrix(1, -0.03, 0.03, 1, 0, 0)';
				} else {
					dividerRef.value.style.transform = 'matrix(1, 0.03, -0.03, 1, 0, 0)';
				}
			}
		});
		return { dividerRef };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.divider {
	width: 100%;
	margin-top: 50px;
	margin-bottom: 50px;
}

.bar {
	width: 100%;
	height: 18px;
	background-color: #002e70;
}

h2 {
	margin: 0px;
	padding: 0;
	text-align: center;
	font: normal normal normal 49px/68px Libre Baskerville;
	letter-spacing: 1.15px;
	color: #002e70;
	font-size: 16px;
	top: 5px;
	position: relative;
	line-height: 1.8;
}
h2::first-letter {
	text-transform: uppercase;
}
@media (min-width: 500px) {
	h2 {
		font-size: 20px;
	}
	.bar {
		height: 22px;
	}
}
@media (min-width: 580px) {
	h2 {
		font-size: 25px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	h2 {
		font-size: 28px;
	}
	.bar {
		height: 28px;
	}
}
/* MEDIA QUERY 800 */
@media (min-width: 800px) {
	h2 {
		font-size: 36px;
	}
	.bar {
		height: 34px;
	}
}
@media (min-width: 990px) {
	h2 {
		font-size: 44px;
	}
	.bar {
		height: 42.5px;
	}
}
</style>
