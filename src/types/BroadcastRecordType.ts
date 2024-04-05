import { IdentifierType } from './GenericRecordTypes';
import { PublicationType } from './GenericRecordTypes';

export interface BroadcastRecordType {
	'@type': string;
	id: string;
	name: NameType[];
	publication: PublicationType;
	description: string;
	startTime: string;
	endTime: string;
	duration: string;
	keywords: string;
	identifier: IdentifierType[];
	contentUrl: string;
	'kb:internal': KbInternal;
}

interface NameType {
	value: string;
}

interface KbInternal {
	'kb:storage_mTime': string;
	'kb:file_id': string;
	'kb:genre_sub': string;
	'kb:surround_sound': boolean;
	'kb:premiere': boolean;
	'kb:format_identifier_ritzau': string;
	'kb:format_identifier_nielsen': string;
	'kb:retransmission': boolean;
	'kb:maingenre_id': string;
	'kb:channel_id': number;
	'kb:country_of_origin_id': string;
	'kb:ritzau_program_id': string;
	'kb:program_ophold': boolean;
	'kb:subgenre_id': string;
	'kb:episode_id': string;
	'kb:season_id': string;
	'kb:series_id': string;
	'kb:padding_seconds': number;
	'kb:access_individual_prohibition': string;
	'kb:access_claused': string;
	'kb:access_malfunction': string;
	'kb:aspect_ratio': string;
	'kb:color': boolean;
	'kb:has_subtitles': boolean;
	'kb:has_subtitles_for_hearing_impaired': boolean;
	'kb:is_teletext': boolean;
	'kb:showviewcode': string;
}
