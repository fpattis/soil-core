
/**
 * @typedef Config
 *
 * //logging
 * @property {Boolean} isLogHandledErrors tells if a handled error gets
 * logged when it occurs
 * @property {ErrorLogFn} errorLogFn gets called when an error occurs
 * @property {ErrorHandlerFn} errorHandlerFn gets when an error occurs in an endpoint/index.js function
 *
 * //security
 * @property {Number} cryptoTokenLength the lenght of secure tokens in bytes
 * @property {GetValidationFn} getValidationFn returns a function that validates a schema
 */

/**
 * @typedef {import('../errors').SoilError} SoilError
 */

/**
 * @callback GetValidationFn
 * @param {Object} schema a schema object that defines the validation work
 * @return {Promise<ValidateFn>} the function that validates the data
 */

/**
 * @callback ValidateFn
 * @param {Object} data the data  to validate
 * @return {Promise<Object>} the validated data
 */

/**
 * @callback ErrorLogFn this function shall not throw an error
 * @param {SoilError} error error object
 */

/**
 * @callback ErrorHandlerFn this function shall not throw an error
 * @param {SoilError} error error object
 * @param {Any} args any number of additional arguments passed to the calling function that failed
 */

/**
 * @callback ErrorHandlerFn this function shall not throw an error
 * @param {SoilError} error error object
 * @param {Any} args any number of additional arguments passed to the calling function that failed
 */

/**
 * @callback GetTranslationFn
 * @param {Object} translations the translations object, first level keys are the language codes
 * 2nd level keys are the translation codes
 * @param {String} defaultLanguage the default language
 * @param {Config} config
 * @returns {TranslationFn}
 */

/**
 * @callback TranslationFn
 * @param {String} code the code of the translation we are looking for
 * @param {String} languageCode the language for the code we are looking for
 */

export const defaultConfig = {
	// logging
	isLogHandledErrors: true,
	errorLogFn: undefined, // console.error is default
	errorHandlerFn: (e) => {
		throw e;
	},
	// localization
	getTranslationFn: undefined,
	// security
	cryptoTokenLength: 256,
	getValidationFn: undefined, // required
};
