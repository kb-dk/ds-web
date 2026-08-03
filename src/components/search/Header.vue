<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
		<Logo></Logo>
		<HeaderMenu></HeaderMenu>
		<div class="container headline-container">
			<router-link :to="{ name: 'Home' }">
				<h1 :aria-label="`${t('hero.title')}`">
					<span class="headline heading-display">
						<span class="text">{{ t('hero.title') }}</span>
					</span>
				</h1>
			</router-link>
			<Transition name="bcfade">
				<Breadcrumb v-if="routerReady && $route.name !== 'Home'" />
			</Transition>
			<SearchBar></SearchBar>
		</div>
	</div>
	<TransitionGroup name="fade">
		<div
			v-if="routerReady && $route.name !== 'Home'"
			class="line first"
		></div>
		<div
			v-if="routerReady && $route.name !== 'Home'"
			class="line second"
		></div>
	</TransitionGroup>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import HeaderMenu from '@/components/global/nav/HeaderMenu.vue';
import { useI18n } from 'vue-i18n';
import SearchBar from '@/components/search/SearchBar.vue';
import Breadcrumb from '@/components/global/nav/Breadcrumb.vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/global/Logo.vue';

export default defineComponent({
	name: 'Header',
	components: { HeaderMenu, SearchBar, Breadcrumb, Logo },
	props: {
		locale: { type: String, required: true },
	},
	setup() {
		const { t } = useI18n();
		const router = useRouter();
		const routerReady = ref(false);

		onMounted(async () => {
			await router.isReady();
			routerReady.value = true;
		});

		return { t, routerReady };
	},
});
</script>
<style scoped>
.header-container {
	display: flex;
	position: relative;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	transition-delay: 0.25s !important;
	transition: height 0.25s cubic-bezier(0.85, 0.09, 0.15, 0.91);
	background-color: var(--bg-default);
	min-height: 170px;
}

.header-container.home {
	background-color: var(--bg-default);
}

.header-container.search,
.header-container.notfound {
	background-color: var(--color-default);
	height: 322px;
	transition-delay: 0.25s !important;
}

.container {
	position: relative;
	display: flex;
	z-index: 4;
	width: 100%;
	max-width: 1280px;
	flex-direction: column;
	/* align-items: baseline; */
}
.container > a {
	text-decoration: none;
}
h1 .headline {
	display: block;
	background-color: transparent;
	width: fit-content;
	padding: 0px 0px;
	pointer-events: all;
	position: relative;
	z-index: 1;
	pointer-events: none;
	letter-spacing: 1.15px;
	color: var(--color-main);
}

h1 .headline .text {
	font-size: var(--fs-xl-fixed);
}
h1 {
	margin: 0;
	display: block;
	width: fit-content;
	position: relative;
	top: 24px;
}

.line {
	width: 100%;
	height: 20px;
}

.line.first {
	background: rgba(234, 159, 188, 0.7);
}

.line.second {
	background: rgba(234, 159, 188, 0.2);
}

.bcfade-enter-active,
.bcfade-leave-active {
	transition: opacity 0.25s ease 0.5s;
}

.bcfade-enter-from,
.bcfade-leave-to {
	opacity: 0;
	transition: opacity 0.25s ease 0s;
}
</style>
