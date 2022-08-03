import { defineStore } from 'pinia';
import { GenericRecord } from '@/types/GenericRecord';
import { APIService } from '@/api/api-service';

export const useRecordStore = defineStore({
	id: 'Record',
	state: () => ({
		record: [] as Array<GenericRecord>,
		loading: false,
		error: '',
	}),
	getters: {},
	actions: {
		async getRecord(id: string) {
			try {
				const responseData = await APIService.getRecord(id);
				this.record = responseData.data.dataFeedElement;
				console.log(responseData);
			} catch (err) {
				throw new Error('error');
			}
		},
	},
});
