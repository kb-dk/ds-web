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
		responseHeader: APIResposeHeaderType;
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
		responseHeader: APIResposeHeaderType;
	};
}

export interface APIResposeHeaderType {
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
