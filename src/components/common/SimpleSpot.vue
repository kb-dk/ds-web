<template>
	<div
		class="spot"
		:class="[spotSize, color]"
	>
		<div
			v-if="iconName"
			class="icon"
		>
			<span class="material-icons">
				{{ iconName }}
			</span>
		</div>
		<div class="inner"><slot></slot></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
// import { useI18n } from 'vue-i18n';
type SpotSizeType = 'small' | 'medium' | 'large' | 'max';
type ColorType = 'main' | 'light';
export default defineComponent({
	name: 'SimpleSpot',
	props: {
		spotSize: {
			type: String as PropType<SpotSizeType>,
			required: true,
		},
		color: {
			type: String as PropType<ColorType>,
			default() {
				return 'main';
			},
		},
		iconName: {
			type: String,
			default() {
				return '';
			},
		},
	},
	setup() {
		// const { t } = useI18n();
		// return t;
	},
});
</script>

<style scoped>
.spot {
	display: flex;
	height: 100%;
	min-height: 190px;
	border-radius: 0px;
	border: 1px solid var(--color-border-success);
	box-sizing: border-box;
	position: relative;
	overflow: hidden;
	flex-wrap: wrap;
	align-content: baseline;
	box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.34) inset;
}
.spot .icon {
	width: 40px;
	align-items: center;
	display: flex;
	text-align: center;
	justify-content: center;
	height: 40px;
	background-color: var(--bg-main);
	color: var(--color-default);
	border-radius: 0 0 var(--rounded-medium) 0;
	top: 0;
	left: 0;
}
.icon .material-icons {
	font-size: var(--fs-lead);
}
.spot .inner {
	width: 100%;
	height: inherit;
	padding: 20px;
	display: flex;
	justify-content: start;
	align-items: flex-start;
	text-align: start;
	flex-direction: column;
	/* word-break: break-all; */
}
.spot.main {
	background-color: var(--bg-main);
	color: var(--color-default);
}

.spot.light {
	background-color: var(--bg-light);
	color: var(--color-main);
}
.spot.small {
	width: 100%;
}
.spot.medium {
	width: 100%;
	max-width: 100%;
}
.spot.large {
	width: 100%;
}
.spot.max {
	width: 100%;
}

@media (min-width: 640px) {
	.spot.small {
		max-width: 49%;
	}
	.spot {
		margin-bottom: 10px;
		border-radius: var(--rounded-medium);
	}
}

@media (min-width: 990px) {
	.spot.small {
		max-width: 23%;
	}
	.spot.medium {
		max-width: 48%;
	}
}
</style>
