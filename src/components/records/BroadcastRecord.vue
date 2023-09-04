<template>
	<div class="">
		<VideoPlayer></VideoPlayer>
		<div class="title-box">
			<h2>{{ recordData.name[0].value }}</h2>
		</div>
		<div>
			<div class="record-title">
				<p>
					{{ recordData.description }}
				</p>
			</div>
			<div class="right-side-metadata-box">
				<div>{{ getBroadcastDate(recordData.startDate) }}</div>
				<div>
					Kl. {{ getBroadcastTime(recordData.startDate) }} - {{ getBroadcastTime(recordData.endDate) }}
					<span class="broadcast-duration">({{ getBroadcastDuration(recordData.duration) }})</span>
				</div>
				<div>{{ recordData.publishedOn.broadcastDisplayName }}</div>
				<h4>{{ $t('record.genre') }}</h4>
				<div>{{ recordData.keywords }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { BroadcastRecord } from '@/types/BroadcastRecord';
import { defineComponent, PropType } from 'vue';
import VideoPlayer from '@/components/viewers/AudioVideo/VideoPlayer.vue';

export default defineComponent({
	name: 'BroadcastRecord',
	components: {
		VideoPlayer,
	},
	props: {
		recordData: {
			type: Object as PropType<BroadcastRecord>,
			required: true,
		},
	},
	methods: {
		//TODO when refined/DRY´ied - these data, time and duration utilities should be 'global' - we are going to use it many places
		//ISO 8601 duration format
		getBroadcastDuration: (isoDuration: string) => {
			if (isoDuration) {
				const match = isoDuration.match(/PT(\d+)M(\d+)S/);
				if (match) {
					const minutes = parseInt(match[1] || '0');
					const seconds = parseInt(match[2] || '0');
					//TODO handle hours and translation/localisation
					return `${minutes}min ${seconds}sek`;
				} else {
					console.log('No match found for the ISO duration format.');
				}
			} else {
				console.log('No ISO duration provided.');
			}
		},
		getBroadcastDate: (isoDate: Date) => {
			const date = new Date(isoDate);

			// Define formatting options - had to do the weird const typing...
			const options = {
				year: 'numeric' as const,
				month: 'long' as const,
				day: 'numeric' as const,
			};

			return new Intl.DateTimeFormat('da-DK', options).format(date);
		},
		getBroadcastTime: (isoDate: Date) => {
			const dateObj = new Date(isoDate);

			// Formatting options - had to do the weird const typing...
			const options = {
				hour: '2-digit' as const,
				minute: '2-digit' as const,
				hour12: false as const,
			};

			return new Intl.DateTimeFormat('en-GB', options).format(dateObj);
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
.title-box {
	margin: 0 0 0 5%;
}

.record-title {
	width: 60%;
	float: left;
	margin: 0 0 0 5%;
}

.right-side-metadata-box {
	float: right;
	margin: 0 10.5% 0 0;
	border: 1px solid;
	padding: 10px;
	width: 20%;
}

.broadcast-duration {
	font-size: 80%;
}
</style>
