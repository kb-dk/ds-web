<template>
	<div class="head-categories">
		<Transition
			mode="out-in"
			name="fade"
		>
			<div v-if="categoriesLoaded">
				<div class="container category-grid">
					<router-link
						v-for="(entity, i) in categories"
						:key="i"
						:to="{
							name: 'Search',
							query: {
								q: '*:*',
								start: 0,
								fq: [encodeURIComponent(`genre:${quotation(entity.name)}`)],
							},
						}"
						class="category-item"
						:data-testid="addTestDataEnrichment('link', 'category-item', `catergory-${entity.name}`, i)"
					>
						{{ entity.name }}
						<span class="number">{{ entity.number.toLocaleString('de-DE') }}</span>
						<span :class="`category-image ${santizeAndSimplify(entity.name)}`"></span>
					</router-link>
				</div>
			</div>
			<div
				v-else
				class="container"
			>
				<div class="container category-grid">
					<div
						v-for="i in 12"
						:key="i"
						class="category-item"
					>
						<span
							:style="`width:${Math.random() * 30 + 30}%`"
							class="loading"
						></span>
						<span
							:style="`width:${Math.random() * 3 + 3}%`"
							class="loading number"
						></span>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
import { APIService } from '@/api/api-service';
import { facetItem } from '@/types/APIResponseTypes';

export default defineComponent({
	name: 'MainCategories',

	setup() {
		const { t } = useI18n();
		const categories = ref([] as facetItem[]);
		const categoriesLoaded = ref(false);

		const quotation = (name: string) => {
			return `"${name}"`;
		};

		onMounted(() => {
			APIService.getFullResultWithFacets().then((response) => {
				const categoryArray = response.data.facet_counts.facet_fields.genre;
				categoryArray.forEach((item, index) => {
					if (index % 2 === 0) {
						let category = {
							name: `${item}`,
							number: categoryArray[index + 1],
						} as unknown as facetItem;
						categories.value.push(category);
					}
				});
				categoriesLoaded.value = true;
			});
		});

		return { t, categories, addTestDataEnrichment, categoriesLoaded, quotation, santizeAndSimplify };
	},
});
</script>
<style scoped>
.head-categories {
	display: flex;
	width: calc(100vw - 14px);
	justify-content: center;
	padding-top: 25px;
}

.loading {
	height: 26px;
	background-color: rgba(170, 170, 170, 1);
	border-radius: 15px;
}

.loading.number {
	height: 3px;
	margin-bottom: 4px;
	margin-right: 4px;
}

.category-grid {
	display: flex;
	gap: 30px 10px;
	flex-wrap: wrap;
	justify-content: center;
	min-height: 200px;
	box-sizing: border-box;
}

.category-item {
	background: #ffffff 0% 0% no-repeat padding-box;
	box-shadow: 2px 2px 4px #75757500;
	border: 2px solid #ffffff;
	border-radius: 4px;
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
	transition: all 0.3s linear 0s;
}

.category-item:hover {
	background-color: #c4f1ed;
}

.category-image {
	transition: all 0.25s linear 0s;
	color: #c4f1ed;
	position: absolute;
	width: 24px;
	height: 24px;
	z-index: 20;
	top: -21px;
	left: -1px;
	background-image: url('@/assets/icons/default/diverse.svg');
	filter: hue-rotate(5);
}

.category-item:hover .category-image {
	transform: rotateZ(25deg);
	background-image: url('@/assets/icons/cyan/diverse-cyan.svg');
}

.category-item .number {
	position: absolute;
	bottom: -16px;
	right: 8px;
	font-size: 12px !important;
	padding: 5px;
	background: #c4f1ed 0% 0% no-repeat padding-box;
	border: 2px solid #002e70;
	border-radius: 4px;
}

.diverse {
	background-image: url('@/assets/icons/default/diverse.svg');
}
.dokumentar {
	background-image: url('@/assets/icons/default/dokumentar.svg');
}
.fiktion {
	background-image: url('@/assets/icons/default/fiktion.svg');
}
.kultur-og-oplysning {
	background-image: url('@/assets/icons/default/kultur.svg');
}
.livsstil {
	background-image: url('@/assets/icons/default/livsstil.svg');
}
.musik {
	background-image: url('@/assets/icons/default/musik.svg');
}
.nyheder-politik-og-samfund {
	background-image: url('@/assets/icons/default/nyheder.svg');
}
.sport {
	background-image: url('@/assets/icons/default/sport.svg');
}
.underholdning {
	background-image: url('@/assets/icons/default/underholdning.svg');
}
.videnskab-og-natur {
	background-image: url('@/assets/icons/default/videnskab.svg');
}
.brn-og-unge {
	background-image: url('@/assets/icons/default/born.svg');
}

.category-item:hover .diverse {
	background-image: url('@/assets/icons/cyan/diverse-cyan.svg');
}
.category-item:hover .dokumentar {
	background-image: url('@/assets/icons/cyan/dokumentar-cyan.svg');
}
.category-item:hover .fiktion {
	background-image: url('@/assets/icons/cyan/fiktion-cyan.svg');
}
.category-item:hover .kultur-og-oplysning {
	background-image: url('@/assets/icons/cyan/kultur-cyan.svg');
}
.category-item:hover .livsstil {
	background-image: url('@/assets/icons/cyan/livsstil-cyan.svg');
}
.category-item:hover .musik {
	background-image: url('@/assets/icons/cyan/musik-cyan.svg');
}
.category-item:hover .nyheder-politik-og-samfund {
	background-image: url('@/assets/icons/cyan/nyheder-cyan.svg');
}
.category-item:hover .sport {
	background-image: url('@/assets/icons/cyan/sport-cyan.svg');
}
.category-item:hover .underholdning {
	background-image: url('@/assets/icons/cyan/underholdning-cyan.svg');
}
.category-item:hover .videnskab-og-natur {
	background-image: url('@/assets/icons/cyan/videnskab-cyan.svg');
}
.category-item:hover .brn-og-unge {
	background-image: url('@/assets/icons/cyan/born-cyan.svg');
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
		gap: 45px 40px;
		justify-content: flex-start;
	}

	.container {
		display: flex;
		max-width: 1150px;
	}
	.category-item {
		width: calc(25% - 30px);
		flex: 0 0 calc(25% - 30px);
		margin: 0px 0px;
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
	.category-grid {
		padding: 0px;
	}
}
</style>
