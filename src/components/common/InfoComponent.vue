<template>
	<button
		:title="title"
		:class="showTitle ? 'info-btn' : 'info-btn icon-only'"
		:style="{
			'--text-color': color,
			'--bg-color': bgColor,
			'--top-offset': top,
			'--left-offset': left,
			'--info-offset': infoOffset,
		}"
		@click="toggleModal($event)"
	>
		<span
			:style="{ '--text-color': bgColor, '--bg-color': color }"
			:class="showTitle ? 'material-icons icon big-icon' : 'material-icons icon small-icon'"
		>
			{{ icon }}
		</span>
		<span class="title">
			{{ showTitle ? title : '' }}
		</span>
		<Transition name="fade">
			<div
				v-if="showContent"
				class="modal"
				:style="{
					'--offset': modalOffset,
				}"
			>
				<button @click="toggleModal($event)"><span class="material-icons">close</span></button>
				<slot></slot>
			</div>
		</Transition>
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'InfoComponent',
	props: {
		title: {
			type: String as PropType<string>,
			required: true,
		},
		showTitle: {
			type: Boolean as PropType<boolean>,
			required: false,
			default: true,
		},
		icon: {
			type: String as PropType<string>,
			required: false,
			default: 'info_outline',
		},
		modalOffset: {
			type: String as PropType<string>,
			required: true,
		},
		bgColor: {
			type: String as PropType<string>,
			required: false,
			default: '#0a2e70',
		},
		color: {
			type: String as PropType<string>,
			required: false,
			default: 'white',
		},
		top: {
			type: String as PropType<string>,
			required: false,
			default: '',
		},
		left: {
			type: String as PropType<string>,
			required: false,
			default: '',
		},
		infoOffset: {
			type: String as PropType<string>,
			required: false,
			default: '',
		},
	},

	setup() {
		const showContent = ref(false);
		const route = useRoute();

		const toggleModal = (e: Event) => {
			e.stopPropagation();
			showContent.value = !showContent.value;
		};

		watch(route, () => {
			showContent.value = false;
		});

		return { showContent, toggleModal };
	},
});
</script>
<style scoped>
.info-btn {
	display: flex;
	height: 26px;
	border: 1px solid white;
	background-color: transparent;
	position: relative;
	align-items: center;
	padding: 0;
	margin: 0;
	cursor: pointer;
	box-sizing: border-box;
	transition:
		background-color 0.15s ease-in-out,
		color 0.15s ease-in-out;
	color: var(--text-color);
	background-color: var(--bg-color);
	margin-left: 25px;
	z-index: 10;
	top: var(--info-offset);
}

.info-btn.icon-only {
	border: 1px solid transparent;
}

.icon-only:hover {
	border: 1px solid transparent !important;
	background-color: var(--bg-color) !important;
}

.info-btn:hover {
	border: 1px solid #0a2e70;
	box-sizing: border-box;
}

.info-btn:hover {
	color: var(--bg-color);
	background-color: var(--text-color);
}

.small-icon {
	font-size: 24px !important;
}

.title {
	display: inline-block;
	padding: 0px 5px;
	padding-left: 10px;
	font-weight: bold;
	transition: all 0.25s ease-in-out 0s;
}

.title:empty {
	padding: 0;
	padding-left: 10px;
}

.modal {
	position: absolute;
	margin-top: 2px;
	border: 1px solid #0a2e70;
	background-color: white;
	color: #0a2e70;
	width: calc(100vw - 35px);
	padding: 15px 50px 15px 15px;
	box-sizing: border-box;
	z-index: 25;
	right: -1px;
	top: 25px;
	text-align: left;
	right: -1px;
}

.modal.right {
	left: -220px;
}

.modal.left {
	right: -370px;
}

.modal.middle {
	right: 0px;
}

.modal button {
	position: absolute;
	right: 3px;
	top: 10px;
	border: 0px;
	background-color: transparent;
	cursor: pointer;
}

.modal button span {
	font-size: 40px;
	color: #0a2e70;
}

.icon {
	width: 30px;
	height: 30px;
	border-radius: 90%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	margin-left: -22px;
	font-size: 36px;
	top: -3px;
	color: var(--bg-color);
	background-color: var(--text-color);
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.modal.left {
		right: -370px;
	}
}

/* MEDIA QUERY 990 */

@media (min-width: 990px) {
	.modal.middle {
		right: -185px;
	}
	.info-btn {
		top: var(--top-offset);
		left: var(--left-offset);
	}
	.modal {
		width: 400px;
		left: var(--offset);
	}
}
</style>
