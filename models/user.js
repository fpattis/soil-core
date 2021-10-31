/**
 * @typedef User
 * @property {Any} ID should implement toString()
 * @property {Array<String>} groups the groups the user is part of, used for authorization
 */

/**
 * returns a random data filled user
 * @return {User}
 */
export async function getMock({groups}) {
	return {
		ID: Math.random(),
		groups: groups || ['group1', 'group2'],
	};
}
