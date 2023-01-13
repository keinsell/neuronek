import { User } from "@prisma/client";
import { verifyHash } from "../shared.common/service.verify-hash/verify-hash.service.js";
import { prisma } from "../shared.infrastructure/infrastructure.prisma/prisma.infrastructure.js";
import { createJwt } from "../shared.common/service.create-jwt/create-jwt.service.js";

interface LoginUserRequest {
  username: string;
  password: string;
}

export async function loginUser(
  payload: LoginUserRequest
): Promise<User & { jwt_token: string }> {
  const user = await prisma.user.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await verifyHash(user.password, payload.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const jwt_token = createJwt({ user });

  return {
    ...user,
    jwt_token,
  };
}
