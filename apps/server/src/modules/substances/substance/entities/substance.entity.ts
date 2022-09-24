/* eslint-disable node/no-extraneous-import */
import { Entity } from "../../../../common/entity/entity.common";
import { EffectOccurance } from "../../effect/entities/effect-occurance.entity";
import { User } from "../../../user/entities/user.entity";
import { ChemicalDetails } from "./chemical-details.entity";
import { ChemicalNomenclature } from "./chemical-nomenclature";
import { ClassMembership } from "./class-membership.entity";
import { DosageClassification } from "./dosage.entity";
import {
	RouteOfAdministration,
	RouteOfAdministrationType,
} from "../../route-of-administration/entities/route-of-administration.entity";
import { collect } from "collect.js";
import { PhaseType } from "./phase.entity";
import { RouteOfAdministrationNotFound } from "../errors/route-of-administration-not-found.error.js";
export interface SubstanceProperties {
	name: string;
	chemnicalNomencalture: ChemicalNomenclature;
	chemicalDetails?: ChemicalDetails;
	classMembership: ClassMembership;
	administrationRoutes: RouteOfAdministration[];
	effects: EffectOccurance[];
}

export class Substance extends Entity implements SubstanceProperties {
	name: string;
	chemnicalNomencalture: ChemicalNomenclature;
	chemicalDetails?: ChemicalDetails | undefined;
	classMembership: ClassMembership;
	administrationRoutes: RouteOfAdministration[];
	effects: EffectOccurance[];

	constructor(properties: SubstanceProperties, id?: string | number) {
		super(id);
		this.name = properties.name;
		this.chemnicalNomencalture = properties.chemnicalNomencalture;
		this.chemicalDetails = properties.chemicalDetails;
		this.classMembership = properties.classMembership;
		this.administrationRoutes = properties.administrationRoutes;
		this.effects = properties.effects ?? [];
	}

	getAvailableAdministrationRoutes() {
		return Object.values(this.administrationRoutes).map(
			(entity) => entity.route
		);
	}

	getRouteOfAdministraiton(route: RouteOfAdministrationType) {
		return this.administrationRoutes.find((v) => v.route === route);
	}

	getDurationOfSpecificPhase(
		route: RouteOfAdministrationType,
		phase: PhaseType
	) {
		const routeOfAdministration = this.administrationRoutes.find(
			(routeOfAdministration) => routeOfAdministration.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		const phaseDuration = routeOfAdministration.duration[phase];

		if (!phaseDuration) {
			throw new Error(
				`Phase ${phase} not found for substance ${this.name} and route of administration ${route}`
			);
		}

		return phaseDuration;
	}

	getDosageClassification(dosage: number, route: RouteOfAdministrationType) {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		const { dosage: substanceDosage } = routeOfAdministration;

		let classification = "unknown";

		if (
			dosage > substanceDosage.thereshold ||
			dosage < substanceDosage.thereshold
		) {
			classification = "thereshold";
		}

		if (dosage >= substanceDosage.light) {
			classification = "light";
		}

		if (dosage >= substanceDosage.moderate) {
			classification = "moderate";
		}

		if (dosage >= substanceDosage.strong) {
			classification = "strong";
		}

		if (dosage >= substanceDosage.heavy) {
			classification = "heavy";
		}

		if (dosage > substanceDosage.overdose) {
			classification = "overdose";
		}

		return classification;
	}

	getPersonalisedDosageForUser(
		user: User,
		route: RouteOfAdministrationType
	): {
		[dosage in DosageClassification]: number;
	} {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		const { dosage: substanceDosage } = routeOfAdministration;

		// TODO: Not sure factors like height and age have impact on the drug dosage - I think yes, but have pretty no idea how to calculate it.

		const { weight } = user;

		const personaliseDosage = (dosage: number) => {
			if (!weight) {
				return dosage;
			}

			const weightAveragedDosage = Math.round((dosage / 80) * weight);

			if (weightAveragedDosage > dosage) {
				return dosage;
			}

			return weightAveragedDosage;
		};

		// TODO: Can be mapped by some array I think.
		return {
			thereshold: personaliseDosage(substanceDosage.thereshold),
			light: personaliseDosage(substanceDosage.light),
			moderate: personaliseDosage(substanceDosage.moderate),
			strong: personaliseDosage(substanceDosage.strong),
			heavy: personaliseDosage(substanceDosage.heavy),
			overdose: personaliseDosage(substanceDosage.overdose),
		};
	}

	getIngestionSpecificEffects(
		dosage: DosageClassification,
		route: RouteOfAdministrationType
	) {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound();
		}

		const availableEffects = collect(this.effects);

		return availableEffects
			.filter(
				(effect) =>
					effect.routes?.includes(route) || effect.routes?.length == 0
			)
			.filter(
				(effect) =>
					effect.dosages?.includes(dosage) ||
					effect.routes?.length == 0
			)
			.toArray<EffectOccurance>();
	}

	getTimeToSpecificPhase(route: RouteOfAdministrationType, phase: PhaseType) {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		const { duration } = routeOfAdministration;

		if (phase === PhaseType.onset) {
			return 0;
		}

		if (phase === PhaseType.comeup) {
			return duration.onset;
		}

		if (phase === PhaseType.peak) {
			return duration.onset + duration.comeup;
		}

		if (phase === PhaseType.offset) {
			return duration.onset + duration.comeup + duration.peak;
		}

		if (phase === PhaseType.aftereffects) {
			return (
				duration.onset +
				duration.comeup +
				duration.peak +
				duration.offset
			);
		}

		throw new Error("Unknown phase");
	}

	getDurationOfEffectsForRouteOfAdministrationToPeak(
		route: RouteOfAdministrationType
	) {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		// sum phase durations
		return (
			routeOfAdministration.duration.comeup +
			routeOfAdministration.duration.peak
		);
	}

	getDurationOfEffectsForRouteOfAdministrationAfterPeak(
		route: RouteOfAdministrationType
	) {
		const routeOfAdministration = this.administrationRoutes.find(
			(v) => v.route === route
		);

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(route, this.name);
		}

		// sum phase durations
		return (
			routeOfAdministration.duration.offset +
			routeOfAdministration.duration.aftereffects
		);
	}
}
