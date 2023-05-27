import { Command } from '~foundry/cqrs'

interface DeleteAccountProperties {
	accountId: string
}

export class DeleteAccount extends Command implements DeleteAccountProperties {
	public accountId: string

	constructor(payload: DeleteAccountProperties) {
		super()
		Object.assign(this, payload)
	}
}
