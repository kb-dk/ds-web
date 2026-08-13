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
			<h2>{{ categories.length }} {{ t('facets.genres', 2) }}:</h2>
			<KBButton
				v-for="(category, i) in categories"
				:key="category.name"
				button-type="btn-cta"
				button-color="cta"
				button-size="medium"
				class="btn-medium"
				:button-text="`${t(`categories.${santizeAndSimplify(category.name)}`)}`"
				:left-icon-name="returnCategoryIcon(category.name)"
				:icon-filled="returnFilledIconStatus(category.name)"
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
		<div
			v-else
			class="loading-container"
		>
			<div class="loading-header">
				<div
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div>
				<span class="loading"></span>
				<h2>{{ t('facets.genres', 2) }}:</h2>
			</div>

			<div
				v-for="i in 12"
				:key="i"
				class="category-item"
			>
				<div
					:style="`animation-delay:${Math.random() * 2}s`"
					class="shimmer"
				></div>
				<span
					:style="`width:${Math.random() * 30 + 50}%`"
					class="loading"
				></span>
				<NoFacetContent
					v-if="categoriesLoaded && categories.length === 0"
					position="absolute"
				></NoFacetContent>
			</div>
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
import { returnCategoryIcon, returnFilledIconStatus } from '@/utils/icon-utils';
import NoFacetContent from '@/components/global/content-elements/NoFacetContent.vue';

export default defineComponent({
	name: 'SpotCategories',
	components: { SimpleSpot, KBButton, NoFacetContent },
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
		return {
			t,
			categories,
			categoriesLoaded,
			quotation,
			scrollToTop,
			addTestDataEnrichment,
			santizeAndSimplify,
			returnCategoryIcon,
			returnFilledIconStatus,
		};
	},
});
</script>

<style scoped>
h3 {
	margin: 0;
	display: contents;
	text-align: center;
}
.spot-categories {
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
	align-items: baseline;
}

.spot-categories h2 {
	padding-right: 15px;
}

.spot-categories > * {
	margin-right: 3px;
	margin-left: 7px;
	margin-bottom: 15px;
}
.loading-header {
	display: flex;
	width: fit-content;
	align-items: baseline;
}
.loading-header .shimmer {
	height: calc(var(--fs-sm) - 5px);
	width: 35px;
	margin: 0;
	border-radius: 15px;
}
.loading-header .loading {
	width: 35px;
	height: calc(var(--fs-xl) - 5px);
	margin-right: 5px;
}
.loading-container {
	display: flex;
	width: 100%;
	flex-direction: row;
	gap: 20px 15px;
	flex-wrap: wrap;
	box-sizing: border-box;
	padding: 0px 12px;
	align-items: baseline;
}

.loading {
	display: flex;
	height: 14px;
	background-color: rgba(170, 170, 170, 1);
	border-radius: 15px;
}
.category-item {
	background: var(--bg-main) 0% 0% no-repeat padding-box;
	box-shadow: 2px 2px 4px #75757500;
	border: 2px solid #ffffff;
	border-radius: 4px;
	color: white;
	width: 150px;
	padding: 8px 8px 0px 10px;
	box-sizing: border-box;
	margin: 0px 10px;
	height: 34px;
	border: 2px solid #002e7026;
	border-radius: 4px;
	position: relative;
	text-decoration: none;
	display: flex;
	transition: all 0.1s linear 0s;
}

.shimmer {
	animation: loading 3s ease-in-out 0s infinite;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		117deg,
		rgba(255, 255, 255, 0) 44%,
		rgba(255, 255, 255, 0.7455357142857143) 64%,
		rgba(255, 255, 255, 0) 77%
	);
	position: absolute;
	width: 100%;
	height: 100%;
	mix-blend-mode: soft-light;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 200% center;
	margin-top: -10px;
	margin-left: -10px;
}

@keyframes loading {
	0% {
		background-position: 200% center;
	}
	20% {
		background-position: 200% center;
	}
	80% {
		background-position: 0% center;
	}
	100% {
		background-position: 0% center;
	}
}
</style>
