<template>
	<button
		:class="title !== '' ? 'info-btn' : 'info-btn icon-only'"
		:style="{
			'--text-color': color,
			'--bg-color': bgColor,
		}"
		@click="toggleModal($event)"
	>
		<span
			:style="{ '--text-color': bgColor, '--bg-color': color }"
			:class="title ? 'material-icons icon big-icon' : 'material-icons icon small-icon'"
		>
			{{ icon }}
		</span>
		<span class="title">
			{{ title }}
		</span>
	</button>
	<Transition name="fade">
		<div
			v-if="showContent"
			:class="modalAlign"
			class="modal"
		>
			<button @click="toggleModal($event)"><span class="material-icons">close</span></button>
			<slot></slot>
		</div>
	</Transition>
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
		icon: {
			type: String as PropType<string>,
			required: false,
			default: 'info_outline',
		},
		modalAlign: {
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
		background-color 0.1s ease-in-out,
		color 0.1s ease-in-out;
	color: var(--text-color);
	background-color: var(--bg-color);
	margin-left: 25px;
	margin-right: 10px;
	border-radius: 4px;
}

.info-btn.icon-only {
	border: 1px solid transparent;
}

.icon-only:hover {
	border: 1px solid transparent !important;
	background-color: var(--bg-color) !important;
}

.info-btn:hover {
	box-sizing: border-box;
}

.info-btn:hover {
	color: var(--bg-color);
	background-color: #c4f1ed;
	border: 1px solid var(--bg-color);
}

.small-icon {
	font-size: 24px !important;
}

.title {
	display: none;
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
	width: calc(100% - 1px);
	padding: 0px 54px 20px 18px;
	box-sizing: border-box;
	z-index: 25;
}
.modal p {
}

.modal.left {
	right: 0px;
}

.modal.right {
	right: 0px;
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
@media (min-width: 480px) {
	.title {
		display: inline;
	}
	.info-btn {
		margin-right: 0px;
	}
}
@media (min-width: 640px) {
	.modal {
		width: 400px;
	}
	.info-btn {
		left: auto;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.modal.middle {
		right: -185px;
	}
}
</style>
