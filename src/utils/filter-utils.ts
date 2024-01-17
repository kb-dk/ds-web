import { RouteLocationNormalizedLoaded } from 'vue-router';
import { useSearchResultStore } from '@/store/searchResultStore';
import { facetPair } from '@/types/GenericRecordTypes';

const createFilter = (key: string) => {
	return `${'categories:"' + key + '"'}`;
};

const filterExists = (key: string, title: string) => {
	if (title && key) {
		const searchResultStore = useSearchResultStore();
		const filterString = `${key}:"${title}"`;
		return searchResultStore.filters.includes(`fq=${encodeURIComponent(filterString)}`);
	} else {
		return false;
	}
};

const cloneRouteQuery = (route: RouteLocationNormalizedLoaded) => {
	/* Future coder - don't even ask, the line of code below took me hours....
		 I wanted to do it the right way: const routeQueries = { ...route.query };
		 but no worki - instead I had to do this deep clone trickery below.
		 For more info on why this is broken:
		 https://github.com/vuejs/vue-router/issues/1182
		 **/
	return JSON.parse(JSON.stringify(route.query));
};

const addFilter = (route: RouteLocationNormalizedLoaded, filter: string) => {
	const routeQueries = cloneRouteQuery(route);
	const newFilter = encodeURIComponent(filter);

	if (!routeQueries.fq) {
		routeQueries.fq = [newFilter];
	} else if (Array.isArray(routeQueries.fq)) {
		routeQueries.fq.push(newFilter);
	} else {
		// This will only trigger if someone manipulates the url manually
		routeQueries.fq = [routeQueries.fq, newFilter];
	}
	return routeQueries;
};

const removeFilter = (route: RouteLocationNormalizedLoaded, filter: string) => {
	const routeQueries = cloneRouteQuery(route);
	const filterToRemove = encodeURIComponent(filter);

	if (Array.isArray(routeQueries.fq)) {
		routeQueries.fq = routeQueries.fq.filter((item: string) => item !== filterToRemove);
	} else {
		routeQueries.fq = undefined;
	}
	return routeQueries;
};

// A simple method to arrange the facets in an orderly fasion, so they're easier to loop through.
// Might not be relevant when we know more about the backend structure.
const simplifyFacets = (facet: Array<string>): facetPair[] => {
	if (facet === undefined) {
		return [];
	}
	const allPairedFacets: Array<facetPair> = [];
	let facetPair = {} as facetPair;
	facet.forEach((facet, i) => {
		if (i % 2 === 0) {
			if (i !== 0) {
				facetPair = {} as facetPair;
			}
			facetPair['title'] = facet;
		} else {
			facetPair['number'] = facet;
			allPairedFacets.push(facetPair);
		}
	});
	return allPairedFacets;
};

export { createFilter, filterExists, addFilter, removeFilter, simplifyFacets };
