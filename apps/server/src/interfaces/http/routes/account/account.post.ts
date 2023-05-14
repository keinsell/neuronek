import { Request, Response } from 'express'
import { IamEventBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.event-bus'
import { IamQueryBus } from '../../../../modules/identity-and-access-mangement/application/bus/iam.query-bus'
import { CreateAccount } from '../../../../modules/identity-and-access-mangement/application/commands/create-account/create-account'
import { CreateAccountUsecase } from '../../../../modules/identity-and-access-mangement/application/usecases/create-account-usecase'
import { PrettyGoodPrivacy } from '../../../../shared/common/pretty-good-privacy'

interface AccountData {
	username: string
	publicKey: string
}

export async function createAccount(req: Request, res: Response) {
	try {
		const { username, publicKey } = req.body as AccountData

		// Validate username and public key
		const errors = []

		if (!username) {
			errors.push('Username is required')
		}

		if (!publicKey) {
			errors.push('Public key is required')
		} else if (!(await PrettyGoodPrivacy.validatePublicKey(publicKey))) {
			errors.push('Invalid public key')
		}

		if (errors.length) {
			return res.status(400).json({ errors })
		}

		const command = new CreateAccount({ username, publicKey })
		const usecase = new CreateAccountUsecase(new IamQueryBus(), new IamEventBus())

		const result = await usecase.execute(command)

		if (result._tag === 'Right') {
			return res.status(201).json({ id: result.right })
		} else {
			return res.status(400).json({ errors: [result.left] })
		}
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: 'Failed to create account' })
	}
}
