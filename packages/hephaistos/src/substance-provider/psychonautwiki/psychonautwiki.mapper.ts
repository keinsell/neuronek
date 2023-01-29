import {
	DosageTable,
	Dosage,
	Phase,
	PhaseTable,
	PsychoactiveClassification,
	RouteOfAdministration,
	RouteOfAdministrationClassification,
	RouteOfAdministrationTable,
	Substance,
	Tolerance
} from 'osiris'
import { GetSubstancesQuery, SubstanceRoa } from './gql/sdk/graphql.js'
import ms from 'ms'

export namespace PsychonautwikiMapper {
	function psychoactiveClassification(input: string): PsychoactiveClassification {
		switch (input) {
			case 'Psychedelics':
				return PsychoactiveClassification.psychedelic
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

	function routeOfAdministration(input: SubstanceRoa):
		| {
				classification: RouteOfAdministrationClassification
				route: RouteOfAdministration
		  }
		| undefined {
		const minimal_bioavailability = input.bioavailability?.min ?? undefined
		const maximal_bioavailability = input.bioavailability?.max ?? undefined
		let units = input.dose?.units ?? undefined

		// TODO: Find a way to inform users that it's about pure substance itself not method of administration (ex. cigarette, beer or raw plant)
		if (units === 'mg (THC)') {
			units = 'mg'
		}

		if (units === 'mL EtOH') {
			units = 'ml'
		}

		// TODO: Need to be handled in other way as it's important information
		if (units === 'mg/kg of body weight') {
			units = 'mg'
		}

		// TODO: What the fuck does it mean?
		if (units === 'seeds') {
			units = undefined
		}

		const thereshold = dosage(input.dose?.threshold, units)
		const light = dosage(input.dose?.light?.max, units)
		const common = dosage(input.dose?.common?.min, units)
		const strong = dosage(input.dose?.strong?.min, units)
		const heavy = dosage(input.dose?.heavy, units)

		const dosage_table = new DosageTable({ thereshold, light, moderate: common, strong, heavy })

		const onset = input.duration?.onset?.min
			? ms(input.duration.onset?.min + ' ' + input.duration.onset?.units)
			: undefined

		const comeup = input.duration?.comeup?.min
			? ms(input.duration.comeup?.min + ' ' + input.duration.comeup?.units)
			: undefined

		const peak = input.duration?.peak?.min ? ms(input.duration.peak?.min + ' ' + input.duration.peak?.units) : undefined

		const offset = input.duration?.offset?.min
			? ms(input.duration.offset?.min + ' ' + input.duration.offset?.units)
			: undefined

		const aftereffects = input.duration?.afterglow?.min
			? ms(input.duration.afterglow?.min + ' ' + input.duration.afterglow?.units)
			: undefined

		const phase_table = new PhaseTable({ onset, comeup, peak, offset, aftereffects })

		const roa = new RouteOfAdministration({
			bioavailability: minimal_bioavailability,
			dosage: dosage_table,
			phase: phase_table
		})

		const classification = input.name as RouteOfAdministrationClassification

		return {
			classification: classification,
			route: roa
		}
	}

	function dosage(input?: number, unit?: string): Dosage | undefined {
		if (!input) {
			return undefined
		}

		if (!unit) {
			return undefined
		}

		return new Dosage(input, unit)
	}

	function phase(input?: number, unit?: string): Phase {
		if (!input) {
			return undefined
		}

		if (!unit) {
			return undefined
		}

		return ms(`${input}${unit}`)
	}

	export function useGetSubstancesQuery(request: GetSubstancesQuery): Substance | undefined {
		const substanceDraft: Partial<Substance> = {}

		if (request.substances.length === 0) {
			return undefined
		}

		const result = request.substances[0]

		// Handle lack of substance's name
		if (!result.name) {
			return undefined
		}

		substanceDraft.name = result.name

		// Handle common names
		if (result.commonNames) {
			substanceDraft.chemical_nomeclature = { common_names: [] }

			result.commonNames.forEach((element: any) => {
				substanceDraft.chemical_nomeclature.common_names.push(element)
			})
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
				route_table[route.classification] = route.route
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

			// result.tolerance
			// 			{
			//   full: 'rapidly develops with prolonged and repeated use',
			//   half: '3 - 7 days',
			//   zero: '1 - 2 weeks'
			// }

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

		return new Substance({
			...(substanceDraft as Substance)
		})
	}
}
