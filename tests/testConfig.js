/**
 * @typedef { import("../config").Config } Config
 */

import {addDefaultValues} from '../config/index.js';

const cache = {};

/** @type {Config} */
const testConfig = {
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
	storeInCacheFn: (prefix, key, value, expiresInMinutes, config) => {
		const collection = cache[prefix] = cache[prefix] || {};
		collection[key] = value;
	}, // required
	readFromCacheFn: (prefix, key, expiresInMinutes) => {
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

let extendedTestConfig = null;

/**
 * returns the config used for tests
 * @return {Config}
 */
export function getTestConfig() {
	if (extendedTestConfig) {
		return extendedTestConfig;
	}
	extendedTestConfig = addDefaultValues(testConfig);
	return extendedTestConfig;
}
