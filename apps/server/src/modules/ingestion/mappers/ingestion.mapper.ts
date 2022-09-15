import {
  Prisma,
  Ingestion as PersistenceIngestion,
  Substance as PersistenceSubstance,
  RouteOfAdministration as PersistenceRouteOfAdministration,
} from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { RouteOfAdministrationType } from "../../substance/entities/route-of-administration.entity";
import { substanceMapper } from "../../substance/mappers/substance.mapper";
import { Ingestion } from "../entities/ingestion.entity";

export class IngestionMapper implements IMapper {
  toDomain(
    entity: PersistenceIngestion & {
      substance: PersistenceSubstance & {
        routesOfAdministraton: PersistenceRouteOfAdministration[];
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
        substance: substanceMapper.toDomain(entity.substance),
        linkedJournalId: entity.journalId ?? undefined,
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
      substance: {
        connect: {
          name: entity.substance.name,
        },
      },
      Journal: {
        connect: {
          id: String(entity.linkedJournalId),
        },
      },
    };
  }
}

export const ingestionMapper = new IngestionMapper();
