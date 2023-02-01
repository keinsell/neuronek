import ms from 'ms'
import {
	Bioavailability,
	ChemicalNomenclature,
	Dosage,
	DosageTable,
	Effect,
	Phase,
	PhaseTable,
	PsychoactiveClassification,
	RouteOfAdministration,
	RouteOfAdministrationClassification,
	RouteOfAdministrationTable,
	Substance,
	Tolerance
} from 'osiris'
import { PartialDeep, Writable } from 'type-fest'

import { GetSubstancesQuery, SubstanceRoa, SubstanceRoaDose } from './gql/sdk/graphql.js'

export namespace PsychonautwikiMapper {
	function psychoactiveClassification(input: string): PsychoactiveClassification {
		switch (input) {
			case 'Psychedelics':
				return PsychoactiveClassification.psychedelic
			case 'Dissociatives':
				return PsychoactiveClassification.dissociative
			case 'Stimulants':
				return PsychoactiveClassification.stimulant
			case 'Depressants':
				return PsychoactiveClassification.depressant
			case 'Deliriant':
				return PsychoactiveClassification.deliriant
			case 'Entheogens':
				return PsychoactiveClassification.entheogen
			case 'Entactogens':
				return PsychoactiveClassification.empathogen
			case 'Nootropic':
				return PsychoactiveClassification.nootropic
			default:
				return undefined
		}
	}

	function psychoactiveClass(input: string | string[] | null): PsychoactiveClassification[] {
		if (!input) {
			return []
		}
		const result: PsychoactiveClassification[] = []

		if (input instanceof Array) {
			for (const i of input) {
				const c = psychoactiveClassification(i)
				if (c) {
					result.push(c)
				}
			}
		} else {
			const c = psychoactiveClassification(input)
			if (c) {
				result.push(c)
			}
		}

		return result
	}

	function parseDosage(input: SubstanceRoaDose): DosageTable | undefined {
		let responseUnits = input.units

		const dosageTableConstructor: Partial<Writable<DosageTable>> = {}

		if (!input.units) {
			return undefined
		}

		// Custom fix fo body weight
		if (responseUnits === 'mg/kg of body weight') {
			responseUnits = 'mg'
			dosageTableConstructor.isWeightBased = true
		}

		// Custom fix for weed (THC)
		if (responseUnits === 'mg (THC)') {
			responseUnits = 'mg'
		}

		// Custom fix for alcohol
		if (responseUnits === 'mL EtOH') {
			responseUnits = 'ml'
		}

		// TODO: Custom fix for LSA
		if (responseUnits === 'seeds') {
			responseUnits = 'seeds'
		}

		// Find baseScalar unit from given units
		const baseScalarUnits = Dosage.fromString(`1 ${responseUnits}`).toBase().units()
		const kindOfUnit = Dosage.fromString(`1 ${responseUnits}`).toBase().kind()

		// Add units
		dosageTableConstructor.unit = baseScalarUnits
		dosageTableConstructor.kind = kindOfUnit as 'mass' | 'volume' | 'custom'

		// Parse thereshold dosage
		if (input.threshold) {
			dosageTableConstructor.thereshold = new Dosage(input.threshold, responseUnits).baseScalar
		}

		// Parse light dosage
		if (input.light) {
			const min = new Dosage(input.light.min, responseUnits).baseScalar
			const max = new Dosage(input.light.max, responseUnits).baseScalar

			dosageTableConstructor.light = [min, max]
		}

		// Parse standard dosage
		if (input.common) {
			const min = new Dosage(input.common.min, responseUnits).baseScalar
			const max = new Dosage(input.common.max, responseUnits).baseScalar

			dosageTableConstructor.moderate = [min, max]
		}

		// Parse strong dosage
		if (input.strong) {
			const min = new Dosage(input.strong.min, responseUnits).baseScalar
			const max = new Dosage(input.strong.max, responseUnits).baseScalar

			dosageTableConstructor.strong = [min, max]
		}

		// Parse heavy dosage
		if (input.heavy) {
			dosageTableConstructor.heavy = new Dosage(input.heavy, responseUnits).baseScalar
		}

		if (!dosageTableConstructor.light || !dosageTableConstructor.moderate || !dosageTableConstructor.strong) {
			return undefined
		}

		const dosageTable = new DosageTable(dosageTableConstructor as any)

		return dosageTable
	}

