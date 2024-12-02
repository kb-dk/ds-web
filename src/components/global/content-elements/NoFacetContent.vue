<template>
	<div :class="`no-content-container ${position}`">
		<span class="material-icons">warning</span>
		<p>{{ $t('app.frontPages.loadingError') }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'NoFacetContent',
	props: {
		position: {
			type: String as PropType<string>,
			default() {
				'relative';
			},
		},
	},
	setup() {
		const { t } = useI18n();
		return { t };
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only
temporary styling until patterns from design system are implemented
-->
<style scoped>
.no-content-container {
	position: absolute;
	display: flex;
	flex-direction: column;
	white-space: nowrap;
	width: 100%;
	height: 100%;
	justify-content: center;
	text-align: center;
	text-decoration: none;
}
.relative {
	position: relative;
}
.material-icons {
	font-size: 36px;
}
p {
	margin-top: 5px;
	font-size: 1rem;
}
</style>
