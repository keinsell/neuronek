import { NotImplemented } from '../../../../shared/@foundry/exceptions/not-implemented.js'
import { hashPassword as createHashedPassword, PasswordHash } from './password-hash.js'
import { Static, String } from 'runtypes'

/** asdsadffasd */
const Password = String.withBrand('Password')

type Password = Static<typeof Password>

/**
 *
 * @param password
 */
async function hashPassword(password: Password): Promise<PasswordHash> {
	try {
		return createHashedPassword(password)
	} catch {
		throw new Error('Error hashing password')
	}
}

/**
 * Creates a password hash using Argon2.
 *
 * @param password The password to hash.
 * @returns A Promise resolving to the hashed password.
 * @throws Error if there's an error hashing the password.
 */
export async function createPassword(password: string): Promise<Password> {
	try {
		return password as Password
	} catch {
		// TODO: Throw error when validation fails
		throw new NotImplemented('Password Validation')
	}
}

export { Password, hashPassword }
