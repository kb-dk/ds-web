export class LocalStorageWrapper {
	public static get(key: string): string | null {
		const item = localStorage.getItem(key);
		if (item) {
			// First we try for an JSON object
			try {
				return JSON.parse(item);
			} catch (error) {
				/* If the JSON.parse fails it's probably a plain 
				string or something else and we just return it
			 **/
				return item;
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
			} catch (e) {
				/* If something happens in the JSON serializer which is en extreme
        edge case in this scenario - there is no need to alert the user but we fail silently*/
			}
		}
	}

	public static remove(key: string): void {
		localStorage.removeItem(key);
	}
}
