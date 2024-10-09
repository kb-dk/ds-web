export interface GenericRecordType {
	'@context': Array<ContextClassType | string>;
	'@type': string;
	id: string;
	url: string;
	name?: string;
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

interface ContextClassType {
	kb: string;
	relator: string;
}

interface CreatorType {
	'@type': string;
	name: string;
	familyName: string;
}

interface HeadlineType {
	value: string;
	'@language': string;
}

interface ImageType {
	'@type': string;
	contentSize: string;
	contentURL: string;
	thumbnail: string;
	height: string;
	width: string;
}

interface IsPartOfType {
	'@type': string;
	headline: string;
	description: string;
	url: string;
}

interface KBAdminDataType {
	'kb:catalogingLanguage': string;
	'kb:localIdentifier': string;
	'kb:shelfLocator': string;
}

export interface IdentifierType {
	'@type': string;
	PropertyID: string;
	value: string;
}

export interface PublicationType {
	'@type': string;
	description: string[];
	publishedOn: {
		broadcastDisplayName: string;
	};
}

export interface FacetPair {
	title: string;
	number: string;
}

export interface EnhancedFacetPair {
	title: string;
	number: string;
	currentNr: string;
}
