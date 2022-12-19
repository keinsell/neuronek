import {
	Paginated,
	PaginatedQueryParams,
	Repository,
} from "../../common/lib/persistence/repository";
import { PrismaInfrastructre } from "../../infrastructure/prisma";
import {
	RouteOfAdministration,
	RouteOfAdministrationWithSubstance,
} from "./entities/route-of-administration.entity";
import { Substance } from "./entity";
import { SubstanceMapper } from "./mapper";
import { RouteOfAdministrationMapper } from "./mappers/route-of-administration.mapper";
import { EffectRepository } from "./repositories/effect.repository";
import { RouteOfAdministrationRepository } from "./repositories/route-of-administration.repository";
import { PrismaClient } from "@prisma/client";

export class SubstanceRepository implements Repository<Substance> {
	constructor(
		public database: PrismaClient = PrismaInfrastructre,
		private substanceMapper: SubstanceMapper = new SubstanceMapper(),
		private routeOfAdministrationRepository: RouteOfAdministrationRepository = new RouteOfAdministrationRepository(
			database,
			new RouteOfAdministrationMapper()
		) // protected effectRepository: EffectRepository
	) {}

	async save(entity: Substance): Promise<Substance> {
		// 1. Save substance without routes of administration
		// 2. Save routes of administration avoiding duplicates
		// 3. Connect routes of administration to substance
		// 4. Save effects avoiding duplicates
		// 5. Connect effects to substance

		const existingSubstance = await this.database.substance.findUnique({
			where: {
				name: entity.name,
			},
			include: {
				routesOfAdministraton: true,
			},
		});

		const substanceToBeSavedWithoutRoutesOfAdministration = {
			...this.substanceMapper.toPersistence(entity),
			routesOfAdministraton: {},
		};

		let updatedOrCreatedSubstance: Substance;

		if (existingSubstance) {
			const updatedSubstance = await this.database.substance.update({
				where: {
					id: existingSubstance.id,
				},
				data: substanceToBeSavedWithoutRoutesOfAdministration,
				include: {
					routesOfAdministraton: true,
				},
			});

			updatedOrCreatedSubstance =
				this.substanceMapper.toDomain(updatedSubstance);
		} else {
			// If substance does not exist in database, we should create it.

			const createdSubstance = await this.database.substance.create({
				data: substanceToBeSavedWithoutRoutesOfAdministration,
				include: {
					routesOfAdministraton: true,
				},
			});

			updatedOrCreatedSubstance =
				this.substanceMapper.toDomain(createdSubstance);
		}

		// Save connected routes of administration and replace ones connected to substance with newly created ones which have proper ids to futher connections.

		const routesOfAdministrationConnectedToSubstance =
			entity.administrationBy;

		const routesOfAdministrationWithSubstanceId =
			routesOfAdministrationConnectedToSubstance.map((route) => {
				return new RouteOfAdministrationWithSubstance(
					route,
					updatedOrCreatedSubstance
				);
			});

		const createdRoutesOfAdministration: RouteOfAdministration[] = [];

		for await (const route of routesOfAdministrationWithSubstanceId) {
			const createdRouteOfAdministration =
				await this.routeOfAdministrationRepository.save(route);
			createdRoutesOfAdministration.push(createdRouteOfAdministration);
		}

		entity.administrationBy = createdRoutesOfAdministration;

		// Once ids of routes of administration are known, we should take a look for existing substances, if there is a one in our database we should update it with new information, if there is no one we should create a new one.

		const substanceWithRoutesOfAdministration =
			await this.database.substance.update({
				where: {
					name: updatedOrCreatedSubstance.name,
				},
				data: {
					routesOfAdministraton: {
						connect: createdRoutesOfAdministration.map((route) => {
							return {
								id: route.id,
							};
						}),
					},
				},
				include: {
					routesOfAdministraton: true,
				},
			});

		updatedOrCreatedSubstance = this.substanceMapper.toDomain(
			substanceWithRoutesOfAdministration
		);

		return updatedOrCreatedSubstance;
	}

	findById(id: string): Promise<Substance | null> {
		throw new Error("Method not implemented.");
	}
	findAll(): Promise<Substance[]> {
		throw new Error("Method not implemented.");
	}
	findAllPaginated(
		parameters: PaginatedQueryParams
	): Promise<Paginated<Substance>> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	transaction<T>(callback: () => Promise<T>): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
