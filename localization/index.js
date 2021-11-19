
/** @typedef {import('../config').Config} Config */
/** @typedef {import('../config').TranslationFn} TranslationFn */

export default {
	getTranslationFn,
};

/**
 * returns the translation function
 * @param {Objects} translations
 * @param {String} defaultLanguage
 * @param {Config} config
 * @return {TranslationFn}
 */
export async function getTranslationFn(translations, defaultLanguage, config = undefined) {
	if (config?.getTranslationFn) {
		return config.getTranslationFn(translations, defaultLanguage, config);
	}
	return async function translate(code, languageCode) {
		return translations[languageCode]?.[code]
			|| translations[defaultLanguage]?.[code]
			|| code;
	};
}
