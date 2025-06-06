<!--v-html rule is disabled below as the contents is sanitized with DOMPurify-->
<!-- eslint-disable vue/no-v-html -->
<template>
	<div :class="searchResultStore.autocompleteResult.length > 0 ? 'autocomplete active' : 'autocomplete'">
		<Transition
			name="fade"
			mode="out-in"
		>
			<ul
				v-if="searchResultStore.autocompleteResult.length > 0"
				ref="autocomplete"
				role="listbox"
				class="autocomplete-list"
				aria-label="autocomplete list"
			>
				<li
					v-for="(item, i) in searchResultStore.autocompleteResult"
					:key="i"
					role="option"
					:class="i === currentSelectedAutocomplete - 1 ? 'hl' : ''"
				>
					<button
						:title="item?.term"
						:data-testid="addTestDataEnrichment('button', 'autcomplete', `term-${item.term}`, i)"
						@click="executeOnSelection($event, i + 1)"
						@mouseenter="updateSelectedElement(i + 1)"
						@mouseleave="updateSelectedElement(0)"
					>
						<span
							class="autocomplete-term"
							v-html="`${setBoldAndSanitize(searchResultStore.currentQuery || '', item?.term)}`"
						></span>
						<span class="number">{{ `(${item.weight})` }}</span>
					</button>
				</li>
			</ul>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import router from '@/router';
import { APIAutocompleteTerm } from '@/types/APIResponseTypes';
import * as DOMPurify from 'dompurify';
import { addTestDataEnrichment } from '@/utils/test-enrichments';

export default defineComponent({
	name: 'Autocomplete',

	props: {
		keystroke: {
			type: KeyboardEvent,
			default: null,
		},
	},

	setup(props) {
		const searchResultStore = useSearchResultStore();
		const currentSelectedAutocomplete = ref(0);

		const doAutocompleteSearch = (query: string) => {
			const rdyQuery = `"${query.replaceAll('"', '\\"')}"`;
			router.push({
				name: 'Search',
				query: { q: query ? rdyQuery : searchResultStore.currentQuery, start: 0 },
			});
		};

		watch(
			() => props.keystroke,
			(newEvent: KeyboardEvent | null) => {
				if (newEvent) {
					keyMovement(newEvent);
				}
			},
		);

		watch(
			() => searchResultStore.autocompleteResult,
			(newResult: APIAutocompleteTerm[], prevResult: APIAutocompleteTerm[]) => {
				if (newResult !== prevResult) {
					currentSelectedAutocomplete.value = 0;
				}
			},
		);

		const updateSelectedElement = (n: number) => {
			currentSelectedAutocomplete.value = n;
		};

		const keyMovement = (e: KeyboardEvent) => {
			searchResultStore.setBlockAutocomplete(false);
			switch (e.key) {
				case 'ArrowDown':
					moveSelectorDown();
					break;
				case 'ArrowUp':
					moveSelectorUp();
					break;
				case 'Enter':
					break;
				case 'Tab':
					if (searchResultStore.autocompleteResult?.length > 0) {
						moveSelectorDown();
						e.preventDefault();
					}
					break;
				default:
					break;
			}
		};

		const moveSelectorUp = () => {
			if (currentSelectedAutocomplete.value > 0) {
				currentSelectedAutocomplete.value--;
			} else {
				currentSelectedAutocomplete.value = searchResultStore.autocompleteResult.length;
			}
		};

		const moveSelectorDown = () => {
			if (currentSelectedAutocomplete.value < searchResultStore.autocompleteResult.length) {
				currentSelectedAutocomplete.value++;
			} else {
				currentSelectedAutocomplete.value = 0;
			}
		};

		const executeOnSelection = (e: PointerEvent, n: number) => {
			if (currentSelectedAutocomplete.value !== 0) {
				e.preventDefault();
				// pointerType mouse is for a mouse click, where pointerType would be "" if enter
				if (e.pointerType === 'mouse') {
					//updated selected element to make sure it picks the clicked element.
					updateSelectedElement(n);
				}
				doAutocompleteSearch(searchResultStore.autocompleteResult[currentSelectedAutocomplete.value - 1].term);
			}
		};

		const setBoldAndSanitize = (hl: string, str: string) => {
			const lowerCaseValue = hl.toLowerCase();
			const lowerCaseStr = str.toLowerCase();

			const startIndex = lowerCaseStr.indexOf(lowerCaseValue);
			const endIndex = startIndex + hl.length;

			if (startIndex !== -1) {
				const before = str.substring(0, startIndex);
				const matched = str.substring(startIndex, endIndex);
				const after = str.substring(endIndex);

				const highlightedString = `<span>${before}<span style="font-weight:bold">${matched}</span>${after}</span>`;
				return DOMPurify.default.sanitize(highlightedString, { ALLOWED_TAGS: ['span'] });
			}
			return str;
		};

		return {
			searchResultStore,
			setBoldAndSanitize,
			doAutocompleteSearch,
			executeOnSelection,
			currentSelectedAutocomplete,
			addTestDataEnrichment,
			updateSelectedElement,
		};
	},
});
</script>

