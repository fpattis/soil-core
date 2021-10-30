import * as errors from '../errors/index.js';
import * as crypto from './crypto.js';

export const CACHE_PREFIX_USERS = 'USERS_';
export const CACHE_PREFIX_TOKENS = 'AUTH_TOKENS_';
export const CACHE_PREFIX_USER_TOKENS = 'USER_TOKENS_';

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
		const userID = await readFromCache(CACHE_PREFIX_TOKENS, token, config.userTokenExpiresInMinutes, config);
		if (!userID) {
			// eslint-disable-next-line max-len
			throw errors.create('authentication: token not found', errors.ERROR_CODES.UNAUTHORIZED, true, 'token not found');
		}
		const user = await readFromCache(CACHE_PREFIX_USERS, userID, config.userTokenExpiresInMinutes, config);
		if (!user) {
			// eslint-disable-next-line max-len
			throw errors.create('authentication: user not found', errors.ERROR_CODES.UNAUTHORIZED, true, 'user not found, please login again');
		}
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
		await storeInCache(CACHE_PREFIX_TOKENS, token, user.ID, config.userTokenExpiresInMinutes, config);
		await storeInCache(CACHE_PREFIX_USERS, user.ID, user, config.userTokenExpiresInMinutes, config);
		let tokens = await readFromCache(CACHE_PREFIX_USER_TOKENS, user.ID, config.userTokenExpiresInMinutes, config);
		if (!tokens) {
			tokens = [];
		}
		tokens.push(token);
		await storeInCache(CACHE_PREFIX_USER_TOKENS, user.ID, tokens, config.userTokenExpiresInMinutes, config);
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
		const tokens = await readFromCache(CACHE_PREFIX_USER_TOKENS, user.ID, 0, config);
		if (!tokens) {
			return;
		}
		for (const token of tokens) {
			await deleteFromCache(CACHE_PREFIX_TOKENS, token, config);
		}
		await deleteFromCache(CACHE_PREFIX_USERS, user.ID, config);
		await deleteFromCache(CACHE_PREFIX_USER_TOKENS, user.ID, config);
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
