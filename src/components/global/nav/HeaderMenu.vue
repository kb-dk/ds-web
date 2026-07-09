<template>
	<div class="overall-header">
		<div class="global-header">
			<div class="logo-wrapper row justify-content-between">
				<div class="col logo-col">
					<a
						href="https://www.kb.dk"
						class="rdl-logo"
						title="Logo of the Royal Danish Library"
						data-testid="link-topmenu-logo-0"
					>
						<span class="sr-only">Royal Danish Library Logo</span>
					</a>
				</div>
			</div>
			<ul
				v-if="currentLocaleMessages"
				role="menubar"
				class="header-items"
			>
				<li
					v-for="(item, index) in currentLocaleMessages.secondary"
					:key="index"
					role="none"
					class="header-item"
					:class="item.icon"
				>
					<button
						v-if="item.id"
						class="nav-item menu-secondary"
						:data-testid="addTestDataEnrichment('link', 'topmenu', item.title, 0)"
						role="menuitem"
						@click="switchLocale"
					>
						<span>
							{{ item.title }}
						</span>
						<i
							v-if="item.icon"
							class="material-icons"
							:aria-hidden="true"
						>
							{{ item.icon }}
						</i>
					</button>
					<a
						v-else
						:href="item.link"
						:data-testid="addTestDataEnrichment('link', 'topmenu', item.title, 0)"
						class="nav-item menu-secondary"
						role="menuitem"
					>
						<span v-text="item.title"></span>
						<i
							v-if="item.icon"
							class="material-icons"
							:aria-hidden="true"
						>
							{{ item.icon }}
						</i>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { HeaderType } from '@/types/HeaderType';
import { LocalStorageWrapper } from '@/utils/local-storage-wrapper';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { defineComponent, onMounted, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
	name: 'HeaderMenu',
	props: {},

	setup() {
		const { t, messages, locale } = useI18n();
		const currentLocaleMessages = ref(undefined as unknown as HeaderType);
		const mainHeaderRef = ref<HTMLFormElement | null>(null);
		const menuOpen = ref(false);
		const router = useRouter();
		const route = useRoute();

		const switchLocale = () => {
			locale.value = locale.value === 'da' ? 'en' : 'da';
			const html = document.querySelector('html');
			html?.setAttribute('lang', locale.value);
			LocalStorageWrapper.set('locale', locale.value);
			const routeQueries = { ...route.query };
			routeQueries.locale = locale.value;
			router.replace({ query: routeQueries });
		};

		onMounted(() => {
			currentLocaleMessages.value = toRaw(messages.value[locale.value].header) as HeaderType;
		});

		watch(
			() => locale.value,
			(newLocale: string, prevLocale: string) => {
				if (newLocale !== prevLocale) {
					currentLocaleMessages.value = toRaw(messages.value[locale.value].header) as HeaderType;
				}
			},
		);
		return {
			mainHeaderRef,
			switchLocale,
			t,
			currentLocaleMessages,
			addTestDataEnrichment,
			menuOpen,
		};
	},
});
</script>

<style scoped>
.overall-header {
	position: relative;
	z-index: 3;
	height: 42px;
	background-color: var(--bg-header);
	display: flex;
	justify-content: center;
	width: 100%;
}
.global-header {
	justify-content: space-between;
	max-width: 1280px;
	display: flex;
	width: 100%;
	flex-direction: row;
	align-items: center;
}
.rdl-logo {
	background-image: url('@/assets/images/KB_logo_inverted.svg');
	background-position: 0;
	background-repeat: no-repeat;
	background-size: contain;
	background-color: var(--bg-header);
	display: inline-block;
	height: 32px;
	width: 138px;
	position: relative;
	z-index: 1;
	text-decoration: none;
	opacity: 0.8;

	width: 97px;
	height: 22.275px;
	aspect-ratio: 97/22.28;
}
.header-items {
	display: flex;
	flex-direction: row;
	color: var(--color-main);
	cursor: pointer;
	list-style-type: none;
}
.header-item {
	transition: border-bottom-color 0.3s ease-in-out;
	border-bottom: 2px solid transparent;
	margin-right: 4px;
	letter-spacing: -0.2px;
	display: flex;
	align-items: center;
}
.header-item > * {
	text-transform: uppercase;
	text-decoration: none;
	color: var(--color-main);
}
.header-item:hover {
	border-color: var(--color-border-success);
}
.header-items button {
	cursor: pointer;
	border: 0;
	background-color: transparent;
}
.header-items:hover {
	border-color: black;
}
.account_circle i {
	font-size: 14px !important;
	top: 2px !important;
	margin-left: 4px;
	position: relative;
}
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
