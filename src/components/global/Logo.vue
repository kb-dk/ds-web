<template>
	<div
		class="logo-container container"
		:class="{ ready }"
	>
		<div
			v-for="n in 5"
			:key="n"
			class="line"
			:class="{ animate: ready, fifth: n === 5, wide: searchResultStore.searchFieldFocused }"
		></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'Logo',
	props: {},

	setup() {
		const searchResultStore = useSearchResultStore();
		const ready = ref(false);
		onMounted(async () => {
			await nextTick();
			//This ensures that Firefox gets the class during animation steps
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					ready.value = true;
				});
			});
		});
		return { ready, searchResultStore };
	},
});
</script>

<style scoped>
.logo-container {
	position: absolute !important;
	z-index: 4 !important;
	opacity: 0;
	transition: opacity 500ms ease;
}

.logo-container.ready {
	opacity: 1;
}

.line {
	width: 490px;
	height: 17.387px;
	background: var(--color-main);
	transform-origin: center;
	position: absolute;
	max-width: calc(100% - 24px);
}

.search .line,
.record .line {
	transition: all 1.5s ease-in-out;
}

.header-container.record .line.animate:nth-of-type(5) {
	opacity: 0;
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
.search .line:nth-of-type(1),
.record .line:nth-of-type(1),
.notfound .line:nth-of-type(1) {
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
.search .line.animate:nth-of-type(2),
.record .line.animate:nth-of-type(2),
.notfound .line.animate:nth-of-type(2) {
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
.search .line.animate:nth-of-type(3),
.record .line.animate:nth-of-type(3),
.notfound .line.animate:nth-of-type(3) {
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
.search .line.animate:nth-of-type(4),
.record .line.animate:nth-of-type(4),
.notfound .line.animate:nth-of-type(4) {
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
.search .line.animate:nth-of-type(5),
.record .line.animate:nth-of-type(5),
.notfound .line.animate:nth-of-type(5) {
	width: calc(100% - 24px);
	top: 305px;
	transition:
		top 750ms ease,
		width 750ms ease 750ms !important;
}
.search .line:nth-of-type(5) {
	top: 305px;
}
@media (max-width: 990px) {
	.line.animate:nth-of-type(1) {
		top: 44.07px;
	}
	.line.animate:nth-of-type(2) {
		top: 154.43px;
	}
	.line.animate:nth-of-type(3) {
		opacity: 0.7 !important;
		top: 139px;
	}
	.line.animate:nth-of-type(4) {
		opacity: 0.2 !important;
		top: 197px;
	}
	.line.animate:nth-of-type(5) {
		top: 305px;
	}
}
@media (min-width: 990px) and (max-width: 1279px) {
	.line.animate:nth-of-type(1) {
		top: 44.07px;
	}
	.line.animate:nth-of-type(2) {
		top: 154.43px;
	}
	.line.animate:nth-of-type(3) {
		top: 339px;
	}
	.line.animate:nth-of-type(4) {
		top: 497px;
	}
	.line.animate:nth-of-type(5) {
		top: 693px;
	}
}

@media (min-width: 1280px) and (max-width: 1479px) {
	.line.animate:nth-of-type(1) {
		top: 44.07px;
	}
	.line.animate:nth-of-type(2) {
		top: 154.43px;
	}
	.line.animate:nth-of-type(3) {
		top: 355px;
	}
	.line.animate:nth-of-type(4) {
		top: 615px;
	}
	.line.animate:nth-of-type(5) {
		top: 813px;
	}
}
@media (min-width: 1480px) {
	.line.animate:nth-of-type(1) {
		top: 44.07px;
	}
	.line.animate:nth-of-type(2) {
		top: 154.43px;
	}
	.line.animate:nth-of-type(3) {
		top: 427px;
	}
	.line.animate:nth-of-type(4) {
		top: 730px;
	}
	.line.animate:nth-of-type(5) {
		top: 953px;
	}
}

@media (max-width: 990px) {
	.fifth.wide {
		width: calc(100% - 24px);
		transition: width 750ms ease !important;
		transition-delay: 0s !important;
	}
}

@media (min-width: 1280px) {
	.search .line.animate:nth-of-type(5),
	.record .line.animate:nth-of-type(5),
	.notfound .line.animate:nth-of-type(5) {
		width: 1280px;
	}
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	background-color: var(--bg-default);
	width: 100%;
}

.home-container {
	background-color: var(--bg-default);
	width: 100%;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		flex-direction: column;
		max-width: 1150px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1304px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 12px;
		padding-left: 12px;
	}
}
</style>
