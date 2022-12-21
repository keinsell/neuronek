import ms from "ms";
import { Entity } from "../../common/entity/entity.common";
import { NumberRange } from "../../utilities/range.vo";
import { ChemcialDetails } from "./entities/chemical-details.vo";
import { ChemcialNomencalture } from "./entities/chemical-nomencalture.vo";
import { PhaseClassification } from "./entities/phase-classification.enum";
import { PsychoactiveClass } from "./entities/psychoactive-class.enum";
import { RouteOfAdministrationClassification } from "./entities/route-of-administration-classification.enum";
import { RouteOfAdministration } from "./entities/route-of-administration.entity";
import { SubstanceAddiction } from "./entities/substance-addiction.vo";
import { DosageClassification } from "./entities/dosage-classification.enum";

export interface SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: ChemcialNomencalture;
	chemicalDetails?: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: SubstanceAddiction;
	legality?: {};
}

export class Substance extends Entity implements SubstanceProperties {
	name: string;
	description?: string;
	chemicalNomencalture: ChemcialNomencalture;
	chemicalDetails?: ChemcialDetails;
	chemicalClass: string;
	psychoactiveClass: PsychoactiveClass;
	administrationBy: RouteOfAdministration[];
	pharmacology?: {};
	toxicity?: {};
	effects?: {};
	addiction?: SubstanceAddiction;
	legality?: {};

	constructor(properties: SubstanceProperties, id?: string | number) {
		super(id);
		this.name = properties.name;
		this.description = properties.description;
		this.chemicalNomencalture = properties.chemicalNomencalture;
		this.chemicalDetails = properties.chemicalDetails;
		this.chemicalClass = properties.chemicalClass;
		this.psychoactiveClass = properties.psychoactiveClass;
		this.administrationBy = properties.administrationBy;
		this.pharmacology = properties.pharmacology;
		this.toxicity = properties.toxicity;
		this.effects = properties.effects;
		this.addiction = properties.addiction;
		this.legality = properties.legality;
	}

	public getTotalDurationOfEffectsRelativeToRouteOfAdministration(
		route: RouteOfAdministrationClassification,
	): number {
		const administrationRoute = this.administrationBy.find(
			(v) => v.classification === route,
		);

		if (!administrationRoute) {
			throw new Error("Route of administration not found");
		}

		const keys = Object.keys(PhaseClassification);

		let totalDuration = 0;

		for (const key of keys) {
			const duration = administrationRoute.duration[key as PhaseClassification];

			if (key === PhaseClassification.aftereffects) {
				continue;
			}

			totalDuration = totalDuration + duration;
		}

		return totalDuration;
	}

	public getDosageClassification(
		dosage: number,
		route: RouteOfAdministrationClassification,
	): DosageClassification {
		const routeOfAdministration = this.administrationBy.find(
			(v) => v.classification === route,
		);

		if (!routeOfAdministration) {
			throw new Error("Route of administration not found");
		}

		const { dosage: substanceDosage } = routeOfAdministration;

		let classification: DosageClassification = DosageClassification.moderate;

		if (dosage < substanceDosage.light) {
			classification = DosageClassification.thereshold;
		}

		if (dosage >= substanceDosage.light) {
			classification = DosageClassification.light;
		}

		if (dosage >= substanceDosage.moderate) {
			classification = DosageClassification.moderate;
		}

		if (dosage >= substanceDosage.strong) {
			classification = DosageClassification.strong;
		}

		if (dosage >= substanceDosage.heavy) {
			classification = DosageClassification.heavy;
		}

		if (dosage > substanceDosage.overdose) {
			classification = DosageClassification.overdose;
		}

		return classification;
	}

	public getTimeToPhase(
		route: RouteOfAdministrationClassification,
		phase: PhaseClassification,
	) {
		const routeOfAdministration = this.administrationBy.find(
			(v) => v.classification === route,
		);

		if (!routeOfAdministration) {
			throw new Error("afsdfg");
		}

		return routeOfAdministration.getTimeToPhase(phase);
	}
}
