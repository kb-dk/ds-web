export interface DrupalFooterType {
	uri: string;
	full_url: string;
	title: string;
}

export interface DrupalHeaderType {
	full_url: string;
	title: string;
	id: string;
	icon: string;
	children: [DrupalHeaderType | null];
}
