/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-duplicate-string */
import { Prisma, PrismaClient } from "@prisma/client";
import { RouteOfAdministrationMapper } from "../mappers/route-of-administration.mapper";
import { PrismaInfrastructre } from "../../../infrastructure/prisma";
import {
	Paginated,
	PaginatedQueryParameters,
	Repository,
} from "../../../common/lib/persistence/repository";
import {
	RouteOfAdministration,
	RouteOfAdministrationWithSubstance,
} from "../entities/route-of-administration.entity";

export class RouteOfAdministrationRepository
	implements Repository<RouteOfAdministration>
{
	constructor(
		public database: PrismaClient = PrismaInfrastructre,
		private routeOfAdministrationMapper: RouteOfAdministrationMapper = new RouteOfAdministrationMapper(),
	) {}

	async save(
		entity: RouteOfAdministrationWithSubstance,
	): Promise<RouteOfAdministration> {
		// Assuming RouteOfAdministration should be unique by classification (RouteOfAdministrationClassification) per substance we should create a new route of administration if it does not exist for a substance and if exists we should update it.

		// 1. Find all routes of administration for a substance
		// 2. Check if route of administration with a given classification exists
		// 3. If exists update it, if not create new route of administration

		const { classification, substance } = entity;

		const existingRoutesOfAdministration =
			await this.database.routeOfAdministration.findMany({
				where: {
					Substance: {
						name: substance.name,
					},
				},
				include: {
					Substance: true,
				},
			});

		const existingRoutesOfAdministrationInDomain =
			existingRoutesOfAdministration.map(
				(element) => this.routeOfAdministrationMapper.toDomain(element),
			);

		const existingRouteOfAdministrationWithGivenClassification =
			existingRoutesOfAdministrationInDomain.find(
				(element) => element.classification === classification,
			);

		let createdOrUpdatedRouteOfAdministration: RouteOfAdministration;

		if (existingRouteOfAdministrationWithGivenClassification) {
			const updated = await this.database.routeOfAdministration.update({
				where: {
					id: existingRouteOfAdministrationWithGivenClassification.id,
				},
				data: this.routeOfAdministrationMapper.toPersistence(entity),
			});

			createdOrUpdatedRouteOfAdministration =
				this.routeOfAdministrationMapper.toDomain(updated);
		} else {
			const created = await this.database.routeOfAdministration.create({
				data: this.routeOfAdministrationMapper.toPersistence(entity),
			});

			createdOrUpdatedRouteOfAdministration =
				this.routeOfAdministrationMapper.toDomain(created);
		}

		return createdOrUpdatedRouteOfAdministration;
	}

	findById(id: string): Promise<RouteOfAdministration | null> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<RouteOfAdministration[]> {
		throw new Error("Method not implemented.");
	}
	findAllPaginated(
		parameters: PaginatedQueryParameters,
	): Promise<Paginated<RouteOfAdministration>> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	transaction<T>(callback: () => Promise<T>): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
