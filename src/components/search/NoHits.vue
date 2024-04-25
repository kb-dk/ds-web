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
				title="Et par fif til din søgning"
				:right="true"
			></TiltedDivider>
			<TextAndImage>
				<template #text>
					<div>
						<h3>Her får du et par fif til at optimere din søgning</h3>
						<ul>
							<li>Et område afsat til at lære brugerene om brugen af søgefeltet</li>
							<li>Hvad kan man og ikke mindst hvad man kan ikke søge på</li>
							<li>Vil det være muligt at søge på en titel</li>
							<li>Vil det være muligt at søge på en programrække</li>
							<li>I det hele taget skal der laves en "søgeguide"</li>
							<li>Her skal stå hvordam man bruger vores søgefelt</li>
						</ul>
					</div>
				</template>
				<template #image><div class="material-icons search-icon">search</div></template>
			</TextAndImage>
			<EdgedContentArea title="Led videre i vores hovedkategorier"></EdgedContentArea>
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
			<EdgedContentArea
				background-color="#FFDCA4"
				title=""
			>
				<template #content></template>
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

export default defineComponent({
	name: 'NoHits',
	components: {
		SpellChecker,
		TiltedDivider,
		TextAndImage,
		EdgedContentArea,
	},
	setup() {
		const searchResultStore = useSearchResultStore();
		return { searchResultStore };
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
	padding: 50px 200px;
	line-height: 35px;
	font-weight: bold;
	width: 750px;
	margin: auto;
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
