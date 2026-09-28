<template>
	<div class="spot-container">
		<div class="spot-row">
			<simple-spot
				spot-size="medium"
				icon-name="link"
				color="light"
				class="spot-link"
				@click="activateLink"
			>
				<a
					ref="spotLink"
					:href="t('hero.link')"
					class="link"
					target="_blank"
				>
					<h2>{{ t('hero.linkText') }}</h2>
				</a>
				<p class="label-reg">{{ t('spots.readMoreSubtitle') }}</p>
			</simple-spot>
			<advanced-spot spot-size="medium"></advanced-spot>
		</div>
		<div class="spot-row">
			<spot-categories></spot-categories>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SimpleSpot from '@/components/common/SimpleSpot.vue';
import AdvancedSpot from '@/components/common/AdvancedSpot.vue';
import SpotCategories from '@/components/common/SpotCategories.vue';
export default defineComponent({
	name: 'SpotContainer',
	components: { SimpleSpot, AdvancedSpot, SpotCategories },
	setup() {
		const { t } = useI18n();
		const spotLink = ref<HTMLAnchorElement | null>(null);
		const activateLink = () => {
			if (spotLink.value) {
				spotLink.value.click();
			}
		};
		return { t, spotLink, activateLink };
	},
});
</script>

<style scoped>
.spot-container {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	margin-bottom: 56px;
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
.link h2,
.spot-link p {
	margin: 0px;
}
.spot-link {
	transition: background-color 0.2s linear;
}
.spot-link:hover {
	transition: background-color 0.3s linear;
	background-color: var(--bg-secondary-light);
	cursor: pointer;
	box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0) inset;
}
@media (min-width: 640px) {
	.spot-container {
		margin-bottom: 150px;
		gap: 56px;
	}
}
</style>
