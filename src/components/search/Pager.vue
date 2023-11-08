<template>
	<div>
		<button
			@click="prevPage"
			:disabled="currentPageRef === 1"
		>
			Previous
		</button>
		<span
			v-for="(pageNumber, index) in computedPages"
			:key="index"
		>
			<span v-if="pageNumber === '...'">{{ pageNumber }}</span>
			<button
				v-else
				@click="goToPage(pageNumber as number)"
				:class="{ active: pageNumber === currentPageRef }"
			>
				{{ pageNumber }}
			</button>
		</span>
		<span>{{ currentPageRef }} / {{ totalPages }}</span>
		<button
			@click="nextPage"
			:disabled="currentPageRef === totalPages"
		>
			Next
		</button>
	</div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
			}
		};

		onMounted(() => {
			if (route.query.start) {
				initializePager();
			}
		});

		return { currentPageRef, totalPages, nextPage, prevPage, goToPage, computedPages };
	},
});
</script>

<style scoped>
.active {
	/*color: #002e70;*/
	color: blue;
	font-weight: bold;
}
</style>
