import { Priority, Severity } from '@/types/NotificationType';
async function copyTextToClipboard(textToCopy: string): Promise<void> {
	let copyWentOK = false;
	try {
		await navigator.clipboard.writeText(textToCopy);
		copyWentOK = true;
	} catch (err) {
		copyWentOK = false;
	}

	let customEvent;
	if (copyWentOK) {
		customEvent = new CustomEvent('notify-user', {
			detail: {
				title: 'record.copyTitleSuccess',
				message: 'record.copyMessageSuccess',
				key: true,
				severity: Severity.SUCCESS,
				userClose: false,
				priority: Priority.LOW,
			},
		});
	} else {
		customEvent = new CustomEvent('notify-user', {
			detail: {
				title: 'record.copyTitleFailed',
				message: 'record.copyMessageFailed',
				key: true,
				severity: Severity.SUCCESS,
				userClose: true,
				priority: Priority.LOW,
			},
		});
	}
	window.dispatchEvent(customEvent);
}
export { copyTextToClipboard };
