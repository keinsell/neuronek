import ms from "ms";
import { NumberRange } from "../../utilities/range.vo";
import { ChemcialDetails } from "./entities/chemical-details.vo";
import { ChemcialNomencalture } from "./entities/chemical-nomencalture.vo";
import { PhaseClassification } from "./entities/phase-classification.enum";
import { PsychoactiveClass } from "./entities/psychoactive-class.enum";
import { RouteOfAdministrationClassification } from "./entities/route-of-administration-classification.enum";
import { RouteOfAdministration } from "./entities/route-of-administration.entity";
import { SubstanceAddiction } from "./entities/substance-addiction.vo";
import { DosageClassification } from "./entities/dosage-classification.enum";
import { Entity } from "../../common/lib/domain/entity";
import { MassUnit } from "../../utilities/mass.vo";

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

	public getAdministrationRouteOrThrow(
		administrationRoute: RouteOfAdministrationClassification
	): RouteOfAdministration {
		const route = this.administrationBy.find(
			(v) => v.classification === administrationRoute
		);

		if (!route) {
			throw new Error("Administration route not found");
		}

		return route;
	}

	public getTotalDurationOfEffectsRelativeToRouteOfAdministration(
		route: RouteOfAdministrationClassification
	): number {
		const administrationRoute = this.getAdministrationRouteOrThrow(route);

		const keys = Object.keys(PhaseClassification);

		let totalDuration = 0;

		for (const key of keys) {
			const duration =
				administrationRoute.duration[key as PhaseClassification].max;

			if (key === PhaseClassification.aftereffects) {
				continue;
			}

			totalDuration = totalDuration + duration;
		}

		return totalDuration;
	}

	public getDosageClassification(
		dosage: MassUnit,
		route: RouteOfAdministrationClassification
	): DosageClassification {
		const routeOfAdministration = this.getAdministrationRouteOrThrow(route);

		const { dosage: substanceDosage } = routeOfAdministration;

		let classification: DosageClassification =
			DosageClassification.moderate;

		if (dosage.baseScalar < substanceDosage.light.baseScalar) {
			classification = DosageClassification.thereshold;
		}

		if (dosage.baseScalar >= substanceDosage.light.baseScalar) {
			classification = DosageClassification.light;
		}

		if (dosage.baseScalar >= substanceDosage.moderate.baseScalar) {
			classification = DosageClassification.moderate;
		}

		if (dosage.baseScalar >= substanceDosage.strong.baseScalar) {
			classification = DosageClassification.strong;
		}

		if (dosage.baseScalar >= substanceDosage.heavy.baseScalar) {
			classification = DosageClassification.heavy;
		}

		if (dosage.baseScalar > substanceDosage.overdose.baseScalar) {
			classification = DosageClassification.overdose;
		}

		return classification;
	}

	public getTimeToPhase(
		route: RouteOfAdministrationClassification,
		phase: PhaseClassification
	) {
		const routeOfAdministration = this.getAdministrationRouteOrThrow(route);

		return routeOfAdministration.getTimeToPhase(phase);
	}
}
