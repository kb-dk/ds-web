<template>
	<div class="portal-container container">
		<div class="categories">
			<SkewedFoldable
				:left="false"
				bg="#002e70"
				text="white"
				icon="category"
				:fullwidth="true"
				:shadow-bottom="true"
				:shadow-top="true"
			>
				<MainCategories />
			</SkewedFoldable>
		</div>
		<div class="date-picker">
			<SkewedFoldable
				:title="$t('timeSearch.searchDate')"
				:left="true"
				bg="#caf0fe"
				icon="event"
				:subtitle="$t('timeSearch.dateSubtitle')"
				:fullwidth="true"
				text="#0a2e70"
				:always-expand="true"
				:dashed-bottom="true"
				:shadow-bottom="true"
			>
				<DayPicker />
			</SkewedFoldable>
		</div>
		<div class="time-search">
			<SkewedFoldable
				:title="$t('timeSearch.timeMachine')"
				:left="false"
				bg="#fafafa"
				text="#0a2e70"
				icon="schedule"
				:subtitle="$t('timeSearch.timeMachineSubtitle')"
				:fullwidth="true"
				:dashed-bottom="true"
				:shadow-bottom="false"
			>
				<TimeSearchComponent />
			</SkewedFoldable>
		</div>
		<TiltedDivider
			:right="false"
			:title="
				$t('frontpage.fromTheArchive', {
					month: new Date().toLocaleString(currentLocale, { month: 'long' }),
				})
			"
		></TiltedDivider>
		<div class="container">
			<GridDisplay
				:spot-nr="8"
				:row-nr="4"
				:draggable="true"
				:spots="mockdata1"
			></GridDisplay>
		</div>
		<div class="blue-background">
			<div class="edge blue"></div>

			<div class="container">
				<h3>{{ $t('app.titles.frontpage.about') + ' ' + $t('app.titles.frontpage.archive.name') }}</h3>
				<GridDisplay
					:draggable="false"
					:spot-nr="3"
					:row-nr="3"
					:blue-background="true"
					:spots="mockdata2"
				></GridDisplay>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import GridDisplay from '@/components/common/GridDisplay.vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import TimeSearchComponent from '@/components/common/TimeSearchComponent.vue';
import TiltedDivider from '../global/content-elements/TiltedDivider.vue';
import { addTestDataEnrichment } from '@/utils/test-enrichments';
import DayPicker from '@/components/common/timeSearch/DayPicker.vue';
import MainCategories from '@/components/common/MainCategories.vue';
import SkewedFoldable from '@/components/common/SkewedFoldable.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'PortalContent',
	components: {
		GridDisplay,
		TimeSearchComponent,
		TiltedDivider,
		DayPicker,
		MainCategories,
		SkewedFoldable,
	},

	setup() {
		const mockdata1 = ['1', '2', '3', '4', '5', '6', '7', '8'] as unknown as GenericSearchResultType[];
		const mockdata2 = ['1', '2', '3'] as unknown as GenericSearchResultType[];
		const searchResultStore = useSearchResultStore();
		const currentLocale = ref('da-dk');
		const { locale, t } = useI18n({ useScope: 'global' });
		watch(
			() => locale.value,
			(newVal: string) => {
				currentLocale.value = newVal === 'da' ? 'da-dk' : 'en-uk';
			},
		);
		return { searchResultStore, mockdata1, mockdata2, currentLocale, addTestDataEnrichment };
	},
	methods: {
		useRoute,
		router() {
			return router;
		},
	},
});
</script>

<style scoped>
.time-search {
	margin-bottom: -70px;
}

.portal-container {
	position: relative;
	margin-top: -100px !important;
	align-items: center;
}

.categories,
.date-picker,
.time-search {
	position: relative;
	margin-top: -6.1vw;
	width: calc(100% + 24px);
	margin-left: -12px;
}

.categories {
	z-index: 3;
}
.date-picker {
	z-index: 2;
}
.time-search {
	z-index: 1;
	margin-bottom: 40px !important;
}

@media (min-width: 990px) {
	.categories,
	.date-picker,
	.time-search {
		width: 100%;
		margin-left: 0px;
	}

	.time-search,
	.categories,
	.date-picker {
		display: grid;
		justify-content: center;
	}
}

@media (min-width: 2000px) {
	.date-picker,
	.time-search {
		margin-top: -3vw;
	}
}
@media (min-width: 4000px) {
	.date-picker,
	.time-search {
		margin-top: -1.5vw;
	}
}
</style>
