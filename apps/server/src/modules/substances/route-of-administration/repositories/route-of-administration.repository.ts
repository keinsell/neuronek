import { Repository } from "../../../../common/repository/repository.common";
import { PrismaInstance } from "../../../../infrastructure/prisma.infra";
import { RouteOfAdministration } from "../entities/route-of-administration.entity";
import { routeOfAdministrationMapper } from "../mappers/route-of-administration.mapper";

export class RouteOfAdministrationRepository
	implements Repository<RouteOfAdministration>
{
	db = PrismaInstance;
	mapper = routeOfAdministrationMapper;

	async save(entity: RouteOfAdministration): Promise<RouteOfAdministration> {
		const presistence = this.mapper.toPersistence(entity);

		const exists = await this.exists(entity);

		if (exists) {
			const updatePayload = {
				...presistence,
				Substance: undefined,
			};

			await this.db.routeOfAdministration.updateMany({
				where: {
					substanceName: entity._substance,
					type: entity.route,
				},
				data: updatePayload,
			});
		} else {
			presistence.id = undefined;
			await this.db.routeOfAdministration.create({
				data: presistence,
			});
		}

		return entity;
	}

	async exists(entity: RouteOfAdministration): Promise<boolean> {
		const findRouteOfAdministrationById =
			await this.db.routeOfAdministration.findFirst({
				where: {
					substanceName: entity._substance,
					type: entity.route,
				},
			});

		return findRouteOfAdministrationById ? true : false;
	}

	async delete(entity: RouteOfAdministration): Promise<boolean> {
		const exists = await this.exists(entity);
		if (exists) {
			await this.db.routeOfAdministration.delete({
				where: {
					id: this.mapper.toPersistence(entity).id,
				},
			});
			return true;
		} else {
			return false;
		}
	}
}

export const routeOfAdministrationRepository =
	new RouteOfAdministrationRepository();
