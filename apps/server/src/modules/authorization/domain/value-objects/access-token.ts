import * as t from 'io-ts'

/**
 * @typedef {Object} AccessToken
 * @property {string} sub - Subject identifier of the token
 * @property {string} jti - Unique identifier of the token
 * @property {string} iss - Issuer of the token
 * @property {string} aud - Audience of the token
 * @property {number} exp - Expiration time of the token as a Unix timestamp
 */
export const AccessToken = t.type({
	sub: t.string,
	jti: t.string,
	iss: t.string,
	aud: t.string,
	exp: t.number
})

export type AccessToken = t.TypeOf<typeof AccessToken>
