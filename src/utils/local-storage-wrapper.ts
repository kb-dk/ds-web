export class LocalStorageWrapper {
	/* Maybe this is too typescript stringent because 9 out of
	 10 times this is called we retrieve a string but for now
	 we will enforce that you have to supply a type just in case */
	public static get<T>(key: string): T | null {
		const item = localStorage.getItem(key);
		if (item) {
			try {
				return JSON.parse(item) as T;
			} catch (error) {
				return item as T;
			}
		}
		return null;
	}

	/* Maybe this is too typescript stringent because 9 out of
	 10 times this is called we store a string but for now
	 we will enforce that you have to supply a type just in case */
	public static set<T>(key: string, value: T): void {
		if (typeof value === 'string') {
			localStorage.setItem(key, value);
		} else {
			try {
				localStorage.setItem(key, JSON.stringify(value));
			} catch {
				/* If something happens in the JSON serializer
        there is no need to alert the user but the developer 
        definitely needs to shape up so we log an error to the console */
				console.error(`Error trying to set key: ${key} and value: ${value} in local storage`);
			}
		}
	}

	public static remove(key: string): void {
		localStorage.removeItem(key);
	}
}
