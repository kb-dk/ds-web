<template>
	<div class="broadcast-record">
		<VideoPlayer
			videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
		></VideoPlayer>
		<div class="boardcast-record-data">
			<div class="main-record-data">
				<div class="record-data">
					<h2>{{ recordData.name[0].value }}</h2>
					<p>{{ recordData.description }} ALSO, LOREM IPSUM PLEASE</p>
				</div>
			</div>
			<div class="right-side">
				<div class="right-side-metadata-box">
					<h3>Sendt</h3>
					<div>
						<span class="material-icons blue">event</span>
						{{ getBroadcastDate(recordData.startTime) }}
					</div>
					<div>
						<span class="material-icons blue">schedule</span>
						Kl. {{ getBroadcastTime(recordData.startTime) }} - {{ getBroadcastTime(recordData.endTime) }}
						<span class="broadcast-duration">
							<duration
								:duration="recordData.duration"
								:startDate="recordData.startTime"
								:endDate="recordData.endTime"
							></duration>
						</span>
					</div>
					<div>
						<span class="material-icons blue">tv</span>
						{{ recordData.publication.publishedOn.broadcastDisplayName }}
					</div>
					<h4>{{ $t('record.genre') }}</h4>
					<div>{{ recordData.keywords }}</div>
				</div>
				<div class="divider darkblue"></div>
				<button
					class="get-link"
					@click="getCurrentUrl()"
				>
					<span class="material-icons">link</span>
					<span class="link-text">{{ $t('record.copy') }}</span>
				</button>
			</div>
		</div>
		<div class="extra-record-data">
			<div class="accordion">
				<kb-accordion
					first="true"
					title="Yderligere information om videoen"
					expanded="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet quam felis. Curabitur dui augue, auctor eu sodales sit amet, porta vel dolor. Ut libero purus, malesuada ut tincidunt non, auctor nec magna. Quisque interdum, libero vitae varius tempor, ipsum sapien tempor tellus, et aliquet ex enim in neque. Donec lacinia justo urna, et imperdiet tellus sodales sit amet. Nulla nec aliquam nunc. Nam pretium suscipit posuere. Pellentesque tincidunt auctor mattis.
					
Mauris non ligula a urna dapibus egestas eget at sem. Sed ac nulla ex. Cras quis ligula at nulla tincidunt consequat. Aliquam arcu est, malesuada non sapien at, malesuada tempus nulla. Etiam faucibus condimentum leo, eget euismod eros cursus fermentum. Fusce eget arcu non nulla vulputate aliquet eget id velit. Integer ipsum tellus, tempus quis elementum id, dictum vitae libero. Nullam at convallis lectus. Morbi pellentesque eget nisi id tempor."
				></kb-accordion>
			</div>
			<div
				v-if="moreLikeThisRecords !== undefined && moreLikeThisRecords.length > 0"
				class="related-content"
			>
				<h3>Relateret indhold</h3>
				<GridDisplay
					:row-nr="3"
					:spot-nr="3"
					:draggable="true"
					:spots="moreLikeThisRecords"
				></GridDisplay>
			</div>
			<div v-else>No related records here. Now what?</div>
		</div>
	</div>
</template>

<script lang="ts">
import { BroadcastRecordType } from '@/types/BroadcastRecordType';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { defineComponent, PropType } from 'vue';
import VideoPlayer from '@/components/viewers/AudioVideo/video/KalturaPlayer.vue';
import Duration from '@/components/common/Duration.vue';
import GridDisplay from '@/components/common/GridDisplay.vue';
import { copyTextToClipboard } from '@/utils/copy-script';

import '@/components/common/wc-accordian';
import '@/components/common/wc-spot-item';

