import { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { APISearchResponseType, APIRecordResponseType, APIMoreLikeThisType } from '@/types/APIResponseTypes';

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
	async getSearchResults(query: string, filters: string): Promise<APISearchResponseType> {
		return await this.httpClient.get(encodeURI(`search/?q=${query}&q.op=OR&indent=true&facet=true${filters}`));
	}

	async getRecord(id: string): Promise<APIRecordResponseType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
	}

	async getRelatedRecords(id: string): Promise<APIMoreLikeThisType> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		return await this.httpClient.get(encodeURI(`mlt/?q=${id}`));
	}
}
