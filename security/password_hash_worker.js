import workerThreads from 'worker_threads';
import sodium from 'libsodium-wrappers';
import {logError} from '../logging/index.js';
import {createFromError} from '../errors/index.js';
import {fileURLToPath} from 'url';

export default {
	createWorker,
};

/** @typedef {import('../config').Config} Config */

if (!workerThreads.isMainThread) {
	workerThreads.parentPort.on('message', async (message) => {
		const responseMessage = {
			isError: false,
		};
		try {
			if (message.type === 'hashPassword') {
				responseMessage.result = await hashPassword(message.password, workerThreads.workerData.config);
			} else {
				responseMessage.result = await isPasswordCorrect(message.password, message.passwordHash);
			}
		} catch (e) {
			responseMessage.isError = true;
			responseMessage.error = e;
		}
		workerThreads.parentPort.postMessage(responseMessage);
	});
}

/**
 * creates a password hash worker
 * @param {Config} config
 * @return {Worker}
 */
export function createWorker(config = undefined) {
	const filename = fileURLToPath(import.meta.url);
	const worker = new workerThreads.Worker(filename, {
		workerData: {config},
	});
	worker.on('error', (e) => {
		const error = createFromError(e, 'password hash worker error');
		logError(error);
	});
	return worker;
}

/**
 * generates a hash to store in your db, the returned passwordHash can then be checked using isPasswordCorrect function
 * @param {String} password user password input
 * @param {Config} config
 * @return {String} to store in your db
 */
async function hashPassword(password, config = undefined) {
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
async function isPasswordCorrect(password, passwordHash) {
	await sodium.ready;
	return sodium.crypto_pwhash_str_verify(passwordHash, password);
}
