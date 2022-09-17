import {
  Journal as PersistenceJournal,
  Ingestion as PersistenceIngestion,
  RouteOfAdministration as PersistenceRouteOfAdministration,
  Substance as PersistenceSubstance,
  User as PersistenceUser,
  Prisma,
} from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { ingestionMapper } from "../../ingestion/mappers/ingestion.mapper";
import { userMapper } from "../../user/mappers/user.mapper";
import { Journal } from "../entities/journal.entity";

type JournalWithIngestionWithSubstanceAndRouteOfAdministration =
  PersistenceJournal & {
    Owner: PersistenceUser;
    Ingestions: (PersistenceIngestion & {
      Substance: PersistenceSubstance & {
        routesOfAdministraton: PersistenceRouteOfAdministration[];
      };
      Ingester: PersistenceUser;
    })[];
  };

export class JournalMapper implements IMapper {
  toDomain(
    entity: JournalWithIngestionWithSubstanceAndRouteOfAdministration
  ): Journal {
    return new Journal(
      {
        owner: userMapper.toDomain(entity.Owner),
        ingestions: entity.Ingestions.map((ingestion) =>
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
      name: String(entity.id),
      Ingestions: {
        connectOrCreate: createOrConnectManyIngestions,
      },
      Owner: {
        connect: {
          username: entity.owner.username,
        },
      },
    };
  }
}

export const journalMapper = new JournalMapper();
