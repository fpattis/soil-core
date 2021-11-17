import crypto from 'crypto';
import sodium from 'libsodium-wrappers';

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
 * generates a hash to store in your db, the returned passwordHash can then be checked using isPasswordCorrect function
 * @param {String} password user password input
 * @param {Config} config
 * @return {String} to store in your db
 */
export async function hashPassword(password, config = undefined) {
	await sodium.ready;
	const memoryLimit = config?.passwordCheckMemoryLimitBytes || sodium.crypto_pwhash_MEMLIMIT_MODERATE;
	const operationsLimit = config?.passwordCheckOperationsLimit || sodium.crypto_pwhash_OPSLIMIT_MODERATE;
	const hash = sodium.crypto_pwhash_str(password, operationsLimit, memoryLimit);
	return hash;
}

/**
 * checks if the user provided password is correct
 * @param {String} password
 * @param {String} passwordHash
 * @return {Boolean}
 */
export async function isPasswordCorrect(password, passwordHash) {
	await sodium.ready;
	return sodium.crypto_pwhash_str_verify(passwordHash, password);
}

export default {
	token,
	hashPassword,
	isPasswordCorrect,
};

// (async function() {
// 	const hash = await hashPassword('test', false, false);
// 	console.log(hash);
// 	console.log(await isPasswordCorrect('test', hash));
// 	console.log(await isPasswordCorrect('test1', hash));
// })();
