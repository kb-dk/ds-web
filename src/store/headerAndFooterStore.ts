import { APIService } from '@/api/api-service';
import { APIDrupalDataType } from '@/types/APIResponseTypes';
import { DrupalFooterType, DrupalHeaderType } from '@/types/DrupalDataType';
import { ErrorManagerType } from '@/types/ErrorManagerType';
import { Priority, Severity } from '@/types/NotificationType';
import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useHeaderAndFooterStore = defineStore('headerAndFooter', () => {
	const mainHeader = ref<Map<string, Array<DrupalHeaderType> | null>>(
		new Map([
			['da', null],
			['en', null],
		]),
	);
	const serviceHeader = ref<Map<string, Array<DrupalHeaderType> | null>>(
		new Map([
			['da', null],
			['en', null],
		]),
	);
	const footer_column_1 = ref<Array<DrupalFooterType> | null>(null);
	const footer_column_2 = ref<Array<DrupalFooterType> | null>(null);
	const footer_column_3 = ref<Array<DrupalFooterType> | null>(null);
	const footer_column_4 = ref<string | null>(null);
	const footer_column_5 = ref<Array<DrupalFooterType> | null>(null);
	const footer_column_6 = ref<Array<DrupalFooterType> | null>(null);
	const hasData = new Map<string, boolean>([
		['da', false],
		['en', false],
	]);
	const { t, locale } = useI18n();
	const errorManager = inject('errorManager') as ErrorManagerType;
	const getDrupalData = () => {
		try {
			if (!hasData.get(locale.value)) {
				if (locale.value === 'en') {
					APIService.getDrupalDataEnglish().then((resp) => {
						getHeaderData(resp);
						getFooterData(resp);
						hasData.set('en', true);
					});
				} else {
					APIService.getDrupalData().then((resp) => {
						getHeaderData(resp);
						getFooterData(resp);
						hasData.set('da', true);
					});
				}
			}
		} catch (err: unknown) {
			//TODO
			errorManager.submitCustomError(
				'time-search-error',
				t('error.infoError.title'),
				t('error.infoError.timeMachine'),
				Severity.ERROR,
				false,
				Priority.MEDIUM,
			);
		}
	};

	const getHeaderData = (resp: APIDrupalDataType) => {
		serviceHeader.value.set(locale.value, resp.data.attributes.service_menu);
		serviceHeader.value.get(locale.value)?.push({
			title: t('header.service.inEnglish.title'),
			full_url: t('header.service.inEnglish.link'),
			id: t('header.service.inEnglish.id'),
			icon: '',
			children: [null],
		});
		serviceHeader.value.get(locale.value)?.push({
			title: t('header.service.login.title'),
			full_url: t('header.service.login.link'),
			id: '',
			icon: t('header.service.login.icon'),
			children: [null],
		});
		mainHeader.value.set(locale.value, resp.data.attributes.main_menu);
	};

	const getFooterData = (resp: APIDrupalDataType) => {
		footer_column_1.value = resp.data.attributes.footer_column_1;
		footer_column_2.value = resp.data.attributes.footer_column_2;
		footer_column_3.value = resp.data.attributes.footer_column_3;
		footer_column_4.value = resp.data.attributes.footer_column_4;
		footer_column_5.value = resp.data.attributes.footer_column_5;
		footer_column_6.value = resp.data.attributes.footer_column_6;
	};

	return {
		mainHeader,
		serviceHeader,
		getDrupalData,
		footer_column_1,
		footer_column_2,
		footer_column_3,
		footer_column_4,
		footer_column_5,
		footer_column_6,
		t,
		hasData,
	};
});
