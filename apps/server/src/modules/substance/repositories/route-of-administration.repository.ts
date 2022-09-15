import { rules } from "../../../../../../packages/eslint-config-node";
import { IMapper } from "../../../common/mapper/mapper.common";
import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { RouteOfAdministration } from "../entities/route-of-administration.entity";
import { Substance } from "../entities/substance.entity";
import { routeOfAdministrationMapper } from "../mappers/route-of-administration.mapper";
import { substanceMapper } from "../mappers/substance.mapper";

export class RouteOfAdministrationRepository
  implements Repository<RouteOfAdministration>
{
  db = PrismaInstance;
  mapper = routeOfAdministrationMapper;

  async save(entity: RouteOfAdministration): Promise<RouteOfAdministration> {
    const presistence = this.mapper.toPersistence(entity);

    const exists = await this.exists(entity);

    if (!exists) {
      presistence.id = undefined;
      await this.db.routeOfAdministration.create({
        data: presistence,
      });
    } else {
      const updatePayload = {
        ...presistence,
        Substance: undefined,
      };

      await this.db.routeOfAdministration.updateMany({
        where: {
          substanceName: entity.substanceName,
          type: entity.route,
        },
        data: updatePayload,
      });
    }

    return entity;
  }

  async exists(entity: RouteOfAdministration): Promise<boolean> {
    const presistence = this.mapper.toPersistence(entity);
    const findRouteOfAdministrationById =
      await this.db.routeOfAdministration.findFirst({
        where: {
          substanceName: entity.substanceName,
          type: entity.route,
        },
      });

    if (!findRouteOfAdministrationById) {
      return false;
    } else {
      return true;
    }
  }

  async delete(entity: RouteOfAdministration): Promise<boolean> {
    const exists = await this.exists(entity);
    if (!exists) {
      return false;
    } else {
      await this.db.routeOfAdministration.delete({
        where: {
          id: this.mapper.toPersistence(entity).id,
        },
      });
      return true;
    }
  }
}

export const routeOfAdministrationRepository =
  new RouteOfAdministrationRepository();
