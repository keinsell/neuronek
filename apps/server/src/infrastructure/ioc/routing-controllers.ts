import diod from 'diod'
import { IocAdapter } from 'routing-controllers'

export class DiodAdapter implements IocAdapter {
	constructor(private container: diod.Container) {}

	get<T>(serviceIdentifier: any): T {
		return this.container.get(serviceIdentifier)
	}
}