	function routeOfAdministration(input: SubstanceRoa):
		| {
				classification: RouteOfAdministrationClassification
				route: RouteOfAdministration
		  }
		| undefined {
		const minimal_bioavailability = input.bioavailability?.min ?? undefined
		const maximal_bioavailability = input.bioavailability?.max ?? undefined

		const bioavailability = new Bioavailability({
			minimal: minimal_bioavailability,
			maximal: maximal_bioavailability
		})

		if (!input.dose) {
			return undefined
		}

		let dosage_table: DosageTable | undefined

		try {
			dosage_table = parseDosage(input.dose)
		} catch (error) {
			console.log(input.dose)
			console.log(error)
			return undefined
		}

		// We should deny creation of substances without dosages.
		if (!dosage_table) {
			return undefined
		}

		const onset = new Phase({
			minimalDuration: input.duration?.onset?.min
				? ms(input.duration.onset?.min + ' ' + input.duration.onset?.units)
				: undefined,
			maximalDuration: input.duration?.onset?.max
				? ms(input.duration.onset.max + ' ' + input.duration.onset.units)
				: undefined
		})

		const comeup = new Phase({
			minimalDuration: input.duration?.comeup?.min
				? ms(input.duration.comeup?.min + ' ' + input.duration.comeup?.units)
				: undefined,
			maximalDuration: input.duration?.comeup?.max
				? ms(input.duration.comeup?.max + ' ' + input.duration.comeup?.units)
				: undefined
		})

		const peak = new Phase({
			minimalDuration: input.duration?.peak?.min
				? ms(input.duration.peak?.min + ' ' + input.duration.peak?.units)
				: undefined,
			maximalDuration: input.duration?.comeup?.max
				? ms(input.duration.peak?.max + ' ' + input.duration.peak?.units)
				: undefined
		})

		const offset = new Phase({
			minimalDuration: input.duration?.offset?.min
				? ms(input.duration.offset?.min + ' ' + input.duration.offset?.units)
				: undefined,
			maximalDuration: input.duration?.comeup?.max
				? ms(input.duration.offset?.max + ' ' + input.duration.offset?.units)
				: undefined
		})

		const aftereffects = new Phase({
			minimalDuration: input.duration?.afterglow?.min
				? ms(input.duration.afterglow?.min + ' ' + input.duration.afterglow?.units)
				: undefined,
			maximalDuration: input.duration?.afterglow?.max
				? ms(input.duration.afterglow?.max + ' ' + input.duration.afterglow?.units)
				: undefined
		})

		const phase_table = new PhaseTable({ onset, comeup, peak, offset, aftereffects })

		const roa = new RouteOfAdministration({
			bioavailability: bioavailability,
			dosage: dosage_table,
			phase: phase_table
		})

		const classification = input.name as RouteOfAdministrationClassification

		return {
			classification: classification,
			route: roa
		}
	}

