<template>
	<div class="result-item-wrapper">
		<div
			class="container"
			v-if="!searchResultStore.loading && resultdata"
		>
			<div class="information">
				<router-link
					:to="{ path: 'record/' + resultdata.id }"
					class="title"
					role="link"
				>
					{{ resultdata.title[0] }}
				</router-link>
				<div class="subtitle">
					<span class="material-icons icons schedule">{{ resultdata.origin.split('.')[1] }}</span>
					<span class="where">{{ resultdata.creator_affiliation[0] + ',' }}</span>
					<span class="when">{{ starttime }}</span>
					<span class="material-icons icons schedule">schedule</span>
					<span class="duration">{{ duration }}</span>
				</div>
				<div class="summary">{{ resultdata.description }}</div>
			</div>
			<div class="result-image-wrapper"><kb-imagecomponent :imagedata="getImageData()"></kb-imagecomponent></div>
		</div>
		<div
			class="loading container"
			v-if="searchResultStore.loading"
		>
			<div class="shimmer"></div>
			<div class="information">
				<div class="placeholder-t"></div>
				<div class="placeholder-w">
					<span></span>
					<span></span>
				</div>
				<div class="placeholder-s">
					<span
						v-for="n in 15"
						:key="n"
					></span>
				</div>
			</div>
			<div class="result-image-wrapper skeleton"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import { GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { ImageComponentType } from '@/types/ImageComponentType';
import '@/components/common/wc-image-item';

export default defineComponent({
	name: 'ResultItem',
	components: {},
	props: {
		resultdata: { type: Object as PropType<GenericSearchResultType> },
		duration: { type: String },
		starttime: { type: String },
		placeholder: { type: String },
	},
	setup(props) {
		const searchResultStore = useSearchResultStore();
		const getImageData = () => {
			const imageData = {} as ImageComponentType;
			imageData.imgSrc = props.resultdata?.thumbnail;
			imageData.altText = props.resultdata?.title;
			imageData.imgTitle = props.resultdata?.title;
			imageData.placeholder = props.placeholder;
			return JSON.stringify(imageData);
		};
		return { searchResultStore, getImageData };
	},
});
</script>
<style scoped>
.result-item-wrapper {
	transition: all 0.3s linear;
	padding-bottom: 30px;
	overflow: hidden;
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
	font-feature-settings: 'liga';
	-webkit-font-feature-settings: 'liga';
	-webkit-font-smoothing: antialiased;
}
.icons {
	padding-right: 3px;
	position: relative;
	top: 3px;
}
.schedule {
	transition: all 0.5s ease-in-out 0s;
}
.summary span {
	height: 15px;
	display: block;
	border-radius: 15px;
	margin-top: 5px;
	transition: all 0.5s ease-in-out 0s;
}

.container {
	display: flex;
	flex-direction: row;
	height: 105px;
	justify-content: space-between;
	gap: 30px;
	width: 100%;
}

.information {
	text-overflow: ellipsis;
	width: calc(100% - (200px + 30px));
	overflow: hidden;
	max-width: 100%;
}

.title {
	transition: all 0.5s ease-in-out 0s;
	font-weight: bold;
	color: #002e70;
	text-overflow: ellipsis;
	max-width: calc(100% - (200px - 60px));
	white-space: nowrap;
	overflow: hidden;
	width: 75ch;
	text-transform: uppercase;
	text-decoration: none;
	height: 18px;
	position: relative;
	display: block;
	margin-bottom: 7px;
	color: #002e70;
}

.result-image-wrapper {
	width: 200px;
}

.where,
.when,
.duration {
	padding-right: 5px;
	text-overflow: ellipsis;
	font-size: 14px;
}

.loading {
	width: 100vw;
	max-width: 100%;
	height: 105px;
	flex-direction: row;
	height: 105px;
	justify-content: space-between;
	gap: 30px;
}

.shimmer {
	animation: loading 3s ease-in-out 0s infinite;
	background: rgb(255, 255, 255);
	background: linear-gradient(
		117deg,
		rgba(255, 255, 255, 0) 44%,
		rgba(255, 255, 255, 0.7455357142857143) 64%,
		rgba(255, 255, 255, 0) 77%
	);
	position: absolute;
	width: 100%;
	height: 105px;
	mix-blend-mode: soft-light;
	overflow: hidden;
	background-size: 200% 100%;
	background-position: 160% center;
}

@keyframes loading {
	0% {
		background-position: 160% center;
	}
	20% {
		background-position: 160% center;
	}
	80% {
		background-position: -20% center;
	}
	100% {
		background-position: -20% center;
	}
}

.placeholder-t {
	border-radius: 105px;
	background-color: rgba(170, 170, 170, 1);
	height: 20px;
	margin-bottom: 7px;
}

.placeholder-w span {
	display: inline-block;
	border-radius: 10px;
	background-color: rgba(170, 170, 170, 1);
	width: 30px;
	height: 16px;
	width: 25%;
}

.placeholder-w span:first-of-type {
	margin-right: 5px;
}

.placeholder-s {
	height: 60px;
	width: 100%;
}

.result-image-wrapper.skeleton {
	background-color: rgba(170, 170, 170, 1);
	border-radius: 10px;
}

.placeholder-s span {
	display: inline-block;
	border-radius: 10px;
	background-color: rgba(170, 170, 170, 1);
	height: 14px;
	line-height: 20px; /* fallback for firefox */
	max-height: calc(20px); /* fallback for firefox */
	width: 90%;
}

.summary {
	transition: all 0.5s ease-in-out 0s;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	line-height: 20px; /* fallback for firefox */
	max-height: calc(20px * 3); /* fallback for firefox */
}
</style>
