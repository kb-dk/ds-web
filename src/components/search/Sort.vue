<template>
	<div class="sort">
		<button
			@click="revealSortingOptions"
			:class="searchResultStore.loading ? 'sort-box disabled' : 'sort-box'"
		>
			<span class="btn-text">
				<span ref="currentSort">
					{{
						searchResultStore.sort !== ''
							? t('search.sortAfter') + t('search.' + searchResultStore.sort.split('%20')[0])
							: t('search.sortBy')
					}}
				</span>
				<span :class="showSortingOptions ? 'material-icons sort-expand turn' : 'material-icons sort-expand'">
					expand_more
				</span>
			</span>
		</button>
		<Transition name="fade">
			<div
				v-show="showSortingOptions"
				class="sort-options"
			>
				<button @click="newSort('title_sort_da asc')">{{ t('search.title') }}</button>
				<button @click="newSort('score desc')">{{ t('search.score') }}</button>
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

export default defineComponent({
	name: 'Sort',
	setup() {
		const showSortingOptions = ref(false);
		const route = useRoute();
		const router = useRouter();
		const searchResultStore = useSearchResultStore();
		const { t } = useI18n();

		const revealSortingOptions = () => {
			showSortingOptions.value = !showSortingOptions.value;
		};

		const newSort = (sortValue: string) => {
			const sort = encodeURIComponent(`${sortValue}`);
			const start = `${0}`;
			const query = { ...route.query, sort, start };
			router.push({ query });
			showSortingOptions.value = false;
			searchResultStore.resetStart();
		};

		onMounted(() => {
			if (route.query.sort) {
				const sortingValue = route.query.sort as string;
				searchResultStore.setSortValue(sortingValue.split('%20')[0]);
				//console.log(searchResultStore.sort);
			}
		});

		return { revealSortingOptions, showSortingOptions, newSort, searchResultStore, t };
	},
});
</script>

<style scoped>
.sort {
	position: relative;
	min-width: 150px;
	text-align: right;
	padding-right: 5px;
}
.sort-box {
	cursor: pointer;
	background-color: transparent;
	border: 0px;
	height: 35px;
	font-family: noway, sans-serif;
	font-size: 16px;
	padding: 6px 0px;
}

.sort-box.disabled {
	pointer-events: none;
	/* https://jxnblk.github.io/grays/ */
	color: #767676;
}

.btn-text {
	position: relative;
	top: -5px;
}
.sort-expand {
	top: 7px;
	position: relative;
	transition: all 0.3s linear 0s;
}

.sort-expand.turn {
	transform: rotateX(180deg);
}

.sort-options {
	display: flex;
	flex-direction: column;
	height: auto;
	overflow: hidden;
	position: absolute;
	width: 100%;
	box-shadow:
		rgba(0, 0, 0, 0.16) 0px 3px 6px,
		rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.sort-options button {
	border: 0px;
	background-color: transparent;
	text-align: right;
	font-size: 16px;
	padding-right: 30px;
	cursor: pointer;
	margin-bottom: 5px;
}

.sort-options button:last-of-type {
	margin-bottom: 0px;
}
</style>
