import ms from 'ms'
import { DosageTable } from '../../shared/substance/route-of-administration-table/route-of-administration/dosage-table/dosage-table.js'
import { DosageUnit } from '../../shared/substance/route-of-administration-table/route-of-administration/dosage-table/dosage-unit/dosage-unit.js'
import { PhaseTable } from '../../shared/substance/route-of-administration-table/route-of-administration/phase-table/phase-table.js'
import { Phase } from '../../shared/substance/route-of-administration-table/route-of-administration/phase-table/phase/phase.js'
import { RouteOfAdministrationClassification } from '../../shared/substance/route-of-administration-table/route-of-administration-classification.js'
import { RouteOfAdministration } from '../../shared/substance/route-of-administration-table/route-of-administration/route-of-administration.js'
import { Substance } from '../../shared/substance/substance.js'
import {
	GetSubstancesQuery,
	SubstanceRoa,
	SubstanceRoaDose,
	SubstanceRoaDuration,
	SubstanceRoaDurationRange,
	SubstanceTolerance,
	SubstanceRoaRange
} from './gql/sdk/graphql.js'
import { RouteOfAdministrationTable } from '../../shared/substance/route-of-administration-table/route-of-administration-table.js'
import { PsychoactiveClass } from '../../dataset/psychoactive-class/psychoactive-class.js'
import { ToxicityTable } from '../../shared/substance/toxicity-table/toxicity-table.js'
import { Tolerance } from '../../shared/substance/tolerance/tolerance.js'

export class PsychonautWikiMapper {
	private SubstanceRoaRange_DosageUnit(input: SubstanceRoaRange, unit?: string): DosageUnit | undefined {
		return input ? new DosageUnit(input.max, unit ?? 'mg') : undefined
	}

	private SubstanceRoaDose__DosageTable(input: SubstanceRoaDose): DosageTable {
		const unit = input.units ?? 'mg'
		return new DosageTable({
			thereshold: input.threshold ? new DosageUnit(input.threshold, unit) : undefined,
			light: this.SubstanceRoaRange_DosageUnit(input.light, unit),
			moderate: this.SubstanceRoaRange_DosageUnit(input.common, unit),
			strong: this.SubstanceRoaRange_DosageUnit(input.strong, unit),
			heavy: input.heavy ? new DosageUnit(input.heavy, unit) : undefined
		})
	}

	private SubstanceTolerance__Tolerance(input: SubstanceTolerance): Tolerance {
		let averagedTimeForToleranceToHalf: number | undefined
		let averagedTimeForToleranceToBaseline: number | undefined

		if (input.half) {
			// Find "-" in string and split
			const half = input.half.split('-')
			let average = 0
			for (const time of half) {
				average += ms(time)
			}
			averagedTimeForToleranceToHalf = average / half.length
		}

		if (input.zero) {
			// Find "-" in string and split
			const baseline = input.zero.split('-')
			let average = 0
			for (const time of baseline) {
				average += ms(time)
			}
			averagedTimeForToleranceToBaseline = average / baseline.length
		}

		return new Tolerance({
			development: {
				description: input.full
			},
			reduction: {
				toleranceBaselineTime: averagedTimeForToleranceToBaseline,
				toleranceHalfingTime: averagedTimeForToleranceToHalf
			}
		})
	}

	private SubstanceRoaDurationRange__Phase(payload: SubstanceRoaDurationRange): Phase {
		function consumeValueAndUnit(value: number, unit: string): number {
			return ms(value + unit)
		}
		return new Phase({
			maximalDuration: payload.max ? consumeValueAndUnit(payload.max, payload.units) : undefined,
			minimalDuration: payload.min ? consumeValueAndUnit(payload.min, payload.units) : undefined
		})
	}

	private SubstanceRoaDuration__PhaseTable(input: SubstanceRoaDuration): PhaseTable {
		return new PhaseTable({
			onset: input.onset ? this.SubstanceRoaDurationRange__Phase(input.onset) : undefined,
			comeup: input.comeup ? this.SubstanceRoaDurationRange__Phase(input.comeup) : undefined,
			peak: input.peak ? this.SubstanceRoaDurationRange__Phase(input.peak) : undefined,
			offset: input.offset ? this.SubstanceRoaDurationRange__Phase(input.offset) : undefined,
			aftereffects: input.afterglow ? this.SubstanceRoaDurationRange__Phase(input.afterglow) : undefined
		})
	}

	private SubstanceRoa__RouteOfAdministration(
		input: SubstanceRoa
	): RouteOfAdministration & { classification: RouteOfAdministrationClassification } {
		const classification = input.name as RouteOfAdministrationClassification
		const routeOfAdministation = new RouteOfAdministration({
			bioavailability: input.bioavailability ? input.bioavailability.max || input.bioavailability.min : undefined,
			dosage: this.SubstanceRoaDose__DosageTable(input.dose),
			phase: this.SubstanceRoaDuration__PhaseTable(input.duration)
		})
		return Object.assign(routeOfAdministation, { classification })
	}

	private RouteOfAdministrationWithClassification__RouteOfAdministrationTable(
		payload: [RouteOfAdministration & { classification: RouteOfAdministrationClassification }]
	) {
		return new RouteOfAdministrationTable(
			payload.reduce((acc, curr) => {
				acc[curr.classification] = curr
				return acc
			}, {} as Record<RouteOfAdministrationClassification, RouteOfAdministration>)
		)
	}

	private SubstanceRoaArray__RouteOfAdministrationTable(input: SubstanceRoa[]): RouteOfAdministrationTable {
		const array = input.map(item => this.SubstanceRoa__RouteOfAdministration(item))

		if (array.length === 0) {
			return new RouteOfAdministrationTable({})
		}

		return this.RouteOfAdministrationWithClassification__RouteOfAdministrationTable(array as any)
	}

	private PsychoactiveClass__PsychoactiveClass(input: string | string[]): PsychoactiveClass | undefined {
		const mainClassification: string = input instanceof Array ? input[0] : input

		if (mainClassification === '') {
			return undefined
		}

		switch (mainClassification) {
			case 'Psychedelics':
				return PsychoactiveClass.psychedelic
			case 'Stimulants':
				return PsychoactiveClass.stimulant
		}
	}

	public GetSubstanceQuery__Substance(input: GetSubstancesQuery): Substance | undefined {
		const response = input.substances

		if (!response || response.length === 0) {
			return undefined
		}

		const data = response[0]

		if (!data) {
			return undefined
		}

		const substance = new Substance({
			name: data.name,
			class_membership: {
				psychoactive_class: this.PsychoactiveClass__PsychoactiveClass(data.class.psychoactive),
				chemical_class: data.class.chemical.toString()
			},
			chemical_nomeclature: {
				common_names: data.commonNames
			},
			routes_of_administration: this.SubstanceRoaArray__RouteOfAdministrationTable(data.roas),
			toxicity: new ToxicityTable({
				description: data.toxicity.toString()
			}),
			tolerance: this.SubstanceTolerance__Tolerance(data.tolerance)
		})

		return substance
	}
}
