/**
 * @typedef User
 * @property {Any} ID should implement toString()
 * @property {Array<String>} groups the groups the user is part of, used for authorization
 * @property {Number | undefined} sessionStart Date.now() timestamp when user token is created
 * @property {String | undefined} token authentication token
 */

/**
 * returns a random data filled user
 * @return {User}
 */
export async function getMock({groups, sessionStart}) {
	return {
		ID: Math.random(),
		groups: groups || ['group1', 'group2'],
		sessionStart: sessionStart || undefined,
	};
}
