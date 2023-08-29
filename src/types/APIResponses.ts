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
		facet_counts: Facets;
	};
}

export interface Facets {
	facet_queries: Array<string>;
	facet_fields: Array<string>;
	facet_ranges: Array<string>;
	facet_interval: Array<string>;
	facet_heatmaps: Array<string>;
}

export interface APIRecordResponse {
	data: {
		dataFeedElement: Array<GenericRecord>;
	};
}
