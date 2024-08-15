<template>
	<div class="headline-container">
		<div
			class="material-icons icon"
			@click="dispatchClick()"
		>
			{{ icon }}
		</div>
		<div
			class="headline"
			@click="dispatchClick()"
		>
			<h3>{{ headline }}</h3>
			<span>{{ subline }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Duration',
	props: {
		headline: {
			type: String as PropType<string>,
			required: true,
		},
		icon: {
			type: String as PropType<string>,
			required: true,
		},
		subline: {
			type: String as PropType<string>,
			required: true,
		},
		click: {
			type: Function,
			default() {
				return null;
			},
		},
	},

	setup(props) {
		const { t } = useI18n();

		const dispatchClick = () => {
			props.click !== undefined ? props.click() : null;
		};

		return { t, dispatchClick };
	},
});
</script>

<style scoped>
.icon {
	height: 60px;
	width: 60px;
	font-size: 60px;
	overflow: hidden;
	color: #002e70;
	padding-right: 10px;
}

h3 {
	padding: 0;
	margin: 0;
	height: 20px;
	font-size: 20px;
	font-weight: 100;
	color: #002e70;
	height: auto;
}

span {
	padding: 0;
	margin: 0;
	height: 20px;
	font-size: 14px;
	font-weight: 700;
	color: #002e70;
	background-color: #d9f5fe;
	border: 1px solid #d9f5fe;
	border-radius: 4px;
	width: fit-content;
	padding-left: 3px;
	padding-right: 3px;
}

.headline {
	display: flex;
	flex-direction: column;
	gap: 0px;
}

.subline {
}

.headline-container {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	flex-direction: row;
	align-items: center;
	align-content: center;
	height: 65px;
	width: 100%;
}

.headline-container h3,
.headline-container span,
.headline-container div {
	cursor: pointer;
}
</style>
