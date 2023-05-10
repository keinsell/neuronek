import { DomainEvent } from '../../../../shared/core/domain/domain-event'

export class AccountCreated extends DomainEvent {
	public eventName(): string {
		return 'account.created'
	}
}
