import { IMapper } from "../../../../common/mapper/mapper.common";
import { Substance } from "../entities/substance.entity";
import {
  Substance as PersistenceSubstance,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  OccuranceOfEffect as PersistenceOccuranceOfEffect,
  Effect as PersistenceEffect,
  Prisma,
} from "@prisma/client";
import { ChemicalNomenclature } from "../entities/chemical-nomenclature";
import { ClassMembership } from "../entities/class-membership.entity";
import { routeOfAdministrationMapper } from "../../route-of-administration/mappers/route-of-administration.mapper";
import { PsychoactiveClass } from "../entities/psychoactive-class.enum";
import { EffectOccuranceMapper } from "../../effect/mappers/effect-occurance.mapper";

export type PersistenceSubstanceWithRelations = PersistenceSubstance & {
  routesOfAdministraton: PersistenceRouteOfAdministration[];
  OccuranceOfEffect: (PersistenceOccuranceOfEffect & {
    Effect: PersistenceEffect;
  })[];
};

export class SubstanceMapper implements IMapper {
  toDomain(entity: PersistenceSubstanceWithRelations): Substance {
    return new Substance(
      {
        name: entity.name,
        chemnicalNomencalture: new ChemicalNomenclature({
          substitutiveName: entity.substitutiveNomenclature,
          systematicName: entity.systematicNomenclature,
          commonNames: entity.commonNomenclature,
        }),
        classMembership: new ClassMembership({
          psychoactiveClass:
            (entity.psychoactiveClass as PsychoactiveClass) ?? "",
          chemicalClass: entity.chemicalClass ?? "",
        }),
        administrationRoutes: entity.routesOfAdministraton.map((roa) =>
          routeOfAdministrationMapper.toDomain(roa)
        ),
        effects: entity.OccuranceOfEffect
          ? entity.OccuranceOfEffect.map((occurance) =>
              new EffectOccuranceMapper().toDomain(occurance)
            )
          : [],
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