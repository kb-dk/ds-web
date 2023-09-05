import { AxiosError } from 'axios';

export class ErrorManager {
	private errorHistory: AxiosError[] = [];

	private isErrorInHistory(error: AxiosError): boolean {
		return this.errorHistory.some((historyError) => this.isSameError(historyError, error));
	}

	private isSameError(error1: AxiosError, error2: AxiosError): boolean {
		console.log('error1', error1);
		console.log('error2', error2);
		if (!error1 || !error2) {
			return false;
		}

		// The idea here is to compare error types and I went with
		// code here but it could be anything
		const isSameCode = error1.code === error2.code;

		// I went with status here but the idea is to illustrate that we should check for several things
		const isSameStatus = error1.response?.status === error2.response?.status;

		// This is just to show we can compare, for more advanced use we should have a dedicated comparator
		return isSameCode && isSameStatus;
	}

	private removeErrorFromHistory(error: AxiosError, delayMs: number) {
		setTimeout(() => {
			const index = this.errorHistory.indexOf(error);
			if (index !== -1) {
				this.errorHistory.splice(index, 1);
			}
		}, delayMs);
	}

	private getNotifierMessage() {
		//TODO specify better error details...
		return { type: 'error', message: 'WE NEED SOME GOOD ERROR KEYS HERE' };
	}

	public submitError(error: AxiosError): void {
		// Check if the current error is in the error history
		if (!this.isErrorInHistory(error)) {
			this.publishNotifyEvent(error);
			this.errorHistory.push(error);

			// Remove error after 5 seconds
			// TODO lets build a more solid error purge method...
			this.removeErrorFromHistory(error, 5000);
		}
		// If the error is in history do nothing for now
		console.error('An error occurred but we already notified the user about it');
	}

	private publishNotifyEvent(error: AxiosError) {
		console.log('send notification to user that something happened', error);
		const notifierMsgDetals = this.getNotifierMessage();
		const customEvent = new CustomEvent('notify-user', {
			detail: notifierMsgDetals,
		});
		window.dispatchEvent(customEvent);
	}
}
