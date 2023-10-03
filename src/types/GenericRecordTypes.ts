export interface GenericRecordType {
	'@context': Array<ContextClassType | string>;
	'@type': string;
	id: string;
	url: string;
	'kb:admin_data': KBAdminDataType;
	headline: HeadlineType[];
	creator: CreatorType[];
	about: string[];
	keywords: string[];
	dateCreated: string;
	temporal: string;
	publication: PublicationType;
	identifier: IdentifierType[];
	isPartOf: IsPartOfType[];
	image: ImageType;
	'kb:read_direction': string;
}

export interface ContextClassType {
	kb: string;
	relator: string;
}

export interface CreatorType {
	'@type': string;
	name: string;
	familyName: string;
}

export interface HeadlineType {
	value: string;
	'@language': string;
}

export interface IdentifierType {
	'@type': string;
	PropertyID: string;
	value: string;
}

export interface ImageType {
	'@type': string;
	contentSize: string;
	contentURL: string;
	thumbnail: string;
	height: string;
	width: string;
}

export interface IsPartOfType {
	'@type': string;
	headline: string;
	description: string;
	url: string;
}

export interface KBAdminDataType {
	'kb:catalogingLanguage': string;
	'kb:localIdentifier': string;
	'kb:shelfLocator': string;
}

export interface PublicationType {
	'@type': string;
	description: string[];
}
