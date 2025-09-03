<template>
	<div class="grid-display">
		<div :class="draggable ? 'record-grid draggable row-' + rowNr : 'record-grid row-' + rowNr">
			<div
				v-for="(item, i) in spotNr"
				:key="i"
				:class="draggable ? 'related-record draggable-item' : 'related-record'"
			>
				<GridResultItem
					:loading="!loaded"
					:resultdata="spots[i]"
					:index="i"
					background="#ffffff"
					:class="{ 'current-record': current === i }"
				></GridResultItem>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import GridResultItem from '../search/GridResultItem.vue';

export default defineComponent({
	name: 'GridDisplay',
	components: {
		GridResultItem,
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
	data() {
		return {
			isDown: false,
			startX: 0,
			scrollLeft: 0 as number,
			slidingElement: null as null | HTMLElement,
			linkItems: null as null | NodeList,
			move: false,
		};
	},

	mounted() {
		this.slidingElement = document.querySelector('.record-grid');
		this.linkItems = document.querySelectorAll('.related-record');
		if (this.slidingElement) {
			this.slidingElement.addEventListener('mousedown', this.startAndCalculateOffset);
			this.slidingElement.addEventListener('touchstart', this.startAndCalculateOffset, { passive: true });
			this.slidingElement.addEventListener('mouseleave', this.stopMovementOnParent);
			this.slidingElement.addEventListener('touchend', this.stopMovementOnParent, { passive: true });
			this.slidingElement.addEventListener('mouseup', this.stopMovementOnParent);
			this.slidingElement.addEventListener('mousemove', this.calculateMovement);
			this.slidingElement.addEventListener('touchmove', this.calculateMovement, { passive: true });
			this.linkItems.forEach((element) => {
				element.addEventListener('mousedown', this.stopMovement);
				element.addEventListener('touchstart', this.stopMovement, { passive: true });
				element.addEventListener('mousemove', this.startMovement);
				element.addEventListener('touchmove', this.startMovement, { passive: true });
				element.addEventListener('click', this.preventClickIfMovement, { capture: true });
			});
		}
	},
	beforeUnmount() {
		this.slidingElement = document.querySelector('.record-grid');
		this.linkItems = document.querySelectorAll('.related-record');
		if (this.slidingElement) {
			this.slidingElement.removeEventListener('mousedown', this.startAndCalculateOffset);
			this.slidingElement.removeEventListener('touchstart', this.startAndCalculateOffset);
			this.slidingElement.removeEventListener('mouseleave', this.stopMovementOnParent);
			this.slidingElement.removeEventListener('touchend', this.stopMovementOnParent);
			this.slidingElement.removeEventListener('mouseup', this.stopMovementOnParent);
			this.slidingElement.removeEventListener('mousemove', this.calculateMovement);
			this.slidingElement.removeEventListener('touchmove', this.calculateMovement);

			this.linkItems.forEach((element) => {
				element.removeEventListener('mousedown', this.stopMovement);
				element.removeEventListener('touchstart', this.stopMovement);
				element.removeEventListener('mousemove', this.startMovement);
				element.removeEventListener('touchmove', this.startMovement);
				element.removeEventListener('click', this.preventClickIfMovement);
			});
		}
	},

	methods: {
		startMovement() {
			this.move = true;
		},
		stopMovement() {
			this.move = false;
		},
		preventClickIfMovement(e: Event) {
			if (this.move) {
				e.preventDefault();
			}
		},

		startAndCalculateOffset(e: MouseEvent | TouchEvent) {
			if (this.slidingElement) {
				this.isDown = true;
				if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
					this.startX = e.touches[0].pageX - this.slidingElement.offsetLeft;
				} else if (e instanceof MouseEvent) {
					this.startX = e.pageX - this.slidingElement.offsetLeft;
				}
				this.scrollLeft = this.slidingElement.scrollLeft;
			}
		},
		stopMovementOnParent() {
			if (this.slidingElement) {
				this.isDown = false;
			}
		},
		calculateMovement(e: MouseEvent | TouchEvent) {
			if (this.slidingElement) {
				if (!this.isDown) {
					return;
				}
				//e.preventDefault();

				let x: number;
				if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
					x = e.touches[0].pageX - this.slidingElement.offsetLeft;
				} else if (e instanceof MouseEvent) {
					x = e.pageX - this.slidingElement.offsetLeft;
				} else {
					return;
				}
				this.slidingElement.scrollLeft = this.scrollLeft - (x - this.startX);
			}
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
}

.record-grid {
	display: flex;
	flex-wrap: wrap;
	padding-left: 0;
	max-width: 100%;
	overflow: hidden;
	padding-top: 5px;
}

.draggable {
	flex-wrap: wrap;
}

.current-record {
	background-color: #c4f1ed !important;
	border: 1px solid #0a2e70;
	box-shadow: 0 0 15 black;
}

@media (min-width: 321px) {
	.draggable {
		flex-wrap: nowrap;
	}
}

.draggable-item {
	flex: 0 0 100%;
	margin: 0px;
}

.related-record.draggable-item {
	margin-left: 20px;
	flex: 0 0 90%;
	box-sizing: border-box;
}
.related-record.draggable-item:first-of-type {
	margin-left: 0px;
}

@media (min-width: 640px) {
	.record-grid {
		flex: 0 0 100%;
		max-width: 100%;
	}
	.row-4 .related-record {
		flex: 0 0 100%;
	}

	.row-4 .related-record.draggable-item {
		flex: 0 0 66.6666%;
	}
	.row-3 .related-record.draggable-item {
		flex: 0 0 66.6666%;
	}
}

/* Second break for small screen */
@media (min-width: 800px) {
	.record-grid {
		flex: 0 0 100%;
		max-width: 100%;
		flex-wrap: wrap;
	}
	.row-3 .related-record,
	.row-3 .related-record.draggable-item {
		margin: 0px;
		flex: 0 0 33.3333%;
		box-sizing: border-box;
	}
	.row-4 .related-record,
	.row-4 .related-record.draggable-item {
		margin: 0px;
		flex: 0 0 25%;
		box-sizing: border-box;
	}
	.row-3 .related-record:nth-of-type(3n + 1) {
		padding-left: 0px;
		padding-right: 10px;
	}
	.row-3 .related-record:nth-of-type(3n + 2) {
		padding-left: 5px;
		padding-right: 5px;
	}
	.row-3 .related-record:nth-of-type(3n) {
		padding-right: 0px;
		padding-left: 10px;
	}
	.row-4 .related-record:nth-of-type(4n + 1) {
		padding-left: 0px;
		padding-right: 10px;
	}
	.row-4 .related-record:nth-of-type(4n + 2) {
		padding-left: 5px;
		padding-right: 7.5px;
	}
	.row-4 .related-record:nth-of-type(4n + 3) {
		padding-left: 7.5px;
		padding-right: 5px;
	}
	.row-4 .related-record:nth-of-type(4n) {
		padding-right: 0px;
		padding-left: 10px;
	}
}

/* third break for large screen */
@media (min-width: 990px) {
	.row-3 div {
		flex: 0 0 33.3333%;
		box-sizing: border-box;
	}

	.row-4 div {
		flex: 0 0 25%;
		box-sizing: border-box;
	}
	.related-records {
		flex: 0 0 100%;
		max-width: 100%;
	}
}
</style>
