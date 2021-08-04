
/** @typedef {import('../config').Config} Config */
/** @typedef {import('../config').TranslationFn} TranslationFn */

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
		const languageTranslations = translations[defaultLanguage];
		return languageTranslations?.[code]
        || translations[defaultLanguage]?.[languageCode];
	};
}