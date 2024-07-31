<template>
	<div class="expand-container">
		<div
			ref="expandContainer"
			class="expander"
		>
			<slot></slot>
		</div>
		<div class="expander-toggle">
			<button
				:class="expanderOpen ? 'toggle-button open' : 'toggle-button closed'"
				@click="toggleExpander()"
			>
				{{ expanderOpen ? '-' : '+' }}
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { onUnmounted } from 'vue';
import { defineComponent, onMounted, ref } from 'vue';
import gsap from 'gsap';

export default defineComponent({
	name: 'CustomExpander',
	setup() {
		const expanderOpen = ref(false);
		const expandContainer = ref<HTMLElement | null>(null);

		const toggleExpander = () => {
			if (expanderOpen.value) {
				gsap.to(expandContainer.value, {
					height: '0px',
					duration: 0.5,
					overwrite: true,
				});
			} else {
				gsap.to(expandContainer.value, {
					height: 'auto',
					duration: 0.5,
					overwrite: true,
				});
			}
			expanderOpen.value = !expanderOpen.value;
		};

		onMounted(() => {
			console.log('mounted');
		});

		onUnmounted(() => {
			console.log('unmounted');
		});

		return { expanderOpen, toggleExpander, expandContainer };
	},
});
</script>
<style scoped>
.expand-container {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
}

.expander {
	overflow: hidden;
	height: 0px;
	width: 100%;
}
.expander-toggle {
	display: grid;
	align-items: center;
	justify-content: center;
	align-content: center;
	height: 0px;
}

.toggle-button {
	border: 0px solid transparent;
	cursor: pointer;
	background-color: transparent;
	padding: 10px 5px;
	width: 30px;
	height: 30px;
	background-color: #0a2e70;
	color: white;
	font-size: 24px;
	display: grid;
	align-items: center;
	justify-content: center;
	align-content: center;
	margin-top: 30px;
}

.toggle-button:before {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-bottom: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: -40px;
	transition: all 0.15s ease-in-out 0s;
	transform: scaleY(0);
	transform-origin: bottom;
}

.toggle-button.open:before {
	transform: scaleY(1);
}

.toggle-button:after {
	content: '';
	display: block;
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-top: 10px solid #0a2e70;
	position: absolute;
	margin-left: -5px;
	margin-top: 40px;
	transform: scaleY(0);
	transform-origin: top;
	transition: all 0.15s ease-in-out 0s;
}

.toggle-button.closed:after {
	transform: scaleY(1);
}
</style>
