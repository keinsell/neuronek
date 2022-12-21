import { Prisma } from "@prisma/client";
import { Mapper } from "../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../common/lib/persistence/mapper/database-records";
import { User } from "./entity";
import { JsonWebTokenPayload } from "./authentication-strategy";

export class UserMapper
	implements Mapper<User, DatabaseRecords.UserCreateRecord, unknown>
{
	toPersistence(entity: User): Prisma.UserCreateInput {
		return {
			username: entity.username,
			recoveryKey: entity.recoveryKey,
			weight: entity.weight,
			height: entity.height,
			dateOfBirth: entity.birthdate,
		};
	}

	toDomain(record: DatabaseRecords.UserRecord): User {
		return new User(
			{
				username: record.username,
				recoveryKey: record.recoveryKey,
				weight: record.weight ?? undefined,
				height: record.height ?? undefined,
				birthdate: record.dateOfBirth ?? undefined,
			},
			record.id,
		);
	}

	toResponse?(entity: User): unknown {
		throw new Error("Method not implemented.");
	}

	toJsonWebToken(user: User): JsonWebTokenPayload {
		return {
			id: user.id,
			username: user.username,
			weight: user.weight,
			height: user.height,
			dateOfBirth: user.birthdate,
		};
	}
}
