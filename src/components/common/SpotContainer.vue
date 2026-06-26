<template>
	<div class="spot-container">
		<div class="spot-row">
			<spot-categories></spot-categories>
		</div>
		<div class="spot-row">
			<simple-spot spot-size="small">
				<span class="label-big">En kasse til noget display 349.994 minutters noget helt tilbage fra 1931.</span>
			</simple-spot>
			<simple-spot
				spot-size="small"
				icon-name="link"
				color="light"
			>
				<a
					:href="t('hero.link')"
					class="label-big link"
				>
					{{ t('hero.linkText') }}
				</a>
			</simple-spot>
			<advanced-spot spot-size="medium"></advanced-spot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import SimpleSpot from '@/components/common/SimpleSpot.vue';
import AdvancedSpot from '@/components/common/AdvancedSpot.vue';
import SpotCategories from '@/components/common/SpotCategories.vue';
export default defineComponent({
	name: 'SpotContainer',
	components: { SimpleSpot, AdvancedSpot, SpotCategories },
	setup() {
		const { t } = useI18n();
		return { t };
	},
});
</script>

<style scoped>
.spot-container {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
}
.spot-row {
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
	flex-wrap: wrap;
	/* background-repeat: no-repeat; */

	justify-content: space-between;
}
.link {
	color: inherit;
	text-decoration: inherit;
	border-bottom: 1px solid transparent;
}
.link:hover {
	transition: border-color linear 0.3s ease-in-out;
	border-bottom-color: var(--color-border-success);
}
</style>
