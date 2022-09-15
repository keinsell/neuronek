import { IMapper } from "../../../common/mapper/mapper.common";
import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { Ingestion } from "../entities/ingestion.entity";
import { ingestionMapper } from "../mappers/ingestion.mapper";

export class IngestionRepository implements Repository<Ingestion> {
  db = PrismaInstance;
  mapper = ingestionMapper;

  async save(entity: Ingestion): Promise<Ingestion> {
    const exists = await this.exists(entity);

    let createdOrUpdateEntity: Ingestion;

    if (!exists) {
      const presistence = this.mapper.toPersistence(entity);
      const created = await this.db.ingestion.create({
        data: presistence,
        include: {
          substance: {
            include: {
              routesOfAdministraton: true,
            },
          },
        },
      });

      createdOrUpdateEntity = this.mapper.toDomain(created);
    } else {
      const presistence = this.mapper.toPersistence(entity);
      const updated = await this.db.ingestion.update({
        where: {
          id: String(entity.id),
        },
        include: {
          substance: {
            include: {
              routesOfAdministraton: true,
            },
          },
        },
        data: presistence,
      });

      createdOrUpdateEntity = this.mapper.toDomain(updated);
    }

    return createdOrUpdateEntity;
  }

  async exists(entity: Ingestion): Promise<boolean> {
    const findIngestionById = await this.findIngestionById(entity.id);

    if (!findIngestionById) {
      return false;
    } else {
      return true;
    }
  }

  delete(entity: Ingestion): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async findIngestionById(id: string | number): Promise<Ingestion | undefined> {
    const findIngestionById = await this.db.ingestion.findUnique({
      where: {
        id: String(id),
      },
      include: {
        substance: {
          include: {
            routesOfAdministraton: true,
          },
        },
      },
    });

    if (!findIngestionById) {
      return undefined;
    } else {
      return this.mapper.toDomain(findIngestionById);
    }
  }
}

export const ingestionRepository = new IngestionRepository();