export default defineComponent({
	name: 'BroadcastRecord',
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
	components: {
		VideoPlayer,
		Duration,
		GridDisplay,
	},
	props: {
		recordData: {
			type: Object as PropType<BroadcastRecordType>,
			required: true,
		},
		moreLikeThisRecords: {
			type: Array as PropType<GenericSearchResultType[]>,
			required: false,
		},
	},
	methods: {
		getCurrentUrl() {
			copyTextToClipboard();
		},

		getBroadcastDate: (isoDate: string) => {
			const date = new Date(isoDate);

			// Define formatting options - had to do the weird const typing...
			const options = {
				year: 'numeric' as const,
				month: 'long' as const,
				day: 'numeric' as const,
			};

			return new Intl.DateTimeFormat('da-DK', options).format(date);
		},
		getBroadcastTime: (isoDate: string) => {
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
:host {
	margin-top: -1px;
	position: relative;
}

.material-icons {
	font-family: 'Material Icons';
	font-weight: normal;
	font-style: normal;
	font-size: 16px;
	line-height: 1;
	letter-spacing: normal;
	text-transform: none;
	display: inline-block;
	white-space: nowrap;
	word-wrap: normal;
	direction: ltr;
	-webkit-font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
	position: relative;
	top: 2px;
}

.get-link {
	font-family: noway, sans-serif;
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding-top: 0px;
	padding-bottom: 25px;
}

.get-link .link-text {
	text-decoration: underline;
}

.get-link .material-icons {
	position: relative;
	top: 3px;
	margin-right: 3px;
}

.material-icons.blue {
	color: #002e70;
}

.boardcast-record-data {
	display: flex;
	flex-direction: column;
	margin: 0px 20px;
}

.extra-record-data {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.accordion {
	margin: 0px 20px;
}

.accordion,
.main-record-data {
	flex: 0 0 100%;
	max-width: 100%;
}

.right-side {
	overflow: hidden;
	flex: 0 0 100%;
	max-width: 100%;
}

.right-side-metadata-box {
	color: #002e70;
	width: 100%;
	padding: 20px 10px 30px 10px;
	background-color: #f0fbff;
	box-sizing: border-box;
}

.related-record {
	margin-left: 20px;
}
.related-record:first-of-type {
	margin-left: 0px;
}

.title-box {
	margin: 0 0 0 5%;
}

.record-title {
	width: 60%;
	float: left;
	margin: 0 0 0 5%;
}

.broadcast-duration {
	font-size: 80%;
}

.divider {
	height: 13px;
	margin: 24px 0 36px;
	width: 100%;
	transform: skewX(-2deg) skewY(2deg);
	margin-top: -7px;
}

.extra-record-data {
	width: 100%;
}

.divider.darkblue {
	background-color: #002e70;
}

.related-content {
	padding: 0px 20px;
}

.related-record {
	flex: 0 0 90%;
	box-sizing: border-box;
}

/* First breakpoint for tablet */

@media (min-width: 640px) {
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
		margin-top: 40px;
	}
	.main-record-data {
		flex: 0 0 calc(50% - 20px);
		max-width: calc(50% - 20px);
	}

	.accordion {
		margin-left: 0px;
		margin-right: 0px;
		flex: 0 0 calc(100%);
	}

	.right-side {
		flex: 0 0 50%;
		max-width: 50%;
	}
	.related-record {
		flex: 0 0 66.6666%;
	}
	.related-content {
		padding: 0px;
	}
	.extra-record-data {
		flex: 0 0 calc(100%);
		max-width: calc(100%);
	}
}

/* Second break for small screen */
@media (min-width: 800px) {
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
	}
	.extra-record-data {
		flex: 0 0 calc(100%);
		max-width: calc(100%);
	}
	.main-record-data {
		flex: 0 0 calc(66.666666% - 20px);
		max-width: calc(66.666666% - 20px);
	}

	.right-side {
		flex: 0 0 33.33333%;
		max-width: 33.33333%;
	}
	.related-record {
		margin: 0px;
		flex: 0 0 33.3333%;
		box-sizing: border-box;
	}
	.related-record:nth-of-type(3n + 1) {
		padding-left: 0px;
		padding-right: 10px;
	}
	.related-record:nth-of-type(3n + 2) {
		padding-left: 5px;
		padding-right: 5px;
	}
	.related-record:nth-of-type(3n) {
		padding-right: 0px;
		padding-left: 10px;
	}
}

/* third break for large screen */
@media (min-width: 990px) {
	.boardcast-record-data {
		flex-direction: row;
		margin-left: 0px;
		margin-right: 0px;
		gap: 20px;
	}
	.main-record-data,
	.related-content,
	.accordion {
		flex: 0 0 calc(75% - 20px);
		max-width: calc(75% - 20px);
	}

	.right-side {
		flex: 0 0 25%;
		max-width: 25%;
	}
}
</style>