<style scoped>
.autocomplete {
	position: absolute;
	z-index: 5;
	background-color: white;
	width: 50%;
	padding: 0px 0px;
	margin-top: -1px;
	margin-left: 0px;
	width: calc(80% - 2px);
	border: 1px solid #757575;
	border-top: 0px solid #757575;
}

.autocomplete.active {
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
	border-radius: 0px 0px 2px 2px;
}

.autocomplete button {
	border: 0px;
	background-color: transparent;
	width: 100%;
	height: 100%;
	cursor: pointer;
	text-align: left;
	font-size: 16px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	align-items: center;
	padding: 0px 10px;
}

.autocomplete-term {
	overflow: hidden;
	text-overflow: ellipsis;
	display: inline-block;
}

.autocomplete button .number {
	color: #757575;
	margin-left: 5px;
	font-size: 12px;
}

.autocomplete:has(> ul:empty) {
	height: 0px;
	border: 0px;
}

.autocomplete li:has(> button:focus) {
	background: #fff6c4;
	color: #002e70;
}

.autocomplete button:focus {
	outline: none;
	box-shadow: none;
}

.autocomplete ul {
	list-style-type: none;
	padding: 0px 0px;
	margin: 0;
	background-color: white;
}

.autocomplete ul li {
	height: 39px;
	transition: all 0.2s linear 0s;
	text-wrap: nowrap;
	text-overflow: ellipsis;
	background-color: white;
}

.autocomplete ul li:hover,
.autocomplete .hl {
	background: #fff6c4;
}

.autocomplete ul li:hover button,
.autocomplete .hl button {
	color: #002e70;
	cursor: pointer;
}

.autocomplete ul li:hover:before,
.autocomplete ul li:hover + li:before,
.autocomplete .hl:before,
.autocomplete .hl + li:before,
.autocomplete ul li:has(> button:focus):before,
.autocomplete ul li:has(> button:focus) + li:before {
	padding: 0px 0px;
	transform: scaleX(calc(100%));
	z-index: 5;
}

.autocomplete ul li:before {
	content: '';
	display: block;
	padding: 0px 10px;
	border-top: 1px solid rgb(229, 228, 226);
	height: 1px;
	position: relative;
	transition: all 0.2s linear 0s;
	transform: scaleX(95%);
	z-index: 0;
}

/* MEDIA QUERY 480 */
@media (min-width: 480px) {
	.autocomplete {
		border: 1px solid #757575;
		border-top: 0px;
		width: calc(80% - 2px);
	}
}
/* MEDIA QUERY 640 */
@media (min-width: 640px) {
}

@media (min-width: 800px) {
	.autocomplete {
		border: 1px solid #f5f5f5;
		border-top: 0px solid #f5f5f5;
		margin-top: -1px;
		margin-left: -1px;
		width: calc(50%);
	}
}
/* MEDIA QUERY 990 */
@media (min-width: 990px) {
}
/* MEDIA QUERY 1150 */
@media (min-width: 1150px) {
}
/* MEDIA QUERY 1280 */
@media (min-width: 1280px) {
}
</style>
