/* eslint-disable jsdoc/require-property */
/* eslint-disable jsdoc/check-tag-names */
/**
 * RequestBody used to register a new user
 *
 * @typedef {object} RegisterUserDTO
 * @requestBody RegisterUserDTO
 */
export interface RegisterUserDTO {
	/**
	 * The user's first name
	 *
	 * @example "John"
	 * @maxLength 50
	 * @minLength 1
	 * @pattern ^[a-zA-Z0-9_]*$
	 * @nullable
	 */
	firstName?: string;
	/**
	 * The user's last name
	 *
	 * @example "Doe"
	 * @maxLength 50
	 * @minLength 1
	 * @pattern ^[a-zA-Z0-9_]*$
	 * @nullable
	 */
	lastName?: string;
	/**
	 * The user's email
	 *
	 * @example "john.doe@example.com"
	 * @nullable
	 * @isEmail
	 * @pattern (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])
	 */
	email?: string;
	/**
	 * The user's password
	 *
	 * @example "superDuperStrongPassword"
	 * @maxLength 64
	 * @minLength 6
	 */
	password: any;
	/**
	 * The user's useranme.
	 *
	 * @example "johndoe"
	 * @maxLength 32
	 * @minLength 1
	 */
	username: string;
	/**
	 * The user's date of birth
	 *
	 * @example "2000-10-12"
	 * @nullable
	 * @isDate
	 */
	dateOfBirth?: Date;
	/**
	 * The user's height in centimeters
	 *
	 * @example 182
	 * @nullable
	 * @minimum 0
	 * @maximum 300
	 * @isInt
	 * @multipleOf 1
	 * @type integer
	 * @format int32
	 */
	height?: number;
	/**
	 * The user's weight in kilograms
	 *
	 * @example 65
	 * @nullable
	 * @minimum 0
	 * @maximum 300
	 * @isInt
	 * @multipleOf 1
	 * @type integer
	 * @format int32
	 */
	weight?: number;
}
