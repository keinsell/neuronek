import { getSubstanceFromPsychonautWiki } from './providers/psychonautwiki/get-substance/get-substance.js'
import { Substance } from './shared/substance/substance.js'

export class Osiris {
	async findSubstancesBy(filters: {
		effect?: string
		psychoactiveClass?: string
		chemicalClass?: string
		name?: string
	}): Promise<Substance[]> {
		// Find substance by PsychonautWiki
		if (filters.name) {
			const psychonautWikiSubstance = await getSubstanceFromPsychonautWiki(filters.name)
			if (psychonautWikiSubstance) {
				return [psychonautWikiSubstance]
			}
		}

		return []
	}

	async findSubstanceByName(substanceName: string): Promise<Substance | undefined> {
		// Find substance by PsychonautWiki
		const psychonautWikiSubstance = await getSubstanceFromPsychonautWiki(substanceName)
		return psychonautWikiSubstance
	}

	// async findSubstancesByRouteOfAdministrationClassification(roa: string): Promise<Substance[]> {}
}
