import { IMapper } from "../../../common/mapper/mapper.common";
import { Substance } from "../entities/substance.entity";
import {
  Substance as PersistenceSubstance,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  Prisma,
} from "@prisma/client";
import { ChemicalNomenclature } from "../entities/chemical-nomenclature";
import { ClassMembership } from "../entities/class-membership.entity";
import { RouteOfAdministration } from "../entities/route-of-administration.entity";
import { routeOfAdministrationMapper } from "./route-of-administration.mapper";

export class SubstanceMapper implements IMapper {
  toDomain(
    entity: PersistenceSubstance & {
      routesOfAdministraton: PersistenceRouteOfAdministration[];
    }
  ): Substance {
    return new Substance(
      {
        name: entity.name,
        chemnicalNomencalture: new ChemicalNomenclature({
          substitutiveName: entity.substitutiveNomenclature,
          systematicName: entity.systematicNomenclature,
          commonNames: entity.commonNomenclature,
        }),
        classMembership: new ClassMembership({
          psychoactiveClass: entity.psychoactiveClass ?? "",
          chemicalClass: entity.chemicalClass ?? "",
        }),
        administrationRoutes: entity.routesOfAdministraton.map((roa) =>
          routeOfAdministrationMapper.toDomain(roa)
        ),
        effects: [],
      },
      entity.id
    );
  }

  toPersistence(entity: Substance): Prisma.SubstanceCreateInput {
    return {
      name: entity.name,
      commonNomenclature: entity.chemnicalNomencalture.commonNames,
      substitutiveNomenclature: entity.chemnicalNomencalture.substitutiveName,
      systematicNomenclature: entity.chemnicalNomencalture.systematicName,
      chemicalClass: entity.classMembership.chemicalClass,
      psychoactiveClass: entity.classMembership.psychoactiveClass,
    };
  }
}

export const substanceMapper = new SubstanceMapper();
