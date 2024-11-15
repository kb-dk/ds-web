<template>
	<div>
		<button @click="showContent = !showContent">
			<span
				:style="`background-color:${bgColor}; color:${color}`"
				class="material-icons icon"
			>
				{{ icon }}
			</span>
			<span
				class="title"
				:style="`background-color:${bgColor}; color:${color}`"
			>
				{{ title }}
			</span>
		</button>
		<Transition name="fade">
			<div
				v-if="showContent"
				class="modal"
			>
				<button @click="showContent = false"><span class="material-icons">close</span></button>
				<slot></slot>
			</div>
		</Transition>
	</div>
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

	setup(props) {
		const showContent = ref(false);
		const route = useRoute();

		watch(route, (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
			if (to.fullPath !== from.fullPath) {
				showContent.value = false;
			}
		});

		return { showContent };
	},
});
</script>
<style scoped>
button {
	display: flex;
	height: 25px;
	border: 1px solid white;
	background-color: transparent;
	position: relative;
	align-items: center;
	padding: 0;
	margin: 0;
	cursor: pointer;
}

.title {
	display: inline-block;
	padding: 5px 5px;
	padding-left: 10px;
	font-weight: bold;
}

.modal {
	position: absolute;
	margin-top: 2px;
	border: 1px solid #0a2e70;
	background-color: white;
	color: #0a2e70;
	right: 0px;
	max-width: 50vw;
	padding: 15px 50px 15px 15px;
}

.modal button {
	position: absolute;
	right: 3px;
	top: 10px;
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
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
}
</style>
