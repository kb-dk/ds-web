import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Duration from '@/components/common/Duration.vue';

const locales = ['en', 'da'];

locales.forEach((locale) => {
	//Yes you can du this to prompt the locale in case of an error:)
	describe(`Duration.vue (${locale} locale)`, () => {
		const i18n = createI18n({
			locale,
			legacy: false,
			messages: {
				en: {
					duration: {
						hours: 'h',
						minutes: 'min',
						seconds: 'sec',
						unknown: 'Duration unknown',
					},
				},
				da: {
					duration: {
						hours: 't',
						minutes: 'min',
						seconds: 'sek',
						unknown: 'Ukendt længde',
					},
				},
			},
		});

		//Put the typing locally here instead of dedicated in types folder as this is a mock props type
		const createWrapper = (props: { isoDuration?: string; startDate?: string; endDate?: string }) => {
			return mount(Duration, {
				props,
				global: {
					plugins: [i18n],
				},
				/*Had to add 'never' here to please TypeScript compiler. I think this is OK
				as the typing is not the core test here. The props are always strings and 
				the rest of the setup (i18N) is not - typing wise - part of the core functionality 
				test either  		
				*/
			} as never);
		};

		it('renders formatted duration when isoDuration prop is provided', async () => {
			const props = {
				isoDuration: 'PT2H30M45S',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? '(2h 30min 45sec)' : '(2t 30min 45sek)';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders formatted duration when isoDuration prop is empty but startDate and endDate prop exist', async () => {
			const props = {
				isoDuration: '',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? '(2h 30min 45sec)' : '(2t 30min 45sek)';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders formatted duration when isoDuration prop is not provided but startDate and endDate prop are', async () => {
			const props = {
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? '(2h 30min 45sec)' : '(2t 30min 45sek)';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders formatted duration when startDate or endDate props are missing but isoDuration exists', async () => {
			const props = {
				isoDuration: 'PT2H30M45S',
				startDate: '2023-09-22T10:00:00',
				endDate: '',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? '(2h 30min 45sec)' : '(2t 30min 45sek)';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders formatted duration when isoDuration is not a valid duration format but startDate and endDate props', async () => {
			const props = {
				isoDuration: 'invalid-duration',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? '(2h 30min 45sec)' : '(2t 30min 45sek)';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders "Duration unknown" when isoDuration is not a valid duration format and startDate is missing', async () => {
			const props = {
				isoDuration: 'invalid-duration',
				startDate: '',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? 'Duration unknown' : 'Ukendt længde';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders "Duration unknown" when isoDuration is not a valid duration format and endDate prop is provided but startDate is missing', async () => {
			const props = {
				isoDuration: 'invalid-duration',
				startDate: '',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? 'Duration unknown' : 'Ukendt længde';
			expect(spanElement.text()).toContain(expectedText);
		});

		it('renders "Duration unknown" when isoDuration is not a valid duration format and endDate is provided but startDate is invalid format', async () => {
			const props = {
				isoDuration: 'invalid-duration',
				startDate: 'invalid-start',
				endDate: '2023-09-22T12:30:45',
			};

			const wrapper = createWrapper(props);
			await wrapper.vm.$nextTick();
			const spanElement = wrapper.find('span');
			const expectedText = locale === 'en' ? 'Duration unknown' : 'Ukendt længde';
			expect(spanElement.text()).toContain(expectedText);
		});
	});
});
