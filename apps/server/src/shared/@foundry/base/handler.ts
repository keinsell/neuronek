export interface Handler<REQUEST = unknown, RESPONSE = unknown> {
	handle(message : REQUEST) : RESPONSE | Promise<RESPONSE>
}
