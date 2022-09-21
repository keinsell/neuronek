import {
  Prisma,
  Ingestion as PersistenceIngestion,
  Substance as PersistenceSubstance,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  OccuranceOfEffect as PersistenceOccuranceOfEffect,
  Effect as PersistenceEffect,
  User as PersistenceUser,
} from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { RouteOfAdministrationType } from "../../route-of-administration/entities/route-of-administration.entity";
import { SubstanceMapper } from "../../substance/mappers/substance.mapper";
import { userMapper } from "../../user/mappers/user.mapper";
import { Ingestion } from "../entities/ingestion.entity";

export class IngestionMapper implements IMapper {
  toDomain(
    entity: PersistenceIngestion & {
      Ingester: PersistenceUser;
      Substance: PersistenceSubstance & {
        routesOfAdministraton: PersistenceRouteOfAdministration[];
        OccuranceOfEffect: (PersistenceOccuranceOfEffect & {
          Effect: PersistenceEffect;
        })[];
      };
    }
  ): Ingestion {
    return new Ingestion(
      {
        date: entity.date,
        dosage: entity.dosage,
        route: entity.routeOfAdministration as RouteOfAdministrationType,
        set: entity.set ?? undefined,
        setting: entity.setting ?? undefined,
        purpose: entity.purpose ?? undefined,
        purity: entity.purity ?? undefined,
        substance: new SubstanceMapper().toDomain(entity.Substance),
        user: userMapper.toDomain(entity.Ingester),
      },
      entity.id
    );
  }

  toPersistence(entity: Ingestion): Prisma.IngestionCreateInput {
    return {
      date: entity.date,
      dosage: entity.dosage,
      routeOfAdministration: entity.route,
      set: entity.set,
      setting: entity.setting,
      purpose: entity.purpose,
      purity: entity.purity,
      Substance: {
        connect: {
          name: entity.substance.name,
        },
      },
      Ingester: {
        connect: {
          id: String(entity.user.id),
        },
      },
    };
  }
}

export const ingestionMapper = new IngestionMapper();
