export interface FooterType {
	[column: string]: {
		title: string;
		links: {
			[link: string]: {
				title: string;
				link: string;
			};
		};
	};
}
