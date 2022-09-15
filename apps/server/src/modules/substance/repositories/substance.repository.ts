import { IMapper } from "../../../common/mapper/mapper.common";
import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { RouteOfAdministration } from "../entities/route-of-administration.entity";
import { Substance } from "../entities/substance.entity";
import { substanceMapper } from "../mappers/substance.mapper";
import { routeOfAdministrationRepository } from "./route-of-administration.repository";

export class SubstanceRepository implements Repository<Substance> {
  db = PrismaInstance;
  mapper = substanceMapper;

  async save(entity: Substance): Promise<Substance> {
    const presistence = this.mapper.toPersistence(entity);

    const exists = await this.exists(entity);

    let createdOrUpdateEntity: Substance;

    if (!exists) {
      presistence.id = undefined;
      const created = await this.db.substance.create({
        data: presistence,
        include: {
          routesOfAdministraton: true,
        },
      });

      createdOrUpdateEntity = this.mapper.toDomain(created);
    } else {
      const updated = await this.db.substance.update({
        where: {
          name: entity.name,
        },
        data: presistence,
        include: {
          routesOfAdministraton: true,
        },
      });

      createdOrUpdateEntity = this.mapper.toDomain(updated);
    }

    const routesOfAdministration = entity.administrationRoutes;

    for (const routeOfAdministration of routesOfAdministration) {
      await routeOfAdministrationRepository.save(routeOfAdministration);
    }

    const aggregateSubstance = await this.findSubstanceByName(entity.name);

    if (aggregateSubstance) {
      createdOrUpdateEntity = aggregateSubstance;
    }

    return createdOrUpdateEntity;
  }

  async exists(entity: Substance): Promise<boolean> {
    const findSubstanceById = await this.db.substance.findUnique({
      where: {
        name: entity.name,
      },
    });

    if (findSubstanceById) {
      return true;
    } else {
      return false;
    }
  }

  delete(entity: Substance): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async findSubstanceByName(name: string) {
    const substance = await this.db.substance.findUnique({
      where: {
        name: name,
      },
      include: {
        routesOfAdministraton: true,
      },
    });

    if (substance) {
      return this.mapper.toDomain(substance);
    } else {
      return undefined;
    }
  }

  async findSubstanceByNameOrAlias(name: string) {
    const substance = await this.db.substance.findFirst({
      where: {
        OR: [
          {
            name: name,
          },
          {
            commonNomenclature: { has: name },
          },
        ],
      },
      include: {
        routesOfAdministraton: true,
      },
    });

    if (substance) {
      return this.mapper.toDomain(substance);
    } else {
      return undefined;
    }
  }
}

export const substanceRepository = new SubstanceRepository();
