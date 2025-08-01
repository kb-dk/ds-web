<template>
	<div class="broadcast-record">
		<AudioPlayer
			v-if="entryId !== ''"
			:entry-id="entryId"
		></AudioPlayer>
		<div
			v-else
			class="no-streaming"
		>
			{{ t('record.missingStreamingUrl') }}
		</div>
		<div class="boardcast-record-data">
			<div class="main-record-data">
				<div class="record-data">
					<h2>{{ recordData.name[0].value ? recordData.name[0].value : recordData.name }}</h2>
					<p>{{ recordData.description }}</p>
				</div>
				<div class="back-link">
					<div class="triangle"></div>
					<router-link
						v-if="backLink !== '/'"
						:to="backLink"
						class="link-container return"
						:data-testid="addTestDataEnrichment('link', 'broadcast-audio', 'back-link', 0)"
					>
						{{ $t('record.back') }}
					</router-link>
					<router-link
						v-else
						to="/"
						class="link-container return"
						:data-testid="addTestDataEnrichment('link', 'broadcast-audio', 'frontpage-link', 0)"
					>
						{{ $t('record.toFrontpage') }}
					</router-link>
				</div>
			</div>
			<div class="right-side">
				<div class="right-side-metadata-box">
					<h3>{{ $t('record.aired') }}</h3>
					<div class="info">
						<span class="material-icons blue">event</span>
						{{ getBroadcastDate(recordData.startTime, locale) }}
					</div>
					<div class="info">
						<span class="material-icons blue">schedule</span>
						{{ $t('record.timestamp') }} {{ getBroadcastTime(recordData.startTime) }} -
						{{ getBroadcastTime(recordData.endTime) }}
						<span class="broadcast-duration">
							<duration
								:duration="recordData.duration"
								:start-date="recordData.startTime"
								:end-date="recordData.endTime"
							></duration>
						</span>
					</div>
					<div class="info">
						<span class="material-icons blue">tv</span>
						{{ recordData.publication.publishedOn.broadcastDisplayName }}
					</div>
					<div
						v-if="recordData.encodesCreativeWork.episodeNumber"
						class="info"
					>
						<span class="material-icons">segment</span>
						<span class="episode-text">
							{{ `${$t('search.episode')} ${recordData.encodesCreativeWork.episodeNumber}` }}
						</span>
						<span
							v-if="recordData.encodesCreativeWork.partOfSeason.numberOfEpisodes"
							class="episode-text episode-text-outof"
						>
							{{ `${$t('search.outOf')} ${recordData.encodesCreativeWork.partOfSeason.numberOfEpisodes}` }}
						</span>
					</div>
					<h4 v-if="recordData.genre">{{ $t('record.genre') }}</h4>
					<div v-if="recordData.genre">
						<router-link
							:to="{
								name: 'Search',
								query: {
									q: '*:*',
									start: 0,
									fq: [encodeURIComponent(`genre_facet:${quotation(recordData.genre)}`)],
								},
							}"
							class="genre-link"
							:data-testid="addTestDataEnrichment('link', 'boardcast-record-audio', `genre-link`, 0)"
							@click="emptySearchResults()"
						>
							{{ t(`categories.${santizeAndSimplify(recordData.genre)}`) }}
						</router-link>
					</div>
				</div>
				<div class="divider darkblue"></div>
				<div class="share-button">
					<div
						class="link-container get-link"
						:data-testid="addTestDataEnrichment('button', 'broadcast-video', 'copy-link', 0)"
						@click="getCurrentUrl()"
					>
						<span class="material-icons">share</span>
						<a class="link">{{ $t('record.copy') }}</a>
					</div>
				</div>
			</div>
		</div>
		<h3>{{ $t('search.relatedContent') }}</h3>
		<div class="extra-record-data">
			<div
				v-for="(record, index) in moreLikeThisRecords"
				:key="index"
				class="related-content"
			>
				<GridResultItem
					:row-nr="3"
					:spot-nr="3"
					:draggable="true"
					:resultdata="record"
					:starttime="new Date(record.startTime).toLocaleString()"
					:index="index"
					:full-post-url="true"
					:loading="moreLikeThisRecords?.length === 0"
				></GridResultItem>
			</div>
		</div>
		<ContactUs :relative-position="false"></ContactUs>
	</div>
</template>

