import * as crypto from './crypto';

async function authenticate(token, config = undefined) {

}

async function createToken(user, config = undefined) {
	const token = await crypto.token();
}
