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
}

interface NameType {
	value: string;
}
