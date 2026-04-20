<template>
	<div class="info-btn">
		<KBButton
			class="btn-reg"
			:left-icon-name="icon"
			:button-text="title"
			button-type="btn-dropdown-default"
			@click="toggleModal($event)"
		></KBButton>
	</div>
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
import KBButton from './KBButton.vue';

export default defineComponent({
	name: 'InfoComponent',
	components: { KBButton },
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
	margin-top: 10px;
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
	transition: all 0.25s ease-in-out 0s;
	font-size: 16px;
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
	padding: 18px 54px 20px 18px;
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
@media (min-width: 640px) {
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
