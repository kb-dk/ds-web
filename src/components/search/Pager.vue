<template>
	<div :class="searchResultStore.loading ? 'pager disabled' : 'pager'">
		<div class="morePagesMessage">
			<div v-if="totalPages > maxPages && currentPageRef === maxPages">
				<div>
					{{ $t('search.morePagesMessage.1') }}
					{{ $t('search.morePagesMessage.2') }}
					<div class="totalHits">
						{{ $t('search.morePagesMessage.3', { totalHits: totalHits.toLocaleString('da-dk') }) }}
					</div>
					{{ $t('search.morePagesMessage.4') }}
					<a
						href="#"
						class="topOfScreen"
					>
						<span class="material-icons">sort</span>
						{{ $t('search.morePagesMessage.5') }}
					</a>
				</div>
			</div>
		</div>
		<div class="pager-buttons">
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
					<span>{{ new Intl.NumberFormat('de-DE').format(Number(pageNumber)) }}</span>
				</button>
			</span>
			<button
				:disabled="currentPageRef === maxPages"
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
		<span class="pager-input">
			<div class="input-label">{{ $t('search.page') }}</div>
			<input
				ref="inputRef"
				v-model="selectPage"
				:class="`page-select-input ${inputIncorrect ? 'page-select-input-error' : ''}`"
				@keydown="checkIfNumber($event)"
				@keyup.enter="submitPage()"
			/>
			<button
				:class="`go-to-button ${inputIncorrect || selectPage === '' ? 'go-to-button-error' : ''}`"
				:disabled="inputIncorrect || selectPage === ''"
				@click="submitPage()"
			>
				{{ $t('search.goToThePage') }}
			</button>
		</span>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { Priority, Severity } from '@/types/NotificationType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { useI18n } from 'vue-i18n';

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
		const selectPage = ref('');
		const inputIncorrect = ref(false);
		const totalPages = computed(() => Math.ceil(props.totalHits / props.itemsPerPage));
		const maxPages = computed(() => (totalPages.value > 100 ? 100 : totalPages.value));
		const errorManager = inject('errorManager') as ErrorManagerType;
		const { t } = useI18n({ useScope: 'global' });
		const inputRef = ref<HTMLInputElement | null>();
		watch(
			() => selectPage.value,
			(newVal) => {
				if (newVal) {
					if (parseInt(newVal) <= 0 || parseInt(newVal) > maxPages.value) {
						inputIncorrect.value = true;
					} else {
						inputIncorrect.value = false;
					}
				}
			},
		);
		const checkIfNumber = (event: KeyboardEvent) => {
			if (event.key.length === 1 && isNaN(Number(event.key))) {
				event.preventDefault();
			}
		};
		const submitPage = () => {
			if (parseInt(selectPage.value) <= maxPages.value && parseInt(selectPage.value) > 0) {
				goToPage(parseInt(selectPage.value));
			} else {
				errorManager.submitCustomError(
					'search-result-error',
					t('error.infoError.title'),
					t('error.infoError.pageNumber'),
					Severity.INFO,
					false,
					Priority.LOW,
				);
			}
		};
		const navigate = () => {
			const start = (currentPageRef.value - 1) * props.itemsPerPage;
			const query = { ...route.query, start };
			router.push({ query });
		};

		const nextPage = () => {
			if (currentPageRef.value < maxPages.value) {
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
			if (page >= 1 && page <= maxPages.value) {
				currentPageRef.value = page;
				navigate();
			}
		};

		const computedPages = computed(() => {
			//Array to hold them page numbers
			const pages = [];
			//If the page count doesn't exceed our number of pages to show we just push all pages
			if (maxPages.value <= props.numPagesToShow) {
				for (let i = 1; i <= maxPages.value; i++) {
					pages.push(i);
				}
				/*If the page count does exceed our number of pages to show we calculate
			  the 'spread' on each side, the start and end page
				*/
			} else {
				const halfNumPagesToShow = Math.floor(props.numPagesToShow / 2);
				let startPage = Math.max(1, currentPageRef.value - halfNumPagesToShow);
				// let startPage = Math.max(1, currentPageRef.value - halfNumPagesToShow) + 3;
				let endPage = startPage + props.numPagesToShow - 1;
				// let endPage = startPage + props.numPagesToShow - 6;
				/*If 'end page' is bigger than 'total pages value' 'end page' is of course 'number of pages'
				 	and the start page is calculated from endPage and 'number of pages to show' values. We +1
					or else there would be shown one more page in the pager than specified in props.numPagesToShow
				 */
				if (endPage > maxPages.value) {
					endPage = maxPages.value;
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
				if (endPage < maxPages.value) {
					if (endPage < maxPages.value - 1) {
						pages.push('...');
					}
					pages.push(maxPages.value);
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
					window.scrollTo({ top: 0, behavior: 'smooth' });
					selectPage.value = '';
				}
			},
		);

		return {
			currentPageRef,
			totalPages,
			maxPages,
			nextPage,
			prevPage,
			goToPage,
			computedPages,
			searchResultStore,
			checkIfNumber,
			selectPage,
			inputIncorrect,
			inputRef,
			submitPage,
		};
	},
});
</script>

<style scoped>
.pager {
	display: flex;
	justify-content: center;
	padding-top: 25px;
	padding-bottom: 50px;
	flex-direction: column;
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
	font-size: 14px;
	cursor: pointer;
	margin: 0px 2px;
	padding: 2px 2px;
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

.input-label {
	color: #002e70;
	font-size: 16px;
	height: 31px;
	width: fit-content;
	display: inline;
	margin-right: 10px;
}

.pager-input {
	padding-top: 20px;
	align-self: center;
}
.pager-buttons {
	align-self: center;
	display: flex;
	flex-direction: row;
}

.page-select-input {
	background: #ffffff 0% 0% no-repeat padding-box;
	color: #002e70;
	border: 0px solid #002e70;
	border-radius: 2px;
	height: 25px;
	width: 80px;
	font-size: 16px;
	padding: 2px 5px;
	outline: 1px solid #002e70;
}

.page-select-input:focus-visible {
	outline: 2px solid #002e70;
}

.page-select-input-error {
	box-shadow: 0 0 5px #f7ae3b;
}

.page-select-input-error:focus-visible {
	outline: 1px solid #f7ae3b;
}

.go-to-button {
	transition: all 0.3s linear 0s;
	color: #002e70;
	background-color: #49da87;
	font-size: 16px;
	height: 31px;
	border-radius: 4px;
	align-items: center;
	margin-left: 10px;
}

.go-to-button:hover {
	outline: 2px solid #002e70;
}

.go-to-button-error {
	background-color: #6e6e6e;
	color: white;
}
.go-to-button-error:hover {
	outline: 0px solid #002e70;
}

.container[data-v-a895c851] {
	text-align: left;
}

.morePagesMessage {
	width: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
}
.morePagesMessage > div {
	width: 95%;
}
.morePagesMessage .totalHits {
	font-weight: bold;
	width: fit-content;
	display: inline;
}
.morePagesMessage .topOfScreen {
	color: #002e70;
}
.topOfScreen > span {
	position: relative;
	top: 6px;
}
/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.pager-buttons {
		font-size: 16px;
	}
	button {
		padding: 2px 5px;
	}
}

@media (min-width: 800px) {
	.morePagesMessage > div {
		width: 55%;
	}
}
</style>
