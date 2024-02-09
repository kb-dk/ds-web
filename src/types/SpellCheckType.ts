export interface SpellCheckType {
	suggestions: [string, Suggestion];
	correctlySpelled: boolean;
	collations: [string, Collation];
}

interface Suggestion {
	numFound: number;
	startOffset: number;
	endOffset: number;
	origFreq: number;
	suggestion: Suggestion[];
}

interface Collation {
	collationQuery: string;
	hits: number;
	misspellingsAndCorrections: string[];
}
