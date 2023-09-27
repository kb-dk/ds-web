import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import Duration from '@/components/records/components/Duration.vue';

describe('Duration.vue', () => {
	const i18n = createI18n({
		locale: 'en',
		legacy: false,
		messages: {
			en: {
				duration: {
					hours: 'hours',
					minutes: 'minutes',
					seconds: 'seconds',
					unknown: 'Duration unknown',
				},
			},
		},
	});

	it('renders formatted duration when isoDuration prop is provided', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'PT2H30M45S',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('(2hours 30minutes 45seconds)');
	});

	it('renders formatted duration when isoDuration prop is empty but startDate and endDate prop exist', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: '',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('(2hours 30minutes 45seconds)');
	});

	it('renders formatted duration when isoDuration prop is not provided but startDate and endDate prop are', async () => {
		const wrapper = mount(Duration, {
			props: {
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('(2hours 30minutes 45seconds)');
	});

	it('renders formatted duration when startDate or endDate props are missing but isoDuration exists', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'PT2H30M45S',
				startDate: '2023-09-22T10:00:00',
				endDate: '',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('(2hours 30minutes 45seconds)');
	});

	it('renders formatted duration when isoDuration is not a valid duration format but startDate and endDate props', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'invalid-duration',
				startDate: '2023-09-22T10:00:00',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('(2hours 30minutes 45seconds)');
	});

	it('renders "Duration unknown" when isoDuration is not a valid duration format and startDate is missing', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'invalid-duration',
				startDate: '',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('Duration unknown');
	});

	it('renders "Duration unknown" when isoDuration is not a valid duration format and endDate prop is provided but startDate is missing', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'invalid-duration',
				startDate: '',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('Duration unknown');
	});

	it('renders "Duration unknown" when isoDuration is not a valid duration format and endDate is provided but startDate is invalid format', async () => {
		const wrapper = mount(Duration, {
			props: {
				isoDuration: 'invalid-duration',
				startDate: 'invalid-start',
				endDate: '2023-09-22T12:30:45',
			},
			global: {
				plugins: [i18n],
			},
		});

		await wrapper.vm.$nextTick();
		const spanElement = wrapper.find('span');
		expect(spanElement.text()).toContain('Duration unknown');
	});
});
