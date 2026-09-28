const returnCategoryIcon = (name: string): string => {
	switch (name) {
		case 'Børn og unge':
			return 'child_care';

		case 'Dokumentar':
			return 'videocam';

		case 'Film og serier':
			return 'movie';

		case 'Humor, quiz og underholdning':
			return 'theater_comedy';

		case 'Kultur og oplysning':
			return 'account_balance';

		case 'Livsstil':
			return 'self_improvement';

		case 'Musik':
			return 'music_note';

		case 'Natur og videnskab':
			return 'science';

		case 'Nyheder, politik og samfund':
			return 'newspaper';

		case 'Radio-rodekasse':
			return 'inventory_2';

		case 'Sport':
			return 'trophy';

		case 'TV-rodekasse':
			return 'inventory_2';

		default: {
			return 'inventory_2';
		}
	}
};

const returnFilledIconStatus = (name: string): boolean => {
	switch (name) {
		case 'Børn og unge':
			return true;

		case 'Dokumentar':
			return false;

		case 'Film og serier':
			return false;

		case 'Humor, quiz og underholdning':
			return false;

		case 'Kultur og oplysning':
			return true;

		case 'Livsstil':
			return false;

		case 'Musik':
			return false;

		case 'Natur og videnskab':
			return true;

		case 'Nyheder, politik og samfund':
			return false;

		case 'Radio-rodekasse':
			return false;

		case 'Sport':
			return false;

		case 'TV-rodekasse':
			return false;

		default: {
			return false;
		}
	}
};

export { returnCategoryIcon, returnFilledIconStatus };
