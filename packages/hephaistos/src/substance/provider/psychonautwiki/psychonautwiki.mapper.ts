import {
	ChemicalNomenclature,
	DosageTable,
	PhaseTable,
	PsychoactiveClassification,
	RouteOfAdministration,
	RouteOfAdministrationClassification,
	Substance
} from 'osiris'

import {
	AllSubstancesQuery,
	Substance as PsychonautWikiSubstance,
	SubstanceRoa,
	SubstanceRoaRange
} from './gql/sdk/graphql.js'

export class PsychonautWikiMapper {
	// TODO: Map and return
	private extractPsychoactiveClass(input: PsychonautWikiSubstance): PsychoactiveClassification[] {
		const classifications: PsychoactiveClassification[] = []
		return classifications
	}

	private extractChemicalNomenclature(input: PsychonautWikiSubstance): ChemicalNomenclature {
		const common_names = input.commonNames ?? []

		return ChemicalNomenclature.create({
			common_names: common_names
		})
	}

	private extractDosageTableFromSubstanceRoa(input: SubstanceRoa): DosageTable {
		const dose = input.dose

		// If there's no dosage information return empty dosage table
		if (!dose) {
			return DosageTable.create({})
		}

		// Otherwise, extract information from dose
		const { threshold, light, common, strong, heavy, units } = dose

		const buildTupleFromSubstanceRoaRange = (input: SubstanceRoaRange): [number, number] => {
			return [input.min, input.max]
		}

		return DosageTable.create({
			unit: units,
			isWeightBased: false,
			thereshold: threshold,
			kind: 'mass',
			light: buildTupleFromSubstanceRoaRange(light),
			moderate: buildTupleFromSubstanceRoaRange(common),
			strong: buildTupleFromSubstanceRoaRange(strong),
			heavy: heavy
		})
	}

	private extractPhaseTableFromSubstanceRoa(input: SubstanceRoa): PhaseTable {}

	private extractRoutesOfAdministration(input: PsychonautWikiSubstance): RouteOfAdministration[] {
		const routesOfAdministration: RouteOfAdministration[] = []
		const psychonautWikiRoutesOfAdministration = input.roas

		if (!psychonautWikiRoutesOfAdministration) {
			return routesOfAdministration
		}

		for (const r of psychonautWikiRoutesOfAdministration) {
			const classification: RouteOfAdministrationClassification = r.name as RouteOfAdministrationClassification

			// If psychonautwiki doesn't contain classification or classification doesn't exist in our enum, ignore this route of administration
			if (!classification || !Object.values(RouteOfAdministrationClassification).includes(classification)) {
				continue
			}

			// Extract dosage table from PsychonautWiki
			// const dosage_table: DosageTable = this.extractDosageTableFromSubstanceRoa(r)
			// const phase_talbe: PhaseTable = this.extractPhaseTableFromSubstanceRoa(r)
			// const bioavailability: Bioavailability = undefined

			// const routeOfAdministration = RouteOfAdministration.create({
			// 	classification,
			// 	dosage_table,
			// 	phase_talbe,
			// 	belongs_to: {
			// 		substanceName: input.name
			// 	}
			// })

			// routesOfAdministration.push(routeOfAdministration)
		}

		return routesOfAdministration
	}

	public Substance__Substance(input: PsychonautWikiSubstance): Substance {
		const chemical_nomenclature = this.extractChemicalNomenclature(input)
		const available_roas = this.extractRoutesOfAdministration(input)

		// const routes_of_administration = RouteOfAdministrationTable.fromMultipleRoutesOfAdministration(available_roas)

		return Substance.create({
			name: input.name,
			nomenclature: chemical_nomenclature
			// routes_of_administration
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
