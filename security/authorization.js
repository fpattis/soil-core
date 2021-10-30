import {
	create as createError,
	ERROR_CODES,
} from '../errors/index.js';

/**
 * @typedef {import("../config").Config} Config
 * @typedef {import("../models/user").User} User
 */

/**
 * @callback AuthorizeUser
 * @param {User} user
 * @param {Array<String>} allowedUserGroups
 * @param {Object} validatedData
 * @param {Array<Any>} additionalData
 * @returns {Promise}
 */

/**
 * returns the function that is able to authorize a user according his groups
 * @param {Config} config
 * @return {AuthorizeUser}
 */
export function getAuthorizeFn(config) {
	return async function authorize(user, allowedUserGroups) {
		const userGroups = user.groups;
		let firstMatchingGroup = null;
		for (const userGroup of userGroups) {
			if (allowedUserGroups.includes(userGroup)) {
				firstMatchingGroup = userGroup;
				break;
			}
		}
		if (!firstMatchingGroup) {
			// eslint-disable-next-line max-len
			throw createError(`authorization: user with id "${user.ID}" has none of the groups "${allowedUserGroups.join(',')}" assigned`, ERROR_CODES.UNAUTHORIZED, true, 'user has none of the requested user groups assigned');
		}
		return firstMatchingGroup;
	};
}

/**
 * provides all function this module exposes
 * @param {Config} config
 * @return {Object}
 */
export default function getAllFunctionality(config) {
	return {
		authorize: getAuthenticatedUserFn(config),
	};
}
