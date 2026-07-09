<template>
	<div class="logo-container container">
		<div
			v-for="n in 5"
			:key="n"
			class="line"
			:class="{ animate: ready }"
			:style="{ animationDuration: `${n * 0.9}s` }"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue';

export default defineComponent({
	name: 'Logo',
	props: {},

	setup() {
		const ready = ref(false);

		onMounted(async () => {
			await nextTick();
			requestAnimationFrame(() => {
				ready.value = true;
			});
		});

		return {
			ready,
		};
	},
});
</script>

<style scoped>
.logo-container {
	position: absolute !important;
	z-index: 4 !important;
}

.line {
	width: 490px;
	height: 17.387px;
	background: var(--color-main);
	transform-origin: center;
	position: absolute;
	opacity: 0;
}

.search .line {
	transition: all 1.5s ease-in-out;
}

.line.animate {
	transition: all 1.5s
		linear(
			0,
			0.528 7%,
			0.921 14.4%,
			1.07 18.3%,
			1.19 22.4%,
			1.28 26.7%,
			1.34 31.2%,
			1.366 34.5%,
			1.378 38%,
			1.377 41.7%,
			1.363 45.6%,
			1.308 53.3%,
			1.13 71.3%,
			1.059 80.1%,
			1.013 89.7%,
			1
		);
}

.line:nth-of-type(1) {
	transform: rotate(0deg);
	top: 0px;
	transform-origin: left;
	transition-delay: 0.1s !important;
}

.line.animate:nth-of-type(1) {
	top: 44.07px;
	transform: rotate(-8.096deg);
	opacity: 1;
}

.search .line:nth-of-type(1) {
	top: 44.07px;
}

.line:nth-of-type(2) {
	transform: rotate(0deg);
	top: 0px;
	transform-origin: right;
	transition-delay: 0.2s !important;
}

.line.animate:nth-of-type(2) {
	top: 154.43px;
	opacity: 1;
	transform: rotate(3.677deg);
}

.search .line:nth-of-type(2) {
	top: 154.43px;
}

.line:nth-of-type(3) {
	transform: rotate(0deg);
	top: 0px;
	transform-origin: left;
	transition-delay: 0.3s !important;
}

.line.animate:nth-of-type(3) {
	top: 427px;
	transform: rotate(3.677deg);
	opacity: 1;
}

.search .line:nth-of-type(3) {
	opacity: 0.7;
	top: 139px;
}

.line:nth-of-type(4) {
	transform: rotate(0deg);
	top: 0px;
	transform-origin: right;
	transition-delay: 0.4s !important;
}

.line.animate:nth-of-type(4) {
	top: 730px;
	transform: rotate(-4.458deg);
	opacity: 1;
}

.search .line:nth-of-type(4) {
	opacity: 0.2;
	top: 197px;
}

.line:nth-of-type(5) {
	transform: rotate(0deg);
	top: 0px;
	transform-origin: left;
	transition-delay: 0.5s !important;
	transition:
		width 750ms ease,
		top 750ms ease 750ms !important;
}

.line.animate:nth-of-type(5) {
	top: 945px;
	opacity: 1;
	transform: rotate(0deg);
}

.search .line.animate:nth-of-type(5) {
	width: 1280px;
	transition:
		top 750ms ease,
		width 750ms ease 750ms !important;
}

.search .line:nth-of-type(5) {
	top: 305px;
}

@media (max-width: 990px) {
	.line:nth-of-type(1) {
		top: 44.07px;
	}
	.line:nth-of-type(2) {
		top: 154.43px;
	}
	.line:nth-of-type(3) {
		opacity: 0.7 !important;
		top: 139px;
	}
	.line:nth-of-type(4) {
		opacity: 0.2 !important;
		top: 197px;
	}
	.line:nth-of-type(5) {
		top: 305px;
	}
}

@media (min-width: 990px) and (max-width: 1279px) {
	.line:nth-of-type(1) {
		top: 44.07px;
	}
	.line:nth-of-type(2) {
		top: 154.43px;
	}
	.line:nth-of-type(3) {
		top: 339px;
	}
	.line:nth-of-type(4) {
		top: 497px;
	}
	.line:nth-of-type(5) {
		top: 698px;
	}
}

@media (min-width: 1280px) and (max-width: 1439px) {
	.line:nth-of-type(1) {
		top: 44.07px;
	}
	.line:nth-of-type(2) {
		top: 154.43px;
	}
	.line:nth-of-type(3) {
		top: 355px;
	}
	.line:nth-of-type(4) {
		top: 615px;
	}
	.line:nth-of-type(5) {
		top: 815px;
	}
}
@media (min-width: 1440px) {
	.line:nth-of-type(1) {
		top: 44.07px;
	}
	.line:nth-of-type(2) {
		top: 154.43px;
	}
	.line:nth-of-type(3) {
		top: 427px;
	}
	.line:nth-of-type(4) {
		top: 730px;
	}
	.line:nth-of-type(5) {
		top: 933px;
	}
}
</style>
