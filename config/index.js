/* eslint-disable max-len */
import * as authentication from '../security/authentication.js';
import * as authorization from '../security/authorization.js';
import * as logging from '../logging/index.js';
import validation from '../security/validation.js';
import localization from '../localization/index.js';
import {DEFAULT_ERROR_FN} from '../errors/index.js';

export default {
	addDefaultValues,
	check,
};

/**
 * @typedef Config
 *
 * //logging
 * @property {Boolean} isLogHandledErrors tells if a handled error gets
 * logged when it occurs
 * @property {ErrorLogFn} errorLogFn gets called when an error occurs
 * @property {ErrorHandlerFn} errorHandlerFn gets called when an error occurs in an endpoint/index.js function
 *
 * //security
 * @property {Number} cryptoTokenLength the length of secure tokens in bytes
 * @property {GetValidationFn} getValidationFn returns a function that validates a schema
 * @property {import("../security/authentication").AuthenticatedUser} authenticateUserFn
 * @property {import("../security/authentication").CreateToken} createTokenFn
 * @property {import("../security/authentication").UnauthorizeUser} unauthorizeUserFn
 * @property {import("../security/authorization").AuthorizeUser} authorizeUserFn
 * @property {Number} userTokenExpiresInMinutes default 30 minutes
 * @property {Number} passwordCheckMemoryLimitBytes reasonable default set, impacts hash execution time
 * @property {Number} passwordCheckOperationsLimit reasonable default set, impacts hash execution time
 * @property {Number} passwordHashWorkerAmountMinimum minimal amount of password hash workers that will start on server startup
 * @property {Number} passwordHashWorkerAmountMaximum minimal amount of password hash workers will start when needed, adapt this and the previous value to your CPU cores
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
 * @param {Number} expiresInMinutes refresh token expiration by minutes
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
 * @param {Number} expiresInMinutes refresh token expiration by minutes
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
	isLogHandledErrors: false,
	errorLogFn: undefined, // default ./logging/index.js@logError
	errorHandlerFn: DEFAULT_ERROR_FN, // rethrows error
	// localization
	getTranslationFn: undefined, // default ./localization/index.js@getTranslationFn
	// security
	cryptoTokenLength: 256,
	getValidationFn: undefined, // default ./security/validation.js@getValidationFn
	authenticateUserFn: undefined, // default result of ./security/authentication.js@getAuthenticatedUserFn
	createTokenFn: undefined, // default result of ./security/authentication.js@getCreateTokenFn
	unauthorizeUserFn: undefined, // default result of ./security/authentication.js@getUnauthorizeUserFn
	authorizeUserFn: undefined, // default result of ./security/authentication.js@getAuthorizeFn
	userTokenExpiresInMinutes: 30,
	passwordHashWorkerAmountMinimum: 2,
	passwordHashWorkerAmountMaximum: 4,
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
	c.createTokenFn ||= authentication.getCreateTokenFn(config);
	c.unauthorizeUserFn ||= authentication.getUnauthorizeUserFn(config);
	c.authorizeUserFn ||= authorization.getAuthorizeFn(config),
	c.errorLogFn ||= logging.logError;
	c.getValidationFn ||= validation.getValidationFn;
	c.getTranslationFn ||= localization.getTranslationFn;
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
