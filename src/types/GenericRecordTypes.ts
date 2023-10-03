export interface GenericRecord {
	'@context': Array<ContextClass | string>;
	'@type': string;
	id: string;
	url: string;
	'kb:admin_data': KBAdminData;
	headline: Headline[];
	creator: Creator[];
	about: string[];
	keywords: string[];
	dateCreated: string;
	temporal: string;
	publication: Publication;
	identifier: Identifier[];
	isPartOf: IsPartOf[];
	image: Image;
	'kb:read_direction': string;
}

export interface ContextClass {
	kb: string;
	relator: string;
}

export interface Creator {
	'@type': string;
	name: string;
	familyName: string;
}

export interface Headline {
	value: string;
	'@language': string;
}

export interface Identifier {
	'@type': string;
	PropertyID: string;
	value: string;
}

export interface Image {
	'@type': string;
	contentSize: string;
	contentURL: string;
	thumbnail: string;
	height: string;
	width: string;
}

export interface IsPartOf {
	'@type': string;
	headline: string;
	description: string;
	url: string;
}

export interface KBAdminData {
	'kb:catalogingLanguage': string;
	'kb:localIdentifier': string;
	'kb:shelfLocator': string;
}

export interface Publication {
	'@type': string;
	description: string[];
}
