import * as crypto from './crypto.js';

export const CACHE_PREFIX_USER_AUTHENTICATION = 'USER_AUTH_';
export const CACHE_PREFIX_USER_AUTHENTICATION_SESSIONS = 'USER_AUTH_S_';

/**
 * @typedef { import("../config").Config } Config
 * @typedef { import("../models/user").User } User
 */

/**
 * @callback AuthenticatedUser
 * @param {String} token
 * @param {Object} validatedData
 * @param {Array<Any>} additionalData
 * @returns {Promise<User | null>} user object
 */

/**
 * @callback CreateToken
 * @param {User} user the user object
 * @returns {Promise<String>} token to pass to the user
 */

/**
 * @callback UnauthorizeUser
 * @param {User} user the user object
 * @returns {Promise} token to pass to the user
 */

/**
 * returns a function that given a token returns related user
 * @param {Config} config
 * @return {AuthenticatedUser}
 */
export function getAuthenticatedUserFn(config) {
	const readFromCache = config.readFromCacheFn;
	return async function authenticatedUser(token) {
		const user = await readFromCache(CACHE_PREFIX_USER_AUTHENTICATION, token, config);
		return user;
	};
}

/**
 * returns a function that given a user object creates a token to authenticate the user
 * and stores that information to the cache
 * @param {Config} config
 * @return {CreateToken}
 */
export function getCreateTokenFn(config) {
	const storeInCache = config.storeInCacheFn;
	const readFromCache = config.readFromCacheFn;
	return async function createToken(user) {
		const token = await crypto.token(config);
		await storeInCache(CACHE_PREFIX_USER_AUTHENTICATION, token, user, config);
		let tokens = await readFromCache(CACHE_PREFIX_USER_AUTHENTICATION_SESSIONS, user, config);
		if (!tokens) {
			tokens = [];
		}
		tokens.push(token);
		await storeInCache(CACHE_PREFIX_USER_AUTHENTICATION_SESSIONS, user, tokens, config);
		return token;
	};
}

/**
 * returns a function that deletes all active user tokens
 * @param {Config} config
 * @return {UnauthorizeUser}
 */
export function getUnauthorizeUserFn(config) {
	const deleteFromCache = config.deleteFromCacheFn;
	const readFromCache = config.readFromCacheFn;
	return async function unauthorizeUser(user) {
		const tokens = await readFromCache(CACHE_PREFIX_USER_AUTHENTICATION_SESSIONS, user, config);
		if (!tokens) {
			return;
		}
		for (const token of tokens) {
			await deleteFromCache(CACHE_PREFIX_USER_AUTHENTICATION, token, config);
		}
	};
}

/**
 * returns all "compiled" functions of this module
 * @param {Config} config
 * @return {Object} containing all "compiled" functions
 */
export default function getAllFunctionality(config) {
	return {
		unauthorizeUser: getUnauthorizeUserFn(config),
		createToken: getCreateTokenFn(config),
		authenticatedUser: getAuthenticatedUserFn(config),
	};
}