<script lang="ts">
import { BroadcastRecordType } from '@/types/BroadcastRecordType';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { defineComponent, PropType, ref, watch } from 'vue';
import AudioPlayer from '@/components/viewers/AudioVideo/AudioPlayer.vue';
import Duration from '@/components/common/Duration.vue';
import { copyTextToClipboard } from '@/utils/copy-script';
import { getBroadcastDate, getBroadcastTime } from '@/utils/time-utils';
import { getEntryId } from '@/utils/record-utils';
import { useI18n } from 'vue-i18n';
import { addTestDataEnrichment, santizeAndSimplify } from '@/utils/test-enrichments';
import { useSearchResultStore } from '@/store/searchResultStore';
import GridResultItem from '@/components/search/GridResultItem.vue';
import ContactUs from '@/components/search/ContactUs.vue';

export default defineComponent({
	name: 'BroadcastAudioRecord',

	components: {
		ContactUs,
		GridResultItem,
		AudioPlayer,
		Duration,
	},

	props: {
		recordData: {
			type: Object as PropType<BroadcastRecordType>,
			required: true,
		},
		moreLikeThisRecords: {
			type: Array as PropType<GenericSearchResultType[]>,
			required: false,
			default() {
				return [];
			},
		},
		backLink: {
			type: String as PropType<string>,
			required: true,
		},
	},

	setup(props) {
		const lastPath = ref('');
		const { locale, t } = useI18n();
		const searchResultStore = useSearchResultStore();

		const entryId = ref('');
		entryId.value = getEntryId(props.recordData);

		const checkForKalturaId = () => {
			return props.recordData.identifier.find((obj) => obj.PropertyID === 'KalturaID') !== undefined;
		};

		const emptySearchResults = () => {
			searchResultStore.searchResult = [];
		};

		const getCurrentUrl = () => {
			copyTextToClipboard();
		};

		const quotation = (name: string) => {
			return `"${name}"`;
		};

		watch(
			() => props.recordData.id,
			() => {
				entryId.value = getEntryId(props.recordData);
			},
			{ deep: true },
		);

		return {
			lastPath,
			locale,
			entryId,
			t,
			getCurrentUrl,
			getBroadcastDate,
			getBroadcastTime,
			checkForKalturaId,
			addTestDataEnrichment,
			quotation,
			emptySearchResults,
			santizeAndSimplify,
		};
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
temporary styling until patterns from design system are implemented 
-->
<style scoped>
h3 {
	margin-top: 0;
}
h4 {
	margin-bottom: 0;
}
:host {
	margin-top: -1px;
	position: relative;
}

.back-link {
	width: fit-content;
}

.info {
	display: flex;
	align-items: center;
	gap: 7px;
	flex-wrap: wrap;
	font-weight: 700;
	line-height: 1.5;
	font-size: 18px;
}

.info .material-icons {
	font-size: 20px;
	margin-right: 3px;
}
.episode-text-outof {
	text-transform: lowercase;
}
.no-streaming {
	width: 100%;
	background-color: black;
	display: flex;
	height: 300px;
	color: white;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 10px;
	box-sizing: border-box;
}

.back-link a {
	display: flex;
	align-items: center;
	text-decoration: none;
	padding: 8px 14px 9px 14px;
}

.share-button {
	width: 100%;
	justify-content: center;
	display: flex;
}

.get-link {
	font-family: noway, sans-serif;
	background-color: transparent;
	border: 0px;
	cursor: pointer;
	padding-top: 0px;
	padding-left: 0px;
	padding-right: 0px;
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
	position: relative;
}

.extra-record-data {
	display: flex;
	flex-direction: column;
	gap: 20px;
	margin-bottom: 45px;
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
	text-transform: capitalize;
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
	max-width: 100%;
}

.related-record {
	flex: 0 0 90%;
	box-sizing: border-box;
}

.genre-link {
	color: #002e70;
	text-decoration: none;
	text-transform: none;
}

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
}
.link {
	position: relative;
	top: 2px;
}
.link-container a {
	white-space: nowrap;
}
.back-link {
	display: flex;
	flex-direction: row;
	bottom: 0;
	padding-top: 15px;
}
.link-container:hover {
	background: #c4f1ed;
	color: #0a2e70;
}
.triangle {
	display: none;
	width: 0;
	height: 0;
	border-bottom: 20px solid transparent;
	border-right: 10px solid #0a2e70;
	border-top: 20px solid transparent;
}
.return {
	border-radius: 4px;
	width: fit-content;
	height: auto;
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
		width: 33.3%;
	}
	.extra-record-data {
		flex: 0 0 calc(100%);
		max-width: calc(100%);
		flex-direction: row;
	}
	.share-button {
		justify-content: flex-end;
	}
	.get-link {
		width: 50%;
	}
	.share-icon {
		margin-right: 5px;
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
	.broadcast-record {
		padding-top: 0px;
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
	.link-container a {
		white-space: nowrap;
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
