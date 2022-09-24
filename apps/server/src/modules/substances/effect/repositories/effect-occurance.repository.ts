import { Prisma } from "@prisma/client";
import { Repository } from "../../../../common/repository/repository.common";
import { PrismaInstance } from "../../../../infrastructure/prisma.infra";
import { EffectOccurance } from "../entities/effect-occurance.entity";
import { EffectOccuranceMapper } from "../mappers/effect-occurance.mapper";

export class EffectOccuranceRepository extends Repository<EffectOccurance> {
	override db = PrismaInstance.occuranceOfEffect;

	protected effectOccuranceRelations: Prisma.OccuranceOfEffectInclude = {
		Effect: true,
		Substance: {
			include: {
				routesOfAdministraton: true,
			},
		},
	};

	async findEffectOccuranceByAllFields(
		entity: EffectOccurance,
	): Promise<EffectOccurance | undefined> {
		const foundOccuranceOfEffect = await this.db.findFirst({
			where: {
				...new EffectOccuranceMapper().dynamicWhereQuery(entity),
			},
			include: {
				Effect: true,
				Substance: {
					include: {
						routesOfAdministraton: true,
					},
				},
			},
		});

		if (!foundOccuranceOfEffect) {
			return undefined;
		}

		return new EffectOccuranceMapper().toDomain(foundOccuranceOfEffect as any);
	}

	async exists(entity: EffectOccurance): Promise<boolean> {
		const foundOccuranceOfEffect = await this.findEffectOccuranceByAllFields(
			entity,
		);

		return !!foundOccuranceOfEffect;
	}

	async save(entity: EffectOccurance): Promise<EffectOccurance> {
		const exists = await this.exists(entity);

		let createdOrUpdatedEffectOccurance: EffectOccurance;

		if (exists) {
			const effectToBeUpdated = await this.findEffectOccuranceByAllFields(
				entity,
			);

			if (!effectToBeUpdated) {
				throw new Error("EffectOccurance not found");
			}

			const updatedEffectOccurance = await this.db.update({
				where: {
					id: String(effectToBeUpdated.id),
				},
				data: new EffectOccuranceMapper().toPersistence(entity),
				include: {
					Effect: true,
					Substance: {
						include: {
							routesOfAdministraton: true,
						},
					},
				},
			});

			createdOrUpdatedEffectOccurance = new EffectOccuranceMapper().toDomain(
				updatedEffectOccurance as any,
			);
		} else {
			const createdEffectOccurance = await this.db.create({
				data: new EffectOccuranceMapper().toPersistence(entity),
				include: {
					Effect: true,
					Substance: {
						include: {
							routesOfAdministraton: true,
						},
					},
				},
			});

			createdOrUpdatedEffectOccurance = new EffectOccuranceMapper().toDomain(
				createdEffectOccurance as any,
			);
		}

		return createdOrUpdatedEffectOccurance;
	}

	delete(entity: EffectOccurance): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
