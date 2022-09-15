import { Entity } from "../../../common/entity/entity.common";
import { Effect } from "../../effects/entities/effect.entity";
import { ChemicalDetails } from "./chemical-details.entity";
import { ChemicalNomenclature } from "./chemical-nomenclature";
import { ClassMembership } from "./class-membership.entity";
import {
  RouteOfAdministration,
  RouteOfAdministrationType,
} from "./route-of-administration.entity";

export interface SubstanceProperties {
  name: string;
  chemnicalNomencalture: ChemicalNomenclature;
  chemicalDetails?: ChemicalDetails;
  classMembership: ClassMembership;
  administrationRoutes: RouteOfAdministration[];
  effects: Effect[];
}

export class Substance extends Entity implements SubstanceProperties {
  name: string;
  chemnicalNomencalture: ChemicalNomenclature;
  chemicalDetails?: ChemicalDetails | undefined;
  classMembership: ClassMembership;
  administrationRoutes: RouteOfAdministration[];
  effects: Effect[];

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
}
