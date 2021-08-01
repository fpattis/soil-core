import crypto from 'crypto';

const TOKEN_LENGTH = 256;

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
