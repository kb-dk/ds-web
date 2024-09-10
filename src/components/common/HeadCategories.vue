<template>
	<div class="categories">
		<div class="title">
			<span class="material-icons">schedule</span>
			<h2>Kategorier</h2>
		</div>
		<div class="category-grid">
			<div
				v-for="(entity, i) in categories"
				:key="i"
				class="category-item"
			>
				{{ `CATEGORY ${i}` }}
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'HeadCategories',

	setup() {
		const { t } = useI18n();
		const categories = 10;
		return { t, categories };
	},
});
</script>
<styles scoped>
</styles>
