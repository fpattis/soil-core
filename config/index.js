import * as authentication from '../security/authentication';
import * as authorization from '../security/authorization';
import * as logging from '../logging';
import * as validation from '../security/validation';

/**
 * @typedef Config
 *
 * //logging
 * @property {Boolean} isLogHandledErrors tells if a handled error gets
 * logged when it occurs
 * @property {ErrorLogFn} errorLogFn gets called when an error occurs
 * @property {ErrorHandlerFn} errorHandlerFn gets when an error occurs in an endpoint/index.js function
 *
 * //security
 * @property {Number} cryptoTokenLength the length of secure tokens in bytes
 * @property {GetValidationFn} getValidationFn returns a function that validates a schema
 * @property {import("../security/authentication").AuthenticatedUser} authenticateUserFn
 * @property {import("../security/authorization").AuthorizeUser} authorizeUserFn
 *
 * //localization
 * @property {GetTranslationFn} getTranslationFn function returns a function that handles the translation
 *
 * //cache
 * @property {StoreInCacheFn} storeInCacheFn a function that stores data in your cache
 * @property {ReadFromCacheFn} readFromCacheFn a function that reads data in from your cache
 * @property {DeleteFromCacheFn} deleteFromCacheFn a function that deletes data from your cache
 */

/**
 * @typedef {import('../errors').SoilError} SoilError
 * @typedef {import('../security/validation').Schema} Schema
 */

// security

/**
 * @callback GetValidationFn
 * @param {Object} schema a schema object that defines the validation work
 * @param {Config} config the application config
 * @return {Promise<ValidateFn>} the function that validates the data
 */

/**
 * @callback ValidateFn
 * @param {Object} data the data  to validate
 * @return {Promise<Object>} the validated data
 */

// logging

/**
 * @callback ErrorLogFn this function shall not throw an error
 * @param {SoilError} error error object
 */

/**
 * @callback ErrorHandlerFn this function shall not throw an error
 * @param {SoilError} error error object
 * @param {Any} args any number of additional arguments passed to the calling function that failed
 */

/**
 * @callback ErrorHandlerFn this function shall not throw an error
 * @param {SoilError} error error object
 * @param {Any} args any number of additional arguments passed to the calling function that failed
 */

// localization

/**
 * @callback GetTranslationFn
 * @param {Object} translations the translations object, first level keys are the language codes
 * 2nd level keys are the translation codes
 * @param {String} defaultLanguage the default language
 * @param {Config} config
 * @returns {TranslationFn}
 */

/**
 * @callback TranslationFn
 * @param {String} code the code of the translation we are looking for
 * @param {String} languageCode the language for the code we are looking for
 */

// cache

/**
 * @callback ReadFromCacheFn shall deserialized JSON or other formats properly before returning
 * @param {String} cachePrefix the cache prefix or collection name
 * @param {String | Object} key the key of the value to read
 * @param {Config} config the applications config object
 * @returns {Promise<Object | Array>}
 */

/**
 * @callback DeleteFromCacheFn shall delete a key from cache
 * @param {String} cachePrefix the cache prefix or collection name
 * @param {String | Object} key the key of the value to read
 * @param {Config} config the applications config object
 * @returns {Promise}
 */

/**
 * @callback StoreInCacheFn
 * @param {String} cachePrefix the cache prefix or collection name
 * @param {String | Object} key the key of the value to read
 * @param {Any} value the value to store for the given key
 * @param {Config} config the applications config object
 * @returns {Promise}
 */

/** @type {Schema} */
const CONFIG_SCHEMA = {
	'errorLogFn': {
		type: 'function',
	},
	'getValidationFn': {
		type: 'function',
	},
	'authenticateUserFn': {
		type: 'function',
	},
	'authorizeUserFn': {
		type: 'function',
	},
	'storeInCacheFn': {
		type: 'function',
	},
	'readFromCacheFn': {
		type: 'function',
	},
	'deleteFromCacheFn': {
		type: 'function',
	},
};

// to obtain default values call addDefaultValues
/** @type {Config} */
const defaultConfig = {
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
	storeInCacheFn: undefined, // required
	readFromCacheFn: undefined, // required
	deleteFromCacheFn: undefined, // required
};

/**
 * adds default values to your config
 * @param {Config} config
 * @return {Config}
 */
export function addDefaultValues(config) {
	const c = Object.assign({}, defaultConfig, config);
	c.authenticateUserFn ||= authentication.getAuthenticatedUserFn(config),
	c.authorizeUserFn ||= authorization.getAuthorizeFn(config),
	c.errorLogFn ||= logging.logError;
	return c;
}


/**
 * checks your config for completeness, call addDefaultValues first
 * @param {Config} config
 * @return {Config}
 */
export function check(config) {
	return validation.validate(config, CONFIG_SCHEMA, config);
}
