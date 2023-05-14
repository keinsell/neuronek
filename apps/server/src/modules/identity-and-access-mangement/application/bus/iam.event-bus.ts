import { EventBinding } from '../../../../shared/core/cqrs/event/event-binding'
import { EventBus } from '../../../../shared/core/cqrs/event/event-bus'
import { SimpleEvent } from '../../../../shared/core/cqrs/event/simple-event'
import { AccountCreated } from '../../domain/events/account-created/account-created'
import { AccountCreatedHandler } from '../../domain/events/account-created/account-created-handler'

export class IamEventBus extends EventBus {
	bindings: EventBinding[] = [
		{
			handler: new AccountCreatedHandler(),
			event: AccountCreated
		}
	]

	public async send(event: SimpleEvent<unknown>): Promise<void> {
		console.log(`Sending event: ${JSON.stringify(event)}`)
		const binding = this.bindings.find(b => b.event.name === event.constructor.name)

		if (binding) {
			await binding.handler.handle(event)
		} else {
			throw new Error(`No binding found for event "${event.name}"`)
		}
	}
}