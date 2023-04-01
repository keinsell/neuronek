import * as t from 'io-ts'

export const PublicKey = new t.Type<string>(
	'PgpPublicKey',
	(input: unknown): input is string => {
		if (typeof input !== 'string') {
			return false
		}

		// Regular expression to match a PGP public key
		const regex =
			/^-----BEGIN PGP PUBLIC KEY BLOCK-----\n(?:[a-zA-Z0-9+/\n]+)+={0,2}\n-----END PGP PUBLIC KEY BLOCK-----\n$/

		return regex.test(input)
	},
	(input, context) => {
		if (typeof input !== 'string') {
			return t.failure(input, context, 'Value must be a string')
		}

		// Regular expression to match a PGP public key
		const regex =
			/^-----BEGIN PGP PUBLIC KEY BLOCK-----\n(?:[a-zA-Z0-9+/\n]+)+={0,2}\n-----END PGP PUBLIC KEY BLOCK-----\n$/

		if (!regex.test(input)) {
			return t.failure(input, context, 'Value is not a valid PGP public key')
		}

		return t.success(input)
	},
	t.identity
)

export type PublicKey = t.TypeOf<typeof PublicKey>
