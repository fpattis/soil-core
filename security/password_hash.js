import genericPool from 'generic-pool';
import passwordHashWorker from './password_hash_worker.js';
import os from 'os';

/** @type {genericPool.Pool} */
let workerPool = null;

/** @typedef {import('../config').Config} Config */

export default {
	setup,
	shutdown,
	hashPassword,
	isPasswordCorrect,
};

/**
 * creates the password hash workers
 * @param {Config} config
 */
export function setup(config = undefined) {
	const factory = {
		create: function() {
			return passwordHashWorker.createWorker(config);
		},
		destroy: function(worker) {
			worker.terminate();
		},
	};

	const options = {
		min: config?.passwordHashWorkerAmountMinimum || 2,
		max: config?.passwordHashWorkerAmountMaximum || Math.floor(os.cpus().length / 2),
	};

	workerPool = genericPool.createPool(factory, options);
}

/**
 * clears the worker pool
 */
export async function shutdown() {
	await workerPool?.drain();
	await workerPool?.clear();
}

/**
 * generates a hash to store in your db, the returned passwordHash can then be checked using isPasswordCorrect function
 * @param {String} password user password input
 * @param {Config} config
 * @return {String} to store in your db
 */
export async function hashPassword(password) {
	const worker = await workerPool.acquire();
	return new Promise((resolve, reject) => {
		worker.postMessage({
			type: 'hashPassword',
			password,
		});
		worker.once('message', (responseMessage) => {
			if (responseMessage.isError) {
				reject(responseMessage.error);
			} else {
				resolve(responseMessage.result);
			}
			workerPool.release(worker);
		});
	});
}

/**
 * checks if the user provided password is correct
 * @param {String} password
 * @param {String} passwordHash
 * @return {Boolean}
 */
export async function isPasswordCorrect(password, passwordHash) {
	const worker = await workerPool.acquire();
	return new Promise((resolve, reject) => {
		worker.postMessage({
			type: 'isPasswordCorrect',
			password,
			passwordHash,
		});
		worker.once('message', (responseMessage) => {
			if (responseMessage.isError) {
				reject(responseMessage.error);
			} else {
				resolve(responseMessage.result);
			}
			workerPool.release(worker);
		});
	});
}
