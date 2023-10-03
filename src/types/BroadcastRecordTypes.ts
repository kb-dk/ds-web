import { IdentifierType } from './GenericRecordTypes';
import { PublicationType } from './GenericRecordTypes';

export interface BroadcastRecordType {
	'@type': string;
	id: string;
	name: NameType[];
	publishedOn: PublicationType;
	description: string;
	startDate: string;
	endDate: string;
	duration: string;
	keywords: string;
	identifier: IdentifierType[];
}

export interface NameType {
	value: string;
}
