async function copyTextToClipboard(): Promise<void> {
	let copyWentOK = false;
	try {
		await navigator.clipboard.writeText(location.href);
		copyWentOK = true;
	} catch (err) {
		copyWentOK = false;
		console.log('Oops, unable to copy');
	}

	let customEvent;
	if (copyWentOK) {
		customEvent = new CustomEvent('notify-user', {
			detail: {
				title: 'record.copyTitleSuccess',
				message: 'record.copyMessageSuccess',
				key: true,
				severity: 'low',
				userClose: false,
			},
		});
	} else {
		customEvent = new CustomEvent('notify-user', {
			detail: {
				title: 'record.copyTitleFailed',
				message: 'record.copyMessageFailed',
				key: true,
				severity: 'low',
				userClose: true,
			},
		});
	}
	window.dispatchEvent(customEvent);
}

export { copyTextToClipboard };
