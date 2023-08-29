import { GenericSearchResult } from './GenericSearchResult';
import { GenericRecord } from './GenericRecord';
import { BroadcastRecord } from './BroadcastRecord';

export interface APISearchResponse {
	data: {
		response: {
			docs: Array<GenericSearchResult>;
			maxScore: number;
			numFound: number;
			numFoundExact: boolean;
			start: number;
		};
	};
}

export interface APIRecordResponse {
	data: GenericRecord | BroadcastRecord;
}
