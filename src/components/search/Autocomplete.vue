<!--v-html rule is disabled below as the contents is sanitized with DOMPurify-->
<!-- eslint-disable vue/no-v-html -->
<template>
	<div class="autocomplete">
		<ul
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
					@click="executeOnSelection"
					v-html="setBoldAndSanitize(searchResultStore.currentQuery || '', item?.term)"
				></button>
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useSearchResultStore } from '@/store/searchResultStore';
import router from '@/router';
import { APIAutocompleteTerm } from '@/types/APIResponseTypes';
import * as DOMPurify from 'dompurify';

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
			router.push({
				name: 'Home',
				query: { q: query ? query : searchResultStore.currentQuery, start: 0, fq: searchResultStore.preliminaryFilter },
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
					executeOnSelection(e);
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

		const executeOnSelection = (e: Event) => {
			if (currentSelectedAutocomplete.value !== 0) {
				e.preventDefault();
				doAutocompleteSearch(
					currentSelectedAutocomplete.value !== 0
						? searchResultStore.autocompleteResult[currentSelectedAutocomplete.value - 1].term
						: searchResultStore.currentQuery,
				);
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

				const highlightedString = `${before}<span style="font-weight:bold">${matched}</span>${after}`;
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
	border: 1px solid #f5f5f5;
	border-top: 0px solid #f5f5f5;
	box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
	border-radius: 0px 0px 2px 2px;
	margin-left: -1px;
}

.autocomplete button {
	border: 0px;
	background-color: transparent;
	width: 100%;
	height: 100%;
	cursor: pointer;
	text-align: left;
	font-size: 16px;
}

.autocomplete button span {
	font-weight: bold;
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
}

.autocomplete button span {
	font-weight: bold;
}

.autocomplete ul li {
	height: 25px;
	padding: 7px 10px;
	transition: all 0.2s linear 0s;
	overflow: hidden;
	text-wrap: nowrap;
	text-overflow: ellipsis;
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
	transform: scaleX(120%);
	z-index: 5;
}

.autocomplete ul li:before {
	content: '';
	display: block;
	padding: 0px 10px;
	border-top: 1px solid rgb(229, 228, 226);
	height: 1px;
	position: relative;
	top: -7px;
	transition: all 0.2s linear 0s;
	z-index: 0;
}
</style>
