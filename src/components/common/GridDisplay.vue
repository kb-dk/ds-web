<template>
	<div class="grid-display">
		<ItemSlider
			:padding="false"
			bg="var(--bg-secondary-light-20)"
			item-class="rotational-results"
			bg-scroll-blue="true"
		>
			<template #default="slotProps">
				<div
					v-for="(item, i) in spotNr"
					:key="i"
					:class="'related-record draggable-item'"
				>
					<GridResultItem
						:loading="!loaded"
						:resultdata="spots[i]"
						:index="i"
						background="var(--bg-secondary-light-20)"
						:class="{ 'current-record': current === i }"
						:slot-props="slotProps"
					></GridResultItem>
				</div>
			</template>
		</ItemSlider>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import GridResultItem from '@/components/search/GridResultItem.vue';
import ItemSlider from '@/components/search/ItemSlider.vue';

export default defineComponent({
	name: 'GridDisplay',
	components: {
		GridResultItem,
		ItemSlider,
	},
	props: {
		rowNr: { type: Number, required: true },
		spots: { type: Object as PropType<GenericSearchResultType[]>, required: true },
		spotNr: { type: Number, required: true },
		draggable: { type: Boolean, required: false },
		loaded: { type: Boolean, required: true },
		current: {
			type: Number,
			required: false,
			default() {
				return -1;
			},
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.grid-display {
	position: relative;
	margin-bottom: 80px;
	margin-top: 34px;
	width: 100%;
	display: flex;
	justify-content: center;
	height: 100%;
}

.related-record.draggable-item {
	margin-left: 15px;
	flex: 0 0 30%;
	box-sizing: border-box;
	background-color: var(--bg-secondary-light-20);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
	user-drag: none;
}
</style>
