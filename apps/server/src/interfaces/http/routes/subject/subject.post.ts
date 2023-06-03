import { Body, Controller, OperationId, Post, Route, SuccessResponse, Tags } from 'tsoa'
import type {
	Subject,
}                                                                            from '../../../../modules/subject/subject.js'
import {
	createSubject,
}                                                                            from '../../../../modules/subject/subject.js'
import {
	Exception,
}                                                                            from '../../../../shared/@foundry/exceptions/exception.js'


// TODO: This should be refactored to use CQRS/Domain.
@Route('subject')
@Tags('Subject')
export class CreateSubjectController extends Controller {
	/**
	 * Creates an account.
	 */
	@Post()
	@OperationId('create-subject')
	@SuccessResponse('201', 'Created')
	public async createAccount(@Body() body: Subject): Promise<any> {
		try {
			await createSubject(body)

			//			const usecase = new CreateAccountUsecase(new IamQueryBus(), new IdentityAndAccessDomainBus())
			//
			//			const result = await usecase.execute(command)
			//
			//			if (result._tag === 'Right') {
			//				this.setStatus(201)
			//				return { id: result.right as string }
			//			} else {
			//				this.setStatus(result.left.statusCode)
			//				return { error: result.left.message }
			//			}
		} catch (error: unknown) {
			if (error instanceof Exception) {
				this.setStatus(error.statusCode)
				return { error: error.message }
			}

			this.setStatus(500)
			return { error: 'Failed to create account' }
		}
	}
}
