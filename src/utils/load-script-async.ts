function loadScriptAsync(url: string): Promise<void> {
	return new Promise(function (resolve, reject) {
		const script = document.createElement('script');
		script.src = url;
		script.onload = function () {
			resolve();
		};
		script.onerror = function (event) {
			reject(event);
		};
		document.head.appendChild(script);
	});
}

export { loadScriptAsync };
