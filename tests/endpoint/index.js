import tape from 'tape';

import {protect, wrap} from '../../endpoint/index.js';
import {getTestConfig} from '../testConfig.js';

const validationSchema = {
	name: {
		type: 'string',
	},
	age: {
		type: 'number',
	},
};
const config = getTestConfig();

tape('endpoint - testing wrap function', async (t) => {
	const testInputData = {
		name: 'joggl',
		age: 142,
		additionalProperty: 'someValue',
	};

	const expectedResult = {
		name: 'joggl',
		age: 142,
	};

	const endpointWrapper = await wrap(
		async (validatedData) => {
			return validatedData;
		},
		validationSchema,
		config,
	);
	const validatedData = await endpointWrapper(testInputData);
	t.deepEqual(validatedData, expectedResult);
});

tape('endpoint - testing protect function', (t) => {
	t.end();
});
