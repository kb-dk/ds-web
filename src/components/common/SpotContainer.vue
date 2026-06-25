<template>
	<div class="spot-container">
		<div class="spot-row">
			<spot-categories></spot-categories>
		</div>
		<div class="spot-row">
			<simple-spot spot-size="small">
				<span class="label-big">En kasse til noget display 349.994 minutters noget helt tilbage fra 1952.</span>
			</simple-spot>
			<simple-spot
				spot-size="small"
				icon-name="link"
				color="light"
			>
				<a
					:href="t('hero.link')"
					class="label-big link"
				>
					{{ t('hero.linkText') }}
				</a>
			</simple-spot>
			<advanced-spot spot-size="medium"></advanced-spot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SimpleSpot from '@/components/common/SimpleSpot.vue';
import { facetItem } from '@/types/APIResponseTypes';
import AdvancedSpot from '@/components/common/AdvancedSpot.vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { Priority, Severity } from '@/types/NotificationType';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
import SpotCategories from '@/components/common/SpotCategories.vue';
export default defineComponent({
	name: 'SpotContainer',
	components: { SimpleSpot, AdvancedSpot, SpotCategories },
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
.spot-container {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
}
.spot-row {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
	flex-wrap: wrap;
	/* background-repeat: no-repeat; */

	justify-content: space-between;
}
.link {
	color: inherit;
	text-decoration: inherit;
	border-bottom: 1px solid transparent;
}
.link:hover {
	transition: border-color linear 0.3s ease-in-out;
	border-bottom-color: var(--color-border-success);
}
</style>
