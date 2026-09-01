<template>
	<div
		class="spot"
		:class="[spotSize, color]"
	>
		<div
			v-if="iconName"
			class="icon"
		>
			<span
				v-if="iconAltText"
				role="img"
				:aria-label="iconAltText"
				class="material-icons"
			>
				{{ iconName }}
			</span>

			<span
				v-else
				aria-hidden="true"
				class="material-icons"
			>
				{{ iconName }}
			</span>
		</div>
		<div
			v-else
			class="icon"
		></div>
		<div class="inner"><slot></slot></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
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
		iconAltText: {
			type: String,
			default() {
				return '';
			},
		},
	},
	setup() {
		const { t } = useI18n();
		return { t };
	},
});
</script>

<style scoped>
.spot {
	display: flex;
	height: 100%;
	min-height: 190px;
	border-radius: 0px;
	border: 1px solid var(--color-border-success-transparent);
	box-sizing: border-box;
	position: relative;
	flex-wrap: wrap;
	align-content: baseline;
}
.spot::after {
	content: '';
	position: absolute;
	inset: 0;
	box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.34) inset;
	pointer-events: none;
	z-index: 2;
}
.spot .icon {
	width: 68px;
	align-items: center;
	display: flex;
	text-align: center;
	justify-content: center;
	height: 68px;
	background-color: var(--bg-main);
	color: var(--color-default);
	border-radius: 0 0 var(--rounded-medium) 0;
	top: 0;
	left: 0;
}
.icon .material-icons {
	font-size: var(--fs-lg);
}
.spot .inner {
	width: 100%;
	padding: 36px 20px 20px 20px;
	display: flex;
	justify-content: start;
	align-items: flex-start;
	text-align: start;
	flex-direction: column;
	position: relative;
	min-height: 130px;
	/* word-break: break-all; */
}
.spot.medium .inner {
	padding-bottom: 56px;
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
	height: 100%;
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
		border-radius: var(--rounded-medium);
	}
	.spot.medium {
		height: 310px;
	}
	.spot.medium .inner {
		padding-bottom: 20px;
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
