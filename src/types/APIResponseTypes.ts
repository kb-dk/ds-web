import { GenericSearchResultType, FacetsType } from './GenericSearchResultTypes';
import { GenericRecordType } from './GenericRecordTypes';
import { BroadcastRecordType } from './BroadcastRecordType';

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

export interface APIRecordResponseType {
	data: GenericRecordType | BroadcastRecordType;
}

export interface APIMoreLikeThisResponseType {
	data: {
		interestingTerms: string[];
		match: {
			docs: Array<GenericSearchResultType>;
			numFound: number;
			numFoundExact: number;
		};
		response: {
			docs: Array<GenericSearchResultType>;
		};
		responseHeader: {
			QTime: number;
			status: number;
		};
	};
}
