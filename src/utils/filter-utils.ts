import { RouteLocationNormalizedLoaded } from 'vue-router';
import { FacetPair } from '@/types/GenericRecordTypes';
const createTagFilter = (key: string) => {
	return `${'categories:"' + key + '"'}`;
};

const createAffiliationFilter = (key: string) => {
	return `${'creator_affiliation_facet:"' + key + '"'}`;
};

const filterExists = (key: string, title: string, parent: string[]) => {
	if (title && key) {
		const filterString = `${key}:"${title}"`;
		return parent.includes(`fq=${encodeURIComponent(filterString)}`);
	} else {
		return false;
	}
};

const channelFilterExists = (key: string, title: string, parent: string[]) => {
	if (title && key) {
		const filterString = `${key}:"${title}"`;
		return parent.includes(encodeURIComponent(`${filterString}`));
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

function addChannelFilter(route: RouteLocationNormalizedLoaded, newFilter: string, keepTimeFacets: boolean) {
	const routeQueries = cloneRouteQuery(route);
	let existingFq = normalizeFq(routeQueries.fq as string[] | string);
	if (keepTimeFacets === false) {
		existingFq = removeTimeFacetsFromRoute(existingFq);
	}
	if (Array.isArray(existingFq)) {
		const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes('creator_affiliation_facet'));
		if (creatorAffiliationFilter) {
			const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
			if (index !== -1) {
				existingFq.splice(index, 1);
			}
			const filters = creatorAffiliationFilter.replace(/[()]/g, '').split(' OR ');
			filters.push(encodeURIComponent(`${newFilter}`));
			const finalFilter = `(${filters.join(' OR ')})`;
			existingFq.push(finalFilter);
		} else {
			existingFq.push(encodeURIComponent(`${newFilter}`));
		}
		routeQueries.fq = existingFq;
	} else {
		routeQueries.fq = [];
		routeQueries.fq.push(encodeURIComponent(`${newFilter}`));
	}
	return routeQueries;
}

function removeChannelFilter(route: RouteLocationNormalizedLoaded, filterToRemove: string, keepTimeFacets: boolean) {
	const routeQueries = cloneRouteQuery(route);
	let existingFq = normalizeFq(routeQueries.fq as string[] | string);
	if (keepTimeFacets === false) {
		existingFq = removeTimeFacetsFromRoute(existingFq);
	}
	if (Array.isArray(existingFq)) {
		const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes('creator_affiliation_facet'));
		if (creatorAffiliationFilter) {
			const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
			if (index !== -1) {
				existingFq.splice(index, 1);
			}
			let filters = creatorAffiliationFilter.replace(/[()]/g, '').split(' OR ');
			filters = filters.filter((filter) => filter !== encodeURIComponent(filterToRemove));
			const finalFilter = `(${filters.join(' OR ')})`;
			if (filters.length !== 0) {
				existingFq.push(finalFilter);
			}
		}
		routeQueries.fq = existingFq;
	}
	return routeQueries;
}

const removeStringFromArray = (array: string[], str: string) => {
	return array.filter((item) => !item.includes(str));
};

const removeTimeFacetsFromRoute = (fq: string[]) => {
	let filter = [] as string[];
	if (Array.isArray(fq)) {
		filter = [...fq];
		filter = removeStringFromArray(filter, 'startTime');
		filter = removeStringFromArray(filter, 'temporal_start_day_da');
		filter = removeStringFromArray(filter, 'temporal_start_month');
		filter = removeStringFromArray(filter, 'temporal_start_hour_da');
	}
	return filter;
};

const normalizeFq = (fq: string | string[] | undefined): string[] => {
	if (!fq) return [];
	return Array.isArray(fq) ? fq : [fq];
};

// A simple method to arrange the facets in an orderly fasion, so they're easier to loop through.
// Might not be relevant when we know more about the backend structure.
const simplifyFacets = (facet: Array<string>): FacetPair[] => {
	if (facet === undefined) {
		return [];
	}
	const allPairedFacets: Array<FacetPair> = [];
	let facetSet = {} as FacetPair;
	facet.forEach((facet, i) => {
		if (i % 2 === 0) {
			if (i !== 0) {
				facetSet = {} as FacetPair;
			}
			facetSet['title'] = facet;
		} else {
			facetSet['number'] = facet;
			allPairedFacets.push(facetSet);
		}
	});
	return allPairedFacets;
};

export {
	createTagFilter,
	createAffiliationFilter,
	filterExists,
	channelFilterExists,
	addFilter,
	removeFilter,
	simplifyFacets,
	addChannelFilter,
	removeChannelFilter,
	cloneRouteQuery,
	normalizeFq,
	removeTimeFacetsFromRoute,
};
