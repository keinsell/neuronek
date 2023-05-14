import * as ioTs from 'io-ts'

/** Username defines the shape and constraints of a username value object. */
export const Username = new ioTs.Type<string>(
	'Username',
	(input: unknown): input is string => {
		return typeof input === 'string' && input.length >= 4 && input.length <= 32
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
