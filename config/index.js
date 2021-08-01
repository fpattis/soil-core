
/**
 * @typedef Config
 *
 * //logging
 * @property {Boolean} isLogHandledErrors tells if a handled error gets
 * logged when it occurs
 * @property {Function} errorLogFn gets called when an error occurs
 *
 * //security
 * @property {Number} cryptoTokenLength the lenght of secure tokens in bytes
 */

export const defaultConfig = {
	// logging
	isLogHandledErrors: true,
	errorLogFn: undefined,
	// security
	cryptoTokenLength: 256,
};
