import type { BroadcastRecordType } from '@/types/BroadcastRecordType';

const getEntryId = (recordData: BroadcastRecordType) => {
	const kalturaIdObj = recordData.identifier.find((obj) => obj.PropertyID === 'KalturaID');
	return kalturaIdObj ? kalturaIdObj.value : '';
};

export { getEntryId };
