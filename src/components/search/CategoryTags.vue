<template>
	<div>
		<div class="category-tags">
			<h2 class="headline">{{ t('search.relatedSubjects') }} ({{ currentCategoryNr }})</h2>
			<Transition
				name="fade"
				mode="out-in"
			>
				<div>
					<div
						:class="filterExists('categories', categoryFacets[index]?.title) ? 'tag active' : 'tag'"
						v-for="(singleCategory, index) in currentCategoryNr as unknown as facetPair[]"
						:key="index + 'category'"
					>
						<router-link
							:class="categoryFacets[index] !== undefined ? 'tag-link' : 'tag-link disabled'"
							:to="{
								name: 'Home',
								query: {
									q: searchResultStore.currentQuery,
									start: 0,
									fq: filterExists('categories', categoryFacets[index]?.title)
										? removeFilter(route, createFilter(categoryFacets[index]?.title)).fq
										: addFilter(route, createFilter(categoryFacets[index]?.title)).fq,
								},
							}"
						>
							<div
								:style="'animation-delay:' + Math.random() + 's'"
								class="shimmer"
							></div>
							<span
								:style="'width: ' + Math.ceil(Math.random() * 30 + 30) + 'px'"
								class="tag-title"
							>
								{{ categoryFacets[index]?.title }}
							</span>
							<span class="tag-number">{{ categoryFacets[index]?.number }}</span>
						</router-link>
						<span>
							{{ index < currentCategoryNr - 1 && categoryFacets.length > 0 ? ',' : '' }}
						</span>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useRoute } from 'vue-router';
import { facetPair } from '@/types/GenericRecordTypes';
import { createFilter, addFilter, removeFilter, filterExists, simplifyFacets } from '@/utils/filter-utils';
import { useI18n } from 'vue-i18n';

import '@/components/search/wc-facet-checkbox';

export default defineComponent({
	name: 'CategoryTags',

	props: {
		categories: { type: Object as PropType<facetPair[]>, required: true },
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const currentCategoryNr = ref(0);
		const categoryFacets = ref([] as facetPair[]);

		const route = useRoute();

		const { t } = useI18n();

		onMounted(() => {
			currentCategoryNr.value = categoryFacets.value.length;

			watch(
				() => props.categories,
				(newCategories: facetPair[], prevCategories: facetPair[]) => {
					if (newCategories.length !== 0) {
						currentCategoryNr.value = newCategories.length;
					}
					categoryFacets.value = newCategories;
				},
			);
		});

		return {
			searchResultStore,
			filterExists,
			simplifyFacets,
			currentCategoryNr,
			categoryFacets,
			createFilter,
			addFilter,
			removeFilter,
			route,
			t,
		};
	},
});
</script>

<style lang="scss" scoped>
h2 {
	font-size: 16px;
	color: black;
}

.disabled .shimmer {
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
	background-position: 160% center;
}

@keyframes loading {
	0% {
		background-position: 160% center;
	}
	20% {
		background-position: 160% center;
	}
	80% {
		background-position: -20% center;
	}
	100% {
		background-position: -20% center;
	}
}

.category-tags {
	flex-wrap: wrap;
	margin-top: 20px;
}

.category-tags .tag {
	font-family: noway, sans-serif;
	padding: 0px 0px;
	margin: 2px 5px;
	color: black;
	display: inline-block;
	text-decoration: none;
	font-size: 14px;
	transition: all 0.3s linear 0s;
}

.category-tags .tag-link {
	text-decoration: none;
	border-bottom: 1px solid #002e70;
	height: 19px;
	display: inline-block;
}

.category-tags .tag .tag-title {
	font-style: italic;
	color: #002e70;
}

.category-tags .tag .tag-number {
	font-size: 10px;
	margin-left: 5px;
	color: rgba(130, 130, 130, 1);
}

.category-tags .tag.active .tag-link {
	background-color: #002e70;
	font-weight: bold;
	padding: 0px 3px;
}

.category-tags .tag.active .tag-title {
	color: white !important;
}

.tag-link.disabled {
	pointer-events: none;
	border: 0px solid;
	position: relative;
}

.tag-title,
.tag-link,
.tag-number {
	background-color: transparent;
	transition: all 0.25s ease-in-out 0s;
}

.tag-link.disabled .tag-title {
	background-color: rgba(170, 170, 170, 1);
	height: 14px;
	border-radius: 20px;
	display: inline-block;
	color: transparent;
}

.tag-link.disabled .tag-number {
	background-color: rgba(170, 170, 170, 1);
	width: 10px;
	height: 10px;
	opacity: 0.5;
	border-radius: 20px;
	display: inline-block;
}

.category-tags a:visited {
	color: #002e70;
}

.tag-number::before {
	content: '(';
}

.tag-number::after {
	content: ')';
}

.tag-number:empty::after {
	content: '';
}

.tag-number:empty::before {
	content: '';
}
</style>
