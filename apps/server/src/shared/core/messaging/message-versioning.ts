interface MessageVersioning {
	getVersion(messageType: string): number

	setVersion(messageType: string, version: number): void
}