	/**
	 *
	 */
	export function useGetSubstancesQuery(
		request: GetSubstancesQuery
	): { substance: Substance; effects: Effect[] } | undefined {
		const substanceDraft: PartialDeep<Substance> = {}

		if (request.substances.length === 0) {
			return undefined
		}

		const result = request.substances[0]

		// Handle lack of substance's name
		if (!result.name) {
			return undefined
		}

		// Handle substance's name
		substanceDraft.name = result.name

		// Handle common names
		if (result.commonNames) {
			const common_names = []

			result.commonNames.forEach((element: any) => {
				common_names.push(element)
			})

			const nomenclature = new ChemicalNomenclature({
				common_names: common_names
			})

			substanceDraft.nomenclature = nomenclature
		}

		if (result.class) {
			substanceDraft.class_membership = { psychoactive_class: [], chemical_class: undefined }

			if (result.class.psychoactive) {
				substanceDraft.class_membership.psychoactive_class = psychoactiveClass(result.class.psychoactive)
			}

			if (result.class.chemical) {
				substanceDraft.class_membership.chemical_class = result.class.chemical.toString()
			}
		}

		if (result.roas) {
			const route_table: { [key in RouteOfAdministrationClassification]?: RouteOfAdministration } = {}

			result.roas.forEach((roa: any) => {
				const route = routeOfAdministration(roa)
				if (route && route.route && route.classification) {
					route_table[route.classification] = route.route
				}
			})

			substanceDraft.routes_of_administration = new RouteOfAdministrationTable(route_table)
		}

		if (result.tolerance) {
			const tolerance_development_description = result.tolerance?.full ?? undefined

			const semi_tolerance_table: {
				half?: {
					min?: string | undefined
					max?: string | undefined
					unit?: string | undefined
					average?: number | undefined
				}
				zero?: {
					min?: string | undefined
					max?: string | undefined
					unit?: string | undefined
					average?: number | undefined
				}
			} = {}

			if (result.tolerance.half) {
				// Check if provided value is a range
				const toleranceHalfing = result.tolerance.half.split('-')

				// If provided value is a range, extract unit
				if (toleranceHalfing.length === 2) {
					const unit = toleranceHalfing[1]?.trim().split(' ').pop()

					const min = toleranceHalfing[0].trim()
					const max = toleranceHalfing[1].trim().split(' ').slice(0, -1).join(' ').trim()

					const avg = (ms(min + ' ' + unit!) + ms(max + ' ' + unit!)) / 2

					semi_tolerance_table.half = {
						min: min,
						max: max,
						unit: unit,
						average: avg
					}
				}

				// If provided value is not a range, extract unit
				else {
					const unit = toleranceHalfing[0].trim().split(' ').pop()

					const min = toleranceHalfing[0]?.trim().split(' ').slice(0, -1).join(' ').trim()

					const avg = ms(min + ' ' + unit!)

					semi_tolerance_table.half = {
						min: min,
						max: min,
						unit: unit,
						average: avg
					}
				}
			}

			if (result.tolerance.zero) {
				// Check if provided value is a range
				const toleranceReset = result.tolerance.zero.split('-')

				// If provided value is a range, extract unit
				if (toleranceReset.length === 2) {
					const unit = toleranceReset[1]?.trim().split(' ').pop()

					const min = toleranceReset[0].trim()
					const max = toleranceReset[1].trim().split(' ').slice(0, -1).join(' ').trim()

					const avg = (ms(min + ' ' + unit!) + ms(max + ' ' + unit!)) / 2

					semi_tolerance_table.zero = {
						min: min,
						max: max,
						unit: unit,
						average: avg
					}
				}

				// If provided value is not a range, extract unit
				else {
					const unit = toleranceReset[0].trim().split(' ').pop()

					const min = toleranceReset[0]?.trim().split(' ').slice(0, -1).join(' ').trim()

					const avg = ms(min + ' ' + unit!)

					semi_tolerance_table.zero = {
						min: min,
						max: min,
						unit: unit,
						average: avg
					}
				}
			}

			substanceDraft.tolerance = new Tolerance({
				development: {
					description: tolerance_development_description
				},
				reduction: {
					toleranceHalfingTime: semi_tolerance_table?.half?.average,
					toleranceBaselineTime: semi_tolerance_table?.zero?.average
				}
			})
		}

		// Asigin external url
		substanceDraft.externals = {
			psychonautwiki: result.url
		}

		const effects: Effect[] = []

		if (result.effects && result.effects.length > 0) {
			for (const effect of result.effects) {
				if (effect.name && effect.url) {
					effects.push(
						new Effect({
							name: effect.name,
							psychonautwiki: effect.url
						})
					)
				}
			}
		}

		return {
			substance: new Substance({
				...(substanceDraft as Substance)
			}),
			effects
		}
	}
}
