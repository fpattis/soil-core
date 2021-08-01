import {logError} from '../logging';

/**
 * @typedef { import("../config").Config } Config
 */

/**
 * @callback ExecuteBusinessLogic
 * @param {String} rawData unparsed string data
 * @return {Promise<Any>}
 */

/**
 * @callback ExecuteProtectedBusinessLogicExtension
 * @param {String} token token identifying the user
 */

/**
 * @typedef {ExecuteBusinessLogic & ExecuteProtectedBusinessLogicExtension}
 * ExecuteProtectedBusinessLogic
 */

/**
 * @callback BusinessLogic
 * @param {Object} data the parsed and validated data
 * @return {Promise<Any>}
 */

/**
 * @callback ProtectedBusinessLogicExtension
 * @param {Object} user the user object
 */

/**
 * @typedef {BusinessLogic & ProtectedBusinessLogicExtension}
 * ProtectedBusinessLogic
 */

/**
 * called from your endpoints, returns a function that shall be called with
 * the unparsed string data arriving over the wire and a string token as second
 * parameter
 * @param {ProtectedBusinessLogic} fn your business logic, recieves the
 * validated data object as first argument and your user object as second
 * argument
 * @param {Object} jsonSchema
 * @param {Array<String>} allowedUserGroups
 * @param {Config} config
 * @return {ExecuteProtectedBusinessLogic}
 */
export async function protect(
	fn,
	jsonSchema,
	allowedUserGroups = [],
	config = undefined,
) {
	return wrapper(async (validatedData, token) => {
		// authentication and authorization
		return await fn(validatedData, user);
	}, jsonSchema, config);
}

/**
 * returns a function that recieves the raw data from your endpoint, parses,
 * validates it and calls your business logic
 * @param {BusinessLogic} fn
 * @param {Object} jsonSchema
 * @param {Config} config
 * @return {ExecuteBusinessLogic}
 */
export async function unprotected(fn, jsonSchema, config = undefined) {
	return wrapper(fn, jsonSchema, config);
}

/**
 * validates the data and logs errors
 * @param {Function} fn function to call after validation
 * @param {Object} jsonSchema
 * @param {Config} config
 * @return {Function<Promsise<Any>>}
 */
async function wrapper(fn, jsonSchema, config = undefined) {
	// TODO: call validation https://ajv.js.org/guide/why-ajv.html
	return async (...args) => {
		try {
			args[0] = await validate(args[0]);
			return await fn(...args);
		} catch (e) {
			logError(e, config);
			throw e;
		}
	};
}
