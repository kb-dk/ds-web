<template>
	<div class="home-container">
		<div>
			<Hero />
			<PortalContent />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import PortalContent from '@/components/common/PortalContent.vue';
import Hero from '@/components/search/Hero.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Home',
	components: {
		PortalContent,
		Hero,
	},

	setup() {
		const searchContainer = ref<HTMLElement | null>(null);
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();

		onMounted(() => {
			searchResultStore.resetSearch();
			document.title = t('app.titles.frontpage.archive.name') as string;
		});

		return {
			searchResultStore,
			searchContainer,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.container {
	text-align: left;
	margin-right: auto;
	margin-left: auto;
	box-sizing: border-box;
	padding-right: 12px;
	padding-left: 12px;
	margin-top: -85px;
}

.home-container {
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
		max-width: 1280px;
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
