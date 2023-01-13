import { prisma } from "../shared.infrastructure/infrastructure.prisma/prisma.infrastructure.js";
import { createHash } from "../shared.common/service.create-hash/create-hash.service.js";
import { User } from "@prisma/client";
import { createJwt } from "../shared.common/service.create-jwt/create-jwt.service.js";

interface CreateUserRequest {
  username: string;
  password: string;
}

export async function createUser(
  payload: CreateUserRequest
): Promise<User & { jwt_token: string }> {
  const hashedPassword = await createHash(payload.password);

  const isUsernameTaken = await prisma.user.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (isUsernameTaken) {
    throw new Error("Username is already taken");
  }

  // TODO(T-31): Add UserRepository
  // TODO(T-32): Add UserEntity
  const user = await prisma.user.create({
    data: {
      username: payload.username,
      password: hashedPassword,
    },
  });

  const jwt_token = createJwt({ user });

  return {
    ...user,
    jwt_token,
  };
}
