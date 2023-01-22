import { Service } from 'diod'

@Service()
export class HelloWorldService {
	private message = 'Hello, World'

	getMessage(): string {
		return this.message
	}
}
