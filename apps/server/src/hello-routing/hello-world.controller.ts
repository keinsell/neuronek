import { Get, JsonController, QueryParam } from 'routing-controllers'
import { HelloWorldService } from './hello-world.service.js'
import * as openapi from 'tsoa'
import { Service } from 'diod'

@Service()
@openapi.Route('')
@JsonController()
export class HelloWorldController {
	constructor(private helloWorldService: HelloWorldService) {}

	@openapi.Get('/')
	@Get('/')
	get(@openapi.Query('id') @QueryParam('id') id?: string): string {
		return this.helloWorldService.getMessage()
	}
}
