import * as express from 'express'
import * as jwt from 'jsonwebtoken'

export async function expressAuthentication(
	request: express.Request,
	securityName: string,
	scopes?: string[]
): Promise<null> {
	return null
}
