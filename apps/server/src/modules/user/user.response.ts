export interface UserResponse {
	/**
	 * The generated user ID.
	 *
	 * @example 'cldcsw3en0000pmpoisyxum63'
	 */
	id: string
	/**
	 * The user's username.
	 *
	 * @example 'john'
	 */
	username: string
	/**
	 * A JSON Web Token that can be used for authentication and authorization.
	 * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
	 * @pattern 'Bearer'
	 */
	jwt_token?: string
	/**
	 * A unix timestamp indicating when the JWT expires.
	 * @example 1601501319
	 * @minimum 0
	 * @type integer
	 */
	expires_in?: number
	/**
	 * A refresh token that can be sent to the /user/refresh endpoint to get a new JWT.'
	 * @pattern 'Bearer'
	 * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
	 */
	refresh_token?: string
}
