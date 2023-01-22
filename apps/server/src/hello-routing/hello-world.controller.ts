import { Get, Query, Route } from 'tsoa'
import { HelloWorldService } from './hello-world.service.js'
import { Service } from 'diod'

@Service()
@Route('hello-world')
export class HelloWorldController {
	constructor(private helloWorldService: HelloWorldService) {}

	@Get('/')
	get(@Query('id') id?: string): string {
		return this.helloWorldService.getMessage()
	}
}
