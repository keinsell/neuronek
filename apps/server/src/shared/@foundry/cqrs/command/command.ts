import { Message, MessagePayload } from '../../messaging/message.js'



export abstract class Command<PAYLOAD, RESPONSE = unknown>
	extends Message<PAYLOAD> {
	public readonly _response : RESPONSE
	
	constructor(properties : MessagePayload<PAYLOAD>) {
		super( properties )
		Object.assign( this, properties )
	}
}
