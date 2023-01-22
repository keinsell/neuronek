import { Controller, Get, Route } from 'tsoa'

@Route('')
export class TestController extends Controller {
	@Get('/')
	get(): string {
		return 'TypeScript, Node.js, and Express'
	}
}
