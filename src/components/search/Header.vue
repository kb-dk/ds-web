<template>
	<div :class="`header-container ${typeof $route.name === 'string' ? $route.name.toLowerCase() : ''}`">
		<HeaderMenu></HeaderMenu>
		<Logo></Logo>
		<div class="container">
			<div class="headline-container">
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
	</div>
	<ContainerSplitBar
		:show-bars="routerReady && $route.name !== 'Home'"
		:is-top="true"
		:animate-bars="true"
		top-color="var(--bg-main-2)"
		bottom-color="var(--bg-main-3)"
	></ContainerSplitBar>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import HeaderMenu from '@/components/global/nav/HeaderMenu.vue';
import { useI18n } from 'vue-i18n';
import SearchBar from '@/components/search/SearchBar.vue';
import Breadcrumb from '@/components/global/nav/Breadcrumb.vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/global/Logo.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';

export default defineComponent({
	name: 'Header',
	components: { HeaderMenu, SearchBar, Breadcrumb, Logo, ContainerSplitBar },
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
	height: 322px;
	z-index: 4;
	width: 100%;
}

.header-container.home {
	background-color: var(--bg-default);
}

.header-container.record {
	height: 230px;
}

.header-container.record,
.header-container.notfound {
	overflow: hidden;
}
.headline-link {
	text-decoration: none;
	margin-top: 24px;
	width: fit-content;
	display: block;
}

.header-container.search,
.header-container.notfound {
	transition: all 0.25s cubic-bezier(0.85, 0.09, 0.15, 0.91) 0s;
	background-color: var(--color-default);
	height: 322px;
	transition-delay: 0.25s !important;
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

@media (min-width: 990px) {
	.header-container {
		height: 170px;
	}
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
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
