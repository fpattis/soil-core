/**
 * @typedef { import("../errors").SoilError } SoilError
 * @typedef { import("../config").Config } Config
 */

/**
 * logs an Error
 * @param {SoilError} error
 * @param {Config} config
 * @return {SoilError}
 */
export function logError(error, config) {
	if (config?.isLogHandledErrors === false && error.isHandled) {
		return;
	}
	error.logID = `${Date.now()}-${Math.random()}`;
	console.error(error);
	return error;
}
