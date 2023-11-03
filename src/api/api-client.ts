import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { APISearchResponseType, APIRecordResponseType, APIMoreLikeThisResponseType } from '@/types/APIResponseTypes';

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
			(response: AxiosResponse) => {
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
	async getSearchResults(query: string, filters: string[]): Promise<APISearchResponseType> {
		let reqFilters = '';
		//Temporary fix for filters containing &. We should rework the filter flow so prep of data is done else where DISC-390
		filters.forEach((filt: string) => {
			reqFilters += `&fq=${encodeURIComponent(filt.split('fq=')[1])}`;
		});
		return await this.httpClient.get(
			`search/?q=${encodeURIComponent(query)}&q.op=OR&indent=true&facet=true${reqFilters}`,
		);
	}

	async getRecord(id: string): Promise<APIRecordResponseType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
	}

	async getMoreLikeThisRecords(id: string): Promise<APIMoreLikeThisResponseType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		return await this.httpClient.get(encodeURI(`mlt/?q=id:"${id}"&mlt.interestingTerms=list&rows=3`));
	}
}
