/* eslint-disable max-len */

export default {
	DEFAULT_ERROR_FN,
	ERROR_CODES,
	create,
	createFromError,
};

export const DEFAULT_ERROR_FN = (e) => {
	throw e;
};

export const ERROR_CODES = {
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		httpStatusCode: 401,
		httpStatusMessage: 'Unauthorized',
	},
	BAD_REQUEST: {
		code: 'BAD_REQUEST',
		httpStatusCode: 400,
		httpStatusMessage: 'Bad Request',
	},
	INTERNAL_SERVER_ERROR: {
		code: 'INTERNAL_SERVER_ERROR',
		httpStatusCode: 500,
		httpStatusMessage: 'Internal Server Error',
	},
};

/**
 * @typedef ErrorCode
 * @property {String} code a unique identifier that never changes
 * @property {Number} httpStatusCode a corresponding http status code
 */

/**
 * @typedef ErrorExtension
 * @property {Boolean} isHandled
 * @property {String | undefined} translationKey
 * @property {Any | undefined} data
 * @property {String} logID
*/

/**
 * @typedef {Error & ErrorExtension & ErrorCode} SoilError
 */

/**
 * creates a new error object
 * @param {String} message the error message
 * @param {ErrorCode} code a code that uniquely identifies an error
 * @param {Boolean} isHandled when used with the default logger, a handled error will not be logged, when used with the default error handler, a non handled error will be re-thrown
 * @param {String} translationKey key that can be used for translation
 * @param {Any} data additional data added to the error
 * @return {SoilError}
 */
export function create(message, code, isHandled = false, translationKey = undefined, data = undefined) {
	/** @type {SoilError} */
	const error = new Error(message);
	error.code = code.code;
	error.httpStatusCode = code.httpStatusCode;
	error.isHandled = isHandled;
	if (translationKey) {
		error.translationKey = translationKey;
	}
	if (data) {
		error.data = data;
	}
	return error;
}

/**
 * creates an error from an error, adding additional information to it
 * @param {Error} originalError the original error
 * @param {String} message the error message
 * @param {String} translationKey key that can be used for translation
 * @param {Any} data additional data added to the error
 * @param {ErrorCode} code a code that uniquely identifies an error
 * @param {Boolean} isHandled when used with the default logger, a handled error will not be logged, when used with the default error handler, a non handled error will be re-thrown
 * @return {SoilError}
 */
export function createFromError(originalError, message, translationKey = undefined, data = undefined, code = ERROR_CODES.INTERNAL_SERVER_ERROR, isHandled = false) {
	/** @type {SoilError} */
	const error = new Error(message);
	error.originalError = originalError;
	error.code = code.code;
	error.httpStatusCode = code.httpStatusCode;
	error.isHandled = isHandled;
	if (translationKey) {
		error.translationKey = translationKey;
	}
	if (data) {
		error.data = data;
	}
	return error;
}
