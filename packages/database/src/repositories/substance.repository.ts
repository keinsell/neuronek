import { Prisma, PrismaClient, Substance as _Substance } from '@prisma/client'
import { ChemicalNomenclature, Substance } from 'osiris'

export namespace SubstanceMapper {
	export type CreateSubstanceRecord = Prisma.SubstanceCreateInput
	export type CreateRouteOfAdministrationRecord = Prisma.RouteOfAdministrationCreateInput

	export function fromSubstance(substance: Substance): CreateSubstanceRecord {
		return {
			name: substance.name,
			common_names: substance?.nomenclature?.common_names || [],
			substitutive_name: substance?.nomenclature?.substitutive_name
		}
	}

	export function toSubstance(substance: _Substance) {
		return Substance.create({
			name: substance.name,
			nomenclature: ChemicalNomenclature.create({
				common_names: substance.common_names || [],
				substitutive_name: substance.substitutive_name
			})
		})
	}
}

export class RouteOfAdministrationRepository {
	constructor(connector: any) {}
}

export class SubstanceRepository {
	constructor(private connector: PrismaClient) {}

	async findByName(name: string) {
		const substance = await this.connector.substance.findFirst({
			where: {
				name: name
			}
		})

		if (!substance) {
			return null
		}

		return SubstanceMapper.toSubstance(substance)
	}

	async save(substance: Substance) {
		const isSubstance = await this.findByName(substance.name)

		if (isSubstance) {
			// Update substance

			const updatedSubstance = await this.connector.substance.update({
				where: {
					name: substance.name
				},
				data: SubstanceMapper.fromSubstance(substance)
			})

			return SubstanceMapper.toSubstance(updatedSubstance)
		}

		const createdSubstance = await this.connector.substance.create({
			data: SubstanceMapper.fromSubstance(substance)
		})

		return SubstanceMapper.toSubstance(createdSubstance)
	}
}
