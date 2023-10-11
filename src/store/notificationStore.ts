import { defineStore } from 'pinia';
import { NotificationType } from '@/types/NotificationType';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notificationStore', () => {
	const notifications = ref([] as Array<NotificationType>);
	const count = ref(0);

	const addNotification = (title: string, desc: string, severity: string, userClose: boolean) => {
		const notification: NotificationType = {
			title: title,
			desc: desc,
			severity: severity,
			userClose: userClose,
			time: new Date().getTime(),
			count: count.value,
		};
		addToCount();
		notifications.value.push(notification);
	};

	const addToCount = () => {
		count.value++;
	};

	const resetNotifications = () => {
		notifications.value = [];
	};

	const removeNotification = (notification: NotificationType) => {
		notifications.value.splice(notifications.value.indexOf(notification), 1);
	};

	return {
		notifications,
		addNotification,
		resetNotifications,
		removeNotification,
	};
});
