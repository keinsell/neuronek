import { IamEventBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.event-bus'
import { IamQueryBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.query-bus'
import { CreateAccount } from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import { CreateAccountUsecase } from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import { createPassword } from '../../../../modules/identity-and-access-mangement/domain/value-objects/password.js'
import { createUsername } from '../../../../modules/identity-and-access-mangement/domain/value-objects/username.js'
import { Request, Response } from 'express'

interface AccountData {
	username: string
	password: string
}

export async function createAccount(req: Request, res: Response) {
	try {
		const { username, password } = req.body as AccountData

		// Validate username and public key
		const errors = []

		if (!username) {
			errors.push('Username is required')
		}

		if (errors.length) {
			return res.status(400).json({ errors })
		}

		const command = new CreateAccount({
			username: await createUsername(username),
			password: await createPassword(password)
		})

		const usecase = new CreateAccountUsecase(new IamQueryBus(), new IamEventBus())

		const result = await usecase.execute(command)

		if (result._tag === 'Right') {
			return res.status(201).json({ id: result.right })
		} else {
			return res.status(result.left.statusCode).json({ message: result.left.message })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Failed to create account' })
	}
}
