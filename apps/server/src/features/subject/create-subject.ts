import { Controller } from '../../shared/core/framework/http/controller'
import { Response } from '../../shared/core/framework/http/response'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export class CreateSubject extends Controller {
	protected async executeImpl(): Promise<Response> {
		const accountId = ''

		const subject = await prisma.subject.create({
			data: {}
		})

		return this.todo()
	}
}
