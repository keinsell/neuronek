import {
  OccuranceOfEffect as PersistenceOccuranceOfEffect,
  Effect as PersistenceEffect,
  Substance as PersistenceSubstance,
  RouteOfAdministration as PerisstenceROA,
  Prisma,
} from "@prisma/client";
import { IMapper } from "../../../../common/mapper/mapper.common";
import { DosageClassification } from "../../substance/entities/dosage.entity";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { EffectOccurance } from "../entities/effect-occurance.entity";
import { EffectMapper } from "./effect.mapper";
import { PhaseType } from "../../substance/entities/phase.entity";

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
        dosages: (entity.dosage as DosageClassification[]) ?? undefined,
        routes:
          (entity.routeOfAdministration as RouteOfAdministrationType[]) ??
          undefined,
        phases: (entity.phase as PhaseType[]) ?? undefined,
        description: entity.description ?? undefined,
      },
      entity.id
    );
  }

  toPersistence(entity: EffectOccurance): Prisma.OccuranceOfEffectCreateInput {
    let effectOccurance: Prisma.OccuranceOfEffectCreateInput = {
      Effect: {
        connectOrCreate: {
          where: {
            name: new EffectMapper().stringifyEffectName(entity.effect.name),
          },
          create: new EffectMapper().toPersistence(entity.effect),
        },
      },
      description: entity.description,
      dosage: entity.dosages,
      phase: entity.phases,
      psychoactiveGroup: entity.psychoactiveClass,
      routeOfAdministration: entity.routes,
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

    if (entity.dosages) {
      effectOccuranceWhereQuery = {
        ...effectOccuranceWhereQuery,
        dosage: {
          hasSome: entity.dosages,
        },
      };
    }

    if (entity.routes) {
      effectOccuranceWhereQuery = {
        ...effectOccuranceWhereQuery,
        routeOfAdministration: {
          hasSome: entity.routes,
        },
      };
    }

    if (entity.phases) {
      effectOccuranceWhereQuery = {
        ...effectOccuranceWhereQuery,
        phase: {
          hasSome: entity.phases,
        },
      };
    }

    if (entity.psychoactiveClass) {
      effectOccuranceWhereQuery = {
        ...effectOccuranceWhereQuery,
        psychoactiveGroup: {
          hasSome: entity.psychoactiveClass,
        },
      };
    }

    return effectOccuranceWhereQuery;
  }
}
