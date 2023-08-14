// Expand as we go
export interface GenericSearchResult {
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
	description: string[];
	file_size: number;
	id: string;
	identifier_local: string;
	image_height: number;
	image_size_pixels: number;
	image_width: number;
	list_of_categories: string[];
	place_of_production: string;
	resource_description: string;
	shelf_location: string;
	title: string;
	topic: string[];
	type_of_resource: string[];
	_version: number;
}
