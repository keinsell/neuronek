import argon2             from 'argon2'
import { Static, String } from 'runtypes'
import { Password }       from './password.js'



const PasswordHash = String.withBrand('PasswordHash')
type PasswordHash = Static<typeof PasswordHash>

export async function createPasswordHash(password: string): Promise<PasswordHash> {
	return password as PasswordHash
}

export async function hashPassword(password: string): Promise<PasswordHash> {
	try {
		const hashedPassword = await argon2.hash(password)
		return hashedPassword as PasswordHash
	} catch (error) {
		throw new Error('Error creating password hash')
	}
}

/**
 *
 * @param hash
 * @param password
 */
export async function comparePasswordHash(hash: PasswordHash, password: Password): Promise<boolean> {
	try {
		return await argon2.verify(hash, password)
	} catch {
		// Handle comparison error
		throw new Error('Error comparing password hash')
	}
}

export { PasswordHash }
