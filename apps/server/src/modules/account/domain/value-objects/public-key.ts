import * as ioTs from 'io-ts'

const validatePublicKey = (input: unknown, context: ioTs.Context): ioTs.Validation<string> => {
	if (typeof input !== 'string') {
		return ioTs.failure(input, context, 'Value must be a string')
	}

	const regex =
		/^-----BEGIN PGP PUBLIC KEY BLOCK-----\n(?:[a-zA-Z0-9+/\n]+)+={0,2}\n-----END PGP PUBLIC KEY BLOCK-----\n$/

	if (!regex.test(input)) {
		return ioTs.failure(input, context, 'Value is not a valid PGP public key')
	}

	return ioTs.success(input)
}

/**
 * `PublicKey` defines a value object that represents a PGP public key.
 */
export const PublicKey = new ioTs.Type<string>(
	'PublicKey',
	(input: unknown): input is string => {
		return typeof input === 'string' && validatePublicKey(input, [])._tag === 'Right'
	},
	validatePublicKey,
	ioTs.identity
)

export type PublicKey = ioTs.TypeOf<typeof PublicKey>