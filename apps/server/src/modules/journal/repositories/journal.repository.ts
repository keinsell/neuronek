import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { Journal } from "../entities/journal.entity";
import { journalMapper } from "../mappers/journal.mapper";

export class JournalRepository extends Repository<Journal> {
  override db = PrismaInstance;
  override mapper = journalMapper;

  async exists(entity: Journal): Promise<boolean> {
    const exists = await this.db.journal.findUnique({
      where: {
        id: String(entity.id),
      },
    });

    return !!exists;
  }

  async save(entity: Journal): Promise<Journal> {
    const persistence = this.mapper.toPersistence(entity);
    const exists = await this.exists(entity);

    let createdOrUpdated: Journal;

    if (exists) {
      const updated = await this.db.journal.update({
        where: {
          id: String(entity.id),
        },
        data: persistence,
        include: {
          Owner: true,
          Ingestions: {
            include: {
              Substance: {
                include: {
                  routesOfAdministraton: true,
                  OccuranceOfEffect: {
                    include: {
                      Effect: true,
                    },
                  },
                },
              },
              Ingester: true,
            },
          },
        },
      });

      createdOrUpdated = this.mapper.toDomain(updated);
    } else {
      const created = await this.db.journal.create({
        data: persistence,
        include: {
          Owner: true,
          Ingestions: {
            include: {
              Substance: {
                include: {
                  routesOfAdministraton: true,
                  OccuranceOfEffect: {
                    include: {
                      Effect: true,
                    },
                  },
                },
              },
              Ingester: true,
            },
          },
        },
      });
      createdOrUpdated = this.mapper.toDomain(created);
    }

    return createdOrUpdated;
  }

  async delete(entity: Journal): Promise<boolean> {
    const exists = await this.exists(entity);

    if (exists) {
      await this.db.journal.delete({
        where: {
          id: String(entity.id),
        },
      });

      return exists;
    } else {
      return false;
    }
  }

  async findJournalById(id: string): Promise<Journal | undefined> {
    const journal = await this.db.journal.findUnique({
      where: {
        id: String(id),
      },
      include: {
        Owner: true,
        Ingestions: {
          include: {
            Substance: {
              include: {
                routesOfAdministraton: true,
                OccuranceOfEffect: {
                  include: {
                    Effect: true,
                  },
                },
              },
            },
            Ingester: true,
          },
        },
      },
    });

    if (!journal) {
      return undefined;
    }

    return this.mapper.toDomain(journal);
  }
}

export const journalRepository = new JournalRepository();
