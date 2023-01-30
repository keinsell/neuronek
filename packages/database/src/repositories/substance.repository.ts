import { Prisma } from '@prisma/client'
import { DosageClassification, PhaseClassification, RouteOfAdministration, Substance } from 'osiris'

export namespace SubstanceMapper {
	export type CreateSubstanceRecord = Prisma.SubstanceCreateInput
	export type CreateRouteOfAdministrationRecord = Prisma.RouteOfAdministrationCreateInput

	export function fromRouteOfAdministration(route: RouteOfAdministration): CreateRouteOfAdministrationRecord {
		return {
			name: route.classification,
			afterglow_phase: [
				route.phase[PhaseClassification.aftereffects].minimalDuration,
				route.phase[PhaseClassification.aftereffects].maximalDuration
			],
			comeup_phase: [
				route.phase[PhaseClassification.comeup].minimalDuration,
				route.phase[PhaseClassification.comeup].maximalDuration
			],
			common_dosage: route.dosage[DosageClassification.moderate],
			dosage_kind: route.dosage.kind,
			dosage_unit: route.dosage.unit,
			heavy_dosage: route.dosage[DosageClassification.heavy],
			light_dosage: route.dosage[DosageClassification.light],
			max_bioavailability: route.bioavailability.maximal,
			min_bioavailability: route.bioavailability.minimal,
			offset_phase: [
				route.phase[PhaseClassification.offset].minimalDuration,
				route.phase[PhaseClassification.offset].maximalDuration
			],
			onset_phase: [
				route.phase[PhaseClassification.onset].minimalDuration,
				route.phase[PhaseClassification.onset].maximalDuration
			],
			peak_phase: [
				route.phase[PhaseClassification.peak].minimalDuration,
				route.phase[PhaseClassification.peak].maximalDuration
			],
			strong_dosage: route.dosage[DosageClassification.strong],
			thereshold_dosage: route.dosage[DosageClassification.thereshold]
		}
	}

	export function fromSubstance(substance: Substance): CreateSubstanceRecord {
		return {
			name: substance.name,
			common_names: substance.nomenclature.common_names,
			substitutive_name: substance.nomenclature.substitutive_name
		}
	}
}

export class RouteOfAdministrationRepository {
	constructor(connector: any) {}

	async
}

export class SubstanceRepository {
	constructor(connector: any) {}
}
