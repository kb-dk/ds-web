import { GenericSearchResultType, FacetsType } from './GenericSearchResultTypes';
import { GenericRecordType } from './GenericRecordTypes';
import { BroadcastRecordType } from './BroadcastRecordType';
import { SpellCheckType } from './SpellCheckType';

export interface APISearchResponseType {
	data: {
		response: {
			docs: Array<GenericSearchResultType>;
			maxScore: number;
			numFound: number;
			numFoundExact: boolean;
			start: number;
		};
		responseHeader: APIResponseHeaderType;
		facet_counts: FacetsType;
		spellcheck: SpellCheckType;
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
		responseHeader: APIResponseHeaderType;
	};
}

export interface APIResponseHeaderType {
	QTime: number;
	status: number;
	params: {
		fq?: string[] | string;
		q?: string;
		rows?: string;
		start?: string;
		wt?: string;
		indent?: string;
		facet?: string;
		sort?: string;
		queryUUID?: string;
	};
}
