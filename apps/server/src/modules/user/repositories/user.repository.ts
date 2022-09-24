import { Repository } from "../../../common/repository/repository.common";
import { PrismaInstance } from "../../../infrastructure/prisma.infra";
import { User } from "../entities/user.entity";
import { userMapper } from "../mappers/user.mapper";

export class UserRepository implements Repository<User> {
	db = PrismaInstance;
	mapper = userMapper;

	async findUserById(id: string | number): Promise<User | undefined> {
		const user = await this.db.user.findUnique({
			where: {
				id: String(id),
			},
		});

		if (!user) {
			return undefined;
		}

		return this.mapper.toDomain(user);
	}

	async findByUsername(username: string): Promise<User | undefined> {
		return await this.findUserByUsername(username);
	}

	async findUserByUsername(username: string): Promise<User | undefined> {
		const user = await this.db.user.findUnique({
			where: {
				username: username,
			},
		});

		if (!user) {
			return undefined;
		}

		return this.mapper.toDomain(user);
	}

	async findUserByEmail(email: string): Promise<User | undefined> {
		const user = await this.db.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!user) {
			return undefined;
		}

		return this.mapper.toDomain(user);
	}

	async exists(entity: User): Promise<boolean> {
		const findUserById = await this.findUserById(entity.id);
		const findUserByUsername = await this.findUserByUsername(entity.username);
		// const findUserByEmail = await this.findUserByEmail(entity.email);

		return findUserById || findUserByUsername ? true : false;
	}

	async save(entity: User): Promise<User> {
		const exists = await this.exists(entity);

		let createdOrUpdateEntity: User;

		if (exists) {
			const presistence = this.mapper.toPersistence(entity);

			await this.db.user.updateMany({
				where: {
					OR: [
						{
							id: String(entity.id),
						},
						{
							username: entity.username,
						},
						{
							email: entity.email,
						},
					],
				},
				data: presistence,
			});

			const updated = await this.db.user.findFirst({
				where: {
					OR: [
						{
							id: String(entity.id),
						},
						{
							username: entity.username,
						},
						{
							email: entity.email,
						},
					],
				},
			});

			if (!updated) {
				throw new Error("User not found");
			}

			createdOrUpdateEntity = await this.mapper.toDomain(updated);
		} else {
			const presistence = this.mapper.toPersistence(entity);
			const created = await this.db.user.create({
				data: presistence,
			});

			createdOrUpdateEntity = await this.mapper.toDomain(created);
		}

		return createdOrUpdateEntity;
	}

	delete(entity: User): Promise<boolean> {
		console.log(entity);
		throw new Error("Method not implemented.");
	}
}

export const userRepository = new UserRepository();
