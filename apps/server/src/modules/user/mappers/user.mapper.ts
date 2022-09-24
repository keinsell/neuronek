import { Prisma, User as _User } from "@prisma/client";
import { IMapper } from "../../../common/mapper/mapper.common";
import { RegisterUserDTO } from "../dtos/register-user.dto";
import { User } from "../entities/user.entity";
import { UserPassword } from "../vos/password.vo.js";

export class UserMapper implements IMapper {
	async toDomain(entity: _User): Promise<User> {
		return new User(
			{
				email: entity.email ?? undefined,
				firstName: entity.firstName ?? undefined,
				lastName: entity.lastName ?? undefined,
				password: await new UserPassword(entity.password).build(),
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
			password: entity.password.value ?? undefined,
			username: entity.username ?? undefined,
			dateOfBirth: entity.dateOfBirth ?? undefined,
			height: entity.height ?? undefined,
			weight: entity.weight ?? undefined,
		};
	}

	async fromRegisterUserDTO(input: RegisterUserDTO): Promise<User> {
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
				password: await new UserPassword(password).build(),
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
