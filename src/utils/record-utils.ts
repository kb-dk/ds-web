import type { BroadcastRecordType } from '@/types/BroadcastRecordType';
import boogie from '@/assets/images/audio-thumbnails/boogie.jpg';
import initial from '@/assets/images/audio-thumbnails/default.jpg';
import mama from '@/assets/images/audio-thumbnails/mama.jpg';
import p1 from '@/assets/images/audio-thumbnails/p1.jpg';
import p2 from '@/assets/images/audio-thumbnails/p2.jpg';
import p3 from '@/assets/images/audio-thumbnails/p3.jpg';
import p4 from '@/assets/images/audio-thumbnails/p4.jpg';
import p5 from '@/assets/images/audio-thumbnails/p5.jpg';
import p6 from '@/assets/images/audio-thumbnails/p6.jpg';
import p7 from '@/assets/images/audio-thumbnails/p7.jpg';
import p8 from '@/assets/images/audio-thumbnails/p8.jpg';
import p5000 from '@/assets/images/audio-thumbnails/p5000.jpg';
import ramasjang from '@/assets/images/audio-thumbnails/ramasjang.jpg';

const getEntryId = (recordData: BroadcastRecordType) => {
	const kalturaIdObj = recordData.identifier.find((obj) => obj.PropertyID === 'KalturaID');
	return kalturaIdObj ? kalturaIdObj.value : '';
};

const getThumbnailPicture = (channel: string) => {
	channel = channel.toLowerCase();
	switch (true) {
		case channel.includes('p5000'):
			return p5000;

		case channel.includes('mama'):
			return mama;

		case channel.includes('boogie'):
			return boogie;

		case channel.includes('ramasjang'):
			return ramasjang;

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

		case channel.includes('p7'):
			return p7;

		case channel.includes('p8'):
			return p8;

		default:
			return initial;
	}
};

export { getEntryId, getThumbnailPicture };
