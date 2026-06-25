<template>
	<simple-spot
		spot-size="max"
		color="light"
		icon-name="category"
	>
		<div
			v-if="categoriesLoaded && categories.length"
			class="spot-categories"
		>
			<h3>{{ categories.length }} kategorier:</h3>
			<KBButton
				v-for="(category, i) in categories"
				:key="category.name"
				button-type="btn-cta"
				button-color="cta"
				button-size="small"
				class="btn-small"
				:button-text="`${t(`categories.${santizeAndSimplify(category.name)}`)}`"
				:custom-icon-left="`category-image ${santizeAndSimplify(category.name)}`"
				:is-router-link="true"
				:data-testid="addTestDataEnrichment('link', 'category-item', `catergory-${category.name}`, i)"
				:to="{
					name: 'Search',
					query: {
						q: '*:*',
						start: 0,
						fq: [encodeURIComponent(`genre_facet:${quotation(category.name)}`)],
					},
				}"
				@click="scrollToTop()"
			></KBButton>
		</div>
	</simple-spot>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SimpleSpot from '@/components/common/SimpleSpot.vue';
import { facetItem } from '@/types/APIResponseTypes';
import KBButton from '@/components/common/KBButton.vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { Priority, Severity } from '@/types/NotificationType';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
export default defineComponent({
	name: 'SpotCategories',
	components: { SimpleSpot, KBButton },
	setup() {
		const { t } = useI18n();
		const searchResultStore = useSearchResultStore();
		const categories = ref([] as facetItem[]);
		const categoriesLoaded = ref(false);
		const errorManager = inject('errorManager') as ErrorManagerType;

		const quotation = (name: string) => {
			return `"${name}"`;
		};
		const constructGenre = () => {
			const categoryArray = searchResultStore.initFacets.facet_fields.genre_facet;
			categoryArray.forEach((item, index) => {
				if (index % 2 === 0) {
					let category = {
						name: `${item}`,
						number: categoryArray[index + 1],
					} as unknown as facetItem;
					categories.value.push(category);
				}
			});
			categories.value.sort((a, b) => a.name.localeCompare(b.name));
			categoriesLoaded.value = true;
		};
		const scrollToTop = () => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		};
		onMounted(() => {
			if (searchResultStore.firstBackendFetchExecuted && Object.keys(searchResultStore.initFacets).length !== 0) {
				constructGenre();
			} else {
				watch(
					() => searchResultStore.firstBackendFetchExecuted,
					(newVal: boolean) => {
						if (newVal && Object.keys(searchResultStore.initFacets).length !== 0) {
							constructGenre();
						} else {
							categoriesLoaded.value = true;
							errorManager.submitCustomError(
								'categories-error',
								t('error.infoError.title'),
								t('error.auth.serviceFailed'),
								Severity.ERROR,
								true,
								Priority.MEDIUM,
							);
						}
					},
				);
			}
		});
		return { t, categories, categoriesLoaded, quotation, scrollToTop, addTestDataEnrichment, santizeAndSimplify };
	},
});
</script>

<style scoped>
h3 {
	margin: 0;
}
.spot-categories {
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
}
.spot-categories > * {
	margin-right: 10px;
	margin-bottom: 10px;
}
</style>
