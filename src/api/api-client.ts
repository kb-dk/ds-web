import { AxiosInstance } from 'axios';
import { APISearchResponse, APIRecordResponse } from '@/types/APIResponses';

export class APIServiceClient {
	constructor(private httpClient: AxiosInstance) {}

	//Search and record methods
	async getSearchResults(query: string, filters: string): Promise<APISearchResponse> {
		return await this.httpClient.get(encodeURI(`search/?q=${query}&q.op=OR&indent=true&facet=true${filters}`));
	}

	async getRecord(id: string): Promise<APIRecordResponse> {
		//console.info('ID hardcoded for now (doms.radio:albert-einstein.xml) - requested id -->', id);
		const encodeId = encodeURIComponent(id);
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
	}
}
