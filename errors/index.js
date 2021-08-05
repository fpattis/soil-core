

export const ERROR_CODES = {
	UNAUTHORIZED: {
		code: 'UNAUTHORIZED',
		httpStatusCode: 401,
	},
	BAD_REQUEST: {
		code: 'BAD_REQUEST',
		httpStatusCode: 400,
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
*/

/**
 * @typedef {Error & ErrorExtension & ErrorCode} SoilError
 */

/**
 * creates a new error object
 * @param {String} message the error message
 * @param {ErrorCode} code a code that uniquely identifies an error
 * @param {Boolean} isHandled when used with the error wrapper an
 * unhandled error will be re-thrown after being logged
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
