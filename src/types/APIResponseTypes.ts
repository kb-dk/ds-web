import { FacetsType, GenericSearchResultType } from './GenericSearchResultTypes';
import { GenericRecordType } from './GenericRecordTypes';
import { BroadcastRecordType } from './BroadcastRecordType';
import { SpellCheckType } from './SpellCheckType';
import { AxiosRequestConfig } from 'axios';
import { CuratedItemsType } from '@/types/CuratedItemsType';

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
			radiotv_title_suggest: {
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
		responseHeader: APIResponseHeaderType;
	};
}

export interface APIThumbnailsResponseType {
	data: { default: string; sprite: string; thumbnails: string[] };
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

export interface APIAuthResponseType {
	resp: string;
}

export interface facetItem {
	name: string;
	number: number;
}
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retryCount?: number;
}

export interface APIAuthMessagesType {
	data: {
		alert1: string;
		streamingBaseUrlVideo: string;
		AudioUiConfId: string;
		videoUiConfId: string;
		partnerId: string;
		streamingBaseUrlAudio: string;
		curatedItems: CuratedItemsType;
	};
}
