<template>
	<Transition
		name="result"
		mode="out-in"
	>
		<div>
			<div class="no-hits-heading">{{ $t('search.nohit', { query: searchResultStore.lastSearchQuery }) }}</div>
			<div class="no-hits-heading-subtitle">
				{{ $t('search.nohitSubtitle.firstPart') }}
				{{ $t('search.nohitSubtitle.readMore') }}
				<a
					:href="$t('search.nohitSubtitle.link')"
					:data-testid="addTestDataEnrichment('link', 'NoHits', 'link-to-about', 0)"
				>
					{{ $t('search.nohitSubtitle.contains') }}
				</a>
				{{ $t('search.nohitSubtitle.lastPart') }}
			</div>
			<EdgedContentArea
				v-if="searchResultStore.spellCheck?.collations.length > 0"
				:lines="true"
				:dotted-edges="false"
				background-color="#c4f1ed"
				align-items="start"
			>
				<template #content>
					<h2>{{ $t('search.maybeYouMeant') }}</h2>
					<div class="no-hits">
						<SpellChecker :spell-check="searchResultStore.spellCheck" />
					</div>
				</template>
			</EdgedContentArea>
			<TiltedDivider
				:title="$t('search.searchGuide.title')"
				:right="true"
			></TiltedDivider>
			<TextAndImage :hide-image-on-mobile="true">
				<template #text>
					<div>
						<h3>{{ $t('search.searchGuide.subtitle') }}</h3>
						<ul>
							<li>
								<div>{{ $t('search.searchGuide.first') }}</div>
							</li>
							<li>
								<div>
									{{ $t('search.searchGuide.second.line1') }}
								</div>
								<div>{{ $t('search.searchGuide.second.line2') }}</div>
							</li>
							<li>
								<div>{{ $t('search.searchGuide.third.line1') }}</div>
								<div>{{ $t('search.searchGuide.third.line2') }}</div>
							</li>
							<li>
								<div>
									{{ $t('search.searchGuide.fourth') }}
								</div>
							</li>
							<li>
								<div>
									{{ $t('search.searchGuide.readMore') }}
									<a
										:href="$t('search.searchGuide.link')"
										:data-testid="addTestDataEnrichment('link', 'NoHits', 'link-to-search-tips', 0)"
									>
										{{ $t('search.searchGuide.searchTips') }}
									</a>
								</div>
							</li>
						</ul>
					</div>
				</template>
				<template #image><div class="material-icons search-icon">search</div></template>
			</TextAndImage>
			<EdgedContentArea
				:lines="true"
				:title="$t('search.mainCategories')"
				class="main-categories-header"
			>
				<template #content>
					<div class="showcase-container">
						<MainCategories></MainCategories>
					</div>
				</template>
			</EdgedContentArea>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import SpellChecker from '@/components/search/SpellChecker.vue';
import TiltedDivider from '@/components/global/content-elements/TiltedDivider.vue';
import TextAndImage from '@/components/global/content-elements/TextAndImage.vue';
import EdgedContentArea from '@/components/global/content-elements/EdgedContentArea.vue';
import MainCategories from '@/components/common/MainCategories.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'NoHits',
	components: {
		MainCategories,
		SpellChecker,
		TiltedDivider,
		TextAndImage,
		EdgedContentArea,
	},
	setup() {
		const categories = [
			'Nyheder & aktualitet',
			'Dokumentar',
			'Børn & Ungdom',
			'Kategori #4',
			'Kategori #5',
			'Kategori #6',
			'Kategori #7',
			'Kategori #8',
		];
		const searchResultStore = useSearchResultStore();
		return { searchResultStore, categories };
	},
	methods: { addTestDataEnrichment },
});
</script>
<style scoped>
.no-hits * {
	padding: 0;
	box-sizing: border-box;
}

.previous-searches {
	display: flex;
	justify-content: center;
	text-align: center;
	line-height: 35px;
	font-weight: bold;
	width: 750px;
	margin: auto;
	width: 750px;
	max-width: 100%;
}

.showcase-container {
	display: flex;
	width: 100%;
	align-items: center;
	padding: 50px 0px;
	flex-direction: row;
	color: white;
	flex-wrap: wrap;
	align-content: center;
	padding: 20px 50px;
	box-sizing: border-box;
}

.material-icons {
	display: block;
	background: -webkit-linear-gradient(#eee, rgb(255, 220, 164));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	font-size: 50px;
}

.showcase {
	text-align: center;
	width: 25%;
	box-sizing: border-box;
	padding-top: 5px;
	padding-bottom: 5px;
	margin-top: 5px;
	margin-bottom: 5px;
	aspect-ratio: 3/1;
	line-height: 90px;
}

.no-hits-heading {
	font-size: 36px;
	word-wrap: break-word;
	hyphens: auto;
}
h2 {
	margin: 0;
}
.no-hits-heading-subtitle {
	margin-top: 10px;
	max-width: 70%;
}
.search-icon {
	text-align: center;
	font-size: 256px;
	color: #002e70;
}
</style>
