<template>
	<Transition
		name="result"
		mode="out-in"
	>
		<div>
			<h2 class="no-hits-heading">
				{{
					searchResultStore.lastSearchQuery === '*:*'
						? $t('search.nohitWithFilter', { filterSearch: $t('search.filterSearch') })
						: $t('search.nohit', { query: searchResultStore.lastSearchQuery })
				}}
			</h2>
			<h3>{{ $t('search.maybeYouMeant') }}</h3>
			<div class="no-hits">
				<SpellChecker :spell-check="searchResultStore.spellCheck" />
			</div>
			<div class="no-hits-heading-subtitle">
				<p>{{ $t('search.nohitSubtitle.subtitleText') }}</p>
				<a
					:href="$t('search.nohitSubtitle.link')"
					:data-testid="addTestDataEnrichment('link', 'NoHits', 'link-to-about', 0)"
				>
					{{ $t('search.nohitSubtitle.readMore') }}
				</a>
			</div>
			<TextAndImage :hide-image-on-mobile="true">
				<template #text>
					<div>
						<h3>{{ $t('search.searchGuide.title') }}</h3>
						<ul>
							<li>
								<p>{{ $t('search.searchGuide.first') }}</p>
							</li>
							<li v-if="locale === 'en'">
								<p>
									{{ $t('search.searchGuide.secondEnglish') }}
								</p>
							</li>
							<li>
								<p>
									{{ $t('search.searchGuide.second.line1') }}
								</p>
								<p>{{ $t('search.searchGuide.second.line2') }}</p>
							</li>
							<li>
								<p>{{ $t('search.searchGuide.third.line1') }}</p>
								<p>{{ $t('search.searchGuide.third.line2') }}</p>
							</li>
							<li>
								<p>
									{{ $t('search.searchGuide.fourth') }}
								</p>
							</li>
							<li>
								<div>
									<a
										target="_blank"
										:href="$t('search.searchGuide.link')"
										:data-testid="addTestDataEnrichment('link', 'NoHits', 'link-to-search-tips', 0)"
									>
										{{ $t('search.searchGuide.readMore') }}
									</a>
								</div>
							</li>
						</ul>
					</div>
				</template>
				<template #image><div class="material-icons search-icon">search</div></template>
			</TextAndImage>
			<div class="container-backdrop"><ContainerSplitBar :is-top="false"></ContainerSplitBar></div>
			<div class="end-container">
				<SpotCategories></SpotCategories>
				<ContactUs
					class="contact-us"
					:relative-position="false"
				></ContactUs>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import SpellChecker from '@/components/search/SpellChecker.vue';
import TextAndImage from '@/components/global/content-elements/TextAndImage.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import ContactUs from '@/components/search/ContactUs.vue';
import { useI18n } from 'vue-i18n';
import SpotCategories from '../common/SpotCategories.vue';
import ContainerSplitBar from '@/components/global/content-elements/ContainerSplitBar.vue';

export default defineComponent({
	name: 'NoHits',
	components: {
		ContactUs,
		SpellChecker,
		TextAndImage,
		SpotCategories,
		ContainerSplitBar,
	},
	setup() {
		const { t, locale } = useI18n();

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
		return { searchResultStore, categories, t, locale };
	},
	methods: { addTestDataEnrichment },
});
</script>
<style scoped>
.container-backdrop {
	position: absolute;
	left: 0;
	height: stretch;
	height: -webkit-fill-available;
	width: 100vw;
	background-color: var(--bg-default);
	justify-content: space-between;
	display: flex;
	flex-direction: column;
}
.end-container {
	display: flex;
	margin-top: 90px;
	position: relative;
	flex-direction: column;
}
.no-hits {
	margin-top: 22px;
	margin-bottom: 38px;
}
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
	color: var(--color-default);
	flex-wrap: wrap;
	align-content: center;
	box-sizing: border-box;
}

.material-icons {
	display: block;
	background: -webkit-linear-gradient(#eee, rgb(255, 220, 164));
	background: -webkit-linear-gradient(var(--bg-default));
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
	word-wrap: break-word;
	hyphens: auto;
	max-width: 800px;
	color: var(--color-default);
	margin-bottom: 56px;
	margin-top: 56px;
}

h2 {
	margin: 0;
}
.no-hits-heading-subtitle {
	margin-top: 10px;
	max-width: 750px;
	color: var(--color-default);
}
.no-hits-heading-subtitle a {
	font-size: var(--fs-base);
	line-height: var(--lh-large);
	font-weight: var(--fw-regular);
}
.search-icon {
	text-align: center;
	font-size: 150px;
	color: var(--color-default);
}
ul p {
	margin: 0;
}
.contact-us {
	margin-top: 38px;
	padding-bottom: 0;
}

@media (min-width: 990px) {
	.contact-us {
		padding-bottom: 20px;
	}
	.search-icon {
		font-size: 256px;
	}
}
</style>
