export interface LoginUserRequest {
	/**
	 * The user's username.
	 * @example 'john'
	 * @minLength 3
	 * @maxLength 32
	 * @pattern ^[a-zA-Z0-9-_]+$
	 * @patternMessage Can only contain the characters A-Z, a-z, 0-9, -, and _
	 */
	username: string
	/**
	 * Password
	 * @example 'password123'
	 */
	password: string
}
