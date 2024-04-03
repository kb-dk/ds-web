<template>
	<div :class="searchResultStore.loading ? 'pager disabled' : 'pager'">
		<button
			:disabled="currentPageRef === 1"
			:title="$t('search.previousPage')"
			:aria-label="$t('search.previousPage')"
			@click="prevPage"
		>
			<i
				class="material-icons"
				aria-hidden="true"
			>
				chevron_left
			</i>
		</button>
		<span
			v-for="(pageNumber, index) in computedPages"
			:key="index"
		>
			<span
				v-if="pageNumber === '...'"
				class="dots"
			>
				{{ pageNumber }}
			</span>
			<button
				v-else
				:class="{ active: pageNumber === currentPageRef }"
				:title="`${$t('search.page')} ${pageNumber}`"
				:aria-label="$t('search.goToPage', Number(pageNumber))"
				@click="goToPage(pageNumber as number)"
			>
				<span>{{ pageNumber }}</span>
			</button>
		</span>
		<button
			:disabled="currentPageRef === totalPages"
			:title="$t('search.nextPage')"
			:aria-label="$t('search.nextPage')"
			@click="nextPage"
		>
			<i
				class="material-icons"
				aria-hidden="true"
			>
				chevron_right
			</i>
		</button>
	</div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';

export default defineComponent({
	name: 'Pager',
	props: {
		totalHits: { type: Number, required: true },
		numPagesToShow: { type: Number, default: 8 },
		itemsPerPage: { type: Number, default: 10 },
	},

	setup(props) {
		const route = useRoute();
		const router = useRouter();
		const currentPageRef = ref(1);
		const searchResultStore = useSearchResultStore();

		const totalPages = computed(() => Math.ceil(props.totalHits / props.itemsPerPage));

		const navigate = () => {
			const start = (currentPageRef.value - 1) * props.itemsPerPage;
			const query = { ...route.query, start };
			router.push({ query });
		};

		const nextPage = () => {
			if (currentPageRef.value < totalPages.value) {
				currentPageRef.value++;
				navigate();
			}
		};

		const prevPage = () => {
			if (currentPageRef.value > 1) {
				currentPageRef.value--;
				navigate();
			}
		};

		const goToPage = (page: number) => {
			if (page >= 1 && page <= totalPages.value) {
				currentPageRef.value = page;
				navigate();
			}
		};

		const computedPages = computed(() => {
			//Array to hold them page numbers
			const pages = [];
			//If the page count doesn't exceed our number of pages to show we just push all pages
			if (totalPages.value <= props.numPagesToShow) {
				for (let i = 1; i <= totalPages.value; i++) {
					pages.push(i);
				}
				/*If the page count does exceed our number of pages to show we calculate
			  the 'spread' on each side, the start and end page
				*/
			} else {
				const halfNumPagesToShow = Math.floor(props.numPagesToShow / 2);
				let startPage = Math.max(1, currentPageRef.value - halfNumPagesToShow);
				let endPage = startPage + props.numPagesToShow - 1;
				/*If 'end page' is bigger than 'total pages value' 'end page' is of course 'number of pages'
				 	and the start page is calculated from endPage and 'number of pages to show' values. We +1
					or else there would be shown one more page in the pager than specified in props.numPagesToShow  
				 */
				if (endPage > totalPages.value) {
					endPage = totalPages.value;
					startPage = endPage - props.numPagesToShow + 1;
				}

				if (startPage > 1) {
					/*If start page is greater than 1 we need to tuck 1 into the pages array
					as 1 always will be our starting page
					*/
					pages.push(1);
					//If start page is greater than 2 we need them small dots to show it
					if (startPage > 2) {
						pages.push('...');
					}
				}
				/*When all the above is taken care of we push page numbers the array until 
				endPage is greater than startPage
				*/
				for (let i = startPage; i <= endPage; i++) {
					pages.push(i);
				}

				/*Here we handle the dots at the end. If totalPages needed is greater than the endPage value
				we continue. If exactly 'totalPages -1' is greater than the endPage value we now them dots now
				so we push them to the pages array. If this condition is not met we know this is the end of line
				and push the total page count to the array as the last thing before we return pages
				*/
				if (endPage < totalPages.value) {
					if (endPage < totalPages.value - 1) {
						pages.push('...');
					}
					pages.push(totalPages.value);
				}
			}
			return pages;
		});

		const initializePager = () => {
			const startParam = Number(route.query.start);
			if (!isNaN(startParam) && startParam >= 0) {
				const initialPage = Math.floor(startParam / props.itemsPerPage) + 1;
				currentPageRef.value = initialPage;
			} else {
				currentPageRef.value = 1;
			}
		};

		onMounted(() => {
			if (route.query.start) {
				initializePager();
			}
		});

		watch(
			() => searchResultStore.start,
			(newStart: string, prevStart: string) => {
				if (newStart !== prevStart) {
					initializePager();
				}
			},
		);

		return { currentPageRef, totalPages, nextPage, prevPage, goToPage, computedPages, searchResultStore };
	},
});
</script>

<style scoped>
.pager {
	display: flex;
	justify-content: center;
	padding-top: 25px;
	padding-bottom: 50px;
}

.pager.disabled {
	pointer-events: none;
}

.pager.disabled button span,
.pager.disabled .dots,
.pager.disabled button i {
	/* https://jxnblk.github.io/grays/ */
	color: #767676 !important;
}

.active span {
	color: white;
	background-color: #002e70;
	text-decoration: none;
}

button {
	border: 0px transparent;
	background-color: transparent;
	font-size: 16px;
	cursor: pointer;
	margin: 0px 2px;
}

button span,
.dots {
	padding: 2px 5px;
	text-decoration: underline;
	color: #002e70;
	border-radius: 3px;
	transition: all 0.2s linear 0s;
	line-height: 25px;
}

.dots {
	text-decoration: none;
}
</style>
