<template>
	<div class="daily-program">
		<button
			class="link-container"
			@click="dailyProgramExpanded = !dailyProgramExpanded"
		>
			Vis dagens program
		</button>
		<div :class="{ 'daily-program-expanded': dailyProgramExpanded, 'daily-program-closed': !dailyProgramExpanded }">
			<GridDisplay
				v-if="dailyProgramExpanded"
				:row-nr="recordsForTheDay.length"
				:spots="recordsForTheDay"
				:spot-nr="recordsForTheDay.length"
				:draggable="true"
				:loaded="recordsForTheDay.length > 0"
			></GridDisplay>
		</div>
	</div>
</template>

<script lang="ts">
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { defineComponent, onUnmounted, PropType, ref } from 'vue';
import GridDisplay from '@/components/common/GridDisplay.vue';

export default defineComponent({
	name: 'ProgramGuide',
	components: {
		GridDisplay,
	},
	props: {
		recordsForTheDay: {
			type: Array as PropType<GenericSearchResultType[]>,
			required: false,
			default() {
				return [];
			},
		},
	},
	setup() {
		const dailyProgramExpanded = ref(false);
		onUnmounted(() => {
			dailyProgramExpanded.value = false;
		});
		return { dailyProgramExpanded };
	},
});
</script>

<style scoped>
.link-container {
	background-color: #0a2e70;
	width: 33.3%;
	color: white;
	text-align: center;
	text-decoration: none;
	font-size: 18px;
	border-radius: 4px;
	height: 40px;
	display: flex;
	box-sizing: border-box;
	margin-bottom: 15px;
	padding: 5px 25px;
	font-family: 'noway';
	font-weight: 100;
	flex-direction: row;
	justify-content: center;
	white-space: nowrap;
	border: 1px solid #0a2e70;
	transition: all 0.25s linear 0s;
	cursor: pointer;
}
.link-container:hover {
	background: #c4f1ed;
	color: #0a2e70;
}

.daily-program-expanded {
	overflow-y: hidden;
	width: 100%;
	max-height: 20em;
	animation: expand-programs 0.8s none;
}
.daily-program-expanded > * > * {
	flex-wrap: nowrap;
	width: 100%;
}
.daily-program-expanded > * > * > * {
	max-width: 13em;
}
.daily-program-closed {
	animation: close-programs 0.5s none;
}

@keyframes expand-programs {
	0% {
		max-height: 0em;
	}
	100% {
		max-height: 20em;
	}
}
@keyframes close-programs {
	0% {
		height: 20em;
	}
	100% {
		height: 0em;
	}
}
</style>
