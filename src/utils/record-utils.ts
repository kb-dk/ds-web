import type { BroadcastRecordType } from '@/types/BroadcastRecordType';
import initial from '@/assets/images/audio-thumbnails/dr.jpg';
import p1 from '@/assets/images/audio-thumbnails/p1.jpg';
import p2 from '@/assets/images/audio-thumbnails/p2.jpg';
import p3 from '@/assets/images/audio-thumbnails/p3.jpg';
import p4 from '@/assets/images/audio-thumbnails/p4.jpg';
import p5 from '@/assets/images/audio-thumbnails/p5.jpg';
import p6 from '@/assets/images/audio-thumbnails/p6.jpg';
import p8 from '@/assets/images/audio-thumbnails/p8.jpg';

import fdr from '@/assets/images/filter-thumbnails/dr.jpg';
import fdr1 from '@/assets/images/filter-thumbnails/dr1.jpg';
import fdr2 from '@/assets/images/filter-thumbnails/dr2.jpg';
import fdrk from '@/assets/images/filter-thumbnails/drk.jpg';
import fdrultra from '@/assets/images/filter-thumbnails/drultra.jpg';
import fdruppdate from '@/assets/images/filter-thumbnails/drupdate.jpg';
import fp1 from '@/assets/images/filter-thumbnails/p1.jpg';
import fp2 from '@/assets/images/filter-thumbnails/p2.jpg';
import fp3 from '@/assets/images/filter-thumbnails/p3.jpg';
import fp4 from '@/assets/images/filter-thumbnails/p4.jpg';
import fp5 from '@/assets/images/filter-thumbnails/p5.jpg';
import fp6 from '@/assets/images/filter-thumbnails/p6.jpg';
import fp8 from '@/assets/images/filter-thumbnails/p8.jpg';
import frama from '@/assets/images/filter-thumbnails/ramasjang-tv.jpg';

const getEntryId = (recordData: BroadcastRecordType) => {
	const kalturaIdObj = recordData.identifier.find((obj) => obj.PropertyID === 'KalturaID');
	return kalturaIdObj ? kalturaIdObj.value : '';
};

const getFilterThumbnail = (channel: string) => {
	channel = channel.toLowerCase();
	switch (true) {
		case channel.includes('dr 1'):
			return fdr1;

		case channel.includes('dr 2'):
			return fdr2;

		case channel.includes('dr update'):
			return fdruppdate;

		case channel.includes('dr ultra'):
			return fdrultra;

		case channel.includes('dr k'):
			return fdrk;

		case channel.includes('ramasjang'):
			return frama;

		case channel.includes('p1'):
			return fp1;

		case channel.includes('p2'):
			return fp2;

		case channel.includes('p3'):
			return fp3;

		case channel.includes('p4'):
			return fp4;

		case channel.includes('p5'):
			return fp5;

		case channel.includes('p6'):
			return fp6;

		case channel.includes('p8'):
			return fp8;

		default:
			return fdr;
	}
};

const getThumbnailPicture = (channel: string) => {
	channel = channel.toLowerCase();
	switch (true) {
		case channel.includes('p1'):
			return p1;

		case channel.includes('p2'):
			return p2;

		case channel.includes('p3'):
			return p3;

		case channel.includes('p4'):
			return p4;

		case channel.includes('p5'):
			return p5;

		case channel.includes('p6'):
			return p6;

		case channel.includes('p8'):
			return p8;

		default:
			return initial;
	}
};

export { getEntryId, getThumbnailPicture, getFilterThumbnail };
