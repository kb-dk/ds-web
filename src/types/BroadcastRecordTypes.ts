export interface BroadcastRecord {
	'@type': string;
	id: string;
	name: Name[];
	publishedOn: PublishedOn;
	description: string;
	startDate: string;
	endDate: string;
	duration: string;
	keywords: string;
	identifier: Identifier[];
}

export interface Identifier {
	'@type': string;
	PropertyID: string;
	value: string;
}

export interface Name {
	value: string;
}

export interface PublishedOn {
	'@type': string;
	broadcastDisplayName: string;
}
