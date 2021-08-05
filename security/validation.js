import {create as createError, ERROR_CODES} from '../errors';

/**
 * @typedef {import('../config').Config} Config
 * @typedef {import('../config').ValidateFn} ValidateFn
 */

/**
 * @typedef {Object.<String, SchemaProperty>} Schema
*/

/**
 * @typedef SchemaProperty
 * @property {String} type specifies the expected string type of the property (returned by "typeof")
 * @property {Boolean} required specifies the expected string type of the property (returned by "typeof")
*/

/**
 * returns a very basic validation function, this should never be used in production
 * @param {Object} schema
 * @param {Config} config
 * @return {ValidateFn}
 */
export function getValidationFn(schema, config) {
	return async function validate(data) {
		for (const key of Object.keys(data)) {
			if (!(key in schema)) {
				// eslint-disable-next-line max-len
				throw createError('validation error: data key not found in schema', ERROR_CODES.BAD_REQUEST, true, 'data key not found');
			}
		}
		return data;
	};
}

/**
 * only returns data that is specified in schema, throws an error when a validation fails
 * @param {Object} data
 * @param {Object} schema
 * @param {Config} config
 * @return {Object} validated data
 */
export function validate(data, schema, config) {
	const validatedData = {};
	for (const key of Object.keys(data)) {
		if (!(key in schema)) {
			continue;
		}
		if (typeof data[key] !== schema[key].type) {
			// eslint-disable-next-line max-len
			throw createError(`validation error: property "${key}" is not of type "${schema[key]}"`, ERROR_CODES.BAD_REQUEST, true, 'data key not found', data[key]);
		}
		validatedData[key] = data[key];
	}
	return validatedData;
}
