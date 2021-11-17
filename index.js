/* eslint-disable max-len */
import crypto from './security/crypto.js';
import configHelper from './config/index.js';

export * as endpoint from './endpoint/index.js';
export * as errors from './errors/index.js';
export * as localization from './localization/index.js';
export * as configHelper from './config/index.js';

/** @typedef {import('./config').Config} Config */

/**
 * prepares soil core, adds default values to config, checks the config, then initializes all the modules setups, this function needs to be called on application start
 * @param {Config} config
 */
export async function setup(config) {
	config = configHelper.addDefaultValues(config);
	configHelper.check(config);
	await crypto.setup(config);
}

/**
 * cleans up all resources, call this when your application shuts down
 * @param {Config} config
 */
export async function shutdown(config) {
	await crypto.shutdown();
}

export default {
	setup,
	shutdown,
	crypto,
	endpoint,
	localization,
	errors,
};
