import { AxiosInstance } from 'axios';
import { ServerResponse } from '@/types/ServerResponses';

export class StatsServiceClient {
	constructor(private httpClient: AxiosInstance) {}
	async getSearchResults(query: string): Promise<ServerResponse> {
		return await this.httpClient.get(encodeURI(`/?q=${query}&q.op=OR&indent=true&fq=entity_type:the_object`));
	}
}
