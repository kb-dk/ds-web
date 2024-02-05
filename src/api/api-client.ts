import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
	APISearchResponseType,
	APIRecordResponseType,
	APIMoreLikeThisResponseType,
	APIAutocompleteResponseType,
} from '@/types/APIResponseTypes';

export function sleep(random?: boolean): Promise<void> {
	let sleep = 2000;
	if (random) {
		sleep = Math.random() * 3000 + 1000;
	}
	console.log('ONLY FOR DEVELOPMENT: sleeping for', sleep, 'ms');
	return new Promise((resolve) => setTimeout(resolve, sleep));
}

export class APIServiceClient {
	constructor(private httpClient: AxiosInstance) {
		httpClient.interceptors.request.use(
			(config) => {
				// We have a hook here to manipulate the request or the request header
				// We will need this later
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		httpClient.interceptors.response.use(
			async (response: AxiosResponse) => {
				// add artificial delay for dev env
				if (process.env.NODE_ENV === 'development') {
					const isAutocompleteRequest = response.config.url?.includes('suggest.dictionary=dr_title_suggest');
					if (!isAutocompleteRequest) {
						await sleep(true);
					}
				}
				return response;
			},
			(error: AxiosError) => {
				// We have a hook here to handle more generel errors like e.g. network errors
				// For now errors pass through as clean AxiosError
				return Promise.reject(error);
			},
		);
	}

	//Search and record methods
	async getFacetResults(query: string, filters: string, start: string, sort: string): Promise<APISearchResponseType> {
		//Temporary fix/implementation for limiting to DR material
		const DRLimiter = encodeURIComponent('broadcaster:"DR"');

		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(
				query,
			)}&q.op=OR&facet=true${filters}${start}${sort}&fq=${DRLimiter}&rows=0&facet.limit=25`,
		);
	}

	async getSearchResults(
		query: string,
		filters: string,
		start: string,
		sort: string,
		uuid: string,
	): Promise<APISearchResponseType> {
		//Temporary fix/implementation for limiting to DR material
		const DRLimiter = encodeURIComponent('broadcaster:"DR"');

		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(
				query,
			)}&q.op=OR&facet=false${filters}${start}${sort}&queryUUID=${uuid}&fq=${DRLimiter}`,
		);
	}

	async getRecord(id: string): Promise<APIRecordResponseType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
	}

	async getAutocomplete(query: string): Promise<APIAutocompleteResponseType> {
		//Temporary fix/implementation for limiting to DR material
		const DRLimiter = encodeURIComponent('broadcaster:"DR"');
		return await this.httpClient.get(
			encodeURI(
				`suggest/?suggest.dictionary=dr_title_suggest&suggest.q=${encodeURIComponent(
					query,
				)}&suggest.count=5&wt=json&fq=${DRLimiter}`,
			),
		);
	}

	async getMoreLikeThisRecords(id: string): Promise<APIMoreLikeThisResponseType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		return await this.httpClient.get(encodeURI(`mlt/?q=id:"${id}"&mlt.interestingTerms=list&rows=3`));
	}
}
