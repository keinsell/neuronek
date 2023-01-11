import { Hasher, Mapper } from "@internal/common";
import type { DatabaseRecords } from "../../configuration/database-records.js";
import { User } from "./user.entity.js";
import { Password } from "./value-objects/password/password.vo.js";
import { Service } from "diod";

@Service()
export class UserMapper
  implements
    Mapper<User, DatabaseRecords.User, DatabaseRecords.CreateUser, unknown>
{
  constructor(private readonly hasher: Hasher) {}

  toPersistence(entity: User): DatabaseRecords.CreateUser {
    return {
      username: entity.username,
      password: entity.password.toString(),
    };
  }

  toDomain(record: DatabaseRecords.User): User {
    return new User({
      username: record.username,
      password: Password.fromHash(record.password, this.hasher),
    });
  }

  toResponse?(entity: User): unknown {
    throw new Error("Method not implemented.");
  }
}
