<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
		<Logo></Logo>
		<HeaderMenu></HeaderMenu>
		<div class="container headline-container">
			<router-link
				class="headline-link"
				:to="{ name: 'Home' }"
			>
				<h1 :aria-label="`${t('hero.title')}`">
					<span class="headline heading-display">
						<span class="text">{{ t('hero.title') }}</span>
					</span>
				</h1>
			</router-link>
			<Transition name="bcfade">
				<Breadcrumb v-if="routerReady && $route.name !== 'Home'" />
			</Transition>
			<Transition name="sbfade">
				<SearchBar v-if="$route.name !== undefined && $route.name !== 'Record'"></SearchBar>
			</Transition>
		</div>
	</div>
	<TransitionGroup name="linefade">
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
	transition: all 0.25s cubic-bezier(0.85, 0.09, 0.15, 0.91) 0s;
	background-color: var(--bg-default);
	height: 170px;
}

.header-container.home {
	background-color: var(--bg-default);
}

.header-container.record {
	height: 230px;
}

.header-container.record,
.header-container.search,
.header-container.notfound {
	overflow: hidden;
}

.header-container.search,
.header-container.notfound {
	transition: all 0.25s cubic-bezier(0.85, 0.09, 0.15, 0.91) 0s;
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
}

.headline-link {
	margin-top: 24px;
	width: fit-content;
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

.linefade-enter-active,
.linefade-leave-active {
	transition:
		opacity 500ms ease 0.5s,
		height 500ms ease 0.5s;
	overflow: hidden;
}

.linefade-enter-from,
.linefade-leave-to {
	transition:
		opacity 150ms ease 0s,
		height 150ms ease 0s;
	opacity: 0;
	height: 0;
}

.linefade-enter-to,
.linefade-leave-from {
	opacity: 1;
	height: 20px;
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

.sbfade-enter-active {
	transition: opacity 0.25s ease 0.5s;
}

.sbfade-leave-active {
	transition: opacity 0.25s ease;
}

.sbfade-enter-from,
.sbfade-leave-to {
	opacity: 0;
}
</style>
