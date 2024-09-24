<template>
	<div class="bg-container">
		<div class="breadcrumb container">
			<span class="material-icons home">home</span>
			<a href="https://www.kb.dk">
				<span class="breadcrumb-title">{{ t('breadcrumb.frontpage') }}</span>
			</a>
			/
			<a href="https://www.kb.dk/find-materiale">
				<span class="breadcrumb-title">{{ t('breadcrumb.findMaterials') }}</span>
			</a>
			/
			<router-link
				:to="{ name: 'Home' }"
				@click="emptyQuery()"
			>
				<span class="breadcrumb-title highlighted">{{ t('breadcrumb.drArchive') }}</span>
			</router-link>
			<span v-if="$route.name === 'Search'">
				<span>/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</span>
			<router-link
				v-if="$route.name === 'Record' && lastPath"
				:to="lastPath"
			>
				<span>/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<router-link
				v-if="$route.name === 'Record' && !lastPath"
				:to="{ name: 'Search' }"
			>
				<span>/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.search') }}</span>
			</router-link>
			<span v-if="$route.name === 'Record'">
				<span>/</span>
				<span class="breadcrumb-title">{{ t('breadcrumb.record') }}</span>
			</span>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
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

		onMounted(() => {
			lastPath.value = router.options.history.state.back as string;
		});

		watch(
			() => route.path,
			() => {
				lastPath.value = router.options.history.state.back as string;
			},
		);

		const emptyQuery = () => {
			searchResultStore.currentQuery = '';
			searchResultStore.loading = false;
			searchResultStore.preliminaryFilter = '';
			searchResultStore.resetSearch();
		};

		return { t, addTestDataEnrichment, lastPath, emptyQuery };
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

.home {
	font-size: 18px;
}

.breadcrumb a {
	text-decoration: none;
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
	padding: 0px 0px;
	text-decoration: none;
	margin: 0px 2px;
	color: black;
	font-size: 12px;
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
