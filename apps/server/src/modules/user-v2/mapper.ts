import { Prisma } from "@prisma/client";
import { Mapper } from "../../common/lib/persistence/mapper";
import { DatabaseRecords } from "../../common/lib/persistence/mapper/database-records";
import { User } from "./entity";

export class UserMapper
	implements Mapper<User, DatabaseRecords.UserCreateRecord, unknown>
{
	toPersistence(entity: User): Prisma.UserCreateInput {
		throw new Error("Method not implemented.");
	}
	toDomain(record: any): User {
		throw new Error("Method not implemented.");
	}
	toResponse?(entity: User): unknown {
		throw new Error("Method not implemented.");
	}
}
