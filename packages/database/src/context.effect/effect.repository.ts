import { Effect as PersistenceEffect, Prisma, PrismaClient } from '@prisma/client'
import { Effect, EffectCategory, EffectTag, EffectType } from 'osiris'
import { BarePrismaRepositoryOfOsirisModel } from '../shared.core/prisma.repsitory.js'

export class EffectRepository
	implements BarePrismaRepositoryOfOsirisModel<Effect, Prisma.EffectCreateInput, PersistenceEffect>
{
	public prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation,
		{ result: {}; model: {}; query: {}; client: {} }
	>

	toDomain(storageModel: {
		id: string
		name: string
		slug: string
		category: string
		type: string
		tags: string[]
		summary: string
		description: string[]
		parameters: string[]
		see_also: string[]
		effectindex: string
		psychonautwiki: string
	}): Effect {
		return Effect.create(
			{
				name: storageModel.name,
				slug: storageModel.slug,
				category: EffectCategory[storageModel.category as keyof typeof EffectCategory],
				type: EffectType[storageModel.type as keyof typeof EffectType],
				tags: storageModel.tags.map(tag => EffectTag[tag as keyof typeof EffectTag]),
				summary: storageModel.summary,
				description: storageModel.description,
				psychonautwiki: storageModel.psychonautwiki,
				effectindex: storageModel.effectindex
			},
			storageModel.id
		)
	}

	toStorage(domainModel: Effect): Prisma.EffectCreateInput {
		return {
			name: domainModel.name,
			slug: domainModel.slug,
			category: domainModel.category,
			type: domainModel.type,
			tags: domainModel.tags,
			summary: domainModel.summary,
			description: domainModel.description,
			psychonautwiki: domainModel.psychonautwiki,
			effectindex: domainModel.effectindex
		}
	}

	async findById(id: any): Promise<Effect> {
		return this.toDomain(await this.prisma.effect.findUnique({ where: { id } }))
	}

	async exists(domainModel: Effect): Promise<boolean> {
		return !!(await this.prisma.effect.findUnique({ where: { id: domainModel.id } }))
	}

	async save(domainModel: Effect): Promise<Effect> {
		// Find Unqiue effect with slug
		const effect = await this.prisma.effect.findUnique({ where: { slug: domainModel.slug } })

		if (effect) {
			return this.toDomain(
				await this.prisma.effect.update({ where: { id: effect.id }, data: this.toStorage(domainModel) })
			)
		} else {
			return this.toDomain(await this.prisma.effect.create({ data: this.toStorage(domainModel) }))
		}
	}

	async all(): Promise<Effect[]> {
		return (await this.prisma.effect.findMany()).map(this.toDomain)
	}
}
