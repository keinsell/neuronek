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

export const PublicKey = new ioTs.Type<string>(
	'PgpPublicKey',
	(input: unknown): input is string => validatePublicKey(input, {}),
	validatePublicKey,
	ioTs.identity
)

export type PublicKey = ioTs.TypeOf<typeof PublicKey>
