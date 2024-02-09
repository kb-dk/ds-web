import { shallowMount } from '@vue/test-utils';
// import { SpellCheckType } from '@/types/SpellCheckType';
import SpellChecker from '@/components/search/SpellChecker.vue';
/*interface Suggestion {
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
}*/

describe('SpellChecker.vue', () => {
	/*it('renders spell check query when spellCheck prop is provided', async () => {
		const suggestion: Suggestion = {
			numFound: 5,
			startOffset: 0,
			endOffset: 7,
			origFreq: 0,
			suggestion: [],
		};

		const collation: Collation = {
			collationQuery: 'spellCheckQuery',
			hits: 5,
			misspellingsAndCorrections: [],
		};

		const spellCheck: SpellCheckType = {
			suggestions: ['example', suggestion],
			correctlySpelled: false,
			collations: ['example', collation],
		};
		console.log(spellCheck);

		const wrapper = shallowMount(SpellChecker, {
			props: {
				spellCheck: spellCheck,
			},
			global: {
				stubs: ['router-link'],
			},
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.spell-check-query').exists()).toBe(true);
		expect(wrapper.find('.spell-check-query').text()).toContain('spellCheckQuery');
		expect(wrapper.find('.spell-check-query').text()).toContain('5');
	});*/

	it('does not render spell check query when spellCheck prop is not provided or null', async () => {
		const wrapper = shallowMount(SpellChecker, {
			global: {
				stubs: ['router-link'],
			},
		});

		await wrapper.vm.$nextTick();

		expect(wrapper.find('.spell-check-query').exists()).toBe(false);
	});
});
