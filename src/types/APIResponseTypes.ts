import { GenericSearchResultType } from './GenericSearchResultType';
import { GenericRecordType } from './GenericRecordTypes';
import { BroadcastRecordType } from './BroadcastRecordTypes';

export interface APISearchResponseType {
	data: {
		response: {
			docs: Array<GenericSearchResultType>;
			maxScore: number;
			numFound: number;
			numFoundExact: boolean;
			start: number;
		};
		facet_counts: FacetsType;
	};
}

export interface FacetsType {
	facet_queries: Array<string>;
	facet_fields: Array<string>;
	facet_ranges: Array<string>;
	facet_interval: Array<string>;
	facet_heatmaps: Array<string>;
}

export interface APIRecordResponseType {
	data: GenericRecordType | BroadcastRecordType;
}
