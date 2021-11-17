import tape from 'tape';
import crypto from '../../security/crypto.js';
import sodium from 'libsodium-wrappers';

tape('password hashing', async (t) => {
	await sodium.ready;
	const config = {
		passwordCheckMemoryLimitBytes: sodium.crypto_pwhash_MEMLIMIT_MIN,
		passwordCheckOperationsLimit: sodium.crypto_pwhash_OPSLIMIT_MIN,
		passwordHashWorkerAmountMinimum: 1,
		passwordHashWorkerAmountMaximum: 1,
	};
	await crypto.setup(config);
	const hash = await crypto.hashPassword('test');
	t.true(await crypto.isPasswordCorrect('test', hash));
	t.false(await crypto.isPasswordCorrect('test1', hash));
	await crypto.shutdown();
});
