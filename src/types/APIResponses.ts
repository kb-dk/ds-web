import { GenericSearchResult } from './GenericSearchResult';
import { GenericRecord } from './GenericRecord';

export interface APISearchResponse {
	data: {
		response: {
			docs: Array<GenericSearchResult>;
			maxScore: number;
			numFound: number;
			numFoundExact: boolean;
			start: number;
		};
		facet_counts: any;
	};
}

export interface APIRecordResponse {
	data: {
		dataFeedElement: Array<GenericRecord>;
	};
}
