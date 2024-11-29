import { defineStore } from 'pinia';
import { FacetResultType, FacetsType, GenericSearchResultType } from '@/types/GenericSearchResultTypes';
import { APIService } from '@/api/api-service';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { AxiosError } from 'axios';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SpellCheckType } from '@/types/SpellCheckType';
import { LocationQueryValue } from 'vue-router';
import { APIAutocompleteTerm } from '@/types/APIResponseTypes';

export const useSearchResultStore = defineStore('searchResults', () => {
	let currentSearchUUID = '';
	let comparisonSearchUUID = '';
	const firstBackendFetchExecuted = ref(false);
	const initFacets = ref({} as FacetsType);
	const searchResult = ref([] as Array<GenericSearchResultType>);
	const spellCheck = ref({} as unknown as SpellCheckType);
	const facetResult = ref(Object as unknown as FacetResultType);
	const autocompleteResult = ref([] as Array<APIAutocompleteTerm>);
	const errorManager = inject('errorManager') as ErrorManagerType;
	const rotationalResult = ref([] as Array<GenericSearchResultType>);
	const searchFired = ref(false);
	const { t } = useI18n();
	const numFound = ref(0);
	const loading = ref(false);
	const start = ref('');
	const sort = ref('');
	const error = ref('');
	const rowCount = ref('10');
	const rowOffset = ref(10);
	const currentQuery = ref('');
	const lastSearchQuery = ref('');
	const noHits = ref(false);
	const filters = ref([] as Array<string>);
	const channelFilters = ref([] as Array<string>);
	const categoryFilters = ref([] as Array<string>);
	const preliminaryFilter = ref('');
	const showFacets = ref(false);
	const blockAutocomplete = ref(false);
	const resultGrid = ref(false);
	const curatedContent = ref([]);

	const setStart = (value: string) => {
		start.value = value;
	};

	const setRowOffset = (value: number) => {
		rowOffset.value = value;
	};

	const setRowCount = (value: string) => {
		rowCount.value = value;
	};

	const setResultGrid = (value: boolean) => {
		resultGrid.value = value;
	};

	const toggleShowFacets = (value: boolean) => {
		showFacets.value = value;
	};

	const setRotationalResult = (items: GenericSearchResultType[]) => {
		rotationalResult.value = items;
	};

	const addFilter = (filter: string) => {
		if (!filters.value.includes(filter)) {
			filters.value.push(filter);
		}
	};

	const removeFilter = (filter: string) => {
		filters.value.splice(filters.value.indexOf(filter), 1);
	};

	const setFiltersFromURL = (URLFilters: string[] | LocationQueryValue[] | string) => {
		filters.value = [];
		channelFilters.value = [];
		categoryFilters.value = [];
		if (URLFilters !== undefined) {
			if (URLFilters instanceof Array) {
				URLFilters.forEach((filter) => {
					if (filter?.split('%3A')[0].includes('origin')) {
						preliminaryFilter.value = filter;
					} else if (filter?.split('%3A')[0].includes('creator_affiliation_facet')) {
						const cleanedString = filter.replace(/[()]/g, '');
						channelFilters.value = cleanedString.split(' OR ');
					} else if (filter?.split('%3A')[0].includes('genre')) {
						const cleanedString = filter.replace(/[()]/g, '');
						categoryFilters.value = cleanedString.split(' OR ');
					} else {
						filter !== '' ? filters.value.push(`fq=${filter}`) : null;
					}
				});
			} else {
				const str = URLFilters;
				if (str.split('%3A')[0].includes('origin')) {
					filters.value.push(`fq=${str}`);
				} else if (str.split('%3A')[0].includes('creator_affiliation_facet')) {
					const cleanedString = str.replace(/[()]/g, '');
					channelFilters.value = cleanedString.split(' OR ');
				} else if (str.split('%3A')[0].includes('genre')) {
					const cleanedString = str.replace(/[()]/g, '');
					categoryFilters.value = cleanedString.split(' OR ');
				} else {
					str !== '' ? filters.value.push(`fq=${str}`) : null;
				}
			}
		}
	};

	const setRowCountFromURL = (rows: string | undefined) => {
		if (rows) {
			rowCount.value = rows;
		}
	};

	const setStartFromURL = (URLStart: string | undefined) => {
		if (URLStart) {
			//Check if url param string is actually some kind of numeric value
			if (!Number.isNaN(Number(URLStart))) {
				start.value = URLStart === '0' ? '' : URLStart;
			}
		}
	};

	const setCurrentQueryFromURL = (URLQuery: string | undefined) => {
		if (URLQuery) {
			currentQuery.value = URLQuery;
		}
	};

	const setSortFromURL = (URLSort: string | undefined) => {
		if (URLSort) {
			sort.value = URLSort;
		} else {
			sort.value = '';
		}
	};

	const resetStart = () => {
		start.value = '0';
	};

	const resetSort = () => {
		sort.value = '';
	};

	const resetPreliminaryFilters = () => {
		preliminaryFilter.value = '';
	};

	const resetSpellCheck = () => {
		spellCheck.value = {} as SpellCheckType;
	};

	const setSortValue = (value: string) => {
		sort.value = value;
	};

	const resetSearch = () => {
		resetFilters();
		resetResults();
		resetStart();
		resetSort();
		resetSpellCheck();
		resetPreliminaryFilters();
		currentQuery.value = '';
		searchFired.value = false;
		loading.value = false;
	};

	const resetResults = () => {
		searchResult.value = [];
	};

	const resetFilters = () => {
		filters.value = [];
		facetResult.value = {} as FacetResultType;
		channelFilters.value = [];
		categoryFilters.value = [];
	};

	const resetAutocomplete = () => {
		autocompleteResult.value = [];
	};

	const setBlockAutocomplete = (state: boolean) => {
		blockAutocomplete.value = state;
	};

	const getAutocompleteResults = (query: string) => {
		APIService.getAutocomplete(query).then((autocompleteReponse) => {
			if (!blockAutocomplete.value) {
				const autocompleteSelectedTerm = autocompleteReponse.data.suggest.radiotv_title_suggest;
				autocompleteResult.value = autocompleteSelectedTerm[Object.keys(autocompleteSelectedTerm)[0]].suggestions;
			}
		});
	};

	const responseMatchesCurrentSearch = (uuid: string): boolean => {
		return uuid === currentSearchUUID;
	};

	const getSearchResults = async (query: string) => {
		if (currentQuery.value === '*:*') {
			currentQuery.value = '';
		}
		setBlockAutocomplete(true);
		lastSearchQuery.value = query;
		resetAutocomplete();
		let searchFilters = '';
		let presetGenreFilters = '';
		let presetChannelFilters = '';
		if (filters.value.length > 0) {
			filters.value.forEach((filt: string) => {
				searchFilters += `&${filt}`;
				presetGenreFilters += `&${filt}`;
				presetChannelFilters += `&${filt}`;
			});
		}
		let channelFilterString = '';
		if (channelFilters.value.length > 0) {
			channelFilterString = `&fq=(${channelFilters.value.join(' OR ')})`;
			presetGenreFilters += `&fq=(${channelFilters.value.join(' OR ')})`;
		}
		searchFilters += channelFilterString;

		let categoryFilterString = '';
		if (categoryFilters.value.length > 0) {
			categoryFilterString = `&fq=(${categoryFilters.value.join(' OR ')})`;
			presetChannelFilters += `&fq=(${categoryFilters.value.join(' OR ')})`;
		}
		searchFilters += categoryFilterString;
		if (preliminaryFilter.value) {
			searchFilters += `&fq=${preliminaryFilter.value}`;
			presetGenreFilters += `&fq=${preliminaryFilter.value}`;
			presetChannelFilters += `&fq=${preliminaryFilter.value}`;
		}
		const startParam = start.value === '' ? '' : `&start=${start.value}`;
		const sortParam = sort.value === '' ? '' : `&sort=${sort.value}`;

		//https://stackoverflow.com/a/62359248
		//to get a _GOOD_ uuid, we use the functionality from the createObjectURL method, that creates one, and just get that one.

		const url = URL.createObjectURL(new Blob());
		currentSearchUUID = url.toString().split('/').reverse()[0];
		URL.revokeObjectURL(url);

		try {
			//window.scrollTo({ top: 0, behavior: 'smooth' });
			searchFired.value = true;
			loading.value = true;
			const responseData = await APIService.getSearchResults(
				query,
				searchFilters,
				rowCount.value,
				startParam as string,
				sortParam as string,
				currentSearchUUID,
			);
			const facetGenreData = await APIService.getFacetResults(
				query,
				presetGenreFilters,
				startParam as string,
				sortParam as string,
			);

			const facetChannelData = await APIService.getFacetResults(
				query,
				presetChannelFilters,
				startParam as string,
				sortParam as string,
			);

			comparisonSearchUUID = responseData.data.responseHeader.params.queryUUID || '';

			if (responseMatchesCurrentSearch(comparisonSearchUUID) && searchFired.value) {
				searchResult.value = responseData.data.response.docs;
				spellCheck.value = responseData.data.spellcheck;
				facetResult.value.genre = facetGenreData.data.facet_counts.facet_fields.genre as string[];
				facetResult.value.creator_affiliation_facet = facetChannelData.data.facet_counts.facet_fields
					.creator_affiliation_facet as string[];
				numFound.value = responseData.data.response.numFound;
				noHits.value = numFound.value === 0;
			}
		} catch (err: unknown) {
			error.value = (err as AxiosError).message;
			errorManager.submitError(err as AxiosError, t('error.searchfailed'));
			noHits.value = numFound.value === 0;
			loading.value = false;
		} finally {
			if (responseMatchesCurrentSearch(comparisonSearchUUID)) {
				loading.value = false;
			}
		}
	};
	const getCuratedContent = (month: string) => {
		const curatedContentList = {
			Januar: [
				'ds.radio:oai:io:f3d56005-39e6-4fc3-90a5-830efded34a0',
				'ds.tv:oai:io:6f9017fb-810a-4386-98cc-debd1f19b48d',
				'ds.tv:oai:io:70968369-8802-41df-a19c-d4ecf7a9e34a',
				'ds.tv:oai:io:0b90d1b1-202a-4d64-835d-75af39bf6444',
				'ds.tv:oai:io:be91aeb4-fac6-44f3-bbd9-4cbd153b971f',
				'ds.tv:oai:io:0eec77ec-42f6-4a59-af04-615b7bb09107',
				'ds.radio:oai:io:2ad7bbfd-7909-4979-8116-398e411af35b',
				'ds.tv:oai:io:80597001-44b1-4dcb-8909-7191888223b5',
				'ds.tv:oai:io:626fc3ce-e28f-44cc-ae81-9419bb8120a2',
				'ds.tv:oai:io:8de4ccdb-c8aa-4867-a2b7-4938117b7603',
			],
			Februar: [
				'ds.tv:oai:io:8d010389-c0c8-4a40-a949-6e2bb577a2b5',
				'ds.tv:oai:io:d6bb63f4-8d49-4991-9f64-d3773e549505',
				'ds.tv:oai:io:f281de00-99c3-423a-850a-c21d29cc3e9a',
				'ds.tv:oai:io:3b99692a-ba88-4f4e-8d6f-29d7013c94c0',
				'ds.tv:oai:io:55e31e5d-eefc-4110-9add-234a25a21f90',
				'ds.tv:oai:io:bac915f2-7a13-4c63-947f-76e190b45fd8',
				'ds.tv:oai:io:ede2fabd-516d-4ab7-81e3-fa4fef0e1ee8',
				'ds.tv:oai:io:037d41d5-b6ef-4ff9-8887-3002c3d036e3',
				'ds.tv:oai:io:adf4e64d-96d1-4104-9a5c-73e4f4c0fa90',
				'ds.radio:oai:io:fb89a537-e637-40c1-8211-25d20b335b4e',
			],
			Marts: [
				'ds.tv:oai:io:6dc76b66-4322-478c-8d6a-ff21a1d7a082',
				'ds.tv:oai:io:0e8e854b-c2ca-48c7-86f6-ad2ba477e00e',
				'ds.tv:oai:io:8c0782f2-43ec-4f32-a035-2263a83007ff',
				'ds.radio:oai:io:6c2b944d-3491-4508-9180-69cb49cdce22',
				'ds.tv:oai:io:8ab87895-48d0-4f1c-a859-12ea248fdfc9',
				'ds.tv:oai:io:c46c7ea6-adbb-45b1-8b89-f41bbdeeae65',
				'ds.tv:oai:io:0d8b4faf-0815-42a2-a48a-672cbfd9ff92',
				'ds.radio:oai:io:6ec0f61c-b93c-4522-a6d6-9390d16f41bd',
				'ds.tv:oai:io:80ae3824-61a2-48db-9a92-9a5fba73569f',
				'ds.tv:oai:io:91c9048e-329d-4e0d-b48c-7d4176e19454',
			],
			April: [
				'ds.tv:oai:io:45c0aa5a-e269-454e-997d-57d44066a60b',
				'ds.tv:oai:io:770fd412-cc9f-4fcd-8db2-96b0fe111d92',
				'ds.tv:oai:io:b265f49c-5922-4241-9f8c-e3c6c28b0caf',
				'ds.tv:oai:io:7e6af614-0ca2-41ec-9cec-4f7cd5478622',
				'ds.radio:oai:io:036b4e24-30b5-45dc-8173-3c33293e2023',
				'ds.tv:oai:io:f77755db-aa02-448c-a821-dbd521d823b9',
				'ds.tv:oai:io:2551eb1e-d2b1-448a-b5b8-e0f51b6d2057',
				'ds.tv:oai:io:b9e8f9a0-fc00-4aa6-88f0-8e98da9b6eac',
				'ds.tv:oai:io:c7e9b792-15b4-4a0d-b10a-1ca98a648dd9',
				'ds.radio:oai:io:ba8a3388-466c-4728-8ff5-bbe8390a0f78',
			],
			Maj: [
				'ds.tv:oai:io:063f0b69-138b-4696-aa02-ba62f47aa349',
				'ds.tv:oai:io:dcd1d7d7-6733-40d5-9176-0ee2e5377edd',
				'ds.tv:oai:io:ac030c03-f1f2-44ca-8590-77a6b5092281',
				'ds.tv:oai:io:a736b592-adea-4928-926a-35cf32962e0c',
				'ds.tv:oai:io:35e68d2c-fc98-40f9-b7f9-dfc5ffbb3228',
				'ds.tv:oai:io:c7a4d650-6f07-4976-9bbb-61ff7dd8bc0f',
				'ds.tv:oai:io:93e2059a-6ec5-4cf2-aaa1-62b9b08d9a5f',
				'ds.tv:oai:io:c304bb69-ffe7-41f8-b48c-21f4fe29ec33',
				'ds.radio:oai:io:ead5ec69-d589-4b45-abf7-d367c33c3e52',
				'ds.tv:oai:io:a86ecdbd-6021-48dc-b20a-75d8a4ef2a5a',
			],
			Juni: [
				'ds.tv:oai:io:c510c7eb-f295-466a-ab7d-4fe702113cc5',
				'ds.tv:oai:io:ad5a9740-9236-499e-851f-b19b7a658ed8',
				'ds.tv:oai:io:e2dbb1ed-2662-4001-a3e5-e69849ddb332',
				'ds.radio:oai:io:0443e90d-133e-404d-9a10-cbfd020d7e2d',
				'ds.tv:oai:io:76b2cfd5-382c-4134-9e1d-c68833547544',
				'ds.tv:oai:io:b611248f-b02f-4d88-a860-74b8070fcc2d',
				'ds.radio:oai:io:42de3b98-d782-4e72-a990-3b6e279b9778',
				'ds.radio:oai:io:83fd9ce3-5b7b-44fd-b135-208c78166ed2',
				'ds.tv:oai:io:9733be00-a24e-4949-8de9-360d8ea96702',
				'ds.tv:oai:io:547b03dd-e7f5-49dd-a1f6-d315308adbe3',
			],
			Juli: [
				'ds.tv:oai:io:d1c025aa-1003-40b6-8324-dfcd0eff1406',
				'ds.radio:oai:io:cff3e216-c168-4fa3-9787-03b5a0cb8660',
				'ds.tv:oai:io:5e195447-421e-4016-b8f7-6c530a89354f',
				'ds.tv:oai:io:f2497b81-374b-4efd-aa57-4d35918210c9',
				'ds.radio:oai:io:5387b122-05db-4125-a5c3-780d36a0dc43',
				'ds.radio:oai:io:37a5b7de-6189-4aa1-978b-234603a13a0b',
				'ds.tv:oai:io:174e9bb1-e4b8-4f9b-991c-7490c3657afa',
				'ds.tv:oai:io:3ee8e25a-f0a3-4dc3-90fb-15a9ed238430',
				'ds.tv:oai:io:5b9393df-d29a-457e-aa4f-20a126f6ea2a',
				'ds.tv:oai:io:7f9d0ebb-8bb6-44c7-a5d7-0dd80e0601be',
			],
			August: [
				'ds.tv:oai:io:a2209638-c9a7-41de-bd20-912a7bdb707b',
				'ds.tv:oai:io:b5383c74-b3ba-421c-bf71-77951e2f39fb',
				'ds.radio:oai:io:b87cd5c3-8f8c-4bf2-b2c3-d4852dfd54cb',
				'ds.tv:oai:io:a87e193e-6576-43d3-a4be-1a72fc07f95e',
				'ds.tv:oai:io:22504f17-03ff-462b-b984-cca091af1e52',
				'ds.tv:oai:io:4e0b056d-3d82-481c-aeb7-bb430673b586',
				'ds.tv:oai:io:35459d3a-88fa-4b20-a5c3-18d46ae3c97a',
				'ds.radio:oai:io:5f028b3c-23a4-4db8-b17d-a1382bffdc90',
				'ds.tv:oai:io:62cedf8e-1768-4781-b4e4-d9cbd1a96df2',
				'ds.tv:oai:io:657c332c-d48c-43d9-9ea8-85884077dbe5',
			],
			September: [
				'ds.tv:oai:io:5c0b3267-d0fc-41f8-bfef-f6de2d6453e8',
				'ds.tv:oai:io:5f903029-a328-4700-a56d-0dafe0711c74',
				'ds.tv:oai:io:6ed58520-184d-4167-8aa0-854d754f5d56',
				'ds.tv:oai:io:a0136fd1-09d0-47ec-8799-579d49014b74',
				'ds.radio:oai:io:e4734433-cef9-4540-a2c7-a37e0d7407fd',
				'ds.tv:oai:io:206a8438-4a05-4b7c-aec5-486c5cd00a5f',
				'ds.tv:oai:io:1e1ffc59-9694-45ba-aa31-1f4ee3747d52',
				'ds.tv:oai:io:24d242cf-b711-4652-8639-2d909a2fe52a',
				'ds.radio:oai:io:5ecc9e70-561e-44db-a721-fe855257628e',
				'ds.tv:oai:io:2cb0ec60-3c9e-48f1-a39a-e3fc67541e08',
			],
			Oktober: [
				'ds.tv:oai:io:08bdd297-c377-4168-b525-5dc5905c7014',
				'ds.tv:oai:io:01598f3e-3780-431c-8c17-4f7919865cd9',
				'ds.tv:oai:io:90554e43-e723-42b7-8e50-687c2b634346',
				'ds.tv:oai:io:00b79d09-ecf2-41ea-8520-f088ad4f0089',
				'ds.tv:oai:io:6948feab-4cc8-412e-ac6c-50436cd5eec8',
				'ds.tv:oai:io:ddcb6c33-bd28-4b3e-9dfa-133ffcb624b7',
				'ds.tv:oai:io:ca15bbac-808a-4ef8-a9ac-d71cf77eb229',
				'ds.tv:oai:io:ca98d05e-13d8-4f88-a827-b82dfccb2ebf',
				'ds.tv:oai:io:3c688abc-d0b1-4696-8312-94e621447838',
				'ds.radio:oai:io:147c5e70-cab2-4868-a0e9-3fa05baddebe',
			],
			November: [
				'ds.tv:oai:io:47578244-da4a-48ca-8ab0-cceef12f23aa',
				'ds.tv:oai:io:4b252da6-7a71-4cdb-a7d8-9c6e9318e565',
				'ds.radio:oai:io:ef384f64-6586-4b13-9415-154233e784ea',
				'ds.tv:oai:io:3a6b1a5e-5453-48b0-b907-cf3258d5bbf3',
				'ds.tv:oai:io:36c3c0e0-883e-4755-a180-67338e5c3886',
				'ds.tv:oai:io:8e72304b-8486-425f-805e-f02cda89736e',
				'ds.tv:oai:io:190a030e-894d-450c-b5a5-c7de7706b824',
				'ds.radio:oai:io:5cd51b8c-944c-401b-a80d-0105ffaaede7',
				'ds.tv:oai:io:99ab2820-9d2a-4007-8bb8-873e1911ab61',
				'ds.tv:oai:io:248a7e6a-0834-4928-8099-d562f53a36ff',
			],
			December: [
				'ds.radio:oai:io:e51bd7a9-bc2f-4426-bc82-114c48d4a016',
				'ds.tv:oai:io:f46c2819-304e-4ab7-8bfc-feb4f5f15e8e',
				'ds.tv:oai:io:9b41848a-f3a5-4ef5-bb6b-2666d482e8b1',
				'ds.radio:oai:io:3359431a-06c6-4dfe-8cf9-63a55c0c037f',
				'ds.tv:oai:io:c805240e-db26-49c8-894c-18f1a62526ca',
				'ds.radio:oai:io:05ee827c-8469-4961-907c-979ae7d97768',
				'ds.tv:oai:io:eb669a5f-b937-4f2a-8e23-ecb7cae298bf',
				'ds.tv:oai:io:d683b49f-63bd-4b77-9fcd-cdcebac834a7',
				'ds.tv:oai:io:13b78277-241d-421e-b944-ae26fd6d2ed8',
				'ds.tv:oai:io:ac21f093-9aad-4f46-a939-6d8511c21950',
			],
		};
	};

	return {
		firstBackendFetchExecuted,
		initFacets,
		searchResult,
		facetResult,
		autocompleteResult,
		errorManager,
		numFound,
		loading,
		error,
		currentQuery,
		lastSearchQuery,
		noHits,
		filters,
		searchFired,
		start,
		sort,
		showFacets,
		spellCheck,
		blockAutocomplete,
		preliminaryFilter,
		resultGrid,
		rowCount,
		rowOffset,
		channelFilters,
		categoryFilters,
		rotationalResult,
		addFilter,
		resetFilters,
		removeFilter,
		getSearchResults,
		resetSearch,
		setFiltersFromURL,
		setStartFromURL,
		setCurrentQueryFromURL,
		resetStart,
		setSortFromURL,
		resetSort,
		setSortValue,
		toggleShowFacets,
		getAutocompleteResults,
		resetAutocomplete,
		setBlockAutocomplete,
		setResultGrid,
		setRowCount,
		setRowOffset,
		setStart,
		setRowCountFromURL,
		setRotationalResult,
	};
});
