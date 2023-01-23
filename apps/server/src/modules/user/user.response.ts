export interface UserResponse {
	/**
	 * The generated user ID.
	 *
	 * @example 'd3d6c3f3-b03a-4780-9d56-2a8a8e93e0cb'
	 */
	id: string
	/**
	 * The user's username.
	 *
	 * @example 'john'
	 */
	username: string
	/**
	 * The user's JWT token.
	 * @example 'ads'
	 * @pattern 'Bearer'
	 */
	jwt_token?: string
}
