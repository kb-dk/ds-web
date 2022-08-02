import { GenericSearchResult } from './GenericSearchResult';

export interface ServerData {
	response: SearchResponse;
}

export interface ServerResponse {
	data: ServerData;
	response: SearchResponse;
}

export interface SearchResponse {
	docs: Array<GenericSearchResult>;
	maxScore: number;
	numFound: number;
	numFoundExact: boolean;
	start: number;
}
