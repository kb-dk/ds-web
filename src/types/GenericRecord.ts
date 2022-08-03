// Expand as we go
export interface GenericRecord {
	id: string;
	url: string;
	headline: Headline[];
	author: Author[];
	recipient: Recipient[];
	about: About[];
	publication: Publication;
	materialExtent: MaterialExtent;
	identifier: Identifier[];
	inLanguage: string[];
	encoding: Encoding[];
}

interface Headline {
	'@value': string;
	'@language': string;
}

interface Author {
	'@type': string;
	sameAs: string;
	homeLocation: string[];
	name: {
		'@language': string;
		'@value': string;
	};
}

interface Recipient {
	'@type': string;
	sameAs: string;
	homeLocation: string[];
	name: {
		'@language': string;
		'@value': string;
	};
}

interface About {
	'@type': string;
	id: string;
	name: [
		{
			'@language': string;
			'@value': string;
		},
	];
}

interface Publication {
	'@type': string;
	endDate: string;
	startDate: string;
	description: string[];
}

interface MaterialExtent {
	'@type': string;
	'@value': string;
	unitText: string;
}

interface Identifier {
	'@type': string;
	'@value': string;
	additionalType: string;
}

interface Encoding {
	'@type': string;
	url: string[];
}
