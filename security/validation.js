import {create as createError, ERROR_CODES} from '../errors';

/**
 * @typedef {import('../config').Config} Config
 * @typedef {import('../config').ValidateFn} ValidateFn
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
