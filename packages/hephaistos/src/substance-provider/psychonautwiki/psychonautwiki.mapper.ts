import { ChemicalNomenclature, RouteOfAdministration, Substance } from 'osiris'

import { AllSubstancesQuery, Substance as PsychonautWikiSubstance } from './gql/sdk/graphql.js'

export class PsychonautWikiMapper {
	private extractChemicalNomenclature(input: PsychonautWikiSubstance): ChemicalNomenclature {
		return new ChemicalNomenclature({
			common_names: input.commonNames ?? []
		})
	}

	private extractRoutesOfAdministration(input: PsychonautWikiSubstance): RouteOfAdministration[] {
		return []
	}

	public Substance__Substance(input: PsychonautWikiSubstance): Substance {
		const chemical_nomenclature = this.extractChemicalNomenclature(input)

		return new Substance({
			name: input.name,
			nomenclature: chemical_nomenclature
		})
	}

	public AllSubstancesQuery__Substances(input: AllSubstancesQuery): Substance[] {
		const substances: Substance[] = []

		for (const s of input.substances) {
			substances.push(this.Substance__Substance(s))
		}

		return substances
	}
}
