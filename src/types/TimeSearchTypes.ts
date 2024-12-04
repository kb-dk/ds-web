export interface SelectableItem {
	name: string;
	selected: boolean;
}

export interface pointItem {
	year: string;
	items: number;
	x: number;
	y: number;
	value?: string;
	key?: number;
}

export interface dataItem {
	year: string;
	items: number;
}

export interface point {
	x: number;
	y: number;
}

export interface markerData {
	key: number;
	value: number;
}

export interface SelectorData {
	name: string;
	value: string;
	selected: boolean;
	index: number;
	translation?: string;
}
