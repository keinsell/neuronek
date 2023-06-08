import { UseCase } from '~foundry/domain/use-case'
import { InvalidValue } from '~foundry/exceptions/invalid-value'
import { Subject } from '@prisma/client'
import { Result, right } from '~foundry/technical/result'
import { prisma } from '../../../../shared/infrastructure/prisma/prisma'

export interface CreateSubjectPayload {
	accountId?: string
	displayName?: string
	firstName?: string
	lastName?: string
	birthDate?: Date
	weight?: number
	height?: number
	nationality?: string
}

export class CreateSubjectUseCase extends UseCase<CreateSubjectPayload, Subject, InvalidValue> {
	async execute(request: CreateSubjectPayload): Promise<Result<InvalidValue, Subject>> {
		const subject = await prisma.subject.create({
			data: {
				account: {
					connect: {
						id: request.accountId
					}
				},
				firstName: request.firstName,
				lastName: request.lastName,
				weight: request.weight,
				height: request.height
			}
		})

		return right(subject)
	}
}
