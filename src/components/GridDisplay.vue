<template>
	<div :class="'record-grid row-' + rowNr">
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
		<div class="related-record"><kb-spotcomponent title="First test yay"></kb-spotcomponent></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SpotType } from '../types/SpotType';
import './spot-component';

export default defineComponent({
	name: 'GridDisplay',

	data: () => ({}),

	props: {
		rowNr: { type: Number, required: true },
		spots: { type: Object as PropType<SpotType[]>, required: false },
	},

	created() {
		console.log('grid-display created');
	},

	methods: {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.record-grid {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
}
.row-3 div {
	flex: 0 0 33.3333%;
	box-sizing: border-box;
}

.row-4 div {
	flex: 0 0 25%;
	box-sizing: border-box;
}
</style>
