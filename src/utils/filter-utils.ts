import { RouteLocationNormalizedLoaded } from 'vue-router';
import { FacetPair } from '@/types/GenericRecordTypes';
const createTagFilter = (key: string) => {
	return `${'categories:"' + key + '"'}`;
};

const createFilter = (key: string, facet: string) => {
	return `${facet}:"${key}"`;
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

/*
Rather large function to add a channel filter. Since we want to use several filters with an OR operator,
we have to put them in one string, in the fq array. We have to split up the existing one and reassemble it
with our new one - if one exists. If it doesn't, we simply create it and push our filter into it.
*/
function addChannelFilter(
	route: RouteLocationNormalizedLoaded,
	newFilter: string,
	keepTimeFacets: boolean,
	facet: string,
) {
	// get the route and the fq array. we normalize it to an array to make sure we know what we're dealing with
	const routeQueries = cloneRouteQuery(route);
	let existingFq = normalizeFq(routeQueries.fq as string[] | string);
	// if we don't need the time facets, we remove those from the array here.
	if (keepTimeFacets === false) {
		existingFq = removeTimeFacetsFromRoute(existingFq);
	}
	// If the array exists, we find the one we need- with the creator_affiliation_facets in it.
	if (Array.isArray(existingFq)) {
		const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes(facet));
		if (creatorAffiliationFilter) {
			// if we can find it, we remove it from the array - and put it in again when we're done manipulating it.
			const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
			if (index !== -1) {
				existingFq.splice(index, 1);
			}
			// we now split it up into the segments between the OR operator
			const filters = creatorAffiliationFilter.replace(/[()]/g, '').split(' OR ');
			// we now push the new filter into the array we just created
			filters.push(encodeURIComponent(`${newFilter}`));
			// and reassemble them all into a new string with the old filters and the new one.
			const finalFilter = `(${filters.join(' OR ')})`;
			existingFq.push(finalFilter);
		} else {
			// if we couldn't find the array, we simply add the new filter to the fq array.
			existingFq.push(encodeURIComponent(`${newFilter}`));
		}
		// replace the routeQueries.fq with our modified array.
		routeQueries.fq = existingFq;
	} else {
		// if there were no fq array in the routeQueries, we simply add one and push our filter string into it.
		routeQueries.fq = [];
		routeQueries.fq.push(encodeURIComponent(`${newFilter}`));
	}
	// return the object.
	return routeQueries;
}
/*
Rather large function to remove a channel filter. Since we want to use several filters with an OR operator,
we have to put them in one string, in the fq array. We have to fish it out if it exists, and then split it up and
remove the one we dont need anymore, and reassemble it.
*/
function removeChannelFilter(
	route: RouteLocationNormalizedLoaded,
	filterToRemove: string,
	keepTimeFacets: boolean,
	facet: string,
) {
	// get the route and the fq array. we normalize it to an array to make sure we know what we're dealing with
	const routeQueries = cloneRouteQuery(route);
	let existingFq = normalizeFq(routeQueries.fq as string[] | string);
	// if we don't need the time facets, we remove those from the array here.
	if (keepTimeFacets === false) {
		existingFq = removeTimeFacetsFromRoute(existingFq);
	}
	// If the array exists, we find the one we need- with the creator_affiliation_facets in it.
	if (Array.isArray(existingFq)) {
		const creatorAffiliationFilter = existingFq.find((fq: string) => fq.includes(facet));
		if (creatorAffiliationFilter) {
			// if we can find it, we remove it from the array - and put it in again when we're done manipulating it.
			const index = existingFq.findIndex((fq: string) => fq === creatorAffiliationFilter);
			if (index !== -1) {
				existingFq.splice(index, 1);
			}
			// we now split it up into the segments between the OR operator
			let filters = creatorAffiliationFilter.replace(/[()]/g, '').split(' OR ');
			// remove the one we dont want
			filters = filters.filter((filter) => filter !== encodeURIComponent(filterToRemove));
			// reassemble it
			const finalFilter = `(${filters.join(' OR ')})`;
			// if there is none left, we dont re-add it. Otherwise we do.
			if (filters.length !== 0) {
				existingFq.push(finalFilter);
			}
		}
		// put it back in the routeQueries object
		routeQueries.fq = existingFq;
	}
	// return the object
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
	createFilter,
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
