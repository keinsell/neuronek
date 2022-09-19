import { Entity } from "../../../common/entity/entity.common";
import { EffectOccurance } from "../../effects/entities/effect-occurance.entity";
import { User } from "../../user/entities/user.entity";
import { ChemicalDetails } from "./chemical-details.entity";
import { ChemicalNomenclature } from "./chemical-nomenclature";
import { ClassMembership } from "./class-membership.entity";
import { DosageClassification } from "./dosage.entity";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "../../route-of-administration/entities/route-of-administration.entity";

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

  getDosageClassification(dosage: number, route: RouteOfAdministrationType) {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw Error("No route of administration found");
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
  ): { [dosage in DosageClassification]: number } {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw Error("No route of administration found");
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

  getEffectsForDosage(dosage: number, route: RouteOfAdministrationType) {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw new Error("No route of administration found");
    }

    return this.effects.map((v) => v.effect.name);
  }

  getDurationOfEffectsForRouteOfAdministration(
    route: RouteOfAdministrationType
  ) {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw new Error("No route of administration found");
    }

    // sum phase durations
    return (
      routeOfAdministration.duration.onset +
      routeOfAdministration.duration.comeup +
      routeOfAdministration.duration.peak +
      routeOfAdministration.duration.offset
    );
  }

  getDurationOfEffectsWithAftereffectsForRouteOfAdministration(
    route: RouteOfAdministrationType
  ) {
    const routeOfAdministration = this.administrationRoutes.find(
      (v) => v.route === route
    );

    if (!routeOfAdministration) {
      throw new Error("No route of administration found");
    }

    // sum phase durations
    return (
      routeOfAdministration.duration.onset +
      routeOfAdministration.duration.comeup +
      routeOfAdministration.duration.peak +
      routeOfAdministration.duration.offset +
      routeOfAdministration.duration.aftereffects
    );
  }
}
