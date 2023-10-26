import { LocalStorageWrapper } from '../../src/utils/local-storage-wrapper';

describe('LocalStorageWrapper', () => {
	beforeEach(() => {
		// We actually have to clear localStorage before each test...
		localStorage.clear();
	});

	describe('get', () => {
		it('should return null for a non-existing key', () => {
			const value = LocalStorageWrapper.get('nonexistentKey');
			expect(value).toBeNull();
		});

		it('should return the stored string value', () => {
			localStorage.setItem('goodKey', 'ds-web rocks!');
			const value = LocalStorageWrapper.get('goodKey');
			expect(value).toBe('ds-web rocks!');
		});

		it('should handle invalid JSON like a boss', () => {
			localStorage.setItem('noGoodJson', '{ invalidJson }');
			const value = LocalStorageWrapper.get('noGoodJson');
			expect(value).toBe('{ invalidJson }');
		});
	});

	describe('set', () => {
		it('should set a string value', () => {
			LocalStorageWrapper.set('goodKey', 'ds-web rocks!');
			const storedValue = localStorage.getItem('goodKey');
			expect(storedValue).toBe('ds-web rocks!');
		});

		it('should set a JSON value', () => {
			const data = { title: 'Radioavisen', durationMillis: 300000 };
			LocalStorageWrapper.set('goodJSON', data);
			const storedValue = localStorage.getItem('goodJSON');
			let parsedValue = null;
			if (storedValue) {
				parsedValue = JSON.parse(storedValue);
			}
			expect(parsedValue).toEqual(data);
		});

		it('should handle JSON serialization errors', () => {
			const badDataObj = { circularReference: {} };
			/**  I know this seems a bit excess but according to the docs
        a circular reference (and a BigInt) is the only thing 
        that will trigger a JSON.stringify TypeError exception on a well
        formed JSON object. So I went with circular reference here.
        */
			badDataObj.circularReference = badDataObj;
			LocalStorageWrapper.set('badDataObjKey', badDataObj);
			// Took some searching on the interwebs but this is a mock console.error function for this test
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
			LocalStorageWrapper.set('badDataObjKey', badDataObj);
			/**If this test passes it will actually print the console.error implemented
			in the local storage wrapper
      */
			expect(consoleErrorSpy).toHaveBeenCalled();
			//https://jestjs.io/docs/mock-function-api#mockfnmockrestore
			consoleErrorSpy.mockRestore();
		});
	});

	describe('remove', () => {
		it('should remove the specified key', () => {
			localStorage.setItem('testLocale', 'en');
			LocalStorageWrapper.remove('testLocale');
			const value = localStorage.getItem('testLocale');
			expect(value).toBeNull();
		});
	});
});
