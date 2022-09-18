import {
  OccuranceOfEffect as PersistenceOccuranceOfEffect,
  Effect as PersistenceEffect,
  Substance as PersistenceSubstance,
  RouteOfAdministration as PerisstenceROA,
} from ".prisma/client";
import { Prisma } from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { DosageClassification } from "../../substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { EffectOccurance } from "../entities/effect-occurance.entity";
import { EffectMapper } from "./effect.mapper";

export class EffectOccuranceMapper implements IMapper {
  toDomain(
    entity: PersistenceOccuranceOfEffect & {
      Effect: PersistenceEffect;
      Substance?: PersistenceSubstance & {
        routesOfAdministraton: PerisstenceROA[];
      };
    }
  ): EffectOccurance {
    return new EffectOccurance(
      {
        effect: new EffectMapper().toDomain(entity.Effect),
        substance: entity.substance ?? undefined,
        dosage: (entity.dosage as DosageClassification) ?? undefined,
        route:
          (entity.routeOfAdministration as RouteOfAdministrationType) ??
          undefined,
        description: entity.description ?? undefined,
      },
      entity.id
    );
  }

  toPersistence(entity: EffectOccurance): Prisma.OccuranceOfEffectCreateInput {
    console.log(entity);

    let effectOccurance: Prisma.OccuranceOfEffectCreateInput = {
      Effect: {
        connect: {
          name: new EffectMapper().stringifyEffectName(entity.effect.name),
        },
      },
      description: entity.description,
      dosage: entity.dosage,
      phase: entity.phase,
      psychoactiveGroup: entity.psychoactiveClass,
      routeOfAdministration: entity.route,
    };

    if (entity.substance) {
      effectOccurance.Substance = {
        connect: {
          name: entity.substance,
        },
      };
    }

    return effectOccurance;
  }

  dynamicWhereQuery(
    entity: EffectOccurance
  ): Prisma.OccuranceOfEffectWhereInput {
    let effectOccuranceWhereQuery: Prisma.OccuranceOfEffectWhereInput = {};

    if (entity.effect) {
      effectOccuranceWhereQuery.effect = new EffectMapper().stringifyEffectName(
        entity.effect.name
      );
    }

    if (entity.substance) {
      effectOccuranceWhereQuery.substance = String(entity.substance);
    }

    if (entity.dosage) {
      effectOccuranceWhereQuery.dosage = entity.dosage;
    }

    if (entity.route) {
      effectOccuranceWhereQuery.routeOfAdministration = entity.route;
    }

    if (entity.phase) {
      effectOccuranceWhereQuery.phase = entity.phase;
    }

    if (entity.psychoactiveClass) {
      effectOccuranceWhereQuery.psychoactiveGroup = entity.psychoactiveClass;
    }

    return effectOccuranceWhereQuery;
  }
}
