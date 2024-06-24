import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
	APISearchResponseType,
	APIRecordResponseType,
	APIMoreLikeThisResponseType,
	APIAutocompleteResponseType,
	APIThumbnailsResponseType,
	APIAuthResponseType,
} from '@/types/APIResponseTypes';

export function sleep(random?: boolean): Promise<void> {
	let sleep = 2000;
	if (random) {
		sleep = Math.random() * 1500 + 500;
	}
	return new Promise((resolve) => setTimeout(resolve, sleep));
}

export class APIServiceClient {
	constructor(private httpClient: AxiosInstance) {
		httpClient.interceptors.request.use(
			(config) => {
				// Hook to manipulate the request or the request header
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		httpClient.interceptors.response.use(
			async (response: AxiosResponse) => {
				// add artificial delay for dev env
				if (import.meta.env.MODE === 'development') {
					const noDelayRequest =
						response.config.url?.includes('suggest.dictionary=radiotv_title_suggest') ||
						response.config.url?.includes('record') ||
						response.config.url?.includes('mlt') ||
						response.config.url?.includes('thumbnails');
					if (!noDelayRequest) {
						await sleep(true);
					}
				}
				return response;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			},
		);
	}

	//Search and record methods
	async getFacetResults(query: string, filters: string, start: string, sort: string): Promise<APISearchResponseType> {
		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(query)}&facet=true${filters}${start}${sort}&rows=0&facet.limit=25`,
		);
	}

	async getFullResultWithFacets(): Promise<APISearchResponseType> {
		let broadcastLimiter = encodeURIComponent(import.meta.env.VITE_BROADCASTER_LIMITER);
		broadcastLimiter = broadcastLimiter === 'undefined' ? '' : broadcastLimiter;
		return await this.httpClient.get(`search/?q=*&facet=true&fq=${broadcastLimiter}&facet.limit=-1`);
	}

	async getSearchResults(
		query: string,
		filters: string,
		start: string,
		sort: string,
		uuid: string,
	): Promise<APISearchResponseType> {
		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(query)}&facet=false${filters}${start}${sort}&queryUUID=${uuid}`,
		);
	}

	async getTimeSearchResults(
		start: string,
		end: string,
		months: string,
		days: string,
		timeslots: string,
		uuid: string,
	): Promise<APISearchResponseType> {
		let broadcastLimiter = encodeURIComponent(import.meta.env.VITE_BROADCASTER_LIMITER);
		broadcastLimiter = broadcastLimiter === 'undefined' ? '' : broadcastLimiter;
		const timeConstraint = encodeURIComponent(`[${start} TO ${end}]`);
		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(
				'*:*',
			)}&facet=false&queryUUID=${uuid}&fq=${broadcastLimiter}&fq=temporal_start_year:${timeConstraint}&rows=8${months}${days}${timeslots}`,
		);
	}

	async getRecord(id: string): Promise<APIRecordResponseType> {
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
	}

	async getAutocomplete(query: string): Promise<APIAutocompleteResponseType> {
		return await this.httpClient.get(
			encodeURI(
				`suggest/?suggest.dictionary=radiotv_title_suggest&suggest.q=${encodeURIComponent(
					query,
				)}&suggest.count=5&wt=json`,
			),
		);
	}

	async getMoreLikeThisRecords(id: string): Promise<APIMoreLikeThisResponseType> {
		return await this.httpClient.get(encodeURI(`mlt/?q=id:"${id}"&mlt.interestingTerms=list&rows=3`));
	}

	async getThumbnail(id: string): Promise<APIThumbnailsResponseType> {
		return await this.httpClient.get(`bff/v1/proxy/ds-image/kaltura/thumbnails/?fileId=${id}&width=200&height=105`);
	}

	async authenticate(): Promise<APIAuthResponseType> {
		return await this.httpClient.get('bff/v1/authenticate/');
	}

	async getExtraThumbnails(id: string): Promise<APIThumbnailsResponseType> {
		return await this.httpClient.get(`bff/v1/proxy/ds-image/kaltura/thumbnails/?fileId=${id}&width=200&vid_slices=10`);
	}
}
