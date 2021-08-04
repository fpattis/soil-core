/**
 * @typedef { import("../errors").SoilError } SoilError
 * @typedef { import("../config").Config } Config
 */

/**
 * logs an Error
 * @param {SoilError} error
 * @param {Config} config
 * @return {undefined}
 */
export async function logError(error, config) {
	if (config?.isLogHandledErrors === false && error.isHandled) {
		return;
	}
	console.error(error);
}
