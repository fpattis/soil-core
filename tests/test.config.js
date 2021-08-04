/**
 * @typedef { import("../config").Config } Config
 */

const cache = {};

/** @type {Config} */
export const defaultConfig = {
	// logging
	isLogHandledErrors: true,
	errorLogFn: undefined, // default ./logging/index.js@logError
	errorHandlerFn: (e) => {
		throw e;
	},
	// localization
	getTranslationFn: undefined,
	// security
	cryptoTokenLength: 256,
	getValidationFn: undefined, // required
	authenticateUserFn: undefined, // default result of ./security/authentication.js@authenticateUserFn
	authorizeUserFn: undefined, // default result of ./security/authentication.js@getAuthorizeFn
	// cache
	storeInCacheFn: (prefix, key, value, config) => {
		const collection = cache[prefix] = cache[prefix] || {};
		collection[key] = value;
	}, // required
	readFromCacheFn: (prefix, key) => {
		return cache[prefix]?.[key];
	}, // required
	deleteFromCacheFn: (prefix, key) => {
		if (!prefix in cache) {
			return;
		}
		if (!key in cache[prefix]) {
			return;
		}
		delete cache[prefix][key];
	}, // required
};
