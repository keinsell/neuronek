import * as ioTs from 'io-ts'

// Business Rules

export const UsernameMinimalCharactersSpecification = (username: string): boolean => {
	const USERNAME_MINIMAL_CHARACTERS = 4
	return username.length >= USERNAME_MINIMAL_CHARACTERS
}

export const UsernameMaximalCharactersSpecification = (username: string): boolean => {
	const USERNAME_MINIMAL_CHARACTERS = 32
	return username.length >= USERNAME_MINIMAL_CHARACTERS
}

/** Username defines the shape and constraints of a username value object. */
export const Username = new ioTs.Type<string>(
	'Username',
	(input: unknown): input is string => {
		return (
			typeof input === 'string' &&
			UsernameMinimalCharactersSpecification(input) &&
			UsernameMaximalCharactersSpecification(input)
		)
	},
	(input, context) => {
		if (typeof input !== 'string') {
			return ioTs.failure(input, context, 'Value must be a string')
		}
		if (input.length < 4 || input.length > 32) {
			return ioTs.failure(input, context, 'Value must be between 4 and 32 characters long')
		}
		return ioTs.success(input)
	},
	ioTs.identity
)

export type Username = ioTs.TypeOf<typeof Username>

/** Create new Username value object */
export function createUsername(username: string): Username {
	// const validationResult = Username.decode(username)
	//
	// if (validationResult._tag === 'Left') {
	// 	// Handle validation error
	// 	throw new Error()
	// }

	return username as Username
}
