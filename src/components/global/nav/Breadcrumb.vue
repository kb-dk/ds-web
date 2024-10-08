<template>
	<div :class="`bg-container ${currentPage}`">
		<div class="breadcrumb container">
			<span class="material-icons home-icon">home</span>
			<span class="material-icons back-arrow">chevron_left</span>
			<a
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'home-logo', 0)"
				href="https://www.kb.dk"
				class="level-1"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.frontpage') }}</span>
				<span class="line">/</span>
			</a>
			<a
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'find-materials', 1)"
				href="https://www.kb.dk/find-materiale"
				class="level-2"
			>
				<span class="breadcrumb-title">{{ t('breadcrumb.findMaterials') }}</span>
				<span class="line">/</span>
			</a>
			<router-link
				:to="{ name: 'Home' }"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'frontpage', 2)"
				class="level-3"
				@click="searchResultStore.resetSearch()"
			>
				<span class="breadcrumb-title highlighted">{{ t('breadcrumb.drArchive') }}</span>
			</router-link>
			<span
				v-if="$route.name === 'Search'"
				class="level-4"
			>
				<span class="line">/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</span>
			<router-link
				v-if="$route.name === 'Record' && lastPath"
				class="level-5"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-with-result', 3)"
				:to="lastPath"
			>
				<span class="line">/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<router-link
				v-if="$route.name === 'Record' && !lastPath"
				class="level-5"
				:to="{ name: 'Search' }"
				:data-testid="addTestDataEnrichment('button', 'breadcrumb', 'search-page-empty', 4)"
			>
				<span class="line">/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<span
				v-if="$route.name === 'Record'"
				class="level-6"
			>
				<span>/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.record') }}</span>
			</span>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { useRouter, useRoute } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'Breadcrumb',
	setup() {
		const { t } = useI18n();
		const router = useRouter();
		const lastPath = ref('');
		const searchResultStore = useSearchResultStore();
		const route = useRoute();

		const currentPage = computed(() => {
			let page = route.name as string;
			if (page) {
				return page.toLowerCase();
			} else {
				return '';
			}
		});

		onMounted(() => {
			lastPath.value = router.options.history.state.back as string;
		});

		watch(
			() => route.path,
			() => {
				lastPath.value = router.options.history.state.back as string;
			},
		);

		return { t, addTestDataEnrichment, lastPath, searchResultStore, currentPage };
	},
});
</script>

<style scoped>
.breadcrumb {
	height: 40px;
	position: relative;
	background-color: #caf0fe;
	z-index: 1;
	display: flex;
	flex-direction: row;
	font-size: 16px;
}

.level-1,
.level-2,
.level-3,
.level-4,
.level-5,
.level-6 {
	display: none;
}

.home .level-2,
.home .level-3 {
	display: initial;
}

.record .level-5,
.record .level-6 {
	display: initial;
}

.record .level-5 .line {
	display: none;
}

.search .level-3,
.search .level-4 {
	display: initial;
}

.home-icon {
	display: none;
	font-size: 18px;
}

.back-arrow {
	font-size: 18px;
}

.breadcrumb a {
	text-decoration: none;
}

.breadcrumb a:hover span {
	color: #002e70;
}

.breadcrumb a:hover .line {
	color: black;
}

.breadcrumb a:hover .highlighted {
	color: white;
}

.breadcrumb a:visited {
	color: black;
}

.breadcrumb-title.highlighted {
	color: white;
	background-color: #002e70;
	border-radius: 4px;
}

.bg-container {
	z-index: 2;
	background-color: #caf0fe;
	position: relative;
}

.breadcrumb-title {
	padding: 0px 4px;
	text-decoration: none;
	margin: 0px 2px;
	color: black;
	font-size: 12px;
}

.record .breadcrumb-title.level-4 {
	display: initial;
}

.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	align-items: center;
}

.container span {
	color: black;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
		padding-right: 12px;
		padding-left: 12px;
	}
	.breadcrumb-title {
		font-size: 14px;
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
	.breadcrumb-title {
		padding: 0px 3px;
		margin: 0px 5px;
		font-size: 16px;
	}
	.container {
		max-width: 990px;
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
	.container {
		display: flex;
		max-width: 1150px;
	}

	.back-arrow {
		display: none;
	}

	.level-1,
	.level-2,
	.level-3,
	.level-4,
	.level-5,
	.level-6 {
		display: initial;
	}

	.line {
		display: initial !important;
	}

	.home-icon {
		display: block;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
}
</style>
