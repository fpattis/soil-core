import {logError} from '../logging';

/**
 * @typedef ErrorExtension
 * @property {Any} code
 * @property {Boolean} isHandled
*/

/**
 * @typedef {Error & ErrorExtension} SoilError
 */

/**
 * creates a new error object
 * @param {String} message the error message
 * @param {*} code a code that uniquely identifies an error
 * @param {Boolean} isHandled when used with the error wrapper an
 * unhandled error will be rethrown after being logged
 * @return {SoilError}
 */
export function create(message, code, isHandled = false) {
	/** @type {SoilError} */
	const error = new Error(message);
	error.code = code;
	error.isHandled = isHandled;
	return error;
}
