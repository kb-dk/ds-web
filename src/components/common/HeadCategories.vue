<template>
	<div class="head-categories">
		<div class="container category-grid">
			<router-link
				v-for="(entity, i) in categories"
				:key="i"
				:to="{
					name: 'Home',
					query: {
						q: '*:*',
						start: 0,
						fq: [encodeURIComponent(`genre:${entity.name}`)],
					},
				}"
				class="category-item"
				:data-testid="addTestDataEnrichment('link', 'category-item', `catergory-link`, i)"
			>
				{{ entity.name }}
				<span class="number">{{ entity.number }}</span>
			</router-link>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import { APIService } from '@/api/api-service';
import { facetItem } from '@/types/APIResponseTypes';
export default defineComponent({
	name: 'HeadCategories',

	setup() {
		const { t } = useI18n();
		const categories = ref([] as facetItem[]);

		onMounted(() => {
			APIService.getFullResultWithFacets().then((response) => {
				const categoryArray = response.data.facet_counts.facet_fields.genre;
				categoryArray.forEach((item, index) => {
					if (index % 2 === 0) {
						let category = {
							name: item,
							number: categoryArray[index + 1],
						} as unknown as facetItem;
						categories.value.push(category);
					}
				});
			});
			console.log(categories);
		});

		return { t, categories, addTestDataEnrichment };
	},
});
</script>
<style scoped>
.head-categories {
	display: flex;
	width: calc(100vw - 14px);
	justify-content: center;
}

.category-grid {
	display: flex;
	gap: 10px;
	flex-wrap: wrap;
	justify-content: center;
	min-height: 200px;
}

.category-item {
	background: #d9f5fe 0% 0% no-repeat padding-box;
	box-shadow: 0px 0px 10px #d9f5fe66;
	border: 1px solid #d9f5fe;
	color: black;
	width: 100%;
	padding: 10px 5px;
	box-sizing: border-box;
	margin: 5px 10px;
	height: 75px;
	border: 2px solid #002e7026;
	border-radius: 4px;
	position: relative;
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
}

.category-item .number {
	position: absolute;
	bottom: 0px;
	right: 0;
	font-size: 12px;
	padding: 5px;
}

.container {
	width: 100%;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.container {
		max-width: 640px;
	}
	.category-item {
		width: calc(50% - 10px);
		margin: 0px;
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
	.category-grid {
		padding: 0px 5px;
		gap: 15px 40px;
		justify-content: flex-start;
	}

	.container {
		display: flex;
		max-width: 1150px;
	}
	.category-item {
		width: calc(25% - 30px);
		margin: 0px 0px;
	}
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
	.container {
		max-width: 1280px;
	}
	.full-width {
		width: 100vw;
	}
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
	.container {
		padding-right: 0;
		padding-left: 0;
	}
	.category-grid {
		padding: 0px;
	}
}
</style>
