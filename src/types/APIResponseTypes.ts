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

export interface APIAutocompleteResponseType {
	data: {
		responseHeader: {
			QTime: number;
			status: number;
			params: {
				fq: string[] | string;
				q: string;
				rows: string;
				start: string;
				wt: string;
				indent: string;
				facet: string;
			};
		};
		suggest: {
			dr_title_suggest: {
				[key: string]: {
					numFound: number;
					suggestions: APIAutocompleteTerm[];
				};
			};
		};
	};
}

export interface APIAutocompleteTerm {
	term: string;
	weight: number;
	payload: string;
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
			params: {
				fq: string[] | string;
				q: string;
				rows: string;
				start: string;
				wt: string;
				indent: string;
				facet: string;
			};
		};
	};
}
