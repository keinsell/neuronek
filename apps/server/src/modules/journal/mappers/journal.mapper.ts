import {
  Journal as PersistenceJournal,
  Ingestion as PersistenceIngestion,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  Substance as PersistenceSubstance,
  Prisma,
} from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { ingestionMapper } from "../../ingestion/mappers/ingestion.mapper";
import { Journal } from "../entities/journal.entity";

type JournalWithIngestionWithSubstanceAndRouteOfAdministration =
  PersistenceJournal & {
    ingestion: (PersistenceIngestion & {
      substance: PersistenceSubstance & {
        routesOfAdministraton: PersistenceRouteOfAdministration[];
      };
    })[];
  };

export class JournalMapper implements IMapper {
  toDomain(
    entity: JournalWithIngestionWithSubstanceAndRouteOfAdministration
  ): Journal {
    return new Journal(
      {
        ingestions: entity.ingestion.map((ingestion) =>
          ingestionMapper.toDomain(ingestion)
        ),
      },
      entity.id
    );
  }

  toPersistence(entity: Journal, ...args: any[]): Prisma.JournalCreateInput {
    const createOrConnectManyIngestions: Prisma.Enumerable<Prisma.IngestionCreateOrConnectWithoutJournalInput> =
      [];

    entity.ingestions.forEach((ingestion) => {
      createOrConnectManyIngestions.push({
        create: ingestionMapper.toPersistence(ingestion),
        where: {
          id: String(ingestion.id),
        },
      });
    });

    return {
      ingestion: {
        connectOrCreate: createOrConnectManyIngestions,
      },
    };
  }
}

export const journalMapper = new JournalMapper();
