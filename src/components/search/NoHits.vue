<template>
	<Transition
		name="result"
		mode="out-in"
	>
		<div>
			<div class="no-hits-heading">{{ $t('search.nohit', { query: searchResultStore.lastSearchQuery }) }}</div>
			<div class="no-hits">
				<SpellChecker :spell-check="searchResultStore.spellCheck" />
			</div>
			<TiltedDivider
				title="Gode råd til din søgning"
				:right="true"
			></TiltedDivider>
			<TextAndImage>
				<template #text>
					<div>
						<h3>Her får du et par fif til at optimere din søgning</h3>
						<ul>
							<li>Prøv med færre eller andre søgeord</li>
							<li>
								Tjek stavningen. Hvis du er usikker, kan du skrive ? som erstatning for et bogstav - eksempelvis Son?a
								<br />
								Så søger du både på Sonia og Sonja
							</li>
							<li>
								Prøv at skrive * i slutningen af et ord, eksempelvis skov*
								<br />
								Så søger du på skov, skovens, skovtur og så videre.
							</li>
							<li>
								Brug søgning via dato eller periode på DR-arkivets forside, hvis du har en fornemmelse af, hvornår
								udsendelsen blev sendt
							</li>
							<li>
								Læs mere om
								<a href="">søgetips</a>
							</li>
						</ul>
					</div>
				</template>
				<template #image><div class="material-icons search-icon">search</div></template>
			</TextAndImage>
			<EdgedContentArea
				:lines="true"
				title="Led videre i vores hovedkategorier"
			>
				<template #content>
					<div class="showcase-container">
						<div
							v-for="(item, index) in categories"
							:key="index"
							class="showcase"
						>
							<div class="material-icons">movie</div>

							{{ item }}
						</div>
					</div>
				</template>
			</EdgedContentArea>
			<TiltedDivider
				title="Andre har søgt på"
				:right="false"
			></TiltedDivider>
			<div class="previous-searches">
				Zig-Zan / Matador / Jarl Fris Mikkelsen / Realty TV / Nak og æd / Lorem / Ipsum / Zig-Zan / Matador / Jarl Fris
				Mikkelsen / Realty TV / Nak og æd / Lorem / Ipsum / Zig-Zan / Matador / Jarl Fris Mikkelsen / Realty TV / Nak og
				æd / Lorem / Ipsum /
			</div>
			<TiltedDivider :right="true"></TiltedDivider>
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

export default defineComponent({
	name: 'NoHits',
	components: {
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
});
</script>
<style scoped>
.no-hits {
	background-color: #e8e8e8;
	padding-right: 12px;
	padding-left: 12px;
	margin-right: auto;
	margin-left: auto;
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
}

.search-icon {
	text-align: center;
	font-size: 256px;
	color: #002e70;
}
</style>
