<template>
	<button
		:class="title !== '' ? 'info-btn' : 'info-btn icon-only'"
		:style="{ '--text-color': color, '--bg-color': bgColor }"
		@click="showContent = !showContent"
	>
		<span
			:style="{ '--text-color': bgColor, '--bg-color': color }"
			class="material-icons icon"
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
			<button @click="showContent = false"><span class="material-icons">close</span></button>
			<slot></slot>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { useRoute, RouteLocationNormalized } from 'vue-router';

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

		watch(route, () => {
			showContent.value = false;
		});

		return { showContent };
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
	transition: all 0.15s ease-in-out 0s;
	color: var(--text-color);
	background-color: var(--bg-color);
}

.icon-only:hover {
	border: 1px solid transparent !important;
}

.info-btn:hover {
	border: 1px solid #0a2e70;
	box-sizing: border-box;
}

.info-btn:hover {
	color: var(--bg-color);
	background-color: var(--text-color);
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
	width: calc(100% - 1px);
	padding: 15px 50px 15px 15px;
	box-sizing: border-box;
	z-index: 15;
}

.modal.left {
}

.modal.right {
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
/* MEDIA QUERY 990 */
@media (min-width: 640px) {
	.modal {
		width: 400px;
	}
}
</style>
