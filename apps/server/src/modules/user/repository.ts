import { User } from "./entity";
import {
	Paginated,
	PaginatedQueryParameters,
	Repository,
} from "../../common/lib/persistence/repository";
import { PrismaClient } from "@prisma/client";
import { PrismaInfrastructre } from "../../infrastructure/prisma";
import { UserMapper } from "./mapper";

export class UserRepository implements Repository<User> {
	constructor(
		private database: PrismaClient = PrismaInfrastructre,
		private userMapper: UserMapper = new UserMapper(),
	) {
		this.database = database;
		this.userMapper = userMapper;
	}

	async save(entity: User): Promise<User> {
		const isUserWithUsername = await this.database.user.findUnique({
			where: {
				username: entity.username,
			},
		});

		let createdOrUpdatedUser: User;

		if (isUserWithUsername) {
			const updatedUser = await this.database.user.update({
				where: {
					username: entity.username,
				},
				data: this.userMapper.toPersistence(entity),
			});

			createdOrUpdatedUser = this.userMapper.toDomain(updatedUser);
		} else {
			const createdUser = await this.database.user.create({
				data: this.userMapper.toPersistence(entity),
			});

			createdOrUpdatedUser = this.userMapper.toDomain(createdUser);
		}

		return createdOrUpdatedUser;
	}

	async findByUsername(username: string) {
		const user = await this.database.user.findUnique({
			where: {
				username: username,
			},
		});

		if (!user) {
			return undefined;
		}

		return this.userMapper.toDomain(user);
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.database.user.findUnique({
			where: {
				id: id,
			},
		});

		if (!user) {
			return null;
		}

		return this.userMapper.toDomain(user);
	}

	findAll(): Promise<User[]> {
		throw new Error("Method not implemented.");
	}
	findAllPaginated(
		parameters: PaginatedQueryParameters,
	): Promise<Paginated<User>> {
		throw new Error("Method not implemented.");
	}
	delete(id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}
	transaction<T>(callback: () => Promise<T>): Promise<T> {
		throw new Error("Method not implemented.");
	}
}
