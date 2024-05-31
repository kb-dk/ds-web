export interface GenericSearchResultType {
	access_billede_aftale: boolean;
	access_blokeret: boolean;
	access_ejermaerke: boolean;
	access_foto_aftale: boolean;
	access_materiale_type: string;
	access_ophavsret_tekst: string;
	access_pligtafleveret: boolean;
	access_skabelsesaar: number;
	area: string;
	catalog_name: string;
	cataloging_language: string;
	categories: string;
	content: string[];
	date_created: string;
	description: string;
	file_size: number;
	file_id: string;
	id: string;
	identifier_local: string;
	image_height: number;
	image_size_pixels: number;
	image_width: number;
	list_of_categories: string[];
	place_of_production: string;
	resource_description: string;
	creator_affiliation: string[];
	shelf_location: string;
	title: string;
	topic: string[];
	type_of_resource: string[];
	thumbnail: string;
	_version: number;
	startTime: string;
	endTime: string;
	duration_ms: string;
	duration: string;
	origin: string;
	temporal_start_year: string;
	temporal_start_day_da: string;
	temporal_start_hour_da: number;
}

export interface FacetsType {
	facet_queries: Array<string>;
	facet_fields: FacetResultType;
	facet_ranges: Array<string>;
	facet_interval: Array<string>;
	facet_heatmaps: Array<string>;
}

export interface FacetResultType {
	catalog: string[];
	categories: string[];
	collection: string[];
	genre: string[];
	creator_affiliation: string[];
	resource_description: string[];
	resource_description_general: string[];
	creator_full_name: string[];
	subject_full_name: string[];
	temporal_start_year: string[];
}
