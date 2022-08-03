import { AxiosInstance } from 'axios';
import { ServerResponse } from '@/types/ServerResponses';

export class APIServiceClient {
	constructor(private httpClient: AxiosInstance) {}

	//Search and record methods
	async getSearchResults(query: string): Promise<ServerResponse> {
		return await this.httpClient.get(encodeURI(`search/?q=${query}&q.op=OR&indent=true&fq=entity_type:the_object`));
	}
	async getRecord(id: string): Promise<ServerResponse> {
		console.log(id);
		const encodeId = encodeURIComponent('doms.radio:albert-einstein.xml');
		return await this.httpClient.get(`record/${encodeId}?format=JSON-LD`);
		//return await this.httpClient.get(encodeURI(`record/${id}`))
	}
}
