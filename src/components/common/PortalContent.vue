<template>
	<div class="container">
		<div class="row">
			<div class="intro">
				<h2>{{ $t('app.frontPages.TVRadioDR') }}</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
					consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum.
				</p>
				<router-link to="/about">read more</router-link>
			</div>
		</div>
		<div class="time-search">
			<TimeSearchComponent></TimeSearchComponent>
		</div>
		<TiltedDivider :title="$t('frontpage.fromTheArchive')"></TiltedDivider>
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
				<h3>Om arkivet</h3>
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
import { defineComponent } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import GridDisplay from '@/components/common/GridDisplay.vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import TimeSearchComponent from '@/components/common/TimeSearchComponent.vue';
import TiltedDivider from '../global/content-elements/TiltedDivider.vue';
export default defineComponent({
	name: 'PortalContent',
	components: {
		GridDisplay,
		TimeSearchComponent,
		TiltedDivider,
	},

	setup() {
		const mockdata1 = ['1', '2', '3', '4', '5', '6', '7', '8'] as unknown as GenericSearchResultType[];
		const mockdata2 = ['1', '2', '3'] as unknown as GenericSearchResultType[];
		const searchResultStore = useSearchResultStore();

		return { searchResultStore, mockdata1, mockdata2 };
	},
});
</script>

<style></style>
