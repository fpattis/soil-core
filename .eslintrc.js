module.exports = {
	'env': {
		'commonjs': true,
		'es2021': true,
		'node': true,
	},
	'extends': [
		'google',
	],
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module',
	},
	'rules': {
		'indent': ['error', 'tab'],
		'no-tabs': 0,
	},
};
