import { PsychoactiveClassification, RouteOfAdministrationTable, Substance } from 'osiris'
import { GetSubstancesQuery } from './gql/sdk/graphql.js'
import type { Schema, Constructor } from 'type-fest'

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

		return new Substance({
			...(substanceDraft as Substance),
			routes_of_administration: new RouteOfAdministrationTable({})
		})
	}
}
