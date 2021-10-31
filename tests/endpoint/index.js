import tape from 'tape';

import {protect, wrap} from '../../endpoint/index.js';
import {getTestConfig} from '../testConfig.js';

/**
 * @typedef { import("../config").Config } Config
 * @typedef { import("../../models/user").User } User
 */

const validationSchema = {
	name: {
		type: 'string',
	},
	age: {
		type: 'number',
	},
};

const testInputData = {
	name: 'joggl',
	age: 142,
	additionalProperty: 'someValue',
};

const expectedResult = {
	name: 'joggl',
	age: 142,
	previousLifeAge: 188,
};

const config = getTestConfig();

tape('endpoint - testing wrap function', async (t) => {
	const endpointWrapper = await wrap(
		async (validatedData) => {
			validatedData.previousLifeAge = 188;
			return validatedData;
		},
		validationSchema,
		config,
	);
	const validatedData = await endpointWrapper(testInputData);
	t.deepEqual(validatedData, expectedResult);
});

tape('endpoint - test error handler', async (t) => {
	t.plan(2);
	config.errorHandlerFn = (error) => {
		t.true(error);
		return error;
	};
	const testError = new Error('ey'); ;
	const endpointWrapperThrowError = await wrap(
		async (validatedData) => {
			throw testError;
		},
		validationSchema,
		config,
	);
	const error = await endpointWrapperThrowError({});
	t.equals(error, testError);
});

tape('endpoint - testing protect function', async (t) => {
	/** @type {User} */
	const user = {
		ID: 1,
		groups: ['developer'],
	};
	const token = await config.createTokenFn(user);
	const endpointWrapper = await protect(
		async (validatedData) => {
			validatedData.previousLifeAge = 188;
			return validatedData;
		},
		validationSchema,
		['developer'],
		config,
	);
	const validatedData = await endpointWrapper(testInputData, token);
	t.deepEqual(validatedData, expectedResult);
});

tape('endpoint - testing protect function, wrong role', async (t) => {
	/** @type {User} */
	const user = {
		ID: 1,
		groups: ['admin'],
	};
	const token = await config.createTokenFn(user);
	config.errorHandlerFn = (error) => {
		throw error;
	};
	const endpointWrapper = await protect(
		async (validatedData) => {
			t.true(false, 'this code (business logic) should not be called, instead an error should be thrown');
		},
		validationSchema,
		['developer'],
		config,
	);
	try {
		await endpointWrapper(testInputData, token);
		t.true(false, 'this code should not be called, instead an error should be thrown');
	} catch (e) {
		t.equal(e.code, 'UNAUTHORIZED');
		t.true(e.message.startsWith('authorization'));
	}
});

tape('endpoint - testing protect function, wrong token', async (t) => {
	/** @type {User} */
	const user = {
		ID: 1,
		groups: ['admin'],
	};
	await config.createTokenFn(user);
	config.errorHandlerFn = (error) => {
		throw error;
	};
	const endpointWrapper = await protect(
		async (validatedData) => {
			t.true(false, 'this code (business logic) should not be called, instead an error should be thrown');
		},
		validationSchema,
		['developer'],
		config,
	);
	try {
		await endpointWrapper(testInputData, 'blobobobobo');
		t.true(false, 'this code should not be called, instead an error should be thrown');
	} catch (e) {
		t.equal(e.code, 'UNAUTHORIZED');
		t.true(e.message.startsWith('authentication'));
	}
});

tape('endpoint - testing protect function, no token', async (t) => {
	/** @type {User} */
	const user = {
		ID: 1,
		groups: ['admin'],
	};
	await config.createTokenFn(user);
	config.errorHandlerFn = (error) => {
		throw error;
	};
	const endpointWrapper = await protect(
		async (validatedData) => {
			t.true(false, 'this code (business logic) should not be called, instead an error should be thrown');
		},
		validationSchema,
		['developer'],
		config,
	);
	try {
		await endpointWrapper(testInputData);
		t.true(false, 'this code should not be called, instead an error should be thrown');
	} catch (e) {
		t.equal(e.code, 'UNAUTHORIZED');
		t.true(e.message.startsWith('authentication'));
	}
});
