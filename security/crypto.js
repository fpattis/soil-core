import crypto from 'crypto';
import hash from './password_hash.js';

const TOKEN_LENGTH = 256;

/** @typedef {import('../config').Config} Config */

/**
 * generates a crypto token
 * @param {Config} config
 * @return {Promise<String>}
 */
export async function token(config = undefined) {
	const tokenLength = config?.cryptoTokenLength || TOKEN_LENGTH;
	return new Promise((resolve, reject) => {
		crypto.randomBytes(tokenLength, (err, buffer) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(buffer.toString('utf-8'));
		});
	});
}

/**
 * sets up workers
 * @param {Config} config
 * @return {Promise}
 */
export async function setup(config = undefined) {
	return Promise.all([
		hash.setup(config),
	]);
}

/**
 * clears workers
 * @return {Promise}
 */
export async function shutdown() {
	return Promise.all([
		hash.shutdown(),
	]);
}

export default {
	setup,
	shutdown,
	token,
	hashPassword: hash.hashPassword,
	isPasswordCorrect: hash.isPasswordCorrect,
};
