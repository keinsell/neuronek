import { Prisma, User as _User } from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { RegisterUserDTO } from "../dtos/register-user.dto";
import { User } from "../entities/user.entity";

export class UserMapper implements IMapper {
  toDomain(entity: _User): User {
    return new User(
      {
        email: entity.email ?? undefined,
        firstName: entity.firstName ?? undefined,
        lastName: entity.lastName ?? undefined,
        password: entity.password,
        username: entity.username ?? "",
        dateOfBirth: entity.dateOfBirth ?? undefined,
        height: entity.height ?? undefined,
        weight: entity.weight ?? undefined,
      },
      entity.id
    );
  }

  toPersistence(entity: User): Prisma.UserCreateInput {
    return {
      email: entity.email ?? undefined,
      firstName: entity.firstName ?? undefined,
      lastName: entity.lastName ?? undefined,
      password: entity.password ?? undefined,
      username: entity.username ?? undefined,
      dateOfBirth: entity.dateOfBirth ?? undefined,
      height: entity.height ?? undefined,
      weight: entity.weight ?? undefined,
    };
  }

  fromRegisterUserDTO(input: RegisterUserDTO): User {
    const {
      firstName,
      lastName,
      email,
      password,
      username,
      dateOfBirth,
      height,
      weight,
    } = input;

    return new User(
      {
        firstName,
        lastName,
        email,
        password,
        username,
        dateOfBirth,
        height,
        weight,
      },
      undefined
    );
  }
}

export const userMapper = new UserMapper();
