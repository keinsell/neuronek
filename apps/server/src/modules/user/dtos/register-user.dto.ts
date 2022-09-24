export interface RegisterUserDTO {
	/**
	 * The user's first name
	 * @example "John"
	 */
	firstName?: string;
	/**
	 * The user's last name
	 * @example "Doe"
	 * @maxLength 50
	 * @minLength 1
	 * @pattern ^[a-zA-Z0-9_]*$
	 * @nullable
	 */
	lastName?: string;
	/** Email of user */
	email?: string;
	password: any;
	username: string;
	dateOfBirth?: Date;
	height?: number;
	weight?: number;
}
